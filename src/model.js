
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
  const build = bindModel(Build, properties);

  this.builder = builder;
  this.build = build;
  this.builders = builders;
  this.builds = builds;

  function builders() {
    return adapter.getBuilders()
      .then(builders => Promise.all(builders.map(data => this.builder(data))));
  }

  function builds(...builders) {
    if (builders.length === 0) {
      return this.builders().then(builders => builds(...builders));
    } else if (builders.length === 1) {
      return adapter.getBuilds(builders[ 0 ].data)
        .then(builds => Promise.all(builds.map(data => build(data))));
    } else {
      return Promise.all(builders.map(builder => builds(builder)))
        .then(builds => [].concat(...builds));
    }
  }
}

export function Builder(data) {
  this.data = data;
}

export function Build(data) {
  this.data = data;
}
