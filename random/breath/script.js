const breathingData = {
    "anxiety": {
        "category": "calm",
        "breath": [
            { "phase": "in", "seconds": 3 },
            { "phase": "hold", "seconds": 1 },
            { "phase": "out", "seconds": 5 },
            { "phase": "hold", "seconds": 1 }
        ]
    },
    "calm": {
        "category": "calm",
        "breath": [
            { "phase": "in", "seconds": 4 },
            { "phase": "out", "seconds": 6 }
        ]
    },
    "4-7-8 relax": {
        "category": "calm",
        "breath": [
            { "phase": "in", "seconds": 4 },
            { "phase": "hold", "seconds": 7 },
            { "phase": "out", "seconds": 8 }
        ]
    },
    "stress relief": {
        "category": "calm",
        "breath": [
            { "phase": "in", "seconds": 4 },
            { "phase": "hold", "seconds": 4 },
            { "phase": "out", "seconds": 6 },
            { "phase": "hold", "seconds": 2 }
        ]
    },
    "tranquility": {
        "category": "calm",
        "breath": [
            { "phase": "in", "seconds": 3 },
            { "phase": "out", "seconds": 6 }
        ]
    },
    "advance buteyko": {
        "category": "calm",
        "breath": [
            { "phase": "in", "seconds": 4 },
            { "phase": "out", "seconds": 6 },
            { "phase": "pause", "seconds": 1 }
        ]
    },
    "anger irritation": {
        "category": "calm",
        "breath": [
            { "phase": "in", "seconds": 4 },
            { "phase": "out", "seconds": 8 }
        ]
    },
    "balance equal": {
        "category": "calm",
        "breath": [
            { "phase": "in", "seconds": 4 },
            { "phase": "out", "seconds": 4 }
        ]
    },
    "bumblebee breath": {
        "category": "calm",
        "breath": [
            { "phase": "in", "seconds": 4 },
            { "phase": "out", "seconds": 7 }
        ]
    },
    "natural": {
        "category": "calm",
        "breath": [
            { "phase": "in", "seconds": null },
            { "phase": "out", "seconds": null }
        ]
    },
    "resonant coherent": {
        "category": "calm",
        "breath": [
            { "phase": "in", "seconds": 5 },
            { "phase": "out", "seconds": 5 }
        ]
    },
    "pure zzz": {
        "category": "sleep",
        "breath": [
            { "phase": "in", "seconds": 3 },
            { "phase": "hold", "seconds": 1 },
            { "phase": "out", "seconds": 5 }
        ]
    },
    "slumber": {
        "category": "sleep",
        "breath": [
            { "phase": "in", "seconds": 3 },
            { "phase": "hold", "seconds": 3 },
            { "phase": "out", "seconds": 4 }
        ]
    },
    "4-7-8 lite": {
        "category": "sleep",
        "breath": [
            { "phase": "in", "seconds": 2 },
            { "phase": "hold", "seconds": 3.5 },
            { "phase": "out", "seconds": 4 }
        ]
    },
    "4-7-8": {
        "category": "sleep",
        "breath": [
            { "phase": "in", "seconds": 4 },
            { "phase": "hold", "seconds": 7 },
            { "phase": "out", "seconds": 8 }
        ]
    },
    "slumber deep": {
        "category": "sleep",
        "breath": [
            { "phase": "in", "seconds": 4 },
            { "phase": "out", "seconds": 9 }
        ]
    },
    "vagal boost sleep": {
        "category": "sleep",
        "breath": [
            { "phase": "in", "seconds": 5 },
            { "phase": "out", "seconds": 9 }
        ]
    },
    "calm energy": {
        "category": "energy",
        "breath": [
            { "phase": "in", "seconds": 5 },
            { "phase": "out", "seconds": 2 }
        ]
    },
    "yogic energy bhastrika": {
        "category": "energy",
        "breath": [
            { "phase": "in", "seconds": 1 },
            { "phase": "out", "seconds": 1 }
        ]
    },
    "brown fat activation": {
        "category": "energy",
        "breath": [
            { "phase": "in", "seconds": 1 },
            { "phase": "out", "seconds": 1 },
            { "phase": "hold", "seconds": null }
        ]
    },
    "endurance active": {
        "category": "energy",
        "breath": [
            { "phase": "in", "seconds": 2.5 },
            { "phase": "out", "seconds": 2.5 }
        ]
    },
    "box": {
        "category": "focus",
        "breath": [
            { "phase": "in", "seconds": 4 },
            { "phase": "hold", "seconds": 4 },
            { "phase": "out", "seconds": 4 },
            { "phase": "hold", "seconds": 4 }
        ]
    },
    "box plus": {
        "category": "focus",
        "breath": [
            { "phase": "in", "seconds": 6 },
            { "phase": "hold", "seconds": 6 },
            { "phase": "out", "seconds": 6 },
            { "phase": "hold", "seconds": 6 }
        ]
    },
    "tactical": {
        "category": "focus",
        "breath": [
            { "phase": "in", "seconds": 4 },
            { "phase": "hold", "seconds": 4 },
            { "phase": "out", "seconds": 4 }
        ]
    },
    "endurance steady": {
        "category": "focus",
        "breath": [
            { "phase": "in", "seconds": 2.5 },
            { "phase": "out", "seconds": 2.5 }
        ]
    },
    "natural mindful": {
        "category": "focus",
        "breath": [
            { "phase": "in", "seconds": null },
            { "phase": "out", "seconds": null }
        ]
    },
    "balance alt nostril": {
        "category": "focus",
        "breath": [
            { "phase": "in", "seconds": 4 },
            { "phase": "out", "seconds": 4 }
        ]
    },
    "vagal boost alert": {
        "category": "focus",
        "breath": [
            { "phase": "in", "seconds": 3 },
            { "phase": "out", "seconds": 3 }
        ]
    }
};

