
function bindModel(ctor, ...properties) {
  const props = Object.assign({
    constructor: {
      value: constructor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  }, ...properties);
  const proto = Object.create(ctor.prototype, props);

  constructor.prototype = proto;

  return constructor;

  function constructor(data) {
    if (!(this instanceof constructor)) {
      return new constructor(data);
    }
    ctor.call(this, data);
  }
}

export function Relation() {
}

export function Entity() {
}

export function Model(adapter, properties = {}) {
  if (!(this instanceof Model)) {
    return new Model(adapter, properties);
  }

  this.ids = [];
  this.objects = {
  };

  this.adapter = adapter;

  const builder = bindModel(Builder, properties, {
    builds: {
      get: function () {
        return builds(this);
      }
    }
  });
  const build = bindModel(Build, properties, {
    builder: {
      get: function () {
        return Promise.resolve(null);
      }
    }
  });

  this.builder = builder;
  this.build = build;
  this.builders = builders;
  this.builds = builds;

  function builders() {
    return adapter.getInfo()
      .then(info => adapter.getBuilders(info))
      .then(builders => Promise.all(builders.map(data => this.builder(data))));
  }

  function cmp(a, b) {
    const now = new Date();
    return (b.end || now).getTime() - (a.end || now).getTime();
  }

  function builds(...builders) {
    return ((builders.length === 0) ? this.builders() : Promise.all(builders))
      .then(builders => Promise.all(builders.map(builder => adapter.getBuilds(builder.data))))
      .then(builds => [].concat(...builds).sort(cmp))
      .then(builds => builds.map(data => build(data)));
  }
}

export function Builder(data) {
  this.data = data;
}

export function Build(data) {
  this.data = data;
}
