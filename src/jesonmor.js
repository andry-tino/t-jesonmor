/**
 * jesonmor.js
 * Andrea Tino - 2017
 */

var jm = function() {
    /**
     * The board object.
     */
    var Board = function(_size) {
        var CONTAINER_CLASSNAME = "container";
        var HOUSE_CLASSNAME = "house";

        // Construct object
        var size = _validateSize(_size);

        // Object public interface
        return {
            build: _build
        };

        function _build() {
            var dimension = size * size;

            var container = _createHouse();
            container.className = CONTAINER_CLASSNAME;

            for (var i = 0; i < dimension; i++) {
                var house = _createHouse();
                house.className = HOUSE_CLASSNAME;
                container.appendChild(house);
            }

            document.body.appendChild(container);
        }

        function _createHouse() {
            return document.createElement("div");
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