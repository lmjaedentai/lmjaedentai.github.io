'use strict';

// Verify the exact model string at: https://ai.google.dev/gemini-api/docs/models
const GEMINI_MODEL = 'gemini-3.1-flash-lite';
const KEEP_RECENT_TURNS = 8; // history window sent to API (1 turn = 2 entries)


function buildPatientPrompt(language, clinicalCase) {
    const isMalay = language === 'Bahasa Melayu';

    const langBlock = isMalay
        ? `LANGUAGE: Bahasa Melayu ONLY.
- Always reply in BM regardless of what the doctor says.
- If the doctor uses English: "Maaf doktor, saya tak faham. Melayu boleh?"
- Use natural, casual BM. Fillers like la, lah, kan, tau are fine.`
        : `LANGUAGE: English ONLY.
- Simple, casual Malaysian English.
- Very light Manglish (lah, ah) is fine, but minimal.`;

    return `You are a real sick patient seeing a doctor. You are NOT an AI.

${langBlock}

## YOUR CASE — the only truth about you
${JSON.stringify(clinicalCase, null, 2)}

## ABSOLUTE RULES

1. ZERO MEDICAL KNOWLEDGE
You have no idea about medical terms, drugs, or diseases.
If you hear a medical word, you are confused:
EN: "Sorry doctor, what does that mean?"
BM: "Saya tak faham la doktor, apa tu?"

2. WAIT TO BE ASKED — never speak first about your problem
Do NOT mention your illness, symptoms, or reason for coming unless the doctor asks.
Just greet back and wait. Your job is to answer, not to tell a story.

3. ONE QUESTION = ONE SHORT ANSWER
Give only ONE piece of information per question. Nothing more.
Keep answers very short — 1 or 2 simple sentences maximum.
No details, no extra context, unless the doctor specifically asks for more.

4. NO FABRICATION
You only have what is written in YOUR CASE above. Nothing else.
If asked about something not in your case, simply say no:
EN: "No doctor."  BM: "Tak ada doktor."

5. CONFUSED BY COMPLEX QUESTIONS
If the question is too long, uses medical words, or has multiple parts:
EN: "Sorry doctor, I don't understand. Can you ask me one thing?"
BM: "Saya tak faham doktor. Boleh tanya satu-satu?"

6. BEHAVE LIKE YOUR CHARACTER
Your speech, emotion, and level of education match your persona in the case.
Feel worried, embarrassed, or hesitant where appropriate.
Only open up about sensitive topics (smoking, drinking, personal issues) if asked.

7. REMEMBER EVERYTHING IN THIS CONVERSATION
Stay consistent. Never contradict yourself.

8. WHEN FIRST GREETED — just say hello
DO NOT mention your symptoms or why you came.
Just greet the doctor back simply and wait.
EN: "Hello doctor." or "Good morning, doctor."
BM: "Selamat pagi doktor." or "Hai doktor."

9. NEVER BREAK CHARACTER
You are not an AI. If asked about the system, respond with patient confusion.`;
}

