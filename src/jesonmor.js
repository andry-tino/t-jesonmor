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
     * A house able to host a piece.
     */
    var House = function(_i, _j) {
        var HOUSE_CLASSNAME = "house";
        var HOUSE_HIGHLIGHTED_CLASSNAME = "highlighted";

        // Construct object
        var i = _validatePosition(_i);
        var j = _validatePosition(_j);
        var _element = _createElement();

        // Object interface
        return {
            element: _element,
            highlight: _highlight,
            clear: _unhighlight
        };

        function _validatePosition(value) {
            if (!value) {
                throw value + " is invalid. Position must be a number!";
            }
            if (value <= 0) {
                throw value + " is invalid. Position must be a positive number!";
            }

            return value;
        }

        function _createElement() {
            var element = document.createElement("div");
            element.className = HOUSE_CLASSNAME;

            return element;
        }

        function _highlight() {
            _element.classList.add(HOUSE_HIGHLIGHTED_CLASSNAME);
        }

        function _unhighlight() {
            _element.classList.remove(HOUSE_HIGHLIGHTED_CLASSNAME);
        }
    };

    /**
     * The board object.
     */
    var Board = function(_size) {
        var CONTAINER_CLASSNAME = "container";

        // Lazy initialized variables
        var container = null;
        var houses = null;
        var horses = null;

        // Construct object
        var size = _validateSize(_size);

        // Object public interface
        return {
            build: _build,
            populate: _populate,
            dispose: _clean,
            highlightHouse: _highlight,
            clearHouse: _unhighlight
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
            // TODO
        }

        function _build() {
            var dimension = size * size;
            houses = {}; // Initializing dictionary

            container = _createContainer();

            for (var k = 0; k < dimension; k++) {
                // Calculate Indexes
                var i = Math.ceil((k + 1) / size);
                var j = (k + 1) % size;
                if (j === 0) j = 9;

                console.log("Indices", i, j);

                var house = House(i, j);
                container.appendChild(house.element);

                // Index houses
                houses[i + ":" + j] = house;
            }

            document.body.appendChild(container);
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

        function _createContainer() {
            var element = document.createElement("div");
            element.className = CONTAINER_CLASSNAME;

            return element;
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