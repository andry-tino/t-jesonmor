var jm = jm || {};

jm.Board = function(_size) {
    var CONTAINER_CLASSNAME = "container";
    var WHITE_CLASSNAME = "white";
    var BLACK_CLASSNAME = "black";
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
        initialize: _initialize
    };

    function _highlight(i, j) {
        var house = _getHouse(i, j);
        if (!house) return;

        house.highlight();
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

        function evaluateEndGame(srci, srcj) {
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
            selectedHousePosition.i, selectedHousePosition.j,
            attemptedHousePosition.i, attemptedHousePosition.j
            )) { cancel("Move"); return; }
        
        // Evaluate endgame
        var endgame = evaluateEndGame(selectedHousePosition.i, selectedHousePosition.j);

        // Can move
        _move(
            selectedHousePosition.i, selectedHousePosition.j, 
            attemptedHousePosition.i, attemptedHousePosition.j);

        _clearSelectedHouse(); // Remove highlight from source house
        e.stopPropagation(); // Make sure destination house does not receive highlight later

        _nextPlayer();

        if (endgame) _endgame();
    }

    function _endgame() {
        _reset();
    }

    function _evaluateAntagony(house) {
        var houseColor = house.getHorseColor();
        var wbcond = houseColor === jm.HORSE_W && currentPlayer === CUR_PLAYER_B;
        var bwcond = houseColor === jm.HORSE_B && currentPlayer === CUR_PLAYER_W;

        return wbcond || bwcond;
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
            var horsew = jm.Horse(jm.HORSE_W);
            var horseb = jm.Horse(jm.HORSE_B);

            var wi = 1;
            var wj = k + 1;
            var bi = size;
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
        if (!_checkMove(srci, srcj, dsti, dstj)) {
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
        if (eat) {
            var eaten = dstHouse.unset();
        }
        dstHouse.set(movingHorse);

        console.log("Moved horse from:", srci, srcj, "to:", dsti, dstj, 
            eat ? "and ate!" : "");
    }

    function _reset() {
        window.location.reload();
    }

    function _checkMove(oi, oj, ni, nj) {
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

    function _build() {
        var dimension = size * size;
        houses = {}; // Initializing dictionary

        container = _createContainer();
        for (var k = 0; k < dimension; k++) {
            // Calculate Indexes
            var i = Math.ceil((k + 1) / size);
            var j = (k + 1) % size;
            if (j === 0) j = size;

            console.log("Indices", i, j);

            var house = jm.House(i, j);
            // In order to facilitate detection while playing
            house.element.id = i + ":" + j;
            container.appendChild(house.element);

            // Index houses
            houses[i + ":" + j] = house;
        }

        document.body.appendChild(container);
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
};
