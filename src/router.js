import express from 'express';
import { state } from 'ci-adapter';
import { inherits } from 'util';
import { parse as parseUrl } from 'url';
import { id } from './id';
import { Model, Build, Builder } from './model';

export function Router(adapter, options) {
  const router = express.Router();
  const model = Model(adapter, {
    id: {
      get: function () {
        return id(this.data);
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
    ]).then(([ builders, builds, pending ]) => ({ builders, builds, pending })).then(send(req, res), error(res));
  });

  router.get('/builders', function (req, res, next) {
    model.builders()
      .then(builders => Promise.all(builders.map(builderData(req))))
      .then(send(req, res), error(res));
  });

  router.get('/builds', function (req, res, next) {
    model.builds()
      .then(builds => Promise.all(builds.map(buildData(req))))
      .then(send(req, res), error(res));
  });

  router.get('/latest', function (req, res, next) {
    model.builds()
      .then(builds => buildData(req)(builds[ 0 ]))
      .then(send(req, res), error(res));
  });

  return router;
}


function getBaseUrl(req) {
  function first(string) {
    return string && string.split(/\s*,\s*/)[0];
  }

  const proto = first(req.headers['x-forwarded-proto']) || ( req.socket.encrypted ? 'https' : 'http' );
  const host = first(req.headers['x-forwarded-host']) || req.headers.host;
  const base = req.baseUrl || '';
  return `${proto}://${host}${base}`
}

function builderData(req) {
  const endpoint = getBaseUrl(req);
  return function (builder) {
    return builder.id.then(function (id) {
      const url = `${endpoint}/builder/${id}`;
      const urls = [ builder.data.url ].concat(builder.data.data.urls || []);
      const data = Object.assign({}, builder.data, { url, data: { urls }});
      return data;
    });
  };
}

function buildData(req) {
  const endpoint = getBaseUrl(req);
  return function (build) {
    return build.id.then(function (id) {
      const url = `${endpoint}/builder/${id}`;
      const urls = [ build.data.url ].concat(build.data.data.urls || []);
      const data = Object.assign({}, build.data, { url, data: { urls }});
      return data;
    });
  };
}

function send(req, res) {
  const url = req.parsedUrl || parseUrl(req.url, true);
  const pretty = !!(url.query.pretty);
  return function (data) {
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(data, null, pretty && 2));
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
