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
        return this.data.then(id);
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
    builds(adapter).then(function (builds) {
      return {
        builds: builds.map(build => build.id),
        latest: builds[0]
      };
    });
  });

  router.get('/builders', function (req, res, next) {
    model.builders().then(send(res), error(res));
  });

  router.get('/builds', function (req, res, next) {
    model.builds().then(send(res), error(res));
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
