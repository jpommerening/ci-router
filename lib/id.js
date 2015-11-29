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
    _uuid2.default.v5({
      namespace: _uuid2.default.namespace.url,
      name: data.url
    }, function (err, uuid) {
      if (err) return reject(err);
      resolve(uuid);
    });
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztRQUVnQixFQUFFLEdBQUYsRUFBRTs7Ozs7Ozs7QUFBWCxTQUFTLEVBQUUsQ0FBQyxJQUFJLEVBQUU7QUFDdkIsU0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDNUMsbUJBQUssRUFBRSxDQUFDO0FBQ04sZUFBUyxFQUFFLGVBQUssU0FBUyxDQUFDLEdBQUc7QUFDN0IsVUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHO0tBQ2YsRUFBRSxVQUFVLEdBQUcsRUFBRSxJQUFJLEVBQUU7QUFDdEIsVUFBSSxHQUFHLEVBQUUsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUIsYUFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2YsQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBQ0oiLCJmaWxlIjoiaWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVVVJRCBmcm9tICd1dWlkLTEzNDUnO1xuXG5leHBvcnQgZnVuY3Rpb24gaWQoZGF0YSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIFVVSUQudjUoe1xuICAgICAgbmFtZXNwYWNlOiBVVUlELm5hbWVzcGFjZS51cmwsXG4gICAgICBuYW1lOiBkYXRhLnVybFxuICAgIH0sIGZ1bmN0aW9uIChlcnIsIHV1aWQpIHtcbiAgICAgIGlmIChlcnIpIHJldHVybiByZWplY3QoZXJyKTtcbiAgICAgIHJlc29sdmUodXVpZCk7XG4gICAgfSk7XG4gIH0pO1xufVxuIl19