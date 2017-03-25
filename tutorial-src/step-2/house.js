var jm = jm || {};

/**
 * A house able to host a piece.
 */
jm.House = function(_i, _j) {
    var HOUSE_CLASSNAME = "house";

    // Lazy initialized objects
    var _horse = null;

    // Construct object
    var i = _validatePosition(_i);
    var j = _validatePosition(_j);
    var _element = _createElement();

    // Object interface
    return {
        element: _element,
        set: _set,
        unset: _unset
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

    function _createElement() {
        var element = document.createElement("div");
        element.className = HOUSE_CLASSNAME;

        return element;
    }
};
