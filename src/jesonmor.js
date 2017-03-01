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

        };

        function _move
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

        // Construct object
        var size = _validateSize(_size);

        // Object public interface
        return {
            build: _build,
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