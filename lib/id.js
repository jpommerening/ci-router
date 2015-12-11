'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.id = id;

var _uuid = require('uuid-1345');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function id(data) {
  return new Promise(function (resolve, reject) {
    function callback(err, uuid) {
      if (err) return reject(err);
      resolve(uuid);
    }

    if (data.url) {
      _uuid2.default.v5({
        namespace: _uuid2.default.namespace.url,
        name: data.url
      }, callback);
    } else {
      _uuid2.default.v4(callback);
    }
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztRQUVnQixFQUFFLEdBQUYsRUFBRTs7Ozs7Ozs7QUFBWCxTQUFTLEVBQUUsQ0FBQyxJQUFJLEVBQUU7QUFDdkIsU0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDNUMsYUFBUyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRTtBQUMzQixVQUFJLEdBQUcsRUFBRSxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1QixhQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDZjs7QUFFRCxRQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFDWixxQkFBSyxFQUFFLENBQUM7QUFDTixpQkFBUyxFQUFFLGVBQUssU0FBUyxDQUFDLEdBQUc7QUFDN0IsWUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHO09BQ2YsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUNkLE1BQU07QUFDTCxxQkFBSyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDbkI7R0FDRixDQUFDLENBQUM7Q0FDSiIsImZpbGUiOiJpZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBVVUlEIGZyb20gJ3V1aWQtMTM0NSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpZChkYXRhKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgZnVuY3Rpb24gY2FsbGJhY2soZXJyLCB1dWlkKSB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycik7XG4gICAgICByZXNvbHZlKHV1aWQpO1xuICAgIH1cblxuICAgIGlmIChkYXRhLnVybCkge1xuICAgICAgVVVJRC52NSh7XG4gICAgICAgIG5hbWVzcGFjZTogVVVJRC5uYW1lc3BhY2UudXJsLFxuICAgICAgICBuYW1lOiBkYXRhLnVybFxuICAgICAgfSwgY2FsbGJhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICBVVUlELnY0KGNhbGxiYWNrKTtcbiAgICB9XG4gIH0pO1xufVxuIl19