import { Router } from './router';

export default function router(adapter, options) {
  return new Router(adapter, options);
}
