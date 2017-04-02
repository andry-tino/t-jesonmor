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

    var board = null;
    var playerw = null;
    var playerb = null;
    var interactive = true; // Default

    var currentPlayer = CUR_PLAYER_W; // White starts

    _parseParameters(params);

    return {
        start: _start
    };

    function _start() {
        _playGame();
    }

    function _playGame(params) {
        var player = null;
        if (currentPlayer === CUR_PLAYER_W) {
            player = playerw;
        } else {
            player = playerb;
        }

        var move = player.move(); // Expecting: { srci, srcj, dsti, dstj }

        var h = window.setTimeout(_playGame, INTERVAL_PAUSE, null);
    }

    function _parseParameters(params) {
        board = params.board;
        playerw = params.playerw;
        playerb = params.playerb;
        interactive = params.interactive;
    }
};
