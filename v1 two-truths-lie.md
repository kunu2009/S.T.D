<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <title>Two Truths and a Lie - Party Game</title>
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
            background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
            min-height: 100vh;
            color: white;
            overflow-x: hidden;
            padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
        }

        .container {
            max-width: 800px;
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
            color: #f39c12;
        }

        .game-rules {
            background: rgba(243, 156, 18, 0.1);
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 25px;
            border-left: 4px solid #f39c12;
        }

        .rules-title {
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 10px;
            color: #f39c12;
        }

        .rules-text {
            font-size: 0.95rem;
            line-height: 1.6;
            color: #666;
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
            background: #f39c12;
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
            border-color: #f39c12;
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
            background: linear-gradient(135deg, #f39c12, #e67e22);
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

        .current-player-card {
            background: rgba(255,255,255,0.95);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 30px;
            color: #333;
            text-align: center;
        }

        .current-player-name {
            font-size: 1.8rem;
            font-weight: bold;
            color: #f39c12;
            margin-bottom: 15px;
        }

        .turn-instruction {
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 20px;
            color: #666;
        }

        .statements-container {
            display: none;
        }

        .statements-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 30px;
        }

        .statement-card {
            background: rgba(255,255,255,0.2);
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
            border: 3px solid transparent;
            backdrop-filter: blur(10px);
        }

        .statement-card:hover {
            background: rgba(255,255,255,0.3);
            transform: scale(1.02);
        }

        .statement-card.selected {
            background: rgba(231, 76, 60, 0.4);
            border-color: #e74c3c;
            transform: scale(1.02);
        }

        .statement-card.truth {
            background: rgba(39, 174, 96, 0.4);
            border-color: #27ae60;
        }

        .statement-number {
            background: #f39c12;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin: 0 auto 15px;
        }

        .statement-text {
            font-size: 1.1rem;
            font-weight: 600;
            line-height: 1.4;
        }

        .action-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }

        .action-btn {
            background: linear-gradient(135deg, #f39c12, #e67e22);
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
            min-width: 150px;
        }

        .action-btn.secondary {
            background: linear-gradient(135deg, #95a5a6, #7f8c8d);
        }

        .action-btn.success {
            background: linear-gradient(135deg, #27ae60, #229954);
        }

        .action-btn:active {
            transform: scale(0.95);
        }

        .action-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .game-progress {
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            backdrop-filter: blur(10px);
        }

        .progress-title {
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 15px;
        }

        .progress-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
        }

        .stat-item {
            text-align: center;
        }

        .stat-value {
            font-size: 1.8rem;
            font-weight: bold;
            color: #FFD700;
        }

        .stat-label {
            font-size: 0.9rem;
            opacity: 0.8;
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
            color: #f39c12;
            margin-bottom: 20px;
        }

        .reveal-text {
            font-size: 1.3rem;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
            border-radius: 15px;
        }

        @media (max-width: 480px) {
            .action-buttons {
                flex-direction: column;
            }
            
            .progress-stats {
                grid-template-columns: 1fr;
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <button class="back-btn" onclick="goBack()">← Back</button>
    
    <div class="container">
        <div class="header">
            <h1 class="title">🎭 Two Truths and a Lie</h1>
            <p class="subtitle">Classic icebreaker - guess the lie!</p>
        </div>

        <!-- Setup Screen -->
        <div id="setupScreen" class="setup-screen">
            <h2 class="setup-title">Game Setup</h2>
            
            <div class="game-rules">
                <h3 class="rules-title">📋 How to Play</h3>
                <p class="rules-text">
                    Each player shares three statements about themselves - two are true, one is a lie. 
                    Other players try to guess which statement is the lie. Great for learning fun facts about each other!
                </p>
            </div>
            
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
            <div class="current-player-card">
                <h2 class="current-player-name" id="currentPlayerName">Player Name</h2>
                <p class="turn-instruction" id="turnInstruction">
                    Think of two true statements and one lie about yourself, then click "Ready to Share"
                </p>
                
                <div class="statements-container" id="statementsContainer">
                    <div class="statements-list" id="statementsList">
                        <!-- Dynamic statements will be added here -->
                    </div>
                </div>
            </div>

            <div class="action-buttons">
                <button class="action-btn" onclick="readyToShare()" id="readyBtn">Ready to Share 📢</button>
                <button class="action-btn secondary" onclick="startGuessing()" id="startGuessingBtn" style="display: none;">Start Guessing 🤔</button>
                <button class="action-btn success" onclick="revealAnswer()" id="revealBtn" style="display: none;">Reveal Answer ✨</button>
                <button class="action-btn" onclick="nextPlayer()" id="nextPlayerBtn" style="display: none;">Next Player ➡️</button>
            </div>

            <div class="game-progress">
                <h3 class="progress-title">🎯 Game Progress</h3>
                <div class="progress-stats">
                    <div class="stat-item">
                        <div class="stat-value" id="currentRound">1</div>
                        <div class="stat-label">Round</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="currentPlayerNum">1</div>
                        <div class="stat-label">Player</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="totalPlayers">0</div>
                        <div class="stat-label">Total Players</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Results Screen -->
        <div id="resultsScreen" class="results-screen">
            <h2 class="results-title">🎉 Round Complete! 🎉</h2>
            <div class="reveal-text" id="revealText">
                <!-- Reveal information will be shown here -->
            </div>
            
            <div class="action-buttons">
                <button class="action-btn" onclick="nextRound()">Next Round 🔄</button>
                <button class="action-btn secondary" onclick="endGame()">End Game</button>
            </div>
        </div>
    </div>

    <script>
        let gameState = {
            players: [],
            currentPlayerIndex: 0,
            currentRound: 1,
            statements: [],
            lieIndex: -1,
            maxRounds: 2
        };

        const sampleStatements = [
            ["I've pulled an all-nighter to finish an assignment", "I've never failed a test", "I once ate dining hall food for 30 days straight"],
            ["I've changed my major 3 times", "I can solve a Rubik's cube in under 2 minutes", "I've never been to the library on my campus"],
            ["I'm afraid of public speaking", "I've run a 5K on campus", "I collect vintage comic books"],
            ["I've never used the campus gym", "I can juggle 3 tennis balls", "I love studying in coffee shops"],
            ["I have a pet fish in my dorm", "I've been bungee jumping", "I'm lactose intolerant but still eat pizza"],
            ["I've never watched any Marvel movies", "I can solve calculus problems in my head", "I'm allergic to pollen"],
            ["I speak 3 languages fluently", "I've never had energy drinks", "I can whistle the entire Harry Potter theme"],
            ["I've been to 5 different countries", "I'm scared of butterflies", "I love playing video games until 3 AM"],
            ["I've never skipped a class", "I can play guitar", "I once got locked out of my dorm at midnight"],
            ["I'm a straight-A student", "I've lived in 4 different states", "I hate social media"],
            ["I can cook a full meal without recipes", "I've never been on a campus tour", "I sleep with 6 pillows"],
            ["I've read 50 books this year", "I'm afraid of elevators", "I can do a backflip"],
            ["I've never used Wikipedia for research", "I can speak Mandarin", "I once forgot my own birthday"],
            ["I've climbed a mountain over 10,000 feet", "I hate chocolate", "I can name all 50 state capitals"],
            ["I've never been to a college party", "I can type 100 words per minute", "I'm afraid of dogs"],
            ["I can paint realistic portraits", "I've never ordered food delivery to campus", "I love horror movies"],
            ["I've been to 15 concerts", "I'm vegetarian", "I can recite the periodic table"],
            ["I've never pulled an all-nighter", "I can skateboard", "I once got lost on my own campus for 2 hours"],
            ["I have perfect pitch", "I've never used a study group", "I'm afraid of spiders"],
            ["I can solve a 1000-piece puzzle in one day", "I've never been homesick", "I love doing laundry"]
        ];

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
                .filter(name => name !== '');

            document.getElementById('setupScreen').style.display = 'none';
            document.getElementById('gameScreen').style.display = 'block';
            
            updateGameProgress();
            startPlayerTurn();
        }

        function startPlayerTurn() {
            const currentPlayer = gameState.players[gameState.currentPlayerIndex];
            document.getElementById('currentPlayerName').textContent = currentPlayer;
            document.getElementById('turnInstruction').textContent = 
                `Think of two true statements and one lie about yourself, then click "Ready to Share"`;
            
            // Reset UI
            document.getElementById('readyBtn').style.display = 'block';
            document.getElementById('startGuessingBtn').style.display = 'none';
            document.getElementById('revealBtn').style.display = 'none';
            document.getElementById('nextPlayerBtn').style.display = 'none';
            document.getElementById('statementsContainer').style.display = 'none';
            
            updateGameProgress();
        }

        function readyToShare() {
            // Generate random statements for demo (in real game, player would input these)
            const randomStatements = sampleStatements[Math.floor(Math.random() * sampleStatements.length)];
            gameState.statements = [...randomStatements];
            gameState.lieIndex = Math.floor(Math.random() * 3);
            
            // Shuffle the statements
            for (let i = gameState.statements.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [gameState.statements[i], gameState.statements[j]] = [gameState.statements[j], gameState.statements[i]];
                
                // Update lie index after shuffle
                if (i === gameState.lieIndex) {
                    gameState.lieIndex = j;
                } else if (j === gameState.lieIndex) {
                    gameState.lieIndex = i;
                }
            }
            
            displayStatements();
            
            document.getElementById('readyBtn').style.display = 'none';
            document.getElementById('startGuessingBtn').style.display = 'block';
            document.getElementById('turnInstruction').textContent = 
                `Here are ${gameState.players[gameState.currentPlayerIndex]}'s three statements. Which one is the lie?`;
        }

        function displayStatements() {
            const statementsContainer = document.getElementById('statementsContainer');
            const statementsList = document.getElementById('statementsList');
            
            statementsList.innerHTML = '';
            
            gameState.statements.forEach((statement, index) => {
                const statementCard = document.createElement('div');
                statementCard.className = 'statement-card';
                statementCard.id = `statement-${index}`;
                statementCard.onclick = () => selectStatement(index);
                
                statementCard.innerHTML = `
                    <div class="statement-number">${index + 1}</div>
                    <div class="statement-text">${statement}</div>
                `;
                
                statementsList.appendChild(statementCard);
            });
            
            statementsContainer.style.display = 'block';
        }

        function selectStatement(index) {
            // Remove previous selections
            document.querySelectorAll('.statement-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            // Select current statement
            document.getElementById(`statement-${index}`).classList.add('selected');
        }

        function startGuessing() {
            document.getElementById('startGuessingBtn').style.display = 'none';
            document.getElementById('revealBtn').style.display = 'block';
            document.getElementById('turnInstruction').textContent = 
                `Everyone discuss and vote! Click on the statement you think is the lie, then reveal the answer.`;
        }

        function revealAnswer() {
            // Show the correct answer
            document.querySelectorAll('.statement-card').forEach((card, index) => {
                if (index === gameState.lieIndex) {
                    card.classList.add('selected');
                    card.querySelector('.statement-text').innerHTML += ' <strong>(This was the LIE! 🎭)</strong>';
                } else {
                    card.classList.add('truth');
                    card.querySelector('.statement-text').innerHTML += ' <strong>(TRUE ✅)</strong>';
                }
                card.onclick = null; // Disable clicking
            });
            
            document.getElementById('revealBtn').style.display = 'none';
            document.getElementById('nextPlayerBtn').style.display = 'block';
            document.getElementById('turnInstruction').textContent = 
                `The lie has been revealed! Did you guess correctly?`;
        }

        function nextPlayer() {
            gameState.currentPlayerIndex++;
            
            if (gameState.currentPlayerIndex >= gameState.players.length) {
                // Round complete
                gameState.currentPlayerIndex = 0;
                gameState.currentRound++;
                
                if (gameState.currentRound > gameState.maxRounds) {
                    endGame();
                    return;
                }
                
                showRoundComplete();
            } else {
                startPlayerTurn();
            }
        }

        function showRoundComplete() {
            document.getElementById('gameScreen').style.display = 'none';
            document.getElementById('resultsScreen').style.display = 'block';
            
            document.getElementById('revealText').textContent = 
                `Round ${gameState.currentRound - 1} complete! Everyone has shared their truths and lies. Ready for another round?`;
        }

        function nextRound() {
            document.getElementById('resultsScreen').style.display = 'none';
            document.getElementById('gameScreen').style.display = 'block';
            
            startPlayerTurn();
        }

        function updateGameProgress() {
            document.getElementById('currentRound').textContent = gameState.currentRound;
            document.getElementById('currentPlayerNum').textContent = gameState.currentPlayerIndex + 1;
            document.getElementById('totalPlayers').textContent = gameState.players.length;
        }

        function endGame() {
            alert(`🎉 Game Complete! 🎉\n\nThanks for playing Two Truths and a Lie!\n\nHope you learned some interesting facts about each other!`);
            goBack();
        }

        function goBack() {
            window.location.href = 'index.html';
        }

        // Initialize with some players
        document.addEventListener('DOMContentLoaded', function() {
            addPlayer();
            addPlayer();
            addPlayer();
        });
    </script>
</body>
</html>