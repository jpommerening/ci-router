import { Router } from './router';

export default function router(adapter, options) {
  return new Router(adapter, options);
}

// Make router() available as require('router')
Object.assign(router, exports);
module.exports = router;
