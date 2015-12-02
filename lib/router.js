'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Router = Router;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _ciAdapter = require('ci-adapter');

var _util = require('util');

var _id = require('./id');

var _model = require('./model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function Router(adapter, options) {
  var router = _express2.default.Router();
  var model = (0, _model.Model)(adapter, {
    id: {
      get: function get() {
        return (0, _id.id)(this.data);
      }
    },
    url: {
      get: function get() {
        if (this instanceof _model.Build) {
          return this.id.then(function (id) {
            return '/builds/' + id;
          });
        }
        if (this instanceof _model.Builder) {
          return this.id.then(function (id) {
            return '/builders/' + id;
          });
        }
      }
    }
  });

  router.get('/', function (req, res, next) {
    var builders = model.builders();
    var builds = model.builds();

    Promise.all([builders.then(function (builders) {
      return Promise.all(builders.map(function (builder) {
        return builder.id;
      }));
    }), builds.then(function (builds) {
      return Promise.all(builds.map(function (build) {
        return build.id;
      }));
    }), builds.then(function (builds) {
      return builds.filter(function (build) {
        return build.state === _ciAdapter.state.PENDING;
      });
    })]).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 3);

      var builders = _ref2[0];
      var builds = _ref2[1];
      var pending = _ref2[2];
      return { builders: builders, builds: builds, pending: pending };
    }).then(send(res), error(res));
  });

  router.get('/builders', function (req, res, next) {
    model.builders().then(function (builders) {
      return builders.map(function (builder) {
        return builder.data;
      });
    }).then(send(res), error(res));
  });

  router.get('/builds', function (req, res, next) {
    model.builds().then(function (builds) {
      return builds.map(function (build) {
        return build.data;
      });
    }).then(send(res), error(res));
  });

  router.get('/latest', function (req, res, next) {
    model.builds().then(function (builds) {
      return builds[0].data;
    }).then(send(res), error(res));
  });

  return router;
}

function send(res) {
  return function (data) {
    return res.send(data);
  };
}

function error(res) {
  return function (err) {
    res.status(500);
    res.send({
      message: err.toString()
    });
    console.log(err);
  };
}

function pmap(promise, callback) {
  return promise.then(function (list) {
    return Promise.all(list.map(callback));
  });
}

function pfmap(promise, callback) {
  return pmap(promise, callback).then(function (lists) {
    var _ref3;

    return (_ref3 = []).concat.apply(_ref3, _toConsumableArray(lists));
  });
}

function builders(adapter) {
  return pmap(adapter.getBuilders(), function (builder) {
    return pmap(adapter.getBuilds(builder), function (build) {
      return (0, _id.id)(build);
    }).then(function (builds) {
      return (0, _id.id)(builder).then(function (id) {
        return {
          id: id,
          html_url: builder.html_url,
          name: builder.name,
          builds: builds
        };
      });
    });
  });
}

