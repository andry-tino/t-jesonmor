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
 *  player1,
 *  player2,
 *  interactive
 * }
 */
jm.players.Player = function(params) {
    var board = null;
    var player1 = null;
    var player2 = null;
    var interactive = true; // Default

    _parseParameters(params);

    return {
        start: _start
    };

    function _start() {
        
    }

    function _parseParameters(params) {
        board = params.board;
        player1 = params.player1;
        player2 = params.player2;
        interactive = params.interactive;
    }
};
