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
    var Horse = function(__mode) {
        var HORSE_CLASSNAME = "horse";
        var WHITE_CLASSNAME = "white";
        var BLACK_CLASSNAME = "black";

        // Construct the object
        var i = 1;
        var j = 1;
        var _mode = _validateMode(__mode); // HORSE_W | HORSE_B
        var _element = _createElement(_mode);

        // Object public interface
        return {
            element: _element,
            position: _position,
            setPosition: _setPosition,
            mode: _mode,
            dispose: _dispose
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

        function _dispose() {
            _element = null;
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
            getPosition: _getPosition,
            dispose: _dispose,
            getHorseColor: _getHorseColor // HORSE_W | HORSE_B
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

        function _getPosition() {
            return { "i": i, "j": j };
        }

        function _isSet() {
            return !!_horse;
        }

        function _getHorseColor() {
            if (!_horse) {
                return null;
            }

            return _horse.mode;
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
            _horse = null; // Disposal of horse needs to happen somewhere else
        }
    };

    /**
     * The board object.
     */
    var Board = function(_size) {
        var CONTAINER_CLASSNAME = "container";
        var CUR_PLAYER_W = 0;
        var CUR_PLAYER_B = 1;

        // Lazy initialized variables
        var container = null;
        var houses = null; // A dictionary indexed by "i:j"
        var horses = null; // An array, maybe not needed

        // Status variables
        var currentPlayer = CUR_PLAYER_W; // White starts
        var selectedHouse = null;

        // Construct object
        var size = _validateSize(_size);

        // Object public interface
        return {
            initialize: _initialize,
            dispose: _clean,
            highlightHouse: _highlight,
            clearHouse: _unhighlight,
            move: _move,
            dispose: _dispose
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

        function _initialize() {
            _build();
            _populate();
            _attachNativeEvents();
        }

        function _attachNativeEvents() {
            if (!container) {
                throw "Cannot attach events. Board must first be initialized!";
            }

            container.addEventListener("click", _onClickHandler, true);
        }

        function _detachNativeEvents() {
            container.removeEventListener("click", _onClickHandler, true);
        }

        function _clearSelectedHouse() {
            selectedHouse.clear();
            selectedHouse = null;
        }

        function _onClickHandler(e) {
            function cancel(phase) {
                e.stopPropagation();
                if (selectedHouse) {
                    _clearSelectedHouse();
                }

                console.log("Interaction canceled at", phase);
            }

            function _evaluateEndGame(srci, srcj) {
                var c = Math.ceil(size / 2);
                return srci === c && srcj === c;
            }

            var target = e.target;
            if (!target) { cancel("House Acquire"); return; }

            var id = target.id;
            if (!id) {
                // Player might have selected a horse
                var parent = target.parentElement;
                if (!parent) { cancel("House Acquire"); return; }

                id = parent.id;
            }

            // Could not find the house
            if (!id) { cancel("House Acquire"); return; }

            // When constructing the board we assign positions as ids
            var house = houses[id];
            if (!house) {
                throw "Click handler failed. Cannot find house at " + id;
            }

            // Nothing was started, one player is selecting an house, 
            // let's check it is a house with a player's horse on
            if (!selectedHouse) {
                // Empty house, invalid selection
                if (!house.isSet()) { cancel("Initial selection"); return; }

                var houseColor = house.getHorseColor();
                var wbcond = houseColor === HORSE_W && currentPlayer === CUR_PLAYER_B;
                var bwcond = houseColor === HORSE_B && currentPlayer === CUR_PLAYER_W;
                // Player has selected an adversary's horse => invalid
                if (_evaluateAntagony(house)) { cancel("Initial selection"); return; }

                // Player has selected one of his horses
                selectedHouse = house;
                return;
            }

            // An house is already selected, a move is being attempted
            // Cannot move to an house which is occupied
            if (house.isSet() && !_evaluateAntagony(house)) { cancel("Move"); return; }

            var selectedHousePosition = selectedHouse.getPosition();
            var attemptedHousePosition = house.getPosition();
            if (!_checkMove(
                attemptedHousePosition.i, attemptedHousePosition.j, 
                selectedHousePosition.i, selectedHousePosition.j)) 
                    { cancel("Move"); return; }
            
            // Evaluate endgame
            var endgame = _evaluateEndGame(selectedHousePosition.i, selectedHousePosition.j);

            // Can move
            _move(
                selectedHousePosition.i, selectedHousePosition.j, 
                attemptedHousePosition.i, attemptedHousePosition.j);

            _clearSelectedHouse();
            house.clear();

            _nextPlayer();

            e.stopPropagation();

            if (endgame) _endgame();
        }

        function _endgame() {
            _reset();
        }

        function _evaluateAntagony(house) {
            var houseColor = house.getHorseColor();
            var wbcond = houseColor === HORSE_W && currentPlayer === CUR_PLAYER_B;
            var bwcond = houseColor === HORSE_B && currentPlayer === CUR_PLAYER_W;

            return wbcond || bwcond;
        }

        // Parameter: { hid: <number> }
        function _fsm(args) {
            // TODO
        }

        function _nextPlayer() {
            if (currentPlayer === CUR_PLAYER_W) {
                currentPlayer = CUR_PLAYER_B;
            } else {
                currentPlayer = CUR_PLAYER_W;
            }
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

        function _depopulate() {
            if (!container) {
                throw "Invalid operation. Board must be first initialized!";
            }

            for (var k = 0, keys = Object.keys(houses); k < keys.length; k++) {
                var house = houses[keys[k]];
                if (!house) continue;

                if (!house.isSet()) continue;

                house.unset();
            }

            for (var k = 0; k < horses.length; k++) {
                horses[k].dispose();
            }

            horses = [];
        }

        // This deals also with eating horses
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

            // If destination is occupied by other player's horse, eat it!
            var eat = false;
            if (dstHouse.isSet()) {
                if (_evaluateAntagony(dstHouse)) {
                    eat = true;
                } else {
                    throw "Cannot move. Destination house is occupied by a horse!";
                }
            }

            // Unplace horse from source house
            var movingHorse = srcHouse.unset();
            if (!movingHorse) {
                throw "Cannot move. Attempt to get source horse failed!";
            }
            movingHorse.setPosition(dsti, dstj);

            // Handling destination house
            if (eat) dstHouse.unset();
            dstHouse.set(movingHorse);

            console.log("Moved horse from:", srci, srcj, "to:", dsti, dstj, 
                eat ? "and ate!" : "");
        }

        function _reset() {
            // Do not regenerate the board, just reset horses in their positions
            _depopulate();
            _populate();

            currentPlayer = CUR_PLAYER_W;
            selectedHouse = null;
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
                // In order to facilitate detection while playing
                house.element.id = i + ":" + j;
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

        function _dispose() {
            _detachNativeEvents();
            container = null;

            for (var k = 0, keys = Object.keys(houses); k < keys.length; k++) {
                houses[keys[k]].dispose();
            }
            houses = null;

            for (var k = 0; k < horses.length; k++) {
                horses[k].dispose();
            }
            horses = null;
        }
    }; // Board

    // Object public interface
    return {
        initialize: _initialize
    }

    function _initialize() {
        var board = Board();
        board.initialize();
        //window.setTimeout(function(){board.move(1,1,3,2);}, 3000);
    }
};