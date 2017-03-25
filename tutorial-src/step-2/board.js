var jm = jm || {};

jm.Board = function(_size) {
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
        initialize: _initialize
    };

    function _getHouse(i, j) {
        if (!houses) return null;

        return houses[i + ":" + j];
    }

    function _initialize() {
        _build();
        _populate();
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

    function _isBuilt() {
        return houses != null;
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
