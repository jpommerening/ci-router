
function bindModel(ctor, properties) {
  const props = Object.assign({
    constructor: {
      value: constructor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  }, properties);
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


export function Model(adapter, properties = {}) {
  this.ids = [];
  this.objects = {
  };

  this.adapter = adapter;

  this.builder = bindModel(Builder, properties);
  this.build = bindModel(Build, properties);

  this.builders = function builders() {
    return adapter.getBuilders()
      .then(builders => Promise.all(builders.map(data => this.builder(data))));
  };
  this.builds = function builds(...builders) {
    if (builders.length === 0) {
      return this.builders().then(builders => this.builds(...builders));
    } else if (builders.length === 1) {
      return builders[ 0 ].data
        .then(data => this.adapter.getBuilds(data))
        .then(builds => Promise.all(builds.map(data => this.build(data))));
    } else {
      return Promise.all(builders.map(builder => this.builds(builder)))
        .then(builds => [].concat(...builds));
    }
  };
}

export function Builder(data) {
  this.data = data;
}

export function Build(data) {
  this.data = data;
}