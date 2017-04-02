/**
 * horse.js
 * Andrea Tino - 2017
 */

var jm = jm || {};

/**
 * The horse piece.
 */
jm.Horse = function(__mode) {
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
        
        if (mode === jm.HORSE_B) {
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
        if (value !== jm.HORSE_W && value !== jm.HORSE_B) {
            return jm.HORSE_W; // Default to white
        }

        return value;
    }

    function _dispose() {
        _element = null;
    }
};