const categories = ['calm', 'sleep', 'focus', 'energy'];
let currentCategoryIndex = 0;
let isBreathing = false;
let breathingInterval = null;
let currentMethodName = '';
let selectedMethod = '';

const body = document.body;
const categoryTitle = document.getElementById('categoryTitle');
const selectTrigger = document.getElementById('selectTrigger');
const selectOptions = document.getElementById('selectOptions');
const descriptionArea = document.getElementById('descriptionArea');
const startButton = document.getElementById('startButton');
const breathingCircle = document.getElementById('breathingCircle');
const circleText = document.getElementById('circleText');
const phaseLabel = document.getElementById('phaseLabel');
const prevArrow = document.getElementById('prevArrow');
const nextArrow = document.getElementById('nextArrow');

// Method descriptions
const methodDescriptions = {
    'anxiety': 'A calming technique to reduce anxiety with extended exhales',
    'calm': 'Simple breathing pattern for general relaxation',
    '4-7-8 relax': 'Dr. Weil\'s renowned relaxation breathing technique',
    'stress relief': 'Balanced holds to relieve stress and tension',
    'tranquility': 'Gentle breathing for peaceful tranquility',
    'advance buteyko': 'Advanced Buteyko method with pause breathing',
    'anger irritation': 'Extended exhales to calm anger and irritation',
    'balance equal': 'Equal breathing for mental balance',
    'bumblebee breath': 'Humming breath for calming the mind',
    'natural': 'Follow your natural breathing rhythm',
    'resonant coherent': 'Coherent breathing at 5 breaths per minute',
    'pure zzz': 'Gentle breathing to ease into sleep',
    'slumber': 'Relaxing pattern for deep slumber',
    '4-7-8 lite': 'Lighter version of 4-7-8 for falling asleep',
    '4-7-8': 'Classic 4-7-8 breathing for sleep induction',
    'slumber deep': 'Extended exhales for deep sleep',
    'vagal boost sleep': 'Stimulate vagal tone for better sleep',
    'calm energy': 'Energizing while maintaining calmness',
    'yogic energy bhastrika': 'Rapid yogic breathing for energy',
    'brown fat activation': 'Quick breathing to activate metabolism',
    'endurance active': 'Balanced breathing for sustained activity',
    'box': 'Classic box breathing for focus and composure',
    'box plus': 'Extended box breathing for deeper focus',
    'tactical': 'Three-step tactical breathing for focus',
    'endurance steady': 'Steady breathing for endurance',
    'natural mindful': 'Mindful awareness of natural breath',
    'balance alt nostril': 'Alternate nostril breathing for balance',
    'vagal boost alert': 'Quick vagal stimulation for alertness'
};

