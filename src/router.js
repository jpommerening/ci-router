import express from 'express';
import { state } from 'ci-adapter';
import { inherits } from 'util';
import { id } from './id';
import { Model, Build, Builder } from './model';

export function Router(adapter, options) {
  const router = express.Router();
  const model = Model(adapter, {
    id: {
      get: function () {
        return id(this.data);
      }
    },
    url: {
      get: function () {
        if (this instanceof Build) {
          return this.id.then(id => `/builds/${id}`);
        }
        if (this instanceof Builder) {
          return this.id.then(id => `/builders/${id}`);
        }
      }
    }
  });

  router.get('/', function (req, res, next) {
    const builders = model.builders();
    const builds = model.builds();

    Promise.all([
      builders.then(builders => Promise.all(builders.map(builder => builder.id))),
      builds.then(builds => Promise.all(builds.map(build => build.id))),
      builds.then(builds => builds.filter(build => build.state === state.PENDING))
    ]).then(([ builders, builds, pending ]) => ({ builders, builds, pending })).then(send(res), error(res));
  });

  router.get('/builders', function (req, res, next) {
    model.builders()
      .then(builders => builders.map(builder => builder.data))
      .then(send(res), error(res));
  });

  router.get('/builds', function (req, res, next) {
    model.builds()
      .then(builds => builds.map(build => build.data))
      .then(send(res), error(res));
  });

  router.get('/latest', function (req, res, next) {
    model.builds()
      .then(builds => builds[ 0 ].data)
      .then(send(res), error(res));
  });

  return router;
}

function send(res) {
  return function (data) {
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(data));
    res.end();
  }
  return data => res.json(data);
}

function error(res) {
  return function (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({ message: err.toString() }));
    res.end();
  };
}
