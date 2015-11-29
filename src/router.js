import express from 'express';
import { state } from 'ci-adapter';
import { inherits } from 'util';
import UUID from 'uuid-1345';

export function Router(adapter, options) {
  const router = express.Router();
  const model = adapter;

  router.get('/', function (req, res, next) {
    builds(adapter).then(function (builds) {
      return {
        builds: builds.map(build => build.id),
        latest: builds[0]
      };
    });
  });

  router.get('/builders', function (req, res, next) {
    builders(adapter).then(send(res), error(res));
  });

  router.get('/builds', function (req, res, next) {
    builds(adapter).then(send(res), error(res));
  });

  router.get('/latest', function (req, res, next) {
    builds(adapter).then(function (builds) {
      return builds[0];
    }).then(send(res), error(res));
  });

  return router;
}

function send(res) {
  return data => res.send(data);
}

function error(res) {
  return err => res.status(500).send(err);
}

function uuid(url) {
  return new Promise(function (resolve, reject) {
    UUID.v5({
      namespace: UUID.namespace.url,
      name: url
    }, function (err, uuid) {
      if (err) return reject(err);
      resolve(uuid);
    });
  });
}


function pmap(promise, callback) {
  return promise.then(list => Promise.all(list.map(callback)));
}

function pfmap(promise, callback) {
  return pmap(promise, callback).then(lists => [].concat( ...lists ));
}

function builders(adapter) {
  return pmap(adapter.getBuilders(), function (builder) {
    return pmap(adapter.getBuilds(builder), function (build) {
      return uuid(build.url);
    }).then(function (builds) {
      return uuid(builder.url).then(function (uuid) {
        return {
          id: uuid,
          name: builder.name,
          builds: builds
        };
      });
    });
  });
}

function builds(adapter) {
  return pfmap(adapter.getBuilders(), adapter.getBuilds).then(function (builds) {
    const sorted = builds.sort( (a, b) => b.end.getTime() - a.end.getTime() );
    console.log( sorted );

    return Promise.all(sorted.map(function (build) {
      return uuid(build.url).then(function (uuid) {
        return {
          id: uuid,
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
