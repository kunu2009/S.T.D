/**
 * Comprehensive Scoring System
 * Handles points, achievements, leaderboards, and statistics
 */

class ScoreManager {
    constructor() {
        this.achievements = new Map();
        this.pointValues = {
            // Truth or Dare
            'truth_completed': 5,
            'dare_completed': 10,
            'dare_skipped': -2,
            'creative_truth': 8,
            'epic_dare': 15,
            
            // Would You Rather
            'choice_made': 3,
            'majority_choice': 5,
            'unique_choice': 8,
            'explanation_given': 7,
            
            // Most Likely To
            'correct_prediction': 10,
            'vote_received': 5,
            'tie_breaker_win': 12,
            'anonymous_vote': 3,
            
            // Never Have I Ever
            'statement_true': 5,
            'rare_experience': 10,
            'common_experience': -1,
            'story_shared': 8,
            
            // Two Truths and a Lie
            'lie_detected': 10,
            'successful_lie': 15,
            'truth_guessed': 5,
            'creative_lie': 12,
            
            // General
            'game_completed': 10,
            'mvp_award': 20,
            'participation': 2,
            'first_game': 5,
            'streak_bonus': 3
        };
        
        this.initializeAchievements();
    }

    initializeAchievements() {
        // Define all possible achievements
        const achievementsList = [
            // General Achievements
            {
                id: 'first_timer',
                name: '🎉 First Timer',
                description: 'Play your first party game',
                points: 10,
                condition: 'games_played >= 1'
            },
            {
                id: 'social_butterfly',
                name: '🦋 Social Butterfly',
                description: 'Play games with 10 different people',
                points: 25,
                condition: 'unique_players >= 10'
            },
            {
                id: 'game_master',
                name: '👑 Game Master',
                description: 'Win 5 games as MVP',
                points: 50,
                condition: 'mvp_awards >= 5'
            },
            {
                id: 'marathon_player',
                name: '🏃 Marathon Player',
                description: 'Play for 2 hours straight',
                points: 30,
                condition: 'session_duration >= 7200'
            },
            {
                id: 'streak_master',
                name: '🔥 Streak Master',
                description: 'Maintain a 10-game winning streak',
                points: 40,
                condition: 'win_streak >= 10'
            },

            // Truth or Dare Achievements
            {
                id: 'truth_seeker',
                name: '🔍 Truth Seeker',
                description: 'Complete 20 truth questions',
                points: 20,
                condition: 'truths_completed >= 20'
            },
            {
                id: 'dare_devil',
                name: '😈 Dare Devil',
                description: 'Complete 15 dare challenges',
                points: 25,
                condition: 'dares_completed >= 15'
            },
            {
                id: 'fearless',
                name: '💪 Fearless',
                description: 'Never skip a dare in a game',
                points: 30,
                condition: 'dares_skipped == 0 && dares_completed >= 5'
            },

            // Would You Rather Achievements
            {
                id: 'decision_maker',
                name: '⚡ Decision Maker',
                description: 'Make 50 choices in Would You Rather',
                points: 15,
                condition: 'choices_made >= 50'
            },
            {
                id: 'contrarian',
                name: '🎭 Contrarian',
                description: 'Choose the minority option 10 times',
                points: 25,
                condition: 'unique_choices >= 10'
            },

            // Most Likely To Achievements
            {
                id: 'prophet',
                name: '🔮 Prophet',
                description: 'Predict correctly 20 times',
                points: 30,
                condition: 'correct_predictions >= 20'
            },
            {
                id: 'popular_vote',
                name: '📊 Popular Vote',
                description: 'Receive 100 votes total',
                points: 25,
                condition: 'votes_received >= 100'
            },

            // Never Have I Ever Achievements
            {
                id: 'experienced',
                name: '🌟 Experienced',
                description: 'Have done 30 things others haven\'t',
                points: 20,
                condition: 'rare_experiences >= 30'
            },
            {
                id: 'storyteller',
                name: '📚 Storyteller',
                description: 'Share 15 interesting stories',
                points: 25,
                condition: 'stories_shared >= 15'
            },

            // Two Truths and a Lie Achievements
            {
                id: 'lie_detector',
                name: '🕵️ Lie Detector',
                description: 'Detect 25 lies correctly',
                points: 30,
                condition: 'lies_detected >= 25'
            },
            {
                id: 'master_deceiver',
                name: '🎪 Master Deceiver',
                description: 'Successfully lie 20 times',
                points: 35,
                condition: 'successful_lies >= 20'
            },

            // Special Achievements
            {
                id: 'completionist',
                name: '🏆 Completionist',
                description: 'Play all available games',
                points: 100,
                condition: 'unique_games >= 6'
            },
            {
                id: 'party_legend',
                name: '🌟 Party Legend',
                description: 'Reach 1000 total points',
                points: 50,
                condition: 'total_points >= 1000'
            }
        ];

        achievementsList.forEach(achievement => {
            this.achievements.set(achievement.id, achievement);
        });
    }

