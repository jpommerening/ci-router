import UUID from 'uuid-1345';

export function id(data) {
  return new Promise(function (resolve, reject) {
    UUID.v5({
      namespace: UUID.namespace.url,
      name: data.url
    }, function (err, uuid) {
      if (err) return reject(err);
      resolve(uuid);
    });
  });
}
