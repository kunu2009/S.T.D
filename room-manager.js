/**
 * Room Management System
 * Handles room creation, joining, and player management
 */

class RoomManager {
    constructor() {
        this.rooms = new Map();
        this.currentRoom = null;
        this.playerId = this.generatePlayerId();
        this.playerName = '';
        this.isHost = false;
    }

    // Generate unique 6-digit room code
    generateRoomCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Generate unique player ID
    generatePlayerId() {
        return 'player_' + Math.random().toString(36).substr(2, 9);
    }

    // Create a new room
    createRoom(hostName, gameType = 'mixed', maxPlayers = 8) {
        const roomCode = this.generateRoomCode();
        
        const room = {
            code: roomCode,
            host: {
                id: this.playerId,
                name: hostName,
                isHost: true,
                avatar: 'default',
                color: '#667eea',
                status: 'ready'
            },
            players: new Map(),
            gameType: gameType,
            maxPlayers: maxPlayers,
            currentGame: null,
            gameState: 'lobby',
            settings: {
                allowSpectators: true,
                requireApproval: false,
                allowCustomContent: true,
                contentRating: 'college'
            },
            scores: new Map(),
            gameHistory: [],
            createdAt: new Date(),
            lastActivity: new Date()
        };

        // Add host as first player
        room.players.set(this.playerId, room.host);
        room.scores.set(this.playerId, {
            total: 0,
            games: new Map(),
            achievements: []
        });

        this.rooms.set(roomCode, room);
        this.currentRoom = roomCode;
        this.playerName = hostName;
        this.isHost = true;

        this.saveToLocalStorage();
        return roomCode;
    }

    // Join an existing room
    joinRoom(roomCode, playerName) {
        roomCode = roomCode.toUpperCase();
        const room = this.rooms.get(roomCode);

        if (!room) {
            throw new Error('Room not found');
        }

        if (room.players.size >= room.maxPlayers) {
            throw new Error('Room is full');
        }

        if (room.gameState === 'playing') {
            throw new Error('Game in progress');
        }

        const player = {
            id: this.playerId,
            name: playerName,
            isHost: false,
            avatar: this.getRandomAvatar(),
            color: this.getRandomColor(),
            status: 'ready',
            joinedAt: new Date()
        };

        room.players.set(this.playerId, player);
        room.scores.set(this.playerId, {
            total: 0,
            games: new Map(),
            achievements: []
        });

        this.currentRoom = roomCode;
        this.playerName = playerName;
        this.isHost = false;

        this.saveToLocalStorage();
        return room;
    }

    // Leave current room
    leaveRoom() {
        if (!this.currentRoom) return;

        const room = this.rooms.get(this.currentRoom);
        if (room) {
            room.players.delete(this.playerId);
            room.scores.delete(this.playerId);

            // If host leaves, transfer to next player or delete room
            if (this.isHost) {
                const remainingPlayers = Array.from(room.players.values());
                if (remainingPlayers.length > 0) {
                    const newHost = remainingPlayers[0];
                    newHost.isHost = true;
                    room.host = newHost;
                } else {
                    this.rooms.delete(this.currentRoom);
                }
            }
        }

        this.currentRoom = null;
        this.isHost = false;
        this.saveToLocalStorage();
    }

    // Kick player (host only)
    kickPlayer(playerId) {
        if (!this.isHost || !this.currentRoom) return false;

        const room = this.rooms.get(this.currentRoom);
        if (room && room.players.has(playerId)) {
            room.players.delete(playerId);
            room.scores.delete(playerId);
            return true;
        }
        return false;
    }

    // Update player status
    updatePlayerStatus(status) {
        if (!this.currentRoom) return;

        const room = this.rooms.get(this.currentRoom);
        if (room && room.players.has(this.playerId)) {
            room.players.get(this.playerId).status = status;
        }
    }

