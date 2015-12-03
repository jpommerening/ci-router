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
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(data));
    res.end();
  };
  return function (data) {
    return res.json(data);
  };
}

function error(res) {
  return function (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({ message: err.toString() }));
    res.end();
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yb3V0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztRQU1nQixNQUFNLEdBQU4sTUFBTTs7Ozs7Ozs7Ozs7Ozs7OztBQUFmLFNBQVMsTUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUU7QUFDdkMsTUFBTSxNQUFNLEdBQUcsa0JBQVEsTUFBTSxFQUFFLENBQUM7QUFDaEMsTUFBTSxLQUFLLEdBQUcsV0FKUCxLQUFLLEVBSVEsT0FBTyxFQUFFO0FBQzNCLE1BQUUsRUFBRTtBQUNGLFNBQUcsRUFBRSxlQUFZO0FBQ2YsZUFBTyxRQVJOLEVBQUUsRUFRTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDdEI7S0FDRjtBQUNELE9BQUcsRUFBRTtBQUNILFNBQUcsRUFBRSxlQUFZO0FBQ2YsWUFBSSxJQUFJLG1CQVpBLEtBQUssQUFZWSxFQUFFO0FBQ3pCLGlCQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUEsRUFBRTtnQ0FBZSxFQUFFO1dBQUUsQ0FBQyxDQUFDO1NBQzVDO0FBQ0QsWUFBSSxJQUFJLG1CQWZPLE9BQU8sQUFlSyxFQUFFO0FBQzNCLGlCQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUEsRUFBRTtrQ0FBaUIsRUFBRTtXQUFFLENBQUMsQ0FBQztTQUM5QztPQUNGO0tBQ0Y7R0FDRixDQUFDLENBQUM7O0FBRUgsUUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsVUFBVSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRTtBQUN4QyxRQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDbEMsUUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDOztBQUU5QixXQUFPLENBQUMsR0FBRyxDQUFDLENBQ1YsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFBLFFBQVE7YUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQSxPQUFPO2VBQUksT0FBTyxDQUFDLEVBQUU7T0FBQSxDQUFDLENBQUM7S0FBQSxDQUFDLEVBQzNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNO2FBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSztlQUFJLEtBQUssQ0FBQyxFQUFFO09BQUEsQ0FBQyxDQUFDO0tBQUEsQ0FBQyxFQUNqRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTTthQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBQSxLQUFLO2VBQUksS0FBSyxDQUFDLEtBQUssS0FBSyxXQWhDMUQsS0FBSyxDQWdDMkQsT0FBTztPQUFBLENBQUM7S0FBQSxDQUFDLENBQzdFLENBQUMsQ0FBQyxJQUFJLENBQUM7OztVQUFHLFFBQVE7VUFBRSxNQUFNO1VBQUUsT0FBTzthQUFRLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUU7S0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztHQUN6RyxDQUFDLENBQUM7O0FBRUgsUUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsVUFBVSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRTtBQUNoRCxTQUFLLENBQUMsUUFBUSxFQUFFLENBQ2IsSUFBSSxDQUFDLFVBQUEsUUFBUTthQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQSxPQUFPO2VBQUksT0FBTyxDQUFDLElBQUk7T0FBQSxDQUFDO0tBQUEsQ0FBQyxDQUN2RCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0dBQ2hDLENBQUMsQ0FBQzs7QUFFSCxRQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxVQUFVLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFO0FBQzlDLFNBQUssQ0FBQyxNQUFNLEVBQUUsQ0FDWCxJQUFJLENBQUMsVUFBQSxNQUFNO2FBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUs7ZUFBSSxLQUFLLENBQUMsSUFBSTtPQUFBLENBQUM7S0FBQSxDQUFDLENBQy9DLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7R0FDaEMsQ0FBQyxDQUFDOztBQUVILFFBQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFVBQVUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUU7QUFDOUMsU0FBSyxDQUFDLE1BQU0sRUFBRSxDQUNYLElBQUksQ0FBQyxVQUFBLE1BQU07YUFBSSxNQUFNLENBQUUsQ0FBQyxDQUFFLENBQUMsSUFBSTtLQUFBLENBQUMsQ0FDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztHQUNoQyxDQUFDLENBQUM7O0FBRUgsU0FBTyxNQUFNLENBQUM7Q0FDZjs7QUFFRCxTQUFTLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFDakIsU0FBTyxVQUFVLElBQUksRUFBRTtBQUNyQixPQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0FBQ2xELE9BQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2hDLE9BQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztHQUNYLENBQUE7QUFDRCxTQUFPLFVBQUEsSUFBSTtXQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0dBQUEsQ0FBQztDQUMvQjs7QUFFRCxTQUFTLEtBQUssQ0FBQyxHQUFHLEVBQUU7QUFDbEIsU0FBTyxVQUFVLEdBQUcsRUFBRTtBQUNwQixPQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztBQUNyQixPQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0FBQ2xELE9BQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkQsT0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0dBQ1gsQ0FBQztDQUNIIiwiZmlsZSI6InJvdXRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgc3RhdGUgfSBmcm9tICdjaS1hZGFwdGVyJztcbmltcG9ydCB7IGluaGVyaXRzIH0gZnJvbSAndXRpbCc7XG5pbXBvcnQgeyBpZCB9IGZyb20gJy4vaWQnO1xuaW1wb3J0IHsgTW9kZWwsIEJ1aWxkLCBCdWlsZGVyIH0gZnJvbSAnLi9tb2RlbCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBSb3V0ZXIoYWRhcHRlciwgb3B0aW9ucykge1xuICBjb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xuICBjb25zdCBtb2RlbCA9IE1vZGVsKGFkYXB0ZXIsIHtcbiAgICBpZDoge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBpZCh0aGlzLmRhdGEpO1xuICAgICAgfVxuICAgIH0sXG4gICAgdXJsOiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBCdWlsZCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmlkLnRoZW4oaWQgPT4gYC9idWlsZHMvJHtpZH1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIEJ1aWxkZXIpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5pZC50aGVuKGlkID0+IGAvYnVpbGRlcnMvJHtpZH1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcm91dGVyLmdldCgnLycsIGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkge1xuICAgIGNvbnN0IGJ1aWxkZXJzID0gbW9kZWwuYnVpbGRlcnMoKTtcbiAgICBjb25zdCBidWlsZHMgPSBtb2RlbC5idWlsZHMoKTtcblxuICAgIFByb21pc2UuYWxsKFtcbiAgICAgIGJ1aWxkZXJzLnRoZW4oYnVpbGRlcnMgPT4gUHJvbWlzZS5hbGwoYnVpbGRlcnMubWFwKGJ1aWxkZXIgPT4gYnVpbGRlci5pZCkpKSxcbiAgICAgIGJ1aWxkcy50aGVuKGJ1aWxkcyA9PiBQcm9taXNlLmFsbChidWlsZHMubWFwKGJ1aWxkID0+IGJ1aWxkLmlkKSkpLFxuICAgICAgYnVpbGRzLnRoZW4oYnVpbGRzID0+IGJ1aWxkcy5maWx0ZXIoYnVpbGQgPT4gYnVpbGQuc3RhdGUgPT09IHN0YXRlLlBFTkRJTkcpKVxuICAgIF0pLnRoZW4oKFsgYnVpbGRlcnMsIGJ1aWxkcywgcGVuZGluZyBdKSA9PiAoeyBidWlsZGVycywgYnVpbGRzLCBwZW5kaW5nIH0pKS50aGVuKHNlbmQocmVzKSwgZXJyb3IocmVzKSk7XG4gIH0pO1xuXG4gIHJvdXRlci5nZXQoJy9idWlsZGVycycsIGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkge1xuICAgIG1vZGVsLmJ1aWxkZXJzKClcbiAgICAgIC50aGVuKGJ1aWxkZXJzID0+IGJ1aWxkZXJzLm1hcChidWlsZGVyID0+IGJ1aWxkZXIuZGF0YSkpXG4gICAgICAudGhlbihzZW5kKHJlcyksIGVycm9yKHJlcykpO1xuICB9KTtcblxuICByb3V0ZXIuZ2V0KCcvYnVpbGRzJywgZnVuY3Rpb24gKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgbW9kZWwuYnVpbGRzKClcbiAgICAgIC50aGVuKGJ1aWxkcyA9PiBidWlsZHMubWFwKGJ1aWxkID0+IGJ1aWxkLmRhdGEpKVxuICAgICAgLnRoZW4oc2VuZChyZXMpLCBlcnJvcihyZXMpKTtcbiAgfSk7XG5cbiAgcm91dGVyLmdldCgnL2xhdGVzdCcsIGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkge1xuICAgIG1vZGVsLmJ1aWxkcygpXG4gICAgICAudGhlbihidWlsZHMgPT4gYnVpbGRzWyAwIF0uZGF0YSlcbiAgICAgIC50aGVuKHNlbmQocmVzKSwgZXJyb3IocmVzKSk7XG4gIH0pO1xuXG4gIHJldHVybiByb3V0ZXI7XG59XG5cbmZ1bmN0aW9uIHNlbmQocmVzKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgcmVzLndyaXRlKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICByZXMuZW5kKCk7XG4gIH1cbiAgcmV0dXJuIGRhdGEgPT4gcmVzLmpzb24oZGF0YSk7XG59XG5cbmZ1bmN0aW9uIGVycm9yKHJlcykge1xuICByZXR1cm4gZnVuY3Rpb24gKGVycikge1xuICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwO1xuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgcmVzLndyaXRlKEpTT04uc3RyaW5naWZ5KHsgbWVzc2FnZTogZXJyLnRvU3RyaW5nKCkgfSkpO1xuICAgIHJlcy5lbmQoKTtcbiAgfTtcbn1cbiJdfQ==