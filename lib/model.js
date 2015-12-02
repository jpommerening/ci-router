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
  var build = bindModel(Build, properties, {
    builder: {
      get: function get() {
        return Promise.resolve(null);
      }
    }
  });

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

  function cmp(a, b) {
    var now = new Date();
    return (b.end || now).getTime() - (a.end || now).getTime();
  }

  function builds() {
    for (var _len2 = arguments.length, builders = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      builders[_key2] = arguments[_key2];
    }

    return (builders.length === 0 ? this.builders() : Promise.all(builders)).then(function (builders) {
      return Promise.all(builders.map(function (builder) {
        return adapter.getBuilds(builder.data);
      }));
    }).then(function (builds) {
      var _ref;

      return (_ref = []).concat.apply(_ref, _toConsumableArray(builds)).sort(cmp);
    }).then(function (builds) {
      return builds.map(function (data) {
        return build(data);
      });
    });
  }
}

function Builder(data) {
  this.data = data;
}

function Build(data) {
  this.data = data;
}
//# sourceMappingURL=data:application/json;base64,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TyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFBLENBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQSxDQUFFLE9BQU8sRUFBRSxDQUFDO0dBQzVEOztBQUVELFdBQVMsTUFBTSxHQUFjO3VDQUFWLFFBQVE7QUFBUixjQUFROzs7QUFDekIsV0FBTyxDQUFDLEFBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUEsQ0FDdEUsSUFBSSxDQUFDLFVBQUEsUUFBUTthQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFBLE9BQU87ZUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7T0FBQSxDQUFDLENBQUM7S0FBQSxDQUFDLENBQ3ZGLElBQUksQ0FBQyxVQUFBLE1BQU07OzthQUFJLFFBQUEsRUFBRSxFQUFDLE1BQU0sTUFBQSwwQkFBSSxNQUFNLEVBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0tBQUEsQ0FBQyxDQUM5QyxJQUFJLENBQUMsVUFBQSxNQUFNO2FBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUk7ZUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDO09BQUEsQ0FBQztLQUFBLENBQUMsQ0FBQztHQUNwRDtDQUNGOztBQUVNLFNBQVMsT0FBTyxDQUFDLElBQUksRUFBRTtBQUM1QixNQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztDQUNsQjs7QUFFTSxTQUFTLEtBQUssQ0FBQyxJQUFJLEVBQUU7QUFDMUIsTUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Q0FDbEIiLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmZ1bmN0aW9uIGJpbmRNb2RlbChjdG9yLCAuLi5wcm9wZXJ0aWVzKSB7XG4gIGNvbnN0IHByb3BzID0gT2JqZWN0LmFzc2lnbih7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBjb25zdHJ1Y3RvcixcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG4gIH0sIC4uLnByb3BlcnRpZXMpO1xuICBjb25zdCBwcm90byA9IE9iamVjdC5jcmVhdGUoY3Rvci5wcm90b3R5cGUsIHByb3BzKTtcblxuICBjb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBwcm90bztcblxuICByZXR1cm4gY29uc3RydWN0b3I7XG5cbiAgZnVuY3Rpb24gY29uc3RydWN0b3IoZGF0YSkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBjb25zdHJ1Y3RvcikpIHtcbiAgICAgIHJldHVybiBuZXcgY29uc3RydWN0b3IoZGF0YSk7XG4gICAgfVxuICAgIGN0b3IuY2FsbCh0aGlzLCBkYXRhKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVsYXRpb24oKSB7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBFbnRpdHkoKSB7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBNb2RlbChhZGFwdGVyLCBwcm9wZXJ0aWVzID0ge30pIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE1vZGVsKSkge1xuICAgIHJldHVybiBuZXcgTW9kZWwoYWRhcHRlciwgcHJvcGVydGllcyk7XG4gIH1cblxuICB0aGlzLmlkcyA9IFtdO1xuICB0aGlzLm9iamVjdHMgPSB7XG4gIH07XG5cbiAgdGhpcy5hZGFwdGVyID0gYWRhcHRlcjtcblxuICBjb25zdCBidWlsZGVyID0gYmluZE1vZGVsKEJ1aWxkZXIsIHByb3BlcnRpZXMsIHtcbiAgICBidWlsZHM6IHtcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gYnVpbGRzKHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGNvbnN0IGJ1aWxkID0gYmluZE1vZGVsKEJ1aWxkLCBwcm9wZXJ0aWVzLCB7XG4gICAgYnVpbGRlcjoge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICB0aGlzLmJ1aWxkZXIgPSBidWlsZGVyO1xuICB0aGlzLmJ1aWxkID0gYnVpbGQ7XG4gIHRoaXMuYnVpbGRlcnMgPSBidWlsZGVycztcbiAgdGhpcy5idWlsZHMgPSBidWlsZHM7XG5cbiAgZnVuY3Rpb24gYnVpbGRlcnMoKSB7XG4gICAgcmV0dXJuIGFkYXB0ZXIuZ2V0QnVpbGRlcnMoKVxuICAgICAgLnRoZW4oYnVpbGRlcnMgPT4gUHJvbWlzZS5hbGwoYnVpbGRlcnMubWFwKGRhdGEgPT4gdGhpcy5idWlsZGVyKGRhdGEpKSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gY21wKGEsIGIpIHtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIHJldHVybiAoYi5lbmQgfHwgbm93KS5nZXRUaW1lKCkgLSAoYS5lbmQgfHwgbm93KS5nZXRUaW1lKCk7XG4gIH1cblxuICBmdW5jdGlvbiBidWlsZHMoLi4uYnVpbGRlcnMpIHtcbiAgICByZXR1cm4gKChidWlsZGVycy5sZW5ndGggPT09IDApID8gdGhpcy5idWlsZGVycygpIDogUHJvbWlzZS5hbGwoYnVpbGRlcnMpKVxuICAgICAgLnRoZW4oYnVpbGRlcnMgPT4gUHJvbWlzZS5hbGwoYnVpbGRlcnMubWFwKGJ1aWxkZXIgPT4gYWRhcHRlci5nZXRCdWlsZHMoYnVpbGRlci5kYXRhKSkpKVxuICAgICAgLnRoZW4oYnVpbGRzID0+IFtdLmNvbmNhdCguLi5idWlsZHMpLnNvcnQoY21wKSlcbiAgICAgIC50aGVuKGJ1aWxkcyA9PiBidWlsZHMubWFwKGRhdGEgPT4gYnVpbGQoZGF0YSkpKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gQnVpbGRlcihkYXRhKSB7XG4gIHRoaXMuZGF0YSA9IGRhdGE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBCdWlsZChkYXRhKSB7XG4gIHRoaXMuZGF0YSA9IGRhdGE7XG59XG4iXX0=