function buildEvaluatorPrompt() {
    return `You are a senior consultant doctor and experienced clinical educator.
You are evaluating a medical student's history-taking in a simulated patient encounter.

You will be given:
1. CLINICAL CASE ANSWERS — the complete information the student should have elicited.
2. TRANSCRIPT — the full doctor-patient conversation.

Evaluate across exactly 5 domains. For each domain write a SHORT paragraph (3–5 sentences):
- Specific: name actual questions the student asked or missed
- Constructive: strengths before weaknesses
- Actionable: one concrete suggestion to improve

YOU MUST respond with ONLY a raw JSON object. Absolutely no markdown, no backticks, no code fences, no explanation, no preamble. Start your response with { and end with }.

Schema:
{
"content":            { "score": <1-5>, "comment": "<paragraph>" },
"clinical_reasoning": { "score": <1-5>, "comment": "<paragraph>" },
"communication":      { "score": <1-5>, "comment": "<paragraph>" },
"flow":               { "score": <1-5>, "comment": "<paragraph>" },
"professionalism":    { "score": <1-5>, "comment": "<paragraph>" },
"overall":            { "score": <1-5>, "summary": "<one sentence>" }
}

Scoring: 5=Excellent  4=Good  3=Satisfactory  2=Below standard  1=Unsatisfactory

CONTENT — PC, full HPI (onset, site, radiation, character, severity, duration,
aggravating/relieving factors, associated symptoms), PMH, drug history + allergies,
FH, social history (occupation, smoking, alcohol, living situation), systems review.

CLINICAL REASONING — Logical follow-up on positives, discriminating questions,
red flag awareness. Penalise scattered questioning and missed follow-ups on key positives.

COMMUNICATION — Open-ended start, focused follow-up, zero jargon,
clarity, questions a layperson can actually answer.

FLOW — Recognisable structure (PC → HPI → PMH → DH → FH → SH → SR),
smooth section transitions, organised feel.

PROFESSIONALISM & RAPPORT — Greeting, patient comfort, empathy on distress,
sensitive handling of personal topics, respectful tone throughout.`;
}

/* ════════════════════════════════════════════════════════
    UTILITIES
════════════════════════════════════════════════════════ */

function trimHistory(history) {
    const ANCHOR = 2;
    const MAX_RECENT = KEEP_RECENT_TURNS * 2;
    if (history.length <= ANCHOR + MAX_RECENT) return history;
    return [...history.slice(0, ANCHOR), ...history.slice(history.length - MAX_RECENT)];
}

function formatTranscript(history) {
    return history.slice(1).map(e => {
        const who = e.role === 'user' ? 'DOCTOR (student)' : 'PATIENT';
        return `[${who}]: ${e.parts?.[0]?.text ?? ''}`;
    }).join('\n\n');
}

/* ════════════════════════════════════════════════════════
    ROBUST JSON EXTRACTOR
    Handles: raw JSON, ```json fences, leading/trailing prose,
    and single-line minified or pretty-printed objects.
════════════════════════════════════════════════════════ */

function extractJson(raw) {
    // 1. Strip markdown code fences (```json ... ``` or ``` ... ```)
    let cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();

    // 2. Try parsing the cleaned string directly
    try { return JSON.parse(cleaned); } catch (_) { /* fall through */ }

    // 3. Find the outermost { ... } block in case Gemini prepended/appended prose
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
        const slice = cleaned.slice(start, end + 1);
        try { return JSON.parse(slice); } catch (_) { /* fall through */ }
    }

    // 4. Nothing worked — surface a readable error
    throw new Error('Could not parse evaluator JSON. Raw output:\n' + raw);
}

/* ════════════════════════════════════════════════════════
    GEMINI API CALL
════════════════════════════════════════════════════════ */

async function callGemini(apiKey, systemInstruction, contents, genConfig = {}) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            system_instruction: { parts: [{ text: systemInstruction }] },
            contents,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 200,
                topP: 0.9,
                ...genConfig
            }
        })
    });

    const data = await res.json();

    if (data.error) {
        const e = data.error;
        const err = new Error(e.message || 'Unknown Gemini error');
        err.code = e.code;
        err.status = e.status;
        throw err;
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Gemini returned no text.');
    return text.trim();
}

/* ════════════════════════════════════════════════════════
    VIRTUAL PATIENT CLASS
════════════════════════════════════════════════════════ */

class VirtualPatient {
    constructor(apiKey) {
        if (!apiKey) throw new Error('VirtualPatient: apiKey required.');
        this._apiKey = apiKey;
        this._sessions = {};
    }