// Custom select functionality
selectTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    selectTrigger.classList.toggle('active');
    selectOptions.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select')) {
        selectTrigger.classList.remove('active');
        selectOptions.classList.remove('active');
    }
});

function updateCategory() {
    const category = categories[currentCategoryIndex];

    // Update body class
    body.className = category;

    // Update title
    categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);

    // Update method select
    updateMethodSelect(category);

    // Reset breathing state
    stopBreathing();

    // Clear selection
    selectedMethod = '';
    selectTrigger.textContent = 'Select Method';
    descriptionArea.textContent = '';
}

function updateMethodSelect(category) {
    selectOptions.innerHTML = '';

    for (const [name, data] of Object.entries(breathingData)) {
        if (data.category === category) {
            const option = document.createElement('div');
            option.className = 'select-option';
            option.textContent = name.charAt(0).toUpperCase() + name.slice(1);
            option.dataset.value = name;

            option.addEventListener('click', () => {
                selectedMethod = name;
                selectTrigger.textContent = name.charAt(0).toUpperCase() + name.slice(1);
                selectTrigger.classList.remove('active');
                selectOptions.classList.remove('active');

                // Update selected state
                document.querySelectorAll('.select-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                option.classList.add('selected');

                // Display description
                descriptionArea.textContent = methodDescriptions[name] || '';
            });

            selectOptions.appendChild(option);
        }
    }
}

function startBreathing() {
    const methodName = selectedMethod;
    if (!methodName) {
        alert('Please select a breathing method');
        return;
    }
    startGradient()
    currentMethodName = methodName;
    const method = breathingData[methodName];
    const breathPattern = method.breath;

    // Show countdown 3-2-1
    startButton.querySelector('span').textContent = 'Starting...';
    startButton.disabled = true;

    const countdownSequence = [3, 2, 1];
    let countdownIndex = 0;

    function showCountdown() {
        if (countdownIndex < countdownSequence.length) {
            const num = countdownSequence[countdownIndex];
            circleText.textContent = num;
            phaseLabel.textContent = 'GET READY';

            // Add pulse animation
            circleText.classList.add('countdown-active');

            setTimeout(() => {
                circleText.classList.remove('countdown-active');
                countdownIndex++;
                showCountdown();
            }, 1000);
        } else {
            // Start actual breathing after countdown
            isBreathing = true;
            startButton.querySelector('span').textContent = 'Stop';
            startButton.disabled = false;
            executeBreathingCycle();
        }
    }

    let stepIndex = 0;
    const pauseBetweenSteps = 0.5; // 0.5 second pause between each step

    function executeBreathingCycle() {
        if (!isBreathing) return;

        const step = breathPattern[stepIndex];
        const phase = step.phase;
        const seconds = step.seconds;

        // Handle null seconds (natural breathing)
        if (seconds === null) {
            phaseLabel.textContent = `Breathe ${phase}`;
            circleText.textContent = '∞';
            breathingCircle.style.width = '200px';
            breathingCircle.style.height = '200px';
            breathingCircle.style.animation = 'none';
            return;
        }

        // Update phase label
        phaseLabel.textContent = phase.toUpperCase();

        // Determine target size and animation based on phase
        let targetSize, startSize;

        if (phase === 'in') {
            startSize = 140;
            targetSize = 300;
            breathingCircle.style.animation = 'none';
            breathingCircle.style.background = 'rgba(255, 255, 255, 0.25)';
            breathingCircle.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.15), inset 0 0 30px rgba(255, 255, 255, 0.2)';
        } else if (phase === 'out') {
            startSize = 300;
            targetSize = 140;
            breathingCircle.style.animation = 'none';
            breathingCircle.style.background = 'rgba(255, 255, 255, 0.1)';
            breathingCircle.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.1)';
        } else if (phase === 'hold' || phase === 'pause') {
            // Keep current size and add rotation
            const currentSize = parseInt(breathingCircle.style.width) || 200;
            startSize = currentSize;
            targetSize = currentSize;
            breathingCircle.style.animation = `breathingRotate ${seconds * 2}s linear infinite`;
            breathingCircle.style.background = 'rgba(255, 255, 255, 0.2)';
            breathingCircle.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.12), inset 0 0 25px rgba(255, 255, 255, 0.15)';
        }

        // Set initial size
        breathingCircle.style.width = `${startSize}px`;
        breathingCircle.style.height = `${startSize}px`;

        // Apply gradual transition
        breathingCircle.style.transition = `width ${seconds}s ease-in-out, height ${seconds}s ease-in-out, background ${seconds}s ease, box-shadow ${seconds}s ease`;

        // Trigger size change after a brief delay to ensure transition applies
        setTimeout(() => {
            breathingCircle.style.width = `${targetSize}px`;
            breathingCircle.style.height = `${targetSize}px`;
        }, 50);

        // Countdown
        let countdown = Math.ceil(seconds);
        circleText.textContent = countdown;

        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                circleText.textContent = countdown;
            } else {
                clearInterval(countdownInterval);
            }
        }, 1000);

        // Move to next step after the breathing duration + 0.5s pause
        setTimeout(() => {
            // Clear the countdown during pause
            circleText.textContent = '';
            phaseLabel.textContent = '';

            // Wait for the pause, then move to next step
            setTimeout(() => {
                stepIndex = (stepIndex + 1) % breathPattern.length;
                executeBreathingCycle();
            }, pauseBetweenSteps * 1000);
        }, seconds * 1000);
    }

    // Start countdown
    showCountdown();
}

