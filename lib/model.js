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

    return adapter.getInfo().then(function (info) {
      return adapter.getBuilders(info);
    }).then(function (builders) {
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
//# sourceMappingURL=data:application/json;base64,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b250ZW50IjpbIlxuZnVuY3Rpb24gYmluZE1vZGVsKGN0b3IsIC4uLnByb3BlcnRpZXMpIHtcbiAgY29uc3QgcHJvcHMgPSBPYmplY3QuYXNzaWduKHtcbiAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgdmFsdWU6IGNvbnN0cnVjdG9yLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH1cbiAgfSwgLi4ucHJvcGVydGllcyk7XG4gIGNvbnN0IHByb3RvID0gT2JqZWN0LmNyZWF0ZShjdG9yLnByb3RvdHlwZSwgcHJvcHMpO1xuXG4gIGNvbnN0cnVjdG9yLnByb3RvdHlwZSA9IHByb3RvO1xuXG4gIHJldHVybiBjb25zdHJ1Y3RvcjtcblxuICBmdW5jdGlvbiBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIGNvbnN0cnVjdG9yKSkge1xuICAgICAgcmV0dXJuIG5ldyBjb25zdHJ1Y3RvcihkYXRhKTtcbiAgICB9XG4gICAgY3Rvci5jYWxsKHRoaXMsIGRhdGEpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWxhdGlvbigpIHtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEVudGl0eSgpIHtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIE1vZGVsKGFkYXB0ZXIsIHByb3BlcnRpZXMgPSB7fSkge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTW9kZWwpKSB7XG4gICAgcmV0dXJuIG5ldyBNb2RlbChhZGFwdGVyLCBwcm9wZXJ0aWVzKTtcbiAgfVxuXG4gIHRoaXMuaWRzID0gW107XG4gIHRoaXMub2JqZWN0cyA9IHtcbiAgfTtcblxuICB0aGlzLmFkYXB0ZXIgPSBhZGFwdGVyO1xuXG4gIGNvbnN0IGJ1aWxkZXIgPSBiaW5kTW9kZWwoQnVpbGRlciwgcHJvcGVydGllcywge1xuICAgIGJ1aWxkczoge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBidWlsZHModGhpcyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgY29uc3QgYnVpbGQgPSBiaW5kTW9kZWwoQnVpbGQsIHByb3BlcnRpZXMsIHtcbiAgICBidWlsZGVyOiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHRoaXMuYnVpbGRlciA9IGJ1aWxkZXI7XG4gIHRoaXMuYnVpbGQgPSBidWlsZDtcbiAgdGhpcy5idWlsZGVycyA9IGJ1aWxkZXJzO1xuICB0aGlzLmJ1aWxkcyA9IGJ1aWxkcztcblxuICBmdW5jdGlvbiBidWlsZGVycygpIHtcbiAgICByZXR1cm4gYWRhcHRlci5nZXRJbmZvKClcbiAgICAgIC50aGVuKGluZm8gPT4gYWRhcHRlci5nZXRCdWlsZGVycyhpbmZvKSlcbiAgICAgIC50aGVuKGJ1aWxkZXJzID0+IFByb21pc2UuYWxsKGJ1aWxkZXJzLm1hcChkYXRhID0+IHRoaXMuYnVpbGRlcihkYXRhKSkpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNtcChhLCBiKSB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICByZXR1cm4gKGIuZW5kIHx8IG5vdykuZ2V0VGltZSgpIC0gKGEuZW5kIHx8IG5vdykuZ2V0VGltZSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gYnVpbGRzKC4uLmJ1aWxkZXJzKSB7XG4gICAgcmV0dXJuICgoYnVpbGRlcnMubGVuZ3RoID09PSAwKSA/IHRoaXMuYnVpbGRlcnMoKSA6IFByb21pc2UuYWxsKGJ1aWxkZXJzKSlcbiAgICAgIC50aGVuKGJ1aWxkZXJzID0+IFByb21pc2UuYWxsKGJ1aWxkZXJzLm1hcChidWlsZGVyID0+IGFkYXB0ZXIuZ2V0QnVpbGRzKGJ1aWxkZXIuZGF0YSkpKSlcbiAgICAgIC50aGVuKGJ1aWxkcyA9PiBbXS5jb25jYXQoLi4uYnVpbGRzKS5zb3J0KGNtcCkpXG4gICAgICAudGhlbihidWlsZHMgPT4gYnVpbGRzLm1hcChkYXRhID0+IGJ1aWxkKGRhdGEpKSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEJ1aWxkZXIoZGF0YSkge1xuICB0aGlzLmRhdGEgPSBkYXRhO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gQnVpbGQoZGF0YSkge1xuICB0aGlzLmRhdGEgPSBkYXRhO1xufVxuIl19