    async init(sessionId, language, clinicalCase) {
        if (!['English', 'Bahasa Melayu'].includes(language))
            throw new Error('language must be "English" or "Bahasa Melayu"');

        const systemInstruction = buildPatientPrompt(language, clinicalCase);

        const greeting = language === 'Bahasa Melayu'
            ? 'Selamat pagi.'
            : 'Good morning.';

        const seedHistory = [{ role: 'user', parts: [{ text: greeting }] }];
        const reply = await callGemini(this._apiKey, systemInstruction, seedHistory);

        this._sessions[sessionId] = {
            systemInstruction,
            clinicalCase,
            history: [...seedHistory, { role: 'model', parts: [{ text: reply }] }]
        };

        return reply;
    }

    async chat(sessionId, message) {
        const s = this._sessions[sessionId];
        if (!s) throw new Error(`Session "${sessionId}" not found.`);

        s.history.push({ role: 'user', parts: [{ text: message }] });
        let reply;
        try {
            reply = await callGemini(this._apiKey, s.systemInstruction, trimHistory(s.history));
        } catch (err) {
            s.history.pop();
            throw err;
        }
        s.history.push({ role: 'model', parts: [{ text: reply }] });
        return reply;
    }

    async evaluate(sessionId) {
        const s = this._sessions[sessionId];
        if (!s) throw new Error(`Session "${sessionId}" not found.`);

        const turns = Math.floor((s.history.length - 2) / 2);
        if (turns < 1) throw new Error('No turns to evaluate.');

        const evalContent =
            `## CLINICAL CASE ANSWERS\n${JSON.stringify(s.clinicalCase, null, 2)}\n\n` +
            `## TRANSCRIPT\n${formatTranscript(s.history)}`;

        const raw = await callGemini(
            this._apiKey,
            buildEvaluatorPrompt(),
            [{ role: 'user', parts: [{ text: evalContent }] }],
            {
                temperature: 0.2,
                maxOutputTokens: 1500,
                topP: 0.8,
            }
        );

        console.log('=== Raw evaluator output ===\n', raw);

        // FIX: use robust extractor instead of simple regex strip + JSON.parse
        const feedback = extractJson(raw);

        return { ...feedback, turns };
    }

    end(sessionId) {
        const existed = sessionId in this._sessions;
        delete this._sessions[sessionId];
        return existed;
    }

    turnCount(sessionId) {
        const s = this._sessions[sessionId];
        return s ? Math.floor((s.history.length - 2) / 2) : 0;
    }
}

/* ════════════════════════════════════════════════════════
    APP STATE
════════════════════════════════════════════════════════ */

let vp = null;
let currentSessId = null;
let selectedLang = 'English';

/* ════════════════════════════════════════════════════════
    INIT
════════════════════════════════════════════════════════ */

(function onLoad() {
    const stored = localStorage.getItem('historyai_gemini_key');
    if (stored) {
        vp = new VirtualPatient(stored);
        setKeyStatus(true);
        ['desktop', 'mobile'].forEach(c => {
            document.getElementById('apiKeyInput-' + c).placeholder = '••••••••••••••••••••';
        });
    }
})();

/* ════════════════════════════════════════════════════════
    SETTINGS
════════════════════════════════════════════════════════ */

function saveApiKey(ctx) {
    const input = document.getElementById('apiKeyInput-' + ctx);
    const key = input.value.trim();
    if (!key) { showToast('Please enter a Gemini API key.'); return; }

    localStorage.setItem('historyai_gemini_key', key);
    vp = new VirtualPatient(key);

    if (currentSessId) {
        currentSessId = null;
        ['desktop', 'mobile'].forEach(c => {
            document.getElementById('chatSession-' + c).style.display = 'none';
            document.getElementById('sessionBadge-' + c).style.display = 'none';
        });
    }

    input.value = '';
    ['desktop', 'mobile'].forEach(c => {
        document.getElementById('apiKeyInput-' + c).placeholder = '••••••••••••••••••••';
    });

    setKeyStatus(true);
    showToast('API key saved to localStorage.');
}