function builds(adapter) {
  return pfmap(adapter.getBuilders(), adapter.getBuilds).then(function (builds) {
    var now = new Date();
    var sorted = builds.sort(function (a, b) {
      return (b.end || now).getTime() - (a.end || now).getTime();
    });

    return Promise.all(sorted.map(function (build) {
      return (0, _id.id)(build).then(function (id) {
        return {
          id: id,
          html_url: build.html_url,
          name: build.name,
          number: build.number,
          state: build.state,
          start: build.start,
          end: build.end
        };
      });
    }));
  });
}
//# sourceMappingURL=data:application/json;base64,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O0FBQzVFLFFBQU0sR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFDdkIsUUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBRSxVQUFDLENBQUMsRUFBRSxDQUFDO2FBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQSxDQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUEsQ0FBRSxPQUFPLEVBQUU7S0FBQSxDQUFFLENBQUM7O0FBRTVGLFdBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsS0FBSyxFQUFFO0FBQzdDLGFBQU8sUUFwR0osRUFBRSxFQW9HSyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7QUFDbEMsZUFBTztBQUNMLFlBQUUsRUFBRSxFQUFFO0FBQ04sa0JBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtBQUN4QixjQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7QUFDaEIsZ0JBQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtBQUNwQixlQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUs7QUFDbEIsZUFBSyxFQUFFLEtBQUssQ0FBQyxLQUFLO0FBQ2xCLGFBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztTQUNmLENBQUM7T0FDSCxDQUFDLENBQUM7S0FDSixDQUFDLENBQUMsQ0FBQztHQUNMLENBQUMsQ0FBQztDQUNKIiwiZmlsZSI6InJvdXRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgc3RhdGUgfSBmcm9tICdjaS1hZGFwdGVyJztcbmltcG9ydCB7IGluaGVyaXRzIH0gZnJvbSAndXRpbCc7XG5pbXBvcnQgeyBpZCB9IGZyb20gJy4vaWQnO1xuaW1wb3J0IHsgTW9kZWwsIEJ1aWxkLCBCdWlsZGVyIH0gZnJvbSAnLi9tb2RlbCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBSb3V0ZXIoYWRhcHRlciwgb3B0aW9ucykge1xuICBjb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xuICBjb25zdCBtb2RlbCA9IE1vZGVsKGFkYXB0ZXIsIHtcbiAgICBpZDoge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBpZCh0aGlzLmRhdGEpO1xuICAgICAgfVxuICAgIH0sXG4gICAgdXJsOiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBCdWlsZCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmlkLnRoZW4oaWQgPT4gYC9idWlsZHMvJHtpZH1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIEJ1aWxkZXIpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5pZC50aGVuKGlkID0+IGAvYnVpbGRlcnMvJHtpZH1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcm91dGVyLmdldCgnLycsIGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkge1xuICAgIGNvbnN0IGJ1aWxkZXJzID0gbW9kZWwuYnVpbGRlcnMoKTtcbiAgICBjb25zdCBidWlsZHMgPSBtb2RlbC5idWlsZHMoKTtcblxuICAgIFByb21pc2UuYWxsKFtcbiAgICAgIGJ1aWxkZXJzLnRoZW4oYnVpbGRlcnMgPT4gUHJvbWlzZS5hbGwoYnVpbGRlcnMubWFwKGJ1aWxkZXIgPT4gYnVpbGRlci5pZCkpKSxcbiAgICAgIGJ1aWxkcy50aGVuKGJ1aWxkcyA9PiBQcm9taXNlLmFsbChidWlsZHMubWFwKGJ1aWxkID0+IGJ1aWxkLmlkKSkpLFxuICAgICAgYnVpbGRzLnRoZW4oYnVpbGRzID0+IGJ1aWxkcy5maWx0ZXIoYnVpbGQgPT4gYnVpbGQuc3RhdGUgPT09IHN0YXRlLlBFTkRJTkcpKVxuICAgIF0pLnRoZW4oKFsgYnVpbGRlcnMsIGJ1aWxkcywgcGVuZGluZyBdKSA9PiAoeyBidWlsZGVycywgYnVpbGRzLCBwZW5kaW5nIH0pKS50aGVuKHNlbmQocmVzKSwgZXJyb3IocmVzKSk7XG4gIH0pO1xuXG4gIHJvdXRlci5nZXQoJy9idWlsZGVycycsIGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkge1xuICAgIG1vZGVsLmJ1aWxkZXJzKClcbiAgICAgIC50aGVuKGJ1aWxkZXJzID0+IGJ1aWxkZXJzLm1hcChidWlsZGVyID0+IGJ1aWxkZXIuZGF0YSkpXG4gICAgICAudGhlbihzZW5kKHJlcyksIGVycm9yKHJlcykpO1xuICB9KTtcblxuICByb3V0ZXIuZ2V0KCcvYnVpbGRzJywgZnVuY3Rpb24gKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgbW9kZWwuYnVpbGRzKClcbiAgICAgIC50aGVuKGJ1aWxkcyA9PiBidWlsZHMubWFwKGJ1aWxkID0+IGJ1aWxkLmRhdGEpKVxuICAgICAgLnRoZW4oc2VuZChyZXMpLCBlcnJvcihyZXMpKTtcbiAgfSk7XG5cbiAgcm91dGVyLmdldCgnL2xhdGVzdCcsIGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkge1xuICAgIG1vZGVsLmJ1aWxkcygpXG4gICAgICAudGhlbihidWlsZHMgPT4gYnVpbGRzWyAwIF0uZGF0YSlcbiAgICAgIC50aGVuKHNlbmQocmVzKSwgZXJyb3IocmVzKSk7XG4gIH0pO1xuXG4gIHJldHVybiByb3V0ZXI7XG59XG5cbmZ1bmN0aW9uIHNlbmQocmVzKSB7XG4gIHJldHVybiBkYXRhID0+IHJlcy5zZW5kKGRhdGEpO1xufVxuXG5mdW5jdGlvbiBlcnJvcihyZXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChlcnIpIHtcbiAgICByZXMuc3RhdHVzKDUwMCk7XG4gICAgcmVzLnNlbmQoe1xuICAgICAgbWVzc2FnZTogZXJyLnRvU3RyaW5nKClcbiAgICB9KTtcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBwbWFwKHByb21pc2UsIGNhbGxiYWNrKSB7XG4gIHJldHVybiBwcm9taXNlLnRoZW4obGlzdCA9PiBQcm9taXNlLmFsbChsaXN0Lm1hcChjYWxsYmFjaykpKTtcbn1cblxuZnVuY3Rpb24gcGZtYXAocHJvbWlzZSwgY2FsbGJhY2spIHtcbiAgcmV0dXJuIHBtYXAocHJvbWlzZSwgY2FsbGJhY2spLnRoZW4obGlzdHMgPT4gW10uY29uY2F0KCAuLi5saXN0cyApKTtcbn1cblxuZnVuY3Rpb24gYnVpbGRlcnMoYWRhcHRlcikge1xuICByZXR1cm4gcG1hcChhZGFwdGVyLmdldEJ1aWxkZXJzKCksIGZ1bmN0aW9uIChidWlsZGVyKSB7XG4gICAgcmV0dXJuIHBtYXAoYWRhcHRlci5nZXRCdWlsZHMoYnVpbGRlciksIGZ1bmN0aW9uIChidWlsZCkge1xuICAgICAgcmV0dXJuIGlkKGJ1aWxkKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChidWlsZHMpIHtcbiAgICAgIHJldHVybiBpZChidWlsZGVyKS50aGVuKGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICBodG1sX3VybDogYnVpbGRlci5odG1sX3VybCxcbiAgICAgICAgICBuYW1lOiBidWlsZGVyLm5hbWUsXG4gICAgICAgICAgYnVpbGRzOiBidWlsZHNcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYnVpbGRzKGFkYXB0ZXIpIHtcbiAgcmV0dXJuIHBmbWFwKGFkYXB0ZXIuZ2V0QnVpbGRlcnMoKSwgYWRhcHRlci5nZXRCdWlsZHMpLnRoZW4oZnVuY3Rpb24gKGJ1aWxkcykge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3Qgc29ydGVkID0gYnVpbGRzLnNvcnQoIChhLCBiKSA9PiAoYi5lbmQgfHwgbm93KS5nZXRUaW1lKCkgLSAoYS5lbmQgfHwgbm93KS5nZXRUaW1lKCkgKTtcblxuICAgIHJldHVybiBQcm9taXNlLmFsbChzb3J0ZWQubWFwKGZ1bmN0aW9uIChidWlsZCkge1xuICAgICAgcmV0dXJuIGlkKGJ1aWxkKS50aGVuKGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICBodG1sX3VybDogYnVpbGQuaHRtbF91cmwsXG4gICAgICAgICAgbmFtZTogYnVpbGQubmFtZSxcbiAgICAgICAgICBudW1iZXI6IGJ1aWxkLm51bWJlcixcbiAgICAgICAgICBzdGF0ZTogYnVpbGQuc3RhdGUsXG4gICAgICAgICAgc3RhcnQ6IGJ1aWxkLnN0YXJ0LFxuICAgICAgICAgIGVuZDogYnVpbGQuZW5kXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICB9KSk7XG4gIH0pO1xufVxuIl19