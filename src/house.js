/**
 * house.js
 * Andrea Tino - 2017
 */

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
            return null;
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