    // Add points to a player
    addPoints(playerId, action, customPoints = null) {
        if (!roomManager.currentRoom) return;

        const points = customPoints || this.pointValues[action] || 0;
        roomManager.addScore(playerId, 'current_game', points);

        // Update player statistics
        this.updatePlayerStats(playerId, action);

        // Check for achievements
        this.checkAchievements(playerId);

        // Create visual feedback
        this.showPointsGained(playerId, points, action);

        return points;
    }

    // Update player statistics for achievement tracking
    updatePlayerStats(playerId, action) {
        const room = roomManager.getCurrentRoom();
        if (!room) return;

        const playerStats = this.getPlayerStats(playerId);

        // Update action-specific stats
        switch (action) {
            case 'truth_completed':
                playerStats.truths_completed = (playerStats.truths_completed || 0) + 1;
                break;
            case 'dare_completed':
                playerStats.dares_completed = (playerStats.dares_completed || 0) + 1;
                break;
            case 'dare_skipped':
                playerStats.dares_skipped = (playerStats.dares_skipped || 0) + 1;
                break;
            case 'choice_made':
                playerStats.choices_made = (playerStats.choices_made || 0) + 1;
                break;
            case 'unique_choice':
                playerStats.unique_choices = (playerStats.unique_choices || 0) + 1;
                break;
            case 'correct_prediction':
                playerStats.correct_predictions = (playerStats.correct_predictions || 0) + 1;
                break;
            case 'vote_received':
                playerStats.votes_received = (playerStats.votes_received || 0) + 1;
                break;
            case 'rare_experience':
                playerStats.rare_experiences = (playerStats.rare_experiences || 0) + 1;
                break;
            case 'story_shared':
                playerStats.stories_shared = (playerStats.stories_shared || 0) + 1;
                break;
            case 'lie_detected':
                playerStats.lies_detected = (playerStats.lies_detected || 0) + 1;
                break;
            case 'successful_lie':
                playerStats.successful_lies = (playerStats.successful_lies || 0) + 1;
                break;
            case 'mvp_award':
                playerStats.mvp_awards = (playerStats.mvp_awards || 0) + 1;
                break;
        }

        // Update general stats
        playerStats.games_played = (playerStats.games_played || 0) + (action === 'game_completed' ? 1 : 0);
        playerStats.total_points = this.getTotalPoints(playerId);

        this.savePlayerStats(playerId, playerStats);
    }

    // Get player statistics
    getPlayerStats(playerId) {
        const saved = localStorage.getItem(`playerStats_${playerId}`);
        return saved ? JSON.parse(saved) : {};
    }

    // Save player statistics
    savePlayerStats(playerId, stats) {
        localStorage.setItem(`playerStats_${playerId}`, JSON.stringify(stats));
    }

    // Get total points for a player
    getTotalPoints(playerId) {
        const room = roomManager.getCurrentRoom();
        if (!room || !room.scores.has(playerId)) return 0;
        return room.scores.get(playerId).total;
    }

    // Check and award achievements
    checkAchievements(playerId) {
        const stats = this.getPlayerStats(playerId);
        const newAchievements = [];

        this.achievements.forEach((achievement, id) => {
            // Skip if already earned
            if (stats.achievements && stats.achievements.includes(id)) return;

            // Check condition
            if (this.evaluateCondition(achievement.condition, stats)) {
                // Award achievement
                if (!stats.achievements) stats.achievements = [];
                stats.achievements.push(id);
                newAchievements.push(achievement);
                
                // Award points
                this.addPoints(playerId, 'achievement', achievement.points);
            }
        });

        if (newAchievements.length > 0) {
            this.savePlayerStats(playerId, stats);
            this.showAchievementUnlocked(newAchievements);
        }
    }

    // Evaluate achievement condition
    evaluateCondition(condition, stats) {
        try {
            // Simple condition evaluation
            // Replace stat names with actual values
            let evaluableCondition = condition;
            
            Object.keys(stats).forEach(key => {
                const regex = new RegExp(`\\b${key}\\b`, 'g');
                evaluableCondition = evaluableCondition.replace(regex, stats[key] || 0);
            });

            // Use Function constructor for safe evaluation
            return new Function('return ' + evaluableCondition)();
        } catch (error) {
            console.warn('Achievement condition evaluation error:', error);
            return false;
        }
    }

