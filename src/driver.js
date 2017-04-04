/**
 * driver.js
 * Andrea Tino - 2017
 */

var jm = jm || {};

/**
 * The driver for driving the board.
 * Parameter is expected of this type:
 * params: {
 *  board,
 *  playerw,
 *  playerb,
 *  interactive
 * }
 */
jm.players.Player = function(params) {
    var MOVE_INTERVAL_PAUSE = 1000;

    var board = null;
    var playerw = null;
    var playerb = null;
    var interactive = true; // Default

    var currentMove = null;

    _parseParameters(params);

    return {
        start: _start
    };

    function _getCurrentPlayer() {
        return board.getCurrentPlayer();
    }

    function _start() {
        board.automation.setEndgameCallback(_endgameCallback);
        board.automation.setMoveCompletedCallback(_moveCompletedCallback);
        board.automation.setErrorCallback(_errorCallback);
        board.automation.setCancelCallback(_cancelCallback);
    }

    function _stop() {
        board.automation.clearEndgameCallback();
        board.automation.clearMoveCompletedCallback();
        board.automation.clearErrorCallback();
        board.automation.clearCancelCallback();
    }

    function _endgameCallback(e) {
        console.log("driver", "Endgame callback invoked!");
    }

    function _moveCompletedCallback(e) {
        // This should drive the game interchange
        if (!e) {
            return;
        }

        var phase = e.phase;

        if (phase === jm.MOVE_PHASE_SELECTION) {
            // Move must be completed
            _sendClick(currentMove.dsti, currentMove.dstj);
        } else if (phase === jm.MOVE_PHASE_MAKE) {
            currentMove = null; // Reset the current move as we are starting over

            // We need to start another move, and now the player has shifted
            var player = board.automation.getCurrentPlayer();
            if (player === jm.CUR_PLAYER_W && playerw) {
                // White moves, White is Machine
            } else if (player === jm.CUR_PLAYER_W && !playerw) {
                // White moves, White is Human
            } else if (player === jm.CUR_PLAYER_B && playerb) {
                // Black moves, Black is Machine
            } else if (player === jm.CUR_PLAYER_B && !playerb) {
                // Black moves, Black is Human
            } else {
                throw "Invalid player configuration";
            }
        }

        console.log("driver", "Move completed callback invoked!");
    }

    function _errorCallback(e) {
        console.log("driver", "Error callback invoked!");
    }

    function _cancelCallback(e) {
        console.log("driver", "Cancel callback invoked!");
    }

    function _playGame(params) {
        // This initiates the machine, then the callbacks will take over
        if (!playerw) {
            // White is Machine, so it needs to _start
            currentMove = playerw.move();
            _sendClick(currentMove.srci, currentMove.srcj);
        }

        // Otherwise we wait for White to move and the callbacks will do the rest
    }

    function _sendClick(i, j) {
        window.setTimeout(function() {board.automation.clickHouse(i, j)}, MOVE_INTERVAL_PAUSE);

        // The callback needs to complete the move
    }

    function _parseParameters(params) {
        board = params.board;
        playerw = params.playerw;
        playerb = params.playerb;
        interactive = params.interactive;
    }
};