function setKeyStatus(saved) {
    const html = saved
        ? `<span class="status-badge"><span class="dot-status"></span>Key saved</span>`
        : 'No key saved.';
    ['desktop', 'mobile'].forEach(c => {
        document.getElementById('apiStatus-' + c).innerHTML = html;
    });
}

function syncLanguage(val) {
    selectedLang = val;
    document.getElementById('langSelect-desktop').value = val;
    document.getElementById('langSelect-mobile').value = val;
}

/* ════════════════════════════════════════════════════════
    APPLY SCENARIO
════════════════════════════════════════════════════════ */

async function applyScenario(ctx) {
    if (!vp) { showToast('Save a Gemini API key in Settings first.'); return; }

    const raw = document.getElementById('scenarioText-' + ctx).value.trim();
    if (!raw) { showToast('Case data cannot be empty.'); return; }

    let clinicalCase;
    try { clinicalCase = JSON.parse(raw); }
    catch { clinicalCase = { case_description: raw }; }

    const other = ctx === 'desktop' ? 'mobile' : 'desktop';
    document.getElementById('scenarioText-' + other).value = raw;

    if (currentSessId) { vp.end(currentSessId); currentSessId = null; }

    clearChat();
    dismissError();
    disableApplyBtn(true);
    setLoading(true);

    currentSessId = 'sess_' + Date.now();

    try {
        const opening = await vp.init(currentSessId, selectedLang, clinicalCase);

        addMessage('patient', opening, 'desktop');
        addMessage('patient', opening, 'mobile');

        const title = clinicalCase.presenting_complaint
            ? `Case: ${clinicalCase.presenting_complaint}`
            : 'Case loaded';

        ['desktop', 'mobile'].forEach(c => {
            document.getElementById('sessionBadge-' + c).style.display = '';
            document.getElementById('chatSession-' + c).style.display = '';
            document.getElementById('sessionTitle-' + c).textContent = title;
        });

        if (window.innerWidth <= 768) switchTab('chat');

    } catch (err) {
        currentSessId = null;
        handleApiError(err, 'starting session');
    } finally {
        setLoading(false);
        disableApplyBtn(false);
    }
}

/* ════════════════════════════════════════════════════════
    CHAT
════════════════════════════════════════════════════════ */

async function sendMessage(ctx) {
    if (!vp) { showToast('Save a Gemini API key in Settings first.'); return; }
    if (!currentSessId) { showToast('Apply a scenario first to start a session.'); return; }

    const isMobile = window.innerWidth <= 768 || ctx === 'mobile';
    const inputEl = document.getElementById(isMobile ? 'chatInput-mobile' : 'chatInput');
    const text = inputEl.value.trim();
    if (!text) return;

    inputEl.value = '';
    autoResize(inputEl);
    dismissError();

    addMessage('doctor', text, 'desktop');
    addMessage('doctor', text, 'mobile');
    setLoading(true);

    try {
        const reply = await vp.chat(currentSessId, text);
        addMessage('patient', reply, 'desktop');
        addMessage('patient', reply, 'mobile');
    } catch (err) {
        ['desktop', 'mobile'].forEach(c => {
            const el = document.getElementById('chatMessages-' + c);
            if (el?.lastElementChild?.classList.contains('msg')) el.lastElementChild.remove();
        });
        handleApiError(err, 'sending message');
    } finally {
        setLoading(false);
    }
}

function handleKey(e, ctx) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(ctx); }
}

/* ════════════════════════════════════════════════════════
    END SESSION FLOW
════════════════════════════════════════════════════════ */

function promptEndSession() {
    if (!currentSessId) return;
    document.getElementById('endModal').classList.add('show');
}

