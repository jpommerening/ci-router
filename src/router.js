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
  return data => res.send(data);
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
  return promise.then(list => Promise.all(list.map(callback)));
}

function pfmap(promise, callback) {
  return pmap(promise, callback).then(lists => [].concat( ...lists ));
}

function builders(adapter) {
  return pmap(adapter.getBuilders(), function (builder) {
    return pmap(adapter.getBuilds(builder), function (build) {
      return id(build);
    }).then(function (builds) {
      return id(builder).then(function (id) {
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
    const now = new Date();
    const sorted = builds.sort( (a, b) => (b.end || now).getTime() - (a.end || now).getTime() );

    return Promise.all(sorted.map(function (build) {
      return id(build).then(function (id) {
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
