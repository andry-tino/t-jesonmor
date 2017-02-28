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

        var size = 9; // Default value => Regular JM board

        // Construct object
        size = _validateSize(_size);

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
            }
        }

        function _createHouse() {
            return document.createElement("div");
        }

        function _validateSize(size) {
            if (size < 5) {
                throw "Cannot create a board whose size is < 5!";
            }
            if (size % 2 !== 1) {
                throw "Board must be odd sized!";
            }

            return size;
        }
    }; // Board
};