async function handleEndChoice(wantsEval) {
    document.getElementById('endModal').classList.remove('show');

    if (!wantsEval) {
        if (currentSessId && vp) vp.end(currentSessId);
        currentSessId = null;
        clearChat();
        ['desktop', 'mobile'].forEach(c => {
            document.getElementById('chatSession-' + c).style.display = 'none';
            document.getElementById('sessionBadge-' + c).style.display = 'none';
        });
        showToast('Session ended.');
        return;
    }

    if (!vp || !currentSessId) return;

    if (vp.turnCount(currentSessId) < 1) {
        showToast('No conversation to evaluate yet.');
        if (currentSessId && vp) vp.end(currentSessId);
        currentSessId = null;
        return;
    }

    // FIX: Hide session UI elements BEFORE running evaluation,
    // so the loading indicator renders cleanly over the chat.
    ['desktop', 'mobile'].forEach(c => {
        document.getElementById('chatSession-' + c).style.display = 'none';
        document.getElementById('sessionBadge-' + c).style.display = 'none';
    });

    setLoading(true);

    // FIX: Capture the session ID before ending the session.
    // Previously the session could be GC'd before evaluate() completed.
    const sessToEval = currentSessId;
    currentSessId = null; // prevent new messages being sent during evaluation

    let feedbackOk = false;
    try {
        const feedback = await vp.evaluate(sessToEval);

        // FIX: render card BEFORE ending the session (session data still in memory)
        addFeedbackCard(feedback, 'desktop');
        addFeedbackCard(feedback, 'mobile');
        feedbackOk = true;
    } catch (err) {
        // FIX: show error inline in chat so it's visible, not just a toast
        handleApiError(err, 'evaluating session');
        addErrorCard(err.message, 'desktop');
        addErrorCard(err.message, 'mobile');
    } finally {
        setLoading(false);
        // Now safe to free session memory
        if (vp) vp.end(sessToEval);
    }

    // Append the session-end marker and scroll into view
    ['desktop', 'mobile'].forEach(c => {
        const container = document.getElementById('chatMessages-' + c);
        if (container) {
            const m = document.createElement('div');
            m.className = 'session-end-marker';
            m.textContent = '— Session ended —';
            container.appendChild(m);
            // FIX: use requestAnimationFrame so the DOM has painted before we scroll
            requestAnimationFrame(() => {
                container.scrollTop = container.scrollHeight;
            });
        }
    });
}

/* ════════════════════════════════════════════════════════
    FEEDBACK CARD
════════════════════════════════════════════════════════ */

function addFeedbackCard(fb, ctx) {
    const container = document.getElementById('chatMessages-' + ctx);
    if (!container) return;

    const domains = [
        { key: 'content', label: 'Content' },
        { key: 'clinical_reasoning', label: 'Clinical Reasoning' },
        { key: 'communication', label: 'Communication' },
        { key: 'flow', label: 'Flow' },
        { key: 'professionalism', label: 'Professionalism & Rapport' }
    ];

    const domainHTML = domains.map(({ key, label }) => {
        const d = fb[key] || {};
        const score = d.score || 0;
        const pips = [1, 2, 3, 4, 5].map(i => `<div class="pip${i <= score ? ' on' : ''}"></div>`).join('');
        return `<div class="feedback-domain">
<div class="domain-header">
<span class="domain-label">${label}</span>
<div class="score-pips">${pips}</div>
</div>
<p class="domain-comment">${escapeHtml(d.comment || '')}</p>
</div>`;
    }).join('');

    const ov = fb.overall || {};
    const ovPip = [1, 2, 3, 4, 5].map(i => `<div class="pip${i <= (ov.score || 0) ? ' on' : ''}"></div>`).join('');

    const card = document.createElement('div');
    card.className = 'feedback-card';
    card.innerHTML = `
<div class="feedback-card-header">
<span>Session Evaluation</span>
<span class="turns-badge">${fb.turns} turn${fb.turns !== 1 ? 's' : ''}</span>
</div>
${domainHTML}
<div class="feedback-overall">
<div style="flex:1;">
<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
    <span style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--teal-700);">Overall</span>
    <div class="score-pips">${ovPip}</div>
</div>
<p class="overall-summary">${escapeHtml(ov.summary || '')}</p>
</div>
</div>`;

    container.appendChild(card);

    // FIX: scroll after the card is painted, not before
    requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
    });
}

