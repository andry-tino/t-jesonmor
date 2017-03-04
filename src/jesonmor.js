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
    var HORSE_W = 0;
    var HORSE_B = 1;

    /**
     * The horse piece.
     */
    var Horse = function(_mode) {
        var HORSE_CLASSNAME = "horse";
        var WHITE_CLASSNAME = "white";
        var BLACK_CLASSNAME = "black";

        // Construct the object
        var i = 1;
        var j = 1;
        var mode = _validateMode(_mode);
        var _element = _createElement(mode);

        // Object public interface
        return {
            element: _element,
            position: _position,
            setPosition: _setPosition
        };

        function _createElement(mode) {
            var element = document.createElement("div");
            element.className = HORSE_CLASSNAME;
            
            if (mode === HORSE_B) {
                element.classList.add(BLACK_CLASSNAME);
            } else {
                element.classList.add(WHITE_CLASSNAME);
            }

            return element;
        }

        function _setPosition(_i, _j) {
            if (!_i || !_j) {
                throw "Invalid position!";
            }
            if (_i <= 0 || _j <= 0) {
                throw "Invalid position!";
            }

            i = _i;
            j = _j;
        }

        function _position() {
            return { "i": i, "j": j }
        }

        function _validateMode(value) {
            if (value !== HORSE_W && value !== HORSE_B) {
                return HORSE_W; // Default to white
            }

            return value;
        }
    }; // Horse

    /**
     * A house able to host a piece.
     */
    var House = function(_i, _j) {
        var HOUSE_CLASSNAME = "house";
        var HOUSE_HIGHLIGHTED_CLASSNAME = "highlighted";

        // Lazy initialized objects
        var _horse = null;

        // Construct object
        var i = _validatePosition(_i);
        var j = _validatePosition(_j);
        var _element = _createElement();
        _attachEventListeners();

        // Object interface
        return {
            element: _element,
            highlight: _highlight,
            clear: _unhighlight,
            set: _set,
            unset: _unset,
            isSet: _isSet,
            dispose: _dispose
        };

        function _set(horse) {
            if (_horse) {
                throw "Cannot set as a horse is already present on this house!";
            }

            _horse = horse;
            _element.appendChild(horse.element);
        }

        function _unset() {
            if (!_horse) {
                return;
            }

            var horse = _horse; // Temporary location
            _horse = null;

            var child = _element.firstChild;
            if (child) {
                child.remove();
            }

            return horse;
        }

        function _isSet() {
            return !!_horse;
        }

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

        function _attachEventListeners() {
            _element.addEventListener("click", _onClickHandler);
        }

        function _detachEventListeners() {
            _element.removeEventListener("click", _onClickHandler);
        }

        function _onClickHandler(e) {
            if (_element.classList.contains(HOUSE_HIGHLIGHTED_CLASSNAME)) {
                _element.classList.remove(HOUSE_HIGHLIGHTED_CLASSNAME);
            } else {
                _element.classList.add(HOUSE_HIGHLIGHTED_CLASSNAME);
            }
        }

        function _highlight() {
            _element.classList.add(HOUSE_HIGHLIGHTED_CLASSNAME);
        }

        function _unhighlight() {
            _element.classList.remove(HOUSE_HIGHLIGHTED_CLASSNAME);
        }

        function _dispose() {
            _detachEventListeners();
            _element = null;
            _horse = null;
        }
    };

    /**
     * The board object.
     */
    var Board = function(_size) {
        var CONTAINER_CLASSNAME = "container";

        // Lazy initialized variables
        var container = null;
        var houses = null; // A dictionary indexed by "i:j"
        var horses = null; // An array, maybe not needed

        // Construct object
        var size = _validateSize(_size);

        // Object public interface
        return {
            build: _build,
            populate: _populate,
            dispose: _clean,
            highlightHouse: _highlight,
            clearHouse: _unhighlight,
            move: _move
        };

        function _highlight(i, j) {
            var house = _getHouse(i, j);
            if (!house) return;

            house.highlight();
        }

        function _unhighlight(i, j) {
            var house = _getHouse(i, j);
            if (!house) return;

            house.clear();
        }

        function _getHouse(i, j) {
            if (!houses) return null;

            return houses[i + ":" + j];
        }

        function _populate() {
            if (!container) {
                throw "Invalid operation. Board must be first initialized!";
            }

            horses = [];

            for (var k = 0; k < size; k++) {
                var horsew = Horse(HORSE_W);
                var horseb = Horse(HORSE_B);

                var wi = 1;
                var wj = k + 1;
                var bi = 9;
                var bj = k + 1;

                horsew.setPosition(wi, wj);
                horseb.setPosition(bi, bj);

                // Push horses in collection
                horses.push(horsew);
                horses.push(horseb);

                _setHorse(wi, wj, horsew);
                _setHorse(bi, bj, horseb);
            }
        }

        function _move(srci, srcj, dsti, dstj) {
            if (!houses) {
                throw "Cannot move. Board has not been populated!";
            }

            if (!dsti || !dstj || !srci || !srcj) {
                throw "Invalid positions!";
            }
            if (dsti <= 0 || dstj <= 0 || srci <= 0 || srcj <= 0) {
                throw "Position must be a couple of positive integers!";
            }

            // Check that the move is valid, a horse moves like a chess knight
            if (!_checkMove(dsti, dstj, srci, srcj)) {
                throw "Invalid move. A Horse moves like a Chess Knight!";
            }

            // Check that the source house is occupied by a horse and destination is free
            var srcHouse = _getHouse(srci, srcj);
            var dstHouse = _getHouse(dsti, dstj);
            if (!srcHouse || !dstHouse) {
                throw "Cannot move. Could not find houses!";
            }
            if (!srcHouse.isSet()) {
                throw "Cannot move. Source house is not occupied by a horse!";
            }
            if (dstHouse.isSet()) {
                throw "Cannot move. Destination house is occupied by a horse!";
            }

            // Unplace horse from source house
            var movingHorse = srcHouse.unset();
            if (!movingHorse) {
                throw "Cannot move. Attempt to get source horse failed!";
            }
            movingHorse.setPosition(dsti, dstj);
            dstHouse.set(movingHorse);

            console.log("Moved horse from:", srci, srcj, "to:", dsti, dstj);
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

        function _setHorse(i, j, horse) {
            var house = _getHouse(i, j);
            if (!house) {
                throw "Cannot set horse in house. Cannot find house!";
            }

            house.set(horse);

            console.log("Horse set in", i, j);
        }

        function _unsetHorse(i, j) {
            var house = _getHouse(i, j);

            if (house) {
                house.unset();
            }
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
        board.populate();
        window.setTimeout(function(){board.move(1,1,3,2);}, 3000);
    }
};