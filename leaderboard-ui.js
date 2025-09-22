/**
 * Leaderboard UI Components
 * Displays scores, achievements, and player statistics
 */

class LeaderboardUI {
    constructor() {
        this.currentView = 'current'; // 'current' or 'overall'
        this.setupEventListeners();
    }

    // Show leaderboard modal
    showLeaderboard(view = 'current') {
        this.currentView = view;
        const modal = this.createLeaderboardModal();
        document.body.appendChild(modal);
        
        setTimeout(() => modal.classList.add('show'), 100);
    }

    // Create leaderboard modal
    createLeaderboardModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'leaderboard-modal';

        const leaderboard = scoreManager.getEnhancedLeaderboard();
        
        modal.innerHTML = `
            <div class="modal-content large">
                <div class="modal-header">
                    <h2>🏆 Leaderboard</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="leaderboard-controls">
                        <button class="view-toggle ${this.currentView === 'current' ? 'active' : ''}" 
                                data-view="current">Current Game</button>
                        <button class="view-toggle ${this.currentView === 'overall' ? 'active' : ''}" 
                                data-view="overall">Overall Stats</button>
                    </div>
                    <div class="leaderboard-container">
                        ${this.renderLeaderboard(leaderboard)}
                    </div>
                    <div class="game-stats-container">
                        ${this.renderGameStats()}
                    </div>
                </div>
            </div>
        `;