function stopBreathing() {
    isBreathing = false;
    if (breathingInterval) {
        clearInterval(breathingInterval);
        breathingInterval = null;
    }
    startButton.querySelector('span').textContent = 'Start';
    startButton.disabled = false;
    breathingCircle.style.width = '200px';
    breathingCircle.style.height = '200px';
    breathingCircle.style.animation = 'none';
    breathingCircle.style.transition = 'width 0.5s ease, height 0.5s ease';
    breathingCircle.style.background = 'rgba(255, 255, 255, 0.15)';
    breathingCircle.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.1)';
    circleText.textContent = '';
    circleText.classList.remove('countdown-active');
    phaseLabel.textContent = '';
    stopGradient()
}

// Event Listeners
prevArrow.addEventListener('click', () => {
    currentCategoryIndex = (currentCategoryIndex - 1 + categories.length) % categories.length;
    updateCategory();
});

nextArrow.addEventListener('click', () => {
    currentCategoryIndex = (currentCategoryIndex + 1) % categories.length;
    updateCategory();
});

startButton.addEventListener('click', () => {
    if (isBreathing) {
        stopBreathing();
    } else {
        startBreathing();
    }
});

// Touch swipe support with less sensitivity
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

body.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

body.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 100; // Increased from 50 to 100 for less sensitivity
    const horizontalDiff = touchEndX - touchStartX;
    const verticalDiff = Math.abs(touchEndY - touchStartY);

    // Only trigger if horizontal swipe is significantly larger than vertical
    if (verticalDiff < 50) {
        if (horizontalDiff < -swipeThreshold) {
            // Swipe left - next category
            currentCategoryIndex = (currentCategoryIndex + 1) % categories.length;
            updateCategory();
        }
        if (horizontalDiff > swipeThreshold) {
            // Swipe right - previous category
            currentCategoryIndex = (currentCategoryIndex - 1 + categories.length) % categories.length;
            updateCategory();
        }
    }
}

function startGradient() {
    body.style.setProperty('--bg-size', '300% 300%');
    body.style.setProperty('--state', "running")
}

function stopGradient() {
    body.style.setProperty('--bg-size', '100% 100%');
    body.style.setProperty('--state', "paused");
}


// Initialize
updateCategory();


//NOTE - timer
// new feature: add timer (use original css)

// allow user to select time to breath: 1, 2, 5, 10, 15, 20 min

// the box of time selection should be at the same row with method, beside it

// 1. separate css, js and html

// 2. don't need regenerate file, only output the additional part for me to replace/paste