import UUID from 'uuid-1345';

export function id(data) {
  return new Promise(function (resolve, reject) {
    function callback(err, uuid) {
      if (err) return reject(err);
      resolve(uuid);
    }

    if (data.url) {
      UUID.v5({
        namespace: UUID.namespace.url,
        name: data.url
      }, callback);
    } else {
      UUID.v4(callback);
    }
  });
}
