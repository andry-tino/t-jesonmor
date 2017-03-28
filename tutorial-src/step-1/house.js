var jm = jm || {};

/**
 * A house able to host a piece.
 */
jm.House = function(_i, _j) {
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
        set: _set
    };

    function _set(horse) {
        if (_horse) {
            throw "Cannot set as a horse is already present on this house!";
        }

        _horse = horse;
        _element.appendChild(horse.element);
    }

    function _createElement() {
        var element = document.createElement("div");
        element.className = HOUSE_CLASSNAME;

        return element;
    }
};