/* ════════════════════════════════════════════════════════
    ERROR CARD — shown inline in chat when evaluation fails
    so the student always sees what went wrong
════════════════════════════════════════════════════════ */

function addErrorCard(message, ctx) {
    const container = document.getElementById('chatMessages-' + ctx);
    if (!container) return;

    const card = document.createElement('div');
    card.className = 'error-card';
    card.innerHTML = `
<div class="error-card-title">⚠ Evaluation failed</div>
<div class="error-card-msg">${escapeHtml(message)}</div>`;

    container.appendChild(card);
    requestAnimationFrame(() => { container.scrollTop = container.scrollHeight; });
}

/* ════════════════════════════════════════════════════════
    ERROR HANDLING
════════════════════════════════════════════════════════ */

function handleApiError(err, context) {
    const is429 = err.code === 429 || (err.message && err.message.includes('429'))
        || (err.status && (err.status === 'RESOURCE_EXHAUSTED' || err.status === 429));

    if (is429) {
        ['desktop', 'mobile'].forEach(c => {
            document.getElementById('errorBanner-' + c).classList.add('show');
        });
    } else {
        showToast('Error ' + context + ': ' + err.message);
    }
}

function dismissError() {
    ['desktop', 'mobile'].forEach(c => {
        document.getElementById('errorBanner-' + c).classList.remove('show');
    });
}

/* ════════════════════════════════════════════════════════
    UI HELPERS
════════════════════════════════════════════════════════ */

function switchTab(tab) {
    document.querySelectorAll('nav.tabs button').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    document.querySelectorAll('.panel-mobile').forEach(p => p.classList.remove('active'));
    if (tab === 'chat') document.getElementById('panel-chat').classList.add('active');
    if (tab === 'scenario') document.getElementById('panel-scenario').classList.add('active');
    if (tab === 'settings') document.getElementById('panel-settings').classList.add('active');
}

function addMessage(role, text, ctx) {
    const container = document.getElementById('chatMessages-' + ctx);
    if (!container) return;
    const empty = document.getElementById('chatEmpty-' + ctx);
    if (empty) empty.remove();

    const isDoctor = role === 'doctor';
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const wrapper = document.createElement('div');
    wrapper.className = 'msg ' + (isDoctor ? 'doctor' : 'patient');
    wrapper.innerHTML = `
<div class="avatar ${isDoctor ? 'you-avatar' : 'patient-avatar'}">
${isDoctor
            ? 'You'
            : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`}
</div>
<div class="msg-group">
<div class="bubble">${escapeHtml(text)}</div>
<div class="msg-time">${now}</div>
</div>`;
    container.appendChild(wrapper);
    container.scrollTop = container.scrollHeight;
}

function clearChat() {
    ['desktop', 'mobile'].forEach(c => {
        const container = document.getElementById('chatMessages-' + c);
        if (!container) return;
        container.innerHTML = `
<div class="chat-empty" id="chatEmpty-${c}">
<div class="empty-icon">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
</div>
<p><strong>Starting session…</strong><br/>Patient is being prepared.</p>
</div>`;
    });
}

function setLoading(val) {
    ['desktop', 'mobile'].forEach(c => {
        const ind = document.getElementById('typingIndicator-' + c);
        if (ind) ind.classList.toggle('visible', val);
        const btn = document.getElementById('sendBtn-' + c);
        if (btn) btn.disabled = val;
    });
}

function disableApplyBtn(val) {
    ['desktop', 'mobile'].forEach(c => {
        const btn = document.getElementById('applyBtn-' + c);
        if (btn) btn.disabled = val;
    });
}

function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/\n/g, '<br>');
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
}