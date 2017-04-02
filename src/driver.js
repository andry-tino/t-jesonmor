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
    var INTERVAL_PAUSE = 1000;
    var INTERMOVE_PAUSE = 500;

    var board = null;
    var playerw = null;
    var playerb = null;
    var interactive = true; // Default

    var currentPlayer = CUR_PLAYER_W; // White starts NOT NEEDEDE, REMOVE!

    _parseParameters(params);

    // Defining callbacks
    board.automation.setEndgameCallback(_endgameCallback);
    board.automation.setMoveCompletedCallback(_moveCompletedCallback);
    board.automation.setErrorCallback(_errorCallback);
    board.automation.setCancelCallback(_cancelCallback);

    return {
        start: _start
    };

    function _start() {
        _playGame();
    }

    function _endgameCallback() {

    }

    function _moveCompletedCallback() {
        // This should drive the game interchange
    }

    function _errorCallback() {
        
    }

    function _cancelCallback() {
        
    }

    function _playGame(params) {
        var player = null;
        if (currentPlayer === CUR_PLAYER_W) {
            player = playerw;
        } else {
            player = playerb;
        }

        var move = player.move(); // Expecting: { srci, srcj, dsti, dstj }

        // TODO: Use board events

        if (playerw && playerb) {
            // Machine vs Machine
            window.setTimeout(function() {
                board.clickHouse(move.srci, move.srcj);
                window.setTimeout(function() {
                    board.clickHouse(move.dsti, move.dstj);
                    window.setTimeout(function() {
                        var h = window.setTimeout(_playGame, INTERVAL_PAUSE, null);
                    }, INTERMOVE_PAUSE);
                }, INTERMOVE_PAUSE);
            }, 0);
        }
        else {
            // Machine vs Human
            if (playerw) {
                // White is Human
            } else {
                // Black is Human
            }
        }
    }

    function _parseParameters(params) {
        board = params.board;
        playerw = params.playerw;
        playerb = params.playerb;
        interactive = params.interactive;
    }
};
