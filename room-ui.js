/**
 * Room UI Components
 * Handles the user interface for room creation and joining
 */

class RoomUI {
    constructor() {
        this.currentView = 'home';
        this.init();
    }

    init() {
        this.createRoomModal();
        this.createJoinModal();
        this.createRoomLobby();
        this.bindEvents();
    }

    createRoomModal() {
        const modal = document.createElement('div');
        modal.id = 'createRoomModal';
        modal.className = 'room-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🎮 Create Room</h2>
                    <button class="close-btn" onclick="roomUI.closeModal('createRoomModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="hostName">Your Name:</label>
                        <input type="text" id="hostName" placeholder="Enter your name" maxlength="20" required>
                    </div>
                    <div class="form-group">
                        <label for="gameType">Game Type:</label>
                        <select id="gameType">
                            <option value="mixed">Mixed Games</option>
                            <option value="truth-or-dare">Truth or Dare</option>
                            <option value="would-you-rather">Would You Rather</option>
                            <option value="most-likely-to">Most Likely To</option>
                            <option value="never-have-ever">Never Have I Ever</option>
                            <option value="two-truths-lie">Two Truths and a Lie</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="maxPlayers">Max Players:</label>
                        <select id="maxPlayers">
                            <option value="4">4 Players</option>
                            <option value="6">6 Players</option>
                            <option value="8" selected>8 Players</option>
                            <option value="10">10 Players</option>
                            <option value="12">12 Players</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="requireApproval"> Require approval to join
                        </label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="roomUI.closeModal('createRoomModal')">Cancel</button>
                    <button class="btn-primary" onclick="roomUI.createRoom()">Create Room</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    createJoinModal() {
        const modal = document.createElement('div');
        modal.id = 'joinRoomModal';
        modal.className = 'room-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🚪 Join Room</h2>
                    <button class="close-btn" onclick="roomUI.closeModal('joinRoomModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="playerName">Your Name:</label>
                        <input type="text" id="playerName" placeholder="Enter your name" maxlength="20" required>
                    </div>
                    <div class="form-group">
                        <label for="roomCode">Room Code:</label>
                        <input type="text" id="roomCode" placeholder="XXXXXX" maxlength="6" style="text-transform: uppercase;" required>
                    </div>
                    <div class="room-code-help">
                        Ask the host for the 6-character room code
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="roomUI.closeModal('joinRoomModal')">Cancel</button>
                    <button class="btn-primary" onclick="roomUI.joinRoom()">Join Room</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    createRoomLobby() {
        const lobby = document.createElement('div');
        lobby.id = 'roomLobby';
        lobby.className = 'room-lobby hidden';
        lobby.innerHTML = `
            <div class="lobby-header">
                <div class="lobby-info">
                    <h2 id="lobbyTitle">🎮 Game Lobby</h2>
                    <div class="room-code-display">
                        Room Code: <span id="displayRoomCode">------</span>
                        <button class="copy-btn" onclick="roomUI.copyRoomCode()" title="Copy room code">📋</button>
                    </div>
                </div>
                <button class="leave-room-btn" onclick="roomUI.leaveRoom()">Leave Room</button>
            </div>
            
            <div class="lobby-content">
                <div class="players-section">
                    <h3>👥 Players (<span id="playerCount">0</span>/<span id="maxPlayerCount">8</span>)</h3>
                    <div class="players-grid" id="playersGrid">
                        <!-- Players will be dynamically added here -->
                    </div>
                </div>
                
                <div class="game-selection" id="gameSelection">
                    <h3>🎯 Select Game</h3>
                    <div class="game-options">
                        <button class="game-option" onclick="roomUI.selectGame('truth-or-dare')">
                            <div class="game-icon">🎭</div>
                            <div class="game-name">Truth or Dare</div>
                        </button>
                        <button class="game-option" onclick="roomUI.selectGame('would-you-rather')">
                            <div class="game-icon">🤔</div>
                            <div class="game-name">Would You Rather</div>
                        </button>
                        <button class="game-option" onclick="roomUI.selectGame('most-likely-to')">
                            <div class="game-icon">👥</div>
                            <div class="game-name">Most Likely To</div>
                        </button>
                        <button class="game-option" onclick="roomUI.selectGame('never-have-ever')">
                            <div class="game-icon">🙋</div>
                            <div class="game-name">Never Have I Ever</div>
                        </button>
                        <button class="game-option" onclick="roomUI.selectGame('two-truths-lie')">
                            <div class="game-icon">🎭</div>
                            <div class="game-name">Two Truths & Lie</div>
                        </button>
                        <button class="game-option" onclick="roomUI.selectGame('challenge-roulette')">
                            <div class="game-icon">🎲</div>
                            <div class="game-name">Challenge Roulette</div>
                        </button>
                    </div>
                </div>
                
                <div class="lobby-actions">
                    <div class="host-controls" id="hostControls" style="display: none;">
                        <button class="btn-primary btn-large" onclick="roomUI.startGame()" id="startGameBtn" disabled>
                            Start Game 🚀
                        </button>
                        <button class="btn-secondary" onclick="roomUI.showSettings()">
                            Settings ⚙️
                        </button>
                    </div>
                    <div class="player-status" id="playerStatus">
                        <div class="status-text">Waiting for host to start game...</div>
                    </div>
                </div>
            </div>
            
            <div class="lobby-chat" id="lobbyChat">
                <div class="chat-messages" id="chatMessages"></div>
                <div class="chat-input">
                    <input type="text" id="chatInput" placeholder="Type a message..." maxlength="200">
                    <button onclick="roomUI.sendMessage()">Send</button>
                </div>
            </div>
        `;
        document.body.appendChild(lobby);
    }

    bindEvents() {
        // Auto-uppercase room code input
        const roomCodeInput = document.getElementById('roomCode');
        if (roomCodeInput) {
            roomCodeInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.toUpperCase();
            });
        }

        // Enter key handlers
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (e.target.id === 'hostName' || e.target.id === 'gameType') {
                    this.createRoom();
                } else if (e.target.id === 'playerName' || e.target.id === 'roomCode') {
                    this.joinRoom();
                } else if (e.target.id === 'chatInput') {
                    this.sendMessage();
                }
            }
        });
    }

    showCreateRoomModal() {
        document.getElementById('createRoomModal').style.display = 'flex';
        document.getElementById('hostName').focus();
    }

    showJoinRoomModal() {
        document.getElementById('joinRoomModal').style.display = 'flex';
        document.getElementById('playerName').focus();
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    async createRoom() {
        const hostName = document.getElementById('hostName').value.trim();
        const gameType = document.getElementById('gameType').value;
        const maxPlayers = parseInt(document.getElementById('maxPlayers').value);

        if (!hostName) {
            this.showError('Please enter your name');
            return;
        }

        try {
            const roomCode = roomManager.createRoom(hostName, gameType, maxPlayers);
            this.closeModal('createRoomModal');
            this.showRoomLobby();
            this.showSuccess(`Room created! Code: ${roomCode}`);
        } catch (error) {
            this.showError(error.message);
        }
    }

    async joinRoom() {
        const playerName = document.getElementById('playerName').value.trim();
        const roomCode = document.getElementById('roomCode').value.trim();

        if (!playerName) {
            this.showError('Please enter your name');
            return;
        }

        if (!roomManager.isValidRoomCode(roomCode)) {
            this.showError('Please enter a valid 6-character room code');
            return;
        }

        try {
            await roomManager.joinRoom(roomCode, playerName);
            this.closeModal('joinRoomModal');
            this.showRoomLobby();
            this.showSuccess(`Joined room ${roomCode}!`);
        } catch (error) {
            this.showError(error.message);
        }
    }

    showRoomLobby() {
        // Hide main game selection
        const gameSelection = document.querySelector('.games-grid');
        if (gameSelection) {
            gameSelection.style.display = 'none';
        }

        // Show room lobby
        document.getElementById('roomLobby').classList.remove('hidden');
        
        // Update lobby info
        const room = roomManager.getCurrentRoom();
        if (room) {
            document.getElementById('displayRoomCode').textContent = room.code;
            document.getElementById('maxPlayerCount').textContent = room.maxPlayers;
            
            // Show/hide host controls
            if (roomManager.isHost) {
                document.getElementById('hostControls').style.display = 'block';
                document.getElementById('playerStatus').style.display = 'none';
            } else {
                document.getElementById('hostControls').style.display = 'none';
                document.getElementById('playerStatus').style.display = 'block';
            }
            
            this.updatePlayersDisplay();
        }
    }

    updatePlayersDisplay() {
        const players = roomManager.getPlayers();
        const grid = document.getElementById('playersGrid');
        const playerCount = document.getElementById('playerCount');
        
        playerCount.textContent = players.length;
        
        grid.innerHTML = '';
        players.forEach(player => {
            const playerCard = document.createElement('div');
            playerCard.className = 'player-card';
            playerCard.style.borderColor = player.color;
            
            const hostBadge = player.isHost ? '<span class="host-badge">👑 Host</span>' : '';
            const kickBtn = roomManager.isHost && !player.isHost ? 
                `<button class="kick-btn" onclick="roomUI.kickPlayer('${player.id}')" title="Kick player">❌</button>` : '';
            
            playerCard.innerHTML = `
                <div class="player-avatar" style="background: ${player.color}">${player.avatar}</div>
                <div class="player-info">
                    <div class="player-name">${player.name}</div>
                    ${hostBadge}
                    <div class="player-status status-${player.status}">${player.status}</div>
                </div>
                ${kickBtn}
            `;
            
            grid.appendChild(playerCard);
        });

        // Update start button state
        const startBtn = document.getElementById('startGameBtn');
        if (startBtn) {
            startBtn.disabled = players.length < 2;
        }
    }

    selectGame(gameType) {
        if (!roomManager.isHost) return;
        
        // Highlight selected game
        document.querySelectorAll('.game-option').forEach(option => {
            option.classList.remove('selected');
        });
        event.target.closest('.game-option').classList.add('selected');
        
        // Enable start button
        document.getElementById('startGameBtn').disabled = false;
        document.getElementById('startGameBtn').dataset.gameType = gameType;
    }

    startGame() {
        const gameType = document.getElementById('startGameBtn').dataset.gameType;
        if (!gameType) {
            this.showError('Please select a game first');
            return;
        }

        if (roomManager.startGame(gameType)) {
            // Redirect to the selected game with room context
            this.redirectToGame(gameType);
        } else {
            this.showError('Failed to start game. Need at least 2 players.');
        }
    }

    redirectToGame(gameType) {
        const gameUrls = {
            'truth-or-dare': 'std.html',
            'would-you-rather': 'wouldyourather.html',
            'most-likely-to': 'most-likely-to.html',
            'never-have-ever': 'never-have-ever.html',
            'two-truths-lie': 'two-truths-lie.html',
            'challenge-roulette': 'challenge.html'
        };
        
        const url = gameUrls[gameType];
        if (url) {
            // Add room context to URL
            window.location.href = `${url}?room=${roomManager.currentRoom}&player=${roomManager.playerId}`;
        }
    }

    leaveRoom() {
        if (confirm('Are you sure you want to leave the room?')) {
            roomManager.leaveRoom();
            this.hideRoomLobby();
            this.showSuccess('Left the room');
        }
    }

    hideRoomLobby() {
        document.getElementById('roomLobby').classList.add('hidden');
        
        // Show main game selection again
        const gameSelection = document.querySelector('.games-grid');
        if (gameSelection) {
            gameSelection.style.display = 'grid';
        }
    }

    kickPlayer(playerId) {
        if (confirm('Kick this player from the room?')) {
            if (roomManager.kickPlayer(playerId)) {
                this.updatePlayersDisplay();
                this.showSuccess('Player kicked');
            }
        }
    }

    copyRoomCode() {
        const roomCode = document.getElementById('displayRoomCode').textContent;
        navigator.clipboard.writeText(roomCode).then(() => {
            this.showSuccess('Room code copied!');
        });
    }

    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (message) {
            // Add message to chat (simple implementation)
            const chatMessages = document.getElementById('chatMessages');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'chat-message';
            messageDiv.innerHTML = `
                <span class="message-author">${roomManager.playerName}:</span>
                <span class="message-text">${message}</span>
            `;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            input.value = '';
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Global room UI instance
const roomUI = new RoomUI();