    // Show points gained animation
    showPointsGained(playerId, points, action) {
        if (points === 0) return;

        const notification = document.createElement('div');
        notification.className = 'points-notification';
        notification.innerHTML = `
            <div class="points-amount ${points > 0 ? 'positive' : 'negative'}">
                ${points > 0 ? '+' : ''}${points}
            </div>
            <div class="points-action">${this.getActionName(action)}</div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after animation
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }

    // Show achievement unlocked animation
    showAchievementUnlocked(achievements) {
        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                const notification = document.createElement('div');
                notification.className = 'achievement-notification';
                notification.innerHTML = `
                    <div class="achievement-header">🏆 Achievement Unlocked!</div>
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                    <div class="achievement-points">+${achievement.points} points</div>
                `;

                document.body.appendChild(notification);

                // Animate in
                setTimeout(() => notification.classList.add('show'), 100);

                // Remove after longer duration
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => {
                        if (notification.parentNode) {
                            document.body.removeChild(notification);
                        }
                    }, 500);
                }, 4000);
            }, index * 500);
        });
    }

    // Get action display name
    getActionName(action) {
        const actionNames = {
            'truth_completed': 'Truth Answered',
            'dare_completed': 'Dare Completed',
            'dare_skipped': 'Dare Skipped',
            'choice_made': 'Choice Made',
            'unique_choice': 'Unique Choice',
            'correct_prediction': 'Correct Prediction',
            'vote_received': 'Vote Received',
            'rare_experience': 'Rare Experience',
            'story_shared': 'Story Shared',
            'lie_detected': 'Lie Detected',
            'successful_lie': 'Successful Lie',
            'mvp_award': 'MVP Award',
            'game_completed': 'Game Completed',
            'participation': 'Participation',
            'achievement': 'Achievement'
        };
        return actionNames[action] || action.replace(/_/g, ' ');
    }

    // Get enhanced leaderboard with stats
    getEnhancedLeaderboard() {
        const leaderboard = roomManager.getLeaderboard();
        
        return leaderboard.map(player => {
            const stats = this.getPlayerStats(player.id);
            return {
                ...player,
                achievements: stats.achievements || [],
                gamesPlayed: stats.games_played || 0,
                winRate: this.calculateWinRate(player.id),
                favoriteGame: this.getFavoriteGame(player.id),
                stats: stats
            };
        });
    }

    // Calculate win rate for a player
    calculateWinRate(playerId) {
        const stats = this.getPlayerStats(playerId);
        const mvpAwards = stats.mvp_awards || 0;
        const gamesPlayed = stats.games_played || 0;
        
        return gamesPlayed > 0 ? Math.round((mvpAwards / gamesPlayed) * 100) : 0;
    }

    // Get player's favorite game
    getFavoriteGame(playerId) {
        const room = roomManager.getCurrentRoom();
        if (!room || !room.scores.has(playerId)) return 'None';

        const gameScores = room.scores.get(playerId).games;
        let maxScore = 0;
        let favoriteGame = 'None';

        gameScores.forEach((score, game) => {
            if (score > maxScore) {
                maxScore = score;
                favoriteGame = game;
            }
        });

        return favoriteGame.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    // Get player achievements
    getPlayerAchievements(playerId) {
        const stats = this.getPlayerStats(playerId);
        const earnedAchievements = stats.achievements || [];
        
        return earnedAchievements.map(id => this.achievements.get(id)).filter(Boolean);
    }

    // Award MVP to highest scorer
    awardMVP() {
        const leaderboard = roomManager.getLeaderboard();
        if (leaderboard.length === 0) return;

        const mvp = leaderboard[0];
        this.addPoints(mvp.id, 'mvp_award');
        
        return mvp;
    }

    // Reset scores for new game
    resetGameScores() {
        const room = roomManager.getCurrentRoom();
        if (!room) return;

        room.scores.forEach((scoreData, playerId) => {
            scoreData.games.clear();
        });
    }

    // Export player data
    exportPlayerData(playerId) {
        const stats = this.getPlayerStats(playerId);
        const achievements = this.getPlayerAchievements(playerId);
        
        return {
            playerId: playerId,
            stats: stats,
            achievements: achievements,
            exportDate: new Date().toISOString()
        };
    }
}

// Global score manager instance
const scoreManager = new ScoreManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScoreManager;
}