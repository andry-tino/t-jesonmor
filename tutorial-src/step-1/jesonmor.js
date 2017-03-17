/**
 * jesonmor.js
 * Andrea Tino - 2017
 */

/**
 * The Jeson Mor object.
 * 
 * Notes:
 * - Indexes are 1-based.
 */
var jm = jm || {};

jm.initialize = function() {
    var board = jm.Board();
    board.initialize();
    //window.setTimeout(function(){board.move(1,1,3,2);}, 3000);
};