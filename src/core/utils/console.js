/**
 * @Author: Xuejian
 * @Date: 2021-05-31 14:47:23
 * @ModifiedBy: Xuejian
 * @ModifiedTime: 2021-05-31 14:47:23
 */

import { DEBUG_ENABLE, DEUBG_PREFIX } from '../config';

const noop = () => {};

class Console {
  constructor(enabled = false) {
    this.enabled = window.console && enabled;

    if (this.enabled) {
      this.log('Debugging调试已开启');
    }
  }

  get log() {
    return this.enabled
      ? Function.prototype.bind.call(
          console.log,
          console,
          `%c${DEUBG_PREFIX} ::`,
          'color: white; background-color: grey;padding: 2px 5px'
        )
      : noop;
  }

  get warn() {
    return this.enabled
      ? Function.prototype.bind.call(
          console.warn,
          console,
          `%c${DEUBG_PREFIX} ::`,
          'color: orange; background-color: #393939;padding: 2px 5px'
        )
      : noop;
  }

  get error() {
    return this.enabled
      ? Function.prototype.bind.call(
          console.error,
          console,
          `%c${DEUBG_PREFIX} ::`,
          'color: red; background-color: black;padding: 2px 5px'
        )
      : noop;
  }
}

const _debug = new Console(DEBUG_ENABLE);

export default _debug;
