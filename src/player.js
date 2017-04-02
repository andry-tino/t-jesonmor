/**
 * player.js
 * Andrea Tino - 2017
 */

var jm = jm || {};

jm.players = jm.players || {};

/**
 * The board object and game driver.
 */
jm.players.Player = function() {
    return {
        /**
         * Returns the position of the horse to move and where to move it.
         * { srci, srcj, dsti, dstj }
         */
        move: _move
    };

    function _move() {
        return {
            srci: 1, srcj: 1,
            dsti: 1, dstj: 1
        };
    }
};