<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <title>Most Likely To - Party Game</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
            min-height: 100vh;
            color: white;
            overflow-x: hidden;
            padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px 15px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .title {
            font-size: clamp(2rem, 6vw, 3rem);
            font-weight: bold;
            text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
            margin-bottom: 10px;
        }

        .subtitle {
            font-size: clamp(1rem, 3vw, 1.2rem);
            opacity: 0.9;
        }

        .back-btn {
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(255,255,255,0.2);
            border: 2px solid white;
            color: white;
            padding: 10px 15px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s;
            backdrop-filter: blur(10px);
        }

        .back-btn:hover {
            background: rgba(255,255,255,0.3);
            transform: translateX(-5px);
        }

        .setup-screen {
            background: rgba(255,255,255,0.95);
            border-radius: 20px;
            padding: 30px;
            color: #333;
            margin-bottom: 20px;
        }

        .setup-title {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
            color: #1abc9c;
        }

        .players-section {
            margin-bottom: 25px;
        }

        .players-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .section-label {
            font-size: 1.2rem;
            font-weight: bold;
        }

        .add-player-btn {
            background: #27ae60;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s;
        }

        .add-player-btn:active {
            transform: scale(0.95);
        }

        .players-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .player-input-group {
            display: flex;
            gap: 10px;
            align-items: center;
            background: rgba(0,0,0,0.05);
            padding: 10px;
            border-radius: 10px;
        }

        .player-number {
            background: #1abc9c;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            flex-shrink: 0;
        }

        .player-input {
            flex: 1;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 1rem;
            transition: all 0.3s;
        }

        .player-input:focus {
            outline: none;
            border-color: #1abc9c;
        }

        .remove-player-btn {
            background: #e74c3c;
            color: white;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
        }

        .start-btn {
            background: linear-gradient(135deg, #1abc9c, #16a085);
            color: white;
            border: none;
            padding: 18px;
            border-radius: 15px;
            font-size: 1.2rem;
            font-weight: bold;
            cursor: pointer;
            width: 100%;
            margin-top: 20px;
            transition: all 0.3s;
        }

        .start-btn:active {
            transform: scale(0.98);
        }

        .start-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .game-screen {
            display: none;
            flex: 1;
        }

        .question-card {
            background: rgba(255,255,255,0.95);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 30px;
            color: #333;
            text-align: center;
        }

        .question-text {
            font-size: clamp(1.3rem, 4vw, 1.6rem);
            line-height: 1.6;
            margin-bottom: 20px;
            font-weight: 600;
        }

        .highlight {
            color: #1abc9c;
            font-weight: bold;
        }

        .voting-timer {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
            padding: 15px;
            border-radius: 15px;
            margin-bottom: 20px;
            text-align: center;
            font-size: 1.2rem;
            font-weight: bold;
        }

        .timer-text {
            font-size: 2rem;
            margin-top: 10px;
        }

        .players-voting-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }

        .player-vote-card {
            background: rgba(255,255,255,0.2);
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            transition: all 0.3s;
            cursor: pointer;
            border: 3px solid transparent;
            backdrop-filter: blur(10px);
        }

        .player-vote-card:hover {
            background: rgba(255,255,255,0.3);
            transform: scale(1.05);
        }

        .player-vote-card.selected {
            background: rgba(26, 188, 156, 0.4);
            border-color: #1abc9c;
            transform: scale(1.05);
        }

        .vote-player-name {
            font-size: 1.1rem;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .vote-count {
            font-size: 1.5rem;
            font-weight: bold;
            margin-top: 10px;
            color: #FFD700;
        }

        .results-screen {
            display: none;
            background: rgba(255,255,255,0.95);
            border-radius: 20px;
            padding: 30px;
            color: #333;
            text-align: center;
            margin-bottom: 20px;
        }

        .results-title {
            font-size: 1.8rem;
            font-weight: bold;
            color: #1abc9c;
            margin-bottom: 20px;
        }

        .winner-announcement {
            font-size: 1.3rem;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #f39c12, #e67e22);
            color: white;
            border-radius: 15px;
        }

        .results-breakdown {
            text-align: left;
            margin-bottom: 30px;
        }

        .result-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }

        .result-name {
            font-weight: bold;
        }

        .result-votes {
            background: #1abc9c;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
        }

        .action-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 30px;
        }

        .action-btn {
            background: linear-gradient(135deg, #1abc9c, #16a085);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            flex: 1;
            max-width: 200px;
        }

        .action-btn.secondary {
            background: linear-gradient(135deg, #95a5a6, #7f8c8d);
        }

        .action-btn:active {
            transform: scale(0.95);
        }

        .scoreboard {
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            padding: 20px;
            margin-top: 20px;
            backdrop-filter: blur(10px);
        }

        .scoreboard-title {
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 15px;
            text-align: center;
        }

        .score-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .score-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(255,255,255,0.1);
            padding: 10px 15px;
            border-radius: 10px;
        }

        .score-name {
            font-weight: bold;
        }

        .score-points {
            background: #FFD700;
            color: #333;
            padding: 5px 12px;
            border-radius: 15px;
            font-weight: bold;
        }

        @media (max-width: 480px) {
            .players-voting-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .action-buttons {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <button class="back-btn" onclick="goBack()">← Back</button>
    
    <div class="container">
        <div class="header">
            <h1 class="title">👥 Most Likely To</h1>
            <p class="subtitle">Vote and predict who's most likely!</p>
        </div>

        <!-- Setup Screen -->
        <div id="setupScreen" class="setup-screen">
            <h2 class="setup-title">Game Setup</h2>
            
            <div class="players-section">
                <div class="players-header">
                    <span class="section-label">Players (3-8)</span>
                    <button class="add-player-btn" onclick="addPlayer()">+ Add Player</button>
                </div>
                <div class="players-list" id="playersList">
                    <!-- Players will be added here -->
                </div>
            </div>
            
            <button class="start-btn" id="startBtn" onclick="startGame()" disabled>
                Start Game 🚀
            </button>
        </div>

        <!-- Game Screen -->
        <div id="gameScreen" class="game-screen">
            <div class="question-card">
                <p class="question-text" id="questionText">
                    <span class="highlight">Who's most likely to</span> become famous?
                </p>
            </div>

            <div class="voting-timer" id="votingTimer" style="display: none;">
                <div>Voting Time!</div>
                <div class="timer-text" id="timerText">10</div>
            </div>

            <div class="players-voting-grid" id="playersVotingGrid">
                <!-- Player voting cards will be added here -->
            </div>

            <div class="action-buttons">
                <button class="action-btn" onclick="startVoting()" id="startVoteBtn">Start Voting ⏱️</button>
                <button class="action-btn secondary" onclick="showResults()" id="showResultsBtn" style="display: none;">Show Results 📊</button>
            </div>
        </div>

        <!-- Results Screen -->
        <div id="resultsScreen" class="results-screen">
            <h2 class="results-title">🏆 Results</h2>
            <div class="winner-announcement" id="winnerAnnouncement">
                <!-- Winner will be announced here -->
            </div>
            
            <div class="results-breakdown" id="resultsBreakdown">
                <!-- Vote breakdown will be shown here -->
            </div>
            
            <div class="action-buttons">
                <button class="action-btn" onclick="nextQuestion()">Next Question ➡️</button>
                <button class="action-btn secondary" onclick="endGame()">End Game</button>
            </div>
        </div>

        <!-- Scoreboard -->
        <div class="scoreboard" id="scoreboard" style="display: none;">
            <h3 class="scoreboard-title">🎯 Scoreboard</h3>
            <div class="score-list" id="scoreList">
                <!-- Scores will be displayed here -->
            </div>
        </div>
    </div>

    <script>
        let gameState = {
            players: [],
            currentQuestion: 0,
            playerVotes: {}, // Track who each player voted for
            questions: [
                "become famous?",
                "forget their own birthday?",
                "get lost in their own hometown?",
                "eat pizza every day for a year?",
                "talk to animals if they could?",
                "become a millionaire?",
                "forget where they put their keys?",
                "binge-watch an entire series in one day?",
                "become a social media influencer?",
                "get scared by their own reflection?",
                "win a dance competition?",
                "survive longest in a zombie apocalypse?",
                "become a professional athlete?",
                "fall asleep in a weird place?",
                "become a stand-up comedian?",
                "get a tattoo on impulse?",
                "become a world traveler?",
                "start their own business?",
                "become a teacher?",
                "get into a silly argument?",
                "become a chef?",
                "get locked out of their house?",
                "become a detective?",
                "sing karaoke in public?",
                "become a game show contestant?",
                "trip over their own feet?",
                "become a movie director?",
                "forget what day it is?",
                "become an astronaut?",
                "laugh at their own jokes?",
                "become a bestselling author?",
                "get excited about cancelled plans?",
                "become a superhero?",
                "accidentally like an old social media post?",
                "become the president?",
                "get into a food fight?",
                "become a professional gamer?",
                "get lost in a shopping mall?",
                "become a motivational speaker?",
                "fall for a prank?"
            ],
            votes: {},
            votingActive: false,
            timer: null,
            timeLeft: 15
        };

        function addPlayer() {
            const playersList = document.getElementById('playersList');
            const playerCount = playersList.children.length + 1;
            
            if (playerCount > 8) {
                alert('Maximum 8 players allowed!');
                return;
            }
            
            const playerGroup = document.createElement('div');
            playerGroup.className = 'player-input-group';
            playerGroup.innerHTML = `
                <div class="player-number">${playerCount}</div>
                <input type="text" class="player-input" placeholder="Enter player name" maxlength="20" oninput="updateStartButton()">
                <button class="remove-player-btn" onclick="removePlayer(this)">×</button>
            `;
            
            playersList.appendChild(playerGroup);
            updatePlayerNumbers();
            updateStartButton();
        }

        function removePlayer(btn) {
            const playersList = document.getElementById('playersList');
            if (playersList.children.length > 0) {
                btn.parentElement.remove();
                updatePlayerNumbers();
                updateStartButton();
            }
        }

        function updatePlayerNumbers() {
            const playerGroups = document.querySelectorAll('.player-input-group');
            playerGroups.forEach((group, index) => {
                const numberElement = group.querySelector('.player-number');
                numberElement.textContent = index + 1;
            });
        }

        function updateStartButton() {
            const inputs = document.querySelectorAll('.player-input');
            const filledInputs = Array.from(inputs).filter(input => input.value.trim() !== '');
            const startBtn = document.getElementById('startBtn');
            
            startBtn.disabled = filledInputs.length < 3;
        }

        function startGame() {
            const inputs = document.querySelectorAll('.player-input');
            gameState.players = Array.from(inputs)
                .map(input => input.value.trim())
                .filter(name => name !== '')
                .map(name => ({
                    name: name,
                    score: 0
                }));

            // Shuffle questions
            gameState.questions.sort(() => Math.random() - 0.5);
            
            document.getElementById('setupScreen').style.display = 'none';
            document.getElementById('gameScreen').style.display = 'block';
            
            setupVotingGrid();
            showCurrentQuestion();
        }

        function setupVotingGrid() {
            const votingGrid = document.getElementById('playersVotingGrid');
            votingGrid.innerHTML = '';
            
            gameState.players.forEach((player, index) => {
                const playerCard = document.createElement('div');
                playerCard.className = 'player-vote-card';
                playerCard.id = `vote-card-${index}`;
                playerCard.onclick = () => voteForPlayer(index);
                
                playerCard.innerHTML = `
                    <div class="vote-player-name">${player.name}</div>
                    <div class="vote-count" id="vote-count-${index}">0</div>
                `;
                
                votingGrid.appendChild(playerCard);
            });
        }

        function showCurrentQuestion() {
            const questionText = document.getElementById('questionText');
            const currentQuestion = gameState.questions[gameState.currentQuestion];
            
            questionText.innerHTML = `
                <span class="highlight">Who's most likely to</span> ${currentQuestion}
            `;
            
            // Reset votes and voter tracking
            gameState.votes = {};
            gameState.playerVotes = {};
            gameState.players.forEach((_, index) => {
                document.getElementById(`vote-count-${index}`).textContent = '0';
                document.getElementById(`vote-card-${index}`).classList.remove('selected');
            });
            
            // Show/hide appropriate buttons
            document.getElementById('startVoteBtn').style.display = 'block';
            document.getElementById('showResultsBtn').style.display = 'none';
            document.getElementById('votingTimer').style.display = 'none';
            
            // Hide results screen
            document.getElementById('resultsScreen').style.display = 'none';
        }

        function startVoting() {
            gameState.votingActive = true;
            gameState.timeLeft = 15;
            
            document.getElementById('startVoteBtn').style.display = 'none';
            document.getElementById('votingTimer').style.display = 'block';
            
            gameState.timer = setInterval(() => {
                gameState.timeLeft--;
                document.getElementById('timerText').textContent = gameState.timeLeft;
                
                if (gameState.timeLeft <= 0) {
                    endVoting();
                }
            }, 1000);
        }

        function endVoting() {
            gameState.votingActive = false;
            clearInterval(gameState.timer);
            
            document.getElementById('votingTimer').style.display = 'none';
            document.getElementById('showResultsBtn').style.display = 'block';
        }

        function voteForPlayer(playerIndex) {
            if (!gameState.votingActive) return;
            
            // Check if this voter has already voted
            const voterName = prompt("Who is voting? Enter your name:");
            if (!voterName || voterName.trim() === '') return;
            
            const voterKey = voterName.trim().toLowerCase();
            
            // Check if this person already voted
            if (gameState.playerVotes[voterKey]) {
                alert(`${voterName} has already voted this round!`);
                return;
            }
            
            // Record the vote
            gameState.playerVotes[voterKey] = playerIndex;
            
            // Remove previous visual selections
            document.querySelectorAll('.player-vote-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            // Add vote to the selected player
            if (!gameState.votes[playerIndex]) {
                gameState.votes[playerIndex] = 0;
            }
            gameState.votes[playerIndex]++;
            
            // Update display
            document.getElementById(`vote-count-${playerIndex}`).textContent = gameState.votes[playerIndex] || 0;
            document.getElementById(`vote-card-${playerIndex}`).classList.add('selected');
            
            // Visual feedback
            const card = document.getElementById(`vote-card-${playerIndex}`);
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = 'pulse 0.5s ease';
            }, 10);
            
            // Show confirmation
            alert(`${voterName} voted for ${gameState.players[playerIndex].name}!`);
        }

        function showResults() {
            // Find winner (most votes)
            let maxVotes = 0;
            let winnersIndices = [];
            
            Object.keys(gameState.votes).forEach(index => {
                const votes = gameState.votes[index];
                if (votes > maxVotes) {
                    maxVotes = votes;
                    winnersIndices = [parseInt(index)];
                } else if (votes === maxVotes) {
                    winnersIndices.push(parseInt(index));
                }
            });
            
            // Award points
            winnersIndices.forEach(index => {
                gameState.players[index].score++;
            });
            
            // Show results
            document.getElementById('gameScreen').style.display = 'none';
            document.getElementById('resultsScreen').style.display = 'block';
            
            // Display winner announcement
            const winnerAnnouncement = document.getElementById('winnerAnnouncement');
            if (winnersIndices.length === 1) {
                const winner = gameState.players[winnersIndices[0]];
                winnerAnnouncement.textContent = `${winner.name} is most likely! (${maxVotes} votes)`;
            } else if (winnersIndices.length > 1) {
                const winners = winnersIndices.map(i => gameState.players[i].name).join(' and ');
                winnerAnnouncement.textContent = `It's a tie between ${winners}! (${maxVotes} votes each)`;
            } else {
                winnerAnnouncement.textContent = 'No votes were cast!';
            }
            
            // Show vote breakdown
            const resultsBreakdown = document.getElementById('resultsBreakdown');
            resultsBreakdown.innerHTML = '<h4>Vote Breakdown:</h4>';
            
            gameState.players.forEach((player, index) => {
                const votes = gameState.votes[index] || 0;
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                resultItem.innerHTML = `
                    <span class="result-name">${player.name}</span>
                    <span class="result-votes">${votes}</span>
                `;
                resultsBreakdown.appendChild(resultItem);
            });
            
            updateScoreboard();
        }

        function updateScoreboard() {
            const scoreboard = document.getElementById('scoreboard');
            const scoreList = document.getElementById('scoreList');
            
            scoreboard.style.display = 'block';
            scoreList.innerHTML = '';
            
            // Sort players by score
            const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
            
            sortedPlayers.forEach(player => {
                const scoreItem = document.createElement('div');
                scoreItem.className = 'score-item';
                scoreItem.innerHTML = `
                    <span class="score-name">${player.name}</span>
                    <span class="score-points">${player.score}</span>
                `;
                scoreList.appendChild(scoreItem);
            });
        }

        function nextQuestion() {
            gameState.currentQuestion++;
            
            if (gameState.currentQuestion >= gameState.questions.length || gameState.currentQuestion >= 15) {
                endGame();
                return;
            }
            
            document.getElementById('resultsScreen').style.display = 'none';
            document.getElementById('gameScreen').style.display = 'block';
            
            showCurrentQuestion();
        }

        function endGame() {
            const winner = gameState.players.reduce((prev, current) => 
                (prev.score > current.score) ? prev : current
            );
            
            alert(`🎉 Game Over! 🎉\n\n${winner.name} wins with ${winner.score} points!\n\nThanks for playing!`);
            goBack();
        }

        function goBack() {
            window.location.href = 'index.html';
        }

        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);

        // Initialize with some players
        document.addEventListener('DOMContentLoaded', function() {
            addPlayer();
            addPlayer();
            addPlayer();
        });
    </script>
</body>
</html>