    // Get current room info
    getCurrentRoom() {
        if (!this.currentRoom) return null;
        return this.rooms.get(this.currentRoom);
    }

    // Get players in current room
    getPlayers() {
        const room = this.getCurrentRoom();
        return room ? Array.from(room.players.values()) : [];
    }

    // Start game (host only)
    startGame(gameType) {
        if (!this.isHost || !this.currentRoom) return false;

        const room = this.rooms.get(this.currentRoom);
        if (room && room.players.size >= 2) {
            room.gameState = 'playing';
            room.currentGame = gameType;
            room.lastActivity = new Date();
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    // End game
    endGame() {
        if (!this.currentRoom) return;

        const room = this.rooms.get(this.currentRoom);
        if (room) {
            room.gameState = 'lobby';
            room.currentGame = null;
            room.lastActivity = new Date();
            this.saveToLocalStorage();
        }
    }

    // Add score for player
    addScore(playerId, gameType, points) {
        if (!this.currentRoom) return;

        const room = this.rooms.get(this.currentRoom);
        if (room && room.scores.has(playerId)) {
            const playerScore = room.scores.get(playerId);
            playerScore.total += points;
            
            if (!playerScore.games.has(gameType)) {
                playerScore.games.set(gameType, 0);
            }
            playerScore.games.set(gameType, playerScore.games.get(gameType) + points);
        }
    }

    // Get leaderboard
    getLeaderboard() {
        if (!this.currentRoom) return [];

        const room = this.rooms.get(this.currentRoom);
        if (!room) return [];

        const leaderboard = [];
        for (const [playerId, scoreData] of room.scores) {
            const player = room.players.get(playerId);
            if (player) {
                leaderboard.push({
                    id: playerId,
                    name: player.name,
                    avatar: player.avatar,
                    color: player.color,
                    total: scoreData.total,
                    games: Object.fromEntries(scoreData.games),
                    achievements: scoreData.achievements
                });
            }
        }

        return leaderboard.sort((a, b) => b.total - a.total);
    }

    // Random avatar generator
    getRandomAvatar() {
        const avatars = [
            '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
            '🦁', '🐮', '🐷', '🐸', '🐵', '🐧', '🐦', '🐤', '🦄', '🐺',
            '🤖', '👻', '👽', '🎭', '🎪', '🎨', '🎲', '🎯', '🎸', '🎤'
        ];
        return avatars[Math.floor(Math.random() * avatars.length)];
    }

    // Random color generator
    getRandomColor() {
        const colors = [
            '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe',
            '#43e97b', '#38f9d7', '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3',
            '#fad0c4', '#ffd1ff', '#c2e9fb', '#a1c4fd', '#d299c2', '#fef9d7'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Save to localStorage
    saveToLocalStorage() {
        const data = {
            currentRoom: this.currentRoom,
            playerId: this.playerId,
            playerName: this.playerName,
            isHost: this.isHost
        };
        localStorage.setItem('partyGameSession', JSON.stringify(data));
    }

    // Load from localStorage
    loadFromLocalStorage() {
        const data = localStorage.getItem('partyGameSession');
        if (data) {
            const parsed = JSON.parse(data);
            this.currentRoom = parsed.currentRoom;
            this.playerId = parsed.playerId || this.generatePlayerId();
            this.playerName = parsed.playerName || '';
            this.isHost = parsed.isHost || false;
        }
    }

    // Check if room code is valid format
    isValidRoomCode(code) {
        return /^[A-Z0-9]{6}$/.test(code.toUpperCase());
    }

    // Clean up old rooms (call periodically)
    cleanupOldRooms() {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        
        for (const [code, room] of this.rooms) {
            if (room.lastActivity < oneHourAgo && room.players.size === 0) {
                this.rooms.delete(code);
            }
        }
    }
}

// Global room manager instance
const roomManager = new RoomManager();

// Load existing session on page load
roomManager.loadFromLocalStorage();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RoomManager;
}