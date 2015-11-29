"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Model = Model;
exports.Builder = Builder;
exports.Build = Build;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function bindModel(ctor, properties) {
  var props = Object.assign({
    constructor: {
      value: constructor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  }, properties);
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

function Model(adapter) {
  var properties = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  this.ids = [];
  this.objects = {};

  this.adapter = adapter;

  this.builder = bindModel(Builder, properties);
  this.build = bindModel(Build, properties);

  this.builders = function builders() {
    var _this = this;

    return adapter.getBuilders().then(function (builders) {
      return Promise.all(builders.map(function (data) {
        return _this.builder(data);
      }));
    });
  };
  this.builds = function builds() {
    var _this2 = this;

    for (var _len = arguments.length, builders = Array(_len), _key = 0; _key < _len; _key++) {
      builders[_key] = arguments[_key];
    }

    if (builders.length === 0) {
      return this.builders().then(function (builders) {
        return _this2.builds.apply(_this2, _toConsumableArray(builders));
      });
    } else if (builders.length === 1) {
      return builders[0].data.then(function (data) {
        return _this2.adapter.getBuilds(data);
      }).then(function (builds) {
        return Promise.all(builds.map(function (data) {
          return _this2.build(data);
        }));
      });
    } else {
      return Promise.all(builders.map(function (builder) {
        return _this2.builds(builder);
      })).then(function (builds) {
        var _ref;

        return (_ref = []).concat.apply(_ref, _toConsumableArray(builds));
      });
    }
  };
}

function Builder(data) {
  this.data = data;
}

function Build(data) {
  this.data = data;
}
//# sourceMappingURL=data:application/json;base64,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QztPQUFBLENBQUMsQ0FBQyxDQUM5RCxJQUFJLENBQUMsVUFBQSxNQUFNOzs7ZUFBSSxRQUFBLEVBQUUsRUFBQyxNQUFNLE1BQUEsMEJBQUksTUFBTSxFQUFDO09BQUEsQ0FBQyxDQUFDO0tBQ3pDO0dBQ0YsQ0FBQztDQUNIOztBQUVNLFNBQVMsT0FBTyxDQUFDLElBQUksRUFBRTtBQUM1QixNQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztDQUNsQjs7QUFFTSxTQUFTLEtBQUssQ0FBQyxJQUFJLEVBQUU7QUFDMUIsTUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Q0FDbEIiLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmZ1bmN0aW9uIGJpbmRNb2RlbChjdG9yLCBwcm9wZXJ0aWVzKSB7XG4gIGNvbnN0IHByb3BzID0gT2JqZWN0LmFzc2lnbih7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBjb25zdHJ1Y3RvcixcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG4gIH0sIHByb3BlcnRpZXMpO1xuICBjb25zdCBwcm90byA9IE9iamVjdC5jcmVhdGUoY3Rvci5wcm90b3R5cGUsIHByb3BzKTtcblxuICBjb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBwcm90bztcblxuICByZXR1cm4gY29uc3RydWN0b3I7XG5cbiAgZnVuY3Rpb24gY29uc3RydWN0b3IoZGF0YSkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBjb25zdHJ1Y3RvcikpIHtcbiAgICAgIHJldHVybiBuZXcgY29uc3RydWN0b3IoZGF0YSk7XG4gICAgfVxuICAgIGN0b3IuY2FsbCh0aGlzLCBkYXRhKTtcbiAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBNb2RlbChhZGFwdGVyLCBwcm9wZXJ0aWVzID0ge30pIHtcbiAgdGhpcy5pZHMgPSBbXTtcbiAgdGhpcy5vYmplY3RzID0ge1xuICB9O1xuXG4gIHRoaXMuYWRhcHRlciA9IGFkYXB0ZXI7XG5cbiAgdGhpcy5idWlsZGVyID0gYmluZE1vZGVsKEJ1aWxkZXIsIHByb3BlcnRpZXMpO1xuICB0aGlzLmJ1aWxkID0gYmluZE1vZGVsKEJ1aWxkLCBwcm9wZXJ0aWVzKTtcblxuICB0aGlzLmJ1aWxkZXJzID0gZnVuY3Rpb24gYnVpbGRlcnMoKSB7XG4gICAgcmV0dXJuIGFkYXB0ZXIuZ2V0QnVpbGRlcnMoKVxuICAgICAgLnRoZW4oYnVpbGRlcnMgPT4gUHJvbWlzZS5hbGwoYnVpbGRlcnMubWFwKGRhdGEgPT4gdGhpcy5idWlsZGVyKGRhdGEpKSkpO1xuICB9O1xuICB0aGlzLmJ1aWxkcyA9IGZ1bmN0aW9uIGJ1aWxkcyguLi5idWlsZGVycykge1xuICAgIGlmIChidWlsZGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLmJ1aWxkZXJzKCkudGhlbihidWlsZGVycyA9PiB0aGlzLmJ1aWxkcyguLi5idWlsZGVycykpO1xuICAgIH0gZWxzZSBpZiAoYnVpbGRlcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gYnVpbGRlcnNbIDAgXS5kYXRhXG4gICAgICAgIC50aGVuKGRhdGEgPT4gdGhpcy5hZGFwdGVyLmdldEJ1aWxkcyhkYXRhKSlcbiAgICAgICAgLnRoZW4oYnVpbGRzID0+IFByb21pc2UuYWxsKGJ1aWxkcy5tYXAoZGF0YSA9PiB0aGlzLmJ1aWxkKGRhdGEpKSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoYnVpbGRlcnMubWFwKGJ1aWxkZXIgPT4gdGhpcy5idWlsZHMoYnVpbGRlcikpKVxuICAgICAgICAudGhlbihidWlsZHMgPT4gW10uY29uY2F0KC4uLmJ1aWxkcykpO1xuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEJ1aWxkZXIoZGF0YSkge1xuICB0aGlzLmRhdGEgPSBkYXRhO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQnVpbGQoZGF0YSkge1xuICB0aGlzLmRhdGEgPSBkYXRhO1xufVxuIl19