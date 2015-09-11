app.factory('Game', function() {

    // ----------
    // Properties
    // ----------

    var game = {};
    game.gameGrid = [];
    game.playerMoves = [];
    game.computerMoves = [];
    game.validMoves = [];
    game.gameLose = false;
    game.gameDraw = false;
    game.drawCount = 0;
    game.lossCount = 0;
    game.winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // ---------
    // Functions
    // ---------

    game.startGame = function() {
        game.playerMoves = [];
        game.computerMoves = [];
        game.gameLose = false;
        game.gameDraw = false;
        game.validMoves = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        game.gameGrid = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8]
        ];
    };

    game.setPlayerMove = function(index) {
        if (game.isValidMove(index) && !game.gameLose && !game.gameDraw) {
            game.addMarkerToGrid(index, 'x');
            game.playerMoves.push(index);

            if (game.validMoves.length > 0) {
                game.setComputerMove();
            } else if (!game.checkForWin()) {
                game.computerDraws();
            }
        }
    };

    game.setComputerMove = function() {
        var computerMove;
        var tryMove;

        if ((tryMove = game.getWinningCombination(game.computerMoves)) != -1) {
            // Captures the winning move for computer, if any.
            computerMove = tryMove;
        } else if ((tryMove = game.getWinningCombination(game.playerMoves)) != -1) {
            // Captures the winning move for player, if any.
            computerMove = tryMove;
        } else if (game.isValidMove(4)) {
            // Captures the center, if available.
            computerMove = 4;
        } else if ((tryMove = game.getCornerMove()) != -1) {
            // Captures the best corner piece, if available.
            computerMove = tryMove;
        } else {
            // Else, captures the first valid move that isn't a corner.
            computerMove = game.getValidMove();
        }

        game.computerMoves.push(computerMove);
        game.addMarkerToGrid(computerMove, 'o');
        game.checkForWin();
    };

    game.addMarkerToGrid = function(index, marker) {
        var row = Math.floor(index/3);
        var col = index%3;
        game.gameGrid[row][col] = marker;

        // Update our available moves array
        var removeIndex = game.validMoves.indexOf(index);
        game.validMoves.splice(removeIndex, 1);
    };

    game.getCornerMove = function() {
        var cornerMoves = [0, 2, 6, 8];
        var validCornerMove = -1;
        var playerWinningMoves = [];

        // If there exists a move for the player that result in more than one way to win,
        // we will save that move into a playerWinningMoves array.
        for (i in cornerMoves) {
            if (game.isValidMove(cornerMoves[i])) {
                var playerMovesTemp = game.playerMoves.slice();
                playerMovesTemp.push(cornerMoves[i]);
                if (game.getWinningCombination(playerMovesTemp, true) >= 2) {
                    playerWinningMoves.push(cornerMoves[i]);
                }
                validCornerMove = cornerMoves[i];
            }
        }

        // If the computer captures one of the playerWinningMoves such that the response from the player
        // has to be one of their winning moves, then the computer will play offensively.
        if (playerWinningMoves.length > 0) {
            for (i in playerWinningMoves) {
                var computerMovesTemp = game.computerMoves.slice();
                computerMovesTemp.push(playerWinningMoves[i]);
                var computerOffensiveMove = game.getWinningCombination(computerMovesTemp);
                if (playerWinningMoves.indexOf(computerOffensiveMove) == -1) {
                    console.log(playerWinningMoves[i]);
                    return playerWinningMoves[i];
                }
            }
        } else {
            return validCornerMove;
        }
        return -1
    };

    /**
     * @name getWinningCombination
     * @desc Determines if there are any available winning combinations
     * @param {playerMoves} is an array of specific player's moves to check against
     * @param {findAll} is a flag that specifies whether to find all combinations, or just return the first
     * @returns Returns either the winning combination number, the number of winning rows, or -1
     **/
    game.getWinningCombination = function(playerMoves, findAll) {
        findAll = typeof findAll !== 'undefined' ? findAll: false;
        var winningRowsCount = 0;
        for (row in game.winningCombos) {
            var comboCount = 0;
            var lastAvailableMove;
            for (col in game.winningCombos[row]) {
                if (playerMoves.indexOf(game.winningCombos[row][col]) != -1) {
                    comboCount += 1
                } else {
                    lastAvailableMove = game.winningCombos[row][col];
                }
            }
            if (comboCount==2 && game.isValidMove(lastAvailableMove)) {
                if (!findAll) { return lastAvailableMove }
                winningRowsCount += 1;
            }
        }
        if (findAll) {return winningRowsCount;}
        return -1;
    };

    game.getValidMove = function() {
        var validMoves = [1, 3, 5, 7];
        for (i in validMoves) {
            if (game.isValidMove(validMoves[i])) { return validMoves[i]}
        }
    };

    game.isValidMove = function(index) {
       return (game.validMoves.indexOf(index) != -1);
    };

    game.checkForWin = function() {
        for (row in game.winningCombos) {
            var comboCount = 0;
            for (col in game.winningCombos[row]) {
                if (game.computerMoves.indexOf(game.winningCombos[row][col]) != -1) {comboCount += 1}
            }
            if (comboCount==3) {
                game.computerWins();
                return true;
            }
        }
        return false;
    };

    game.computerWins = function() {
        game.gameLose = true;
        game.lossCount += 1;
    };

    game.computerDraws = function() {
        game.gameDraw = true;
        game.drawCount += 1;
    };

	return game;
});