        this.attachLeaderboardListeners(modal);
        return modal;
    }

    // Render leaderboard list
    renderLeaderboard(leaderboard) {
        if (leaderboard.length === 0) {
            return `
                <div class="empty-leaderboard">
                    <p>🎮 No players yet!</p>
                    <p>Start playing to see scores here.</p>
                </div>
            `;
        }

        const listItems = leaderboard.map((player, index) => {
            const rank = index + 1;
            const achievements = player.achievements || [];
            const topAchievements = achievements.slice(0, 3);

            return `
                <li class="leaderboard-item rank-${rank <= 3 ? rank : 'other'}" data-player-id="${player.id}">
                    <div class="rank-number">${this.getRankDisplay(rank)}</div>
                    <div class="player-info">
                        <div class="player-name">${player.name}</div>
                        <div class="player-stats">
                            <span class="stat-item">
                                🎮 ${player.gamesPlayed || 0} games
                            </span>
                            <span class="stat-item">
                                📊 ${player.winRate || 0}% win rate
                            </span>
                            <span class="stat-item">
                                ⭐ ${player.favoriteGame || 'None'}
                            </span>
                        </div>
                    </div>
                    <div class="player-achievements">
                        ${topAchievements.map(achievement => 
                            `<div class="achievement-badge" title="${achievement.name}: ${achievement.description}">
                                ${achievement.name.charAt(0)}
                            </div>`
                        ).join('')}
                        ${achievements.length > 3 ? 
                            `<div class="achievement-badge more" title="View all achievements">
                                +${achievements.length - 3}
                            </div>` : ''
                        }
                    </div>
                    <div class="score-display">
                        <div class="current-score">${player.currentScore || 0}</div>
                        <div class="total-score">Total: ${player.totalScore || 0}</div>
                    </div>
                </li>
            `;
        }).join('');

        return `
            <div class="leaderboard-header">
                <h3 class="leaderboard-title">Player Rankings</h3>
                <p class="leaderboard-subtitle">Click on a player to view their full profile</p>
            </div>
            <ul class="leaderboard-list">
                ${listItems}
            </ul>
        `;
    }

    // Get rank display with emojis
    getRankDisplay(rank) {
        switch (rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return rank;
        }
    }

    // Render game statistics
    renderGameStats() {
        const room = roomManager.getCurrentRoom();
        if (!room) return '';

        const totalPlayers = room.players.size;
        const totalGames = this.getTotalGamesPlayed();
        const averageScore = this.getAverageScore();
        const topScorer = this.getTopScorer();

        return `
            <div class="leaderboard-header">
                <h3 class="leaderboard-title">Game Statistics</h3>
            </div>
            <div class="game-stats-grid">
                <div class="game-stat-card">
                    <div class="stat-icon">👥</div>
                    <div class="stat-number">${totalPlayers}</div>
                    <div class="stat-description">Active Players</div>
                </div>
                <div class="game-stat-card">
                    <div class="stat-icon">🎮</div>
                    <div class="stat-number">${totalGames}</div>
                    <div class="stat-description">Games Played</div>
                </div>
                <div class="game-stat-card">
                    <div class="stat-icon">📊</div>
                    <div class="stat-number">${Math.round(averageScore)}</div>
                    <div class="stat-description">Average Score</div>
                </div>
                <div class="game-stat-card">
                    <div class="stat-icon">🏆</div>
                    <div class="stat-number">${topScorer.score}</div>
                    <div class="stat-description">High Score by ${topScorer.name}</div>
                </div>
            </div>
        `;
    }

    // Get total games played
    getTotalGamesPlayed() {
        // This could be enhanced to track across all games
        return parseInt(localStorage.getItem('totalGamesPlayed') || '0');
    }

    // Get average score
    getAverageScore() {
        const room = roomManager.getCurrentRoom();
        if (!room || room.scores.size === 0) return 0;

        let totalScore = 0;
        let playerCount = 0;

        room.scores.forEach(scoreData => {
            totalScore += scoreData.total;
            playerCount++;
        });

        return playerCount > 0 ? totalScore / playerCount : 0;
    }

    // Get top scorer
    getTopScorer() {
        const leaderboard = roomManager.getLeaderboard();
        if (leaderboard.length === 0) {
            return { name: 'Nobody yet', score: 0 };
        }
        return { name: leaderboard[0].name, score: leaderboard[0].totalScore };
    }

    // Show player profile modal
    showPlayerProfile(playerId) {
        const room = roomManager.getCurrentRoom();
        if (!room) return;

        const player = room.players.get(playerId);
        const stats = scoreManager.getPlayerStats(playerId);
        const achievements = scoreManager.getPlayerAchievements(playerId);

        const modal = document.createElement('div');
        modal.className = 'player-profile-modal';
        modal.innerHTML = `
            <div class="player-profile-content">
                <button class="close-profile">&times;</button>
                <div class="profile-header">
                    <div class="profile-name">${player.name}</div>
                    <div class="profile-title">${this.getPlayerTitle(stats)}</div>
                    <div class="profile-score">Total Score: ${scoreManager.getTotalPoints(playerId)}</div>
                </div>
                
                <div class="profile-stats-grid">
                    <div class="profile-stat">
                        <div class="stat-value">${stats.games_played || 0}</div>
                        <div class="stat-label">Games Played</div>
                    </div>
                    <div class="profile-stat">
                        <div class="stat-value">${stats.mvp_awards || 0}</div>
                        <div class="stat-label">MVP Awards</div>
                    </div>
                    <div class="profile-stat">
                        <div class="stat-value">${scoreManager.calculateWinRate(playerId)}%</div>
                        <div class="stat-label">Win Rate</div>
                    </div>
                    <div class="profile-stat">
                        <div class="stat-value">${achievements.length}</div>
                        <div class="stat-label">Achievements</div>
                    </div>
                    <div class="profile-stat">
                        <div class="stat-value">${stats.truths_completed || 0}</div>
                        <div class="stat-label">Truths Answered</div>
                    </div>
                    <div class="profile-stat">
                        <div class="stat-value">${stats.dares_completed || 0}</div>
                        <div class="stat-label">Dares Completed</div>
                    </div>
                </div>

                <div class="achievements-section">
                    <h3 class="achievements-title">🏆 Achievements (${achievements.length})</h3>
                    <div class="achievements-grid">
                        ${achievements.map(achievement => `
                            <div class="achievement-card">
                                <div class="achievement-icon">${achievement.name.split(' ')[0]}</div>
                                <div class="achievement-name">${achievement.name}</div>
                                <div class="achievement-desc">${achievement.description}</div>
                            </div>
                        `).join('')}
                        ${achievements.length === 0 ? 
                            '<p style="text-align: center; color: #666; grid-column: 1 / -1;">No achievements yet. Keep playing to unlock them!</p>' : 
                            ''
                        }
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 100);

        // Close modal listeners
        modal.querySelector('.close-profile').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => document.body.removeChild(modal), 300);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => document.body.removeChild(modal), 300);
            }
        });
    }

    // Get player title based on stats
    getPlayerTitle(stats) {
        const gamesPlayed = stats.games_played || 0;
        const mvpAwards = stats.mvp_awards || 0;
        const achievements = stats.achievements || [];

        if (achievements.length >= 10) return '🌟 Achievement Hunter';
        if (mvpAwards >= 5) return '👑 Game Master';
        if (gamesPlayed >= 20) return '🎮 Veteran Player';
        if (gamesPlayed >= 10) return '🎯 Regular Player';
        if (gamesPlayed >= 5) return '🎪 Party Goer';
        if (gamesPlayed >= 1) return '🎈 Newcomer';
        return '👋 New Player';
    }

    // Attach event listeners to leaderboard modal
    attachLeaderboardListeners(modal) {
        // Close modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => document.body.removeChild(modal), 300);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => document.body.removeChild(modal), 300);
            }
        });

        // View toggles
        modal.querySelectorAll('.view-toggle').forEach(button => {
            button.addEventListener('click', () => {
                this.currentView = button.dataset.view;
                modal.querySelectorAll('.view-toggle').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Refresh leaderboard content
                const container = modal.querySelector('.leaderboard-container');
                const leaderboard = scoreManager.getEnhancedLeaderboard();
                container.innerHTML = this.renderLeaderboard(leaderboard);
                
                // Re-attach player click listeners
                this.attachPlayerClickListeners(modal);
            });
        });

        // Player profile clicks
        this.attachPlayerClickListeners(modal);
    }

    // Attach click listeners to player items
    attachPlayerClickListeners(modal) {
        modal.querySelectorAll('.leaderboard-item').forEach(item => {
            item.addEventListener('click', () => {
                const playerId = item.dataset.playerId;
                this.showPlayerProfile(playerId);
            });
        });
    }

    // Setup global event listeners
    setupEventListeners() {
        // Listen for score updates to refresh leaderboard
        document.addEventListener('scoreUpdated', () => {
            this.refreshLeaderboard();
        });

        // Listen for achievements unlocked
        document.addEventListener('achievementUnlocked', (e) => {
            this.refreshLeaderboard();
        });
    }

    // Refresh leaderboard if it's currently visible
    refreshLeaderboard() {
        const modal = document.getElementById('leaderboard-modal');
        if (modal) {
            const container = modal.querySelector('.leaderboard-container');
            const leaderboard = scoreManager.getEnhancedLeaderboard();
            container.innerHTML = this.renderLeaderboard(leaderboard);
            this.attachPlayerClickListeners(modal);
        }
    }

    // Show quick score summary
    showQuickScore() {
        const room = roomManager.getCurrentRoom();
        if (!room) return;

        const leaderboard = roomManager.getLeaderboard().slice(0, 3);
        
        const notification = document.createElement('div');
        notification.className = 'quick-score-notification';
        notification.innerHTML = `
            <div class="quick-score-header">🏆 Top Players</div>
            <div class="quick-score-list">
                ${leaderboard.map((player, index) => `
                    <div class="quick-score-item">
                        <span class="quick-rank">${this.getRankDisplay(index + 1)}</span>
                        <span class="quick-name">${player.name}</span>
                        <span class="quick-score">${player.totalScore}</span>
                    </div>
                `).join('')}
            </div>
            <button class="view-full-leaderboard">View Full Leaderboard</button>
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);

        // View full leaderboard button
        notification.querySelector('.view-full-leaderboard').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
            this.showLeaderboard();
        });
    }
}

// Global leaderboard UI instance
const leaderboardUI = new LeaderboardUI();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LeaderboardUI;
}