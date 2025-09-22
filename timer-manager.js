/**
 * Timer Management System
 * Handles game timers, round management, and time-based scoring
 */

class TimerManager {
    constructor() {
        this.timers = new Map();
        this.activeTimer = null;
        this.timerCallbacks = new Map();
        this.timerElements = new Map();
        this.soundEnabled = true;
        
        this.setupAudioContext();
    }

    // Setup audio context for timer sounds
    setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Audio context not supported');
            this.audioContext = null;
        }
    }

    // Create a new timer
    createTimer(id, duration, options = {}) {
        const timer = {
            id: id,
            duration: duration * 1000, // Convert to milliseconds
            remaining: duration * 1000,
            startTime: null,
            endTime: null,
            isRunning: false,
            isPaused: false,
            interval: null,
            callbacks: {
                onTick: options.onTick || null,
                onComplete: options.onComplete || null,
                onWarning: options.onWarning || null
            },
            warningTime: options.warningTime || 10000, // 10 seconds default
            showDisplay: options.showDisplay !== false,
            position: options.position || 'top-right',
            title: options.title || 'Timer',
            color: options.color || '#667eea'
        };

        this.timers.set(id, timer);
        
        if (timer.showDisplay) {
            this.createTimerDisplay(timer);
        }

        return timer;
    }

    // Start a timer
    startTimer(id) {
        const timer = this.timers.get(id);
        if (!timer || timer.isRunning) return false;

        timer.isRunning = true;
        timer.isPaused = false;
        timer.startTime = Date.now();
        timer.endTime = timer.startTime + timer.remaining;
        this.activeTimer = id;

        timer.interval = setInterval(() => {
            this.updateTimer(id);
        }, 100);

        this.updateTimerDisplay(timer);
        this.playTimerSound('start');

        return true;
    }

    // Pause a timer
    pauseTimer(id) {
        const timer = this.timers.get(id);
        if (!timer || !timer.isRunning || timer.isPaused) return false;

        timer.isPaused = true;
        timer.remaining = timer.endTime - Date.now();
        clearInterval(timer.interval);
        
        this.updateTimerDisplay(timer);
        return true;
    }

    // Resume a timer
    resumeTimer(id) {
        const timer = this.timers.get(id);
        if (!timer || !timer.isPaused) return false;

        timer.isPaused = false;
        timer.startTime = Date.now();
        timer.endTime = timer.startTime + timer.remaining;

        timer.interval = setInterval(() => {
            this.updateTimer(id);
        }, 100);

        this.updateTimerDisplay(timer);
        return true;
    }

    // Stop and reset a timer
    stopTimer(id) {
        const timer = this.timers.get(id);
        if (!timer) return false;

        clearInterval(timer.interval);
        timer.isRunning = false;
        timer.isPaused = false;
        timer.remaining = timer.duration;
        timer.startTime = null;
        timer.endTime = null;

        if (this.activeTimer === id) {
            this.activeTimer = null;
        }

        this.updateTimerDisplay(timer);
        return true;
    }

    // Update timer countdown
    updateTimer(id) {
        const timer = this.timers.get(id);
        if (!timer || !timer.isRunning || timer.isPaused) return;

        const now = Date.now();
        timer.remaining = Math.max(0, timer.endTime - now);

        // Check for warning time
        if (timer.remaining <= timer.warningTime && timer.remaining > 0) {
            if (timer.callbacks.onWarning) {
                timer.callbacks.onWarning(timer.remaining);
            }
            this.playTimerSound('warning');
        }

        // Check for completion
        if (timer.remaining <= 0) {
            this.completeTimer(id);
            return;
        }

        // Call tick callback
        if (timer.callbacks.onTick) {
            timer.callbacks.onTick(timer.remaining);
        }

        this.updateTimerDisplay(timer);
    }

    // Complete a timer
    completeTimer(id) {
        const timer = this.timers.get(id);
        if (!timer) return;

        clearInterval(timer.interval);
        timer.isRunning = false;
        timer.remaining = 0;

        if (timer.callbacks.onComplete) {
            timer.callbacks.onComplete();
        }

        this.updateTimerDisplay(timer);
        this.playTimerSound('complete');

        // Award time-based points if in a multiplayer game
        if (typeof scoreManager !== 'undefined' && roomManager.getCurrentRoom()) {
            const currentPlayer = roomManager.getCurrentPlayer();
            if (currentPlayer) {
                scoreManager.addPoints(currentPlayer.id, 'streak_bonus');
            }
        }
    }

    // Create timer display element
    createTimerDisplay(timer) {
        const display = document.createElement('div');
        display.id = `timer-display-${timer.id}`;
        display.className = 'timer-display';
        
        const position = this.getPositionStyles(timer.position);
        display.style.cssText = `
            position: fixed;
            ${position}
            background: ${timer.color};
            color: white;
            padding: 15px 20px;
            border-radius: 25px;
            font-family: 'Courier New', monospace;
            font-size: 1.2em;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            min-width: 120px;
            text-align: center;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.2);
        `;

        display.innerHTML = `
            <div class="timer-title" style="font-size: 0.8em; margin-bottom: 5px; opacity: 0.9;">
                ${timer.title}
            </div>
            <div class="timer-time" style="font-size: 1.4em;">
                ${this.formatTime(timer.remaining)}
            </div>
            <div class="timer-controls" style="margin-top: 8px; display: flex; gap: 8px; justify-content: center;">
                <button onclick="timerManager.pauseTimer('${timer.id}')" 
                        style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 4px 8px; border-radius: 12px; cursor: pointer; font-size: 0.8em;">
                    ⏸️
                </button>
                <button onclick="timerManager.resumeTimer('${timer.id}')" 
                        style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 4px 8px; border-radius: 12px; cursor: pointer; font-size: 0.8em;">
                    ▶️
                </button>
                <button onclick="timerManager.stopTimer('${timer.id}')" 
                        style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 4px 8px; border-radius: 12px; cursor: pointer; font-size: 0.8em;">
                    ⏹️
                </button>
            </div>
        `;

        document.body.appendChild(display);
        this.timerElements.set(timer.id, display);

        // Add drag functionality for mobile
        this.makeDraggable(display);
    }

    // Update timer display
    updateTimerDisplay(timer) {
        const element = this.timerElements.get(timer.id);
        if (!element) return;

        const timeElement = element.querySelector('.timer-time');
        if (timeElement) {
            timeElement.textContent = this.formatTime(timer.remaining);
        }

        // Update colors based on remaining time
        if (timer.remaining <= 5000) { // Last 5 seconds
            element.style.background = '#ef4444';
            element.style.animation = 'pulse 1s infinite';
        } else if (timer.remaining <= timer.warningTime) {
            element.style.background = '#f59e0b';
            element.style.animation = 'none';
        } else {
            element.style.background = timer.color;
            element.style.animation = 'none';
        }

        // Show/hide based on timer state
        if (timer.isRunning) {
            element.style.opacity = '1';
        } else if (timer.isPaused) {
            element.style.opacity = '0.7';
        } else {
            element.style.opacity = '0.5';
        }
    }

    // Get position styles for timer placement
    getPositionStyles(position) {
        switch (position) {
            case 'top-left': return 'top: 20px; left: 20px;';
            case 'top-right': return 'top: 20px; right: 20px;';
            case 'top-center': return 'top: 20px; left: 50%; transform: translateX(-50%);';
            case 'bottom-left': return 'bottom: 20px; left: 20px;';
            case 'bottom-right': return 'bottom: 20px; right: 20px;';
            case 'bottom-center': return 'bottom: 20px; left: 50%; transform: translateX(-50%);';
            case 'center': return 'top: 50%; left: 50%; transform: translate(-50%, -50%);';
            default: return 'top: 20px; right: 20px;';
        }
    }

    // Format time for display
    formatTime(milliseconds) {
        const totalSeconds = Math.ceil(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        if (minutes > 0) {
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${seconds}s`;
        }
    }

    // Make timer display draggable
    makeDraggable(element) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        element.addEventListener('touchstart', (e) => {
            isDragging = true;
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startLeft = parseInt(element.style.left) || 0;
            startTop = parseInt(element.style.top) || 0;
            element.style.transition = 'none';
        });

        element.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            
            element.style.left = (startLeft + deltaX) + 'px';
            element.style.top = (startTop + deltaY) + 'px';
            element.style.right = 'auto';
            element.style.bottom = 'auto';
            element.style.transform = 'none';
        });

        element.addEventListener('touchend', () => {
            isDragging = false;
            element.style.transition = 'all 0.3s ease';
        });
    }

    // Play timer sounds
    playTimerSound(type) {
        if (!this.soundEnabled || !this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            let frequency, duration;
            switch (type) {
                case 'start':
                    frequency = 800;
                    duration = 0.2;
                    break;
                case 'warning':
                    frequency = 1000;
                    duration = 0.1;
                    break;
                case 'complete':
                    frequency = 600;
                    duration = 0.5;
                    break;
                default:
                    frequency = 400;
                    duration = 0.1;
            }

            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (e) {
            console.warn('Timer sound failed:', e);
        }
    }

    // Remove timer
    removeTimer(id) {
        const timer = this.timers.get(id);
        if (timer) {
            this.stopTimer(id);
            
            const element = this.timerElements.get(id);
            if (element && element.parentNode) {
                document.body.removeChild(element);
            }
            
            this.timers.delete(id);
            this.timerElements.delete(id);
        }
    }

    // Get timer info
    getTimer(id) {
        return this.timers.get(id);
    }

    // Get all active timers
    getActiveTimers() {
        const active = [];
        this.timers.forEach((timer, id) => {
            if (timer.isRunning) {
                active.push({ id, ...timer });
            }
        });
        return active;
    }

    // Toggle sound
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }

    // Create quick timer presets
    createQuickTimer(type) {
        switch (type) {
            case 'round':
                return this.createTimer('round', 60, {
                    title: '⏰ Round Timer',
                    warningTime: 10000,
                    color: '#667eea',
                    onComplete: () => {
                        alert('Round time is up! 🔔');
                        if (typeof scoreManager !== 'undefined' && roomManager.getCurrentRoom()) {
                            scoreManager.awardMVP();
                        }
                    }
                });

            case 'turn':
                return this.createTimer('turn', 30, {
                    title: '🎯 Turn Timer',
                    warningTime: 5000,
                    color: '#f59e0b',
                    position: 'top-left'
                });

            case 'thinking':
                return this.createTimer('thinking', 15, {
                    title: '🤔 Think Fast',
                    warningTime: 3000,
                    color: '#8b5cf6',
                    position: 'center'
                });

            case 'challenge':
                return this.createTimer('challenge', 120, {
                    title: '🎪 Challenge Time',
                    warningTime: 30000,
                    color: '#ef4444',
                    onComplete: () => {
                        alert('Challenge time is up! 💪');
                    }
                });

            default:
                return this.createTimer('custom', 60, {
                    title: '⏱️ Timer',
                    color: '#667eea'
                });
        }
    }
}

// Global timer manager instance
const timerManager = new TimerManager();

// Add CSS for timer animations
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        .timer-display:hover {
            transform: scale(1.02);
        }
        
        @media (max-width: 768px) {
            .timer-display {
                font-size: 1em !important;
                padding: 10px 15px !important;
                min-width: 100px !important;
            }
            
            .timer-display .timer-time {
                font-size: 1.2em !important;
            }
        }
    `;
    document.head.appendChild(style);
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimerManager;
}