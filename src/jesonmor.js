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
var jm = function() {
    /**
     * The horse piece.
     */
    var Horse = function() {
        // Construct the object
        var i = 1;
        var j = 1;

        // Object public interface
        return {
            move: _move,
            position: _position
        };

        function _move(_i, _j) {
            if (_i < 0 || _j < 0) {
                throw "Position must be a couple of positive integers!";
            }

            // Check that the move is valid, a horse moves like a chess knight
            if (!_checkMove(_i, _j, i, j)) {
                throw "Invalid move. A Horse moves like a Chess Knight!";
            }

            i = _i;
            j = _j;
        }

        function _position() {
            return { "i": i, "j": j }
        }

        function _checkMove(ni, nj, oi, oj) {
            if (ni === oi - 2 && nj === oj + 1) return true;
            if (ni === oi - 1 && nj === oj + 2) return true;
            if (ni === oi + 1 && nj === oj + 2) return true;
            if (ni === oi + 2 && nj === oj + 1) return true;
            if (ni === oi + 2 && nj === oj - 1) return true;
            if (ni === oi + 1 && nj === oj - 2) return true;
            if (ni === oi - 1 && nj === oj - 2) return true;
            if (ni === oi - 2 && nj === oj - 1) return true;

            return false;
        }
    }; // Horse

    /**
     * The board object.
     */
    var Board = function(_size) {
        var CONTAINER_CLASSNAME = "container";
        var HOUSE_CLASSNAME = "house";
        var HOUSE_HIGHLIGHTED_CLASSNAME = "highlighted";

        // Lazy initialized variables
        var houses = null;
        var horses = null;

        // Construct object
        var size = _validateSize(_size);

        // Object public interface
        return {
            build: _build,
            populate: _populate,
            dispose: _clean
        };

        function _highlight(i, j) {
            var house = _getHouse(i, j);
            if (!house) return;

            house.classList.add(HOUSE_HIGHLIGHTED_CLASSNAME);
        }

        function _unhighlight(i, j) {
            var house = _getHouse(i, j);
            if (!house) return;

            house.classList.remove(HOUSE_HIGHLIGHTED_CLASSNAME);
        }

        function _getHouse(i, j) {
            if (!houses) return null;

            return houses[i + ":" + j];
        }

        function _populate() {

        }

        function _build() {
            var dimension = size * size;
            houses = {}; // Initializing dictionary

            var container = _createHouse();
            container.className = CONTAINER_CLASSNAME;

            for (var k = 0; k < dimension; k++) {
                var house = _createHouse();
                house.className = HOUSE_CLASSNAME;
                container.appendChild(house);

                // Index houses
                var i = Math.ceil(k / size);
                var j = k % size;
                houses[i + ":" + j] = house;
            }

            document.body.appendChild(container);
        }

        function _createHouse() {
            return document.createElement("div");
        }

        function _isBuilt() {
            return houses != null;
        }

        function _clean() {
            if (!_isBuilt()) return;

            var container = houses["1:1"].parentElement;
            if (!container) return;

            container.remove();
            houses = null;
        }

        function _validateSize(size) {
            if (!size) {
                size = 9; // Default value
            }

            if (size < 5) {
                throw "Cannot create a board whose size is < 5!";
            }
            if (size % 2 !== 1) {
                throw "Board must be odd sized!";
            }

            return size;
        }
    }; // Board

    // Object public interface
    return {
        initialize: _initialize
    }

    function _initialize() {
        var board = Board();
        board.build();
    }
};