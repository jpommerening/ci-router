"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Relation = Relation;
exports.Entity = Entity;
exports.Model = Model;
exports.Builder = Builder;
exports.Build = Build;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function bindModel(ctor) {
  var _Object;

  for (var _len = arguments.length, properties = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    properties[_key - 1] = arguments[_key];
  }

  var props = (_Object = Object).assign.apply(_Object, [{
    constructor: {
      value: constructor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  }].concat(properties));
  var proto = Object.create(ctor.prototype, props);

  constructor.prototype = proto;

  return constructor;

  function constructor(data) {
    if (!(this instanceof constructor)) {
      return new constructor(data);
    }
    ctor.call(this, data);
  }
}

function Relation() {}

function Entity() {}

function Model(adapter) {
  var properties = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  if (!(this instanceof Model)) {
    return new Model(adapter, properties);
  }

  this.ids = [];
  this.objects = {};

  this.adapter = adapter;

  var builder = bindModel(Builder, properties, {
    builds: {
      get: function get() {
        return builds(this);
      }
    }
  });
  var build = bindModel(Build, properties);

  this.builder = builder;
  this.build = build;
  this.builders = builders;
  this.builds = builds;

  function builders() {
    var _this = this;

    return adapter.getBuilders().then(function (builders) {
      return Promise.all(builders.map(function (data) {
        return _this.builder(data);
      }));
    });
  }

  function builds() {
    for (var _len2 = arguments.length, builders = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      builders[_key2] = arguments[_key2];
    }

    if (builders.length === 0) {
      return this.builders().then(function (builders) {
        return builds.apply(undefined, _toConsumableArray(builders));
      });
    } else if (builders.length === 1) {
      return adapter.getBuilds(builders[0].data).then(function (builds) {
        return Promise.all(builds.map(function (data) {
          return build(data);
        }));
      });
    } else {
      return Promise.all(builders.map(function (builder) {
        return builds(builder);
      })).then(function (builds) {
        var _ref;

        return (_ref = []).concat.apply(_ref, _toConsumableArray(builds));
      });
    }
  }
}

function Builder(data) {
  this.data = data;
}

function Build(data) {
  this.data = data;
}
//# sourceMappingURL=data:application/json;base64,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LElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDaEMsYUFBTyxPQUFPLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBRSxDQUFDLENBQUUsQ0FBQyxJQUFJLENBQUMsQ0FDekMsSUFBSSxDQUFDLFVBQUEsTUFBTTtlQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUk7aUJBQUksS0FBSyxDQUFDLElBQUksQ0FBQztTQUFBLENBQUMsQ0FBQztPQUFBLENBQUMsQ0FBQztLQUNqRSxNQUFNO0FBQ0wsYUFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQSxPQUFPO2VBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQztPQUFBLENBQUMsQ0FBQyxDQUN6RCxJQUFJLENBQUMsVUFBQSxNQUFNOzs7ZUFBSSxRQUFBLEVBQUUsRUFBQyxNQUFNLE1BQUEsMEJBQUksTUFBTSxFQUFDO09BQUEsQ0FBQyxDQUFDO0tBQ3pDO0dBQ0Y7Q0FDRjs7QUFFTSxTQUFTLE9BQU8sQ0FBQyxJQUFJLEVBQUU7QUFDNUIsTUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Q0FDbEI7O0FBRU0sU0FBUyxLQUFLLENBQUMsSUFBSSxFQUFFO0FBQzFCLE1BQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0NBQ2xCIiwiZmlsZSI6Im1vZGVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5mdW5jdGlvbiBiaW5kTW9kZWwoY3RvciwgLi4ucHJvcGVydGllcykge1xuICBjb25zdCBwcm9wcyA9IE9iamVjdC5hc3NpZ24oe1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogY29uc3RydWN0b3IsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9LCAuLi5wcm9wZXJ0aWVzKTtcbiAgY29uc3QgcHJvdG8gPSBPYmplY3QuY3JlYXRlKGN0b3IucHJvdG90eXBlLCBwcm9wcyk7XG5cbiAgY29uc3RydWN0b3IucHJvdG90eXBlID0gcHJvdG87XG5cbiAgcmV0dXJuIGNvbnN0cnVjdG9yO1xuXG4gIGZ1bmN0aW9uIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgY29uc3RydWN0b3IpKSB7XG4gICAgICByZXR1cm4gbmV3IGNvbnN0cnVjdG9yKGRhdGEpO1xuICAgIH1cbiAgICBjdG9yLmNhbGwodGhpcywgZGF0YSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlbGF0aW9uKCkge1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRW50aXR5KCkge1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTW9kZWwoYWRhcHRlciwgcHJvcGVydGllcyA9IHt9KSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBNb2RlbCkpIHtcbiAgICByZXR1cm4gbmV3IE1vZGVsKGFkYXB0ZXIsIHByb3BlcnRpZXMpO1xuICB9XG5cbiAgdGhpcy5pZHMgPSBbXTtcbiAgdGhpcy5vYmplY3RzID0ge1xuICB9O1xuXG4gIHRoaXMuYWRhcHRlciA9IGFkYXB0ZXI7XG5cbiAgY29uc3QgYnVpbGRlciA9IGJpbmRNb2RlbChCdWlsZGVyLCBwcm9wZXJ0aWVzLCB7XG4gICAgYnVpbGRzOiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGJ1aWxkcyh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBjb25zdCBidWlsZCA9IGJpbmRNb2RlbChCdWlsZCwgcHJvcGVydGllcyk7XG5cbiAgdGhpcy5idWlsZGVyID0gYnVpbGRlcjtcbiAgdGhpcy5idWlsZCA9IGJ1aWxkO1xuICB0aGlzLmJ1aWxkZXJzID0gYnVpbGRlcnM7XG4gIHRoaXMuYnVpbGRzID0gYnVpbGRzO1xuXG4gIGZ1bmN0aW9uIGJ1aWxkZXJzKCkge1xuICAgIHJldHVybiBhZGFwdGVyLmdldEJ1aWxkZXJzKClcbiAgICAgIC50aGVuKGJ1aWxkZXJzID0+IFByb21pc2UuYWxsKGJ1aWxkZXJzLm1hcChkYXRhID0+IHRoaXMuYnVpbGRlcihkYXRhKSkpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkcyguLi5idWlsZGVycykge1xuICAgIGlmIChidWlsZGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLmJ1aWxkZXJzKCkudGhlbihidWlsZGVycyA9PiBidWlsZHMoLi4uYnVpbGRlcnMpKTtcbiAgICB9IGVsc2UgaWYgKGJ1aWxkZXJzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIGFkYXB0ZXIuZ2V0QnVpbGRzKGJ1aWxkZXJzWyAwIF0uZGF0YSlcbiAgICAgICAgLnRoZW4oYnVpbGRzID0+IFByb21pc2UuYWxsKGJ1aWxkcy5tYXAoZGF0YSA9PiBidWlsZChkYXRhKSkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGJ1aWxkZXJzLm1hcChidWlsZGVyID0+IGJ1aWxkcyhidWlsZGVyKSkpXG4gICAgICAgIC50aGVuKGJ1aWxkcyA9PiBbXS5jb25jYXQoLi4uYnVpbGRzKSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBCdWlsZGVyKGRhdGEpIHtcbiAgdGhpcy5kYXRhID0gZGF0YTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEJ1aWxkKGRhdGEpIHtcbiAgdGhpcy5kYXRhID0gZGF0YTtcbn1cbiJdfQ==