'use strict';

exports.__esModule = true;
exports.TagNode = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _char = require('./char');

var _index = require('./index');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TagNode = function () {
  function TagNode(tag, attrs, content) {
    _classCallCheck(this, TagNode);

    this.tag = tag;
    this.attrs = attrs;
    this.content = content;
  }

  TagNode.prototype.attr = function attr(name, value) {
    if (typeof value !== 'undefined') {
      this.attrs[name] = value;
    }

    return this.attrs[name];
  };

  TagNode.prototype.append = function append(value) {
    return (0, _index.appendToNode)(this, value);
  };

  TagNode.prototype.toString = function toString() {
    var OB = _char.OPEN_BRAKET;
    var CB = _char.CLOSE_BRAKET;

    return OB + this.tag + CB + this.content.reduce(function (r, node) {
      return r + node.toString();
    }, '') + OB + _char.SLASH + this.tag + CB;
  };

  _createClass(TagNode, [{
    key: 'length',
    get: function get() {
      return (0, _index.getNodeLength)(this);
    }
  }]);

  return TagNode;
}();

TagNode.create = function (tag) {
  var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var content = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  return new TagNode(tag, attrs, content);
};
TagNode.isOf = function (node, type) {
  return node.tag === type;
};

exports.TagNode = TagNode;
exports.default = TagNode;