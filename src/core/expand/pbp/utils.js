import { ATHM_DEBUG } from './config';

/**
 * debuglog
 * @param  {...any} args
 */
export function _debugLog(...args) {
  var _console;

  for (var _len = args.length, msg = new Array(_len), _key = 0; _key < _len; _key++) {
    msg[_key] = args[_key];
  }

  ATHM_DEBUG && (_console = console).log.apply(_console, ['[PBP DEBUG]: '].concat(msg));
}

/**
 * 判断是否支持pbp
 * @returns
 */
export function _isSupport() {
  // if (!window.indexedDB) return false;
  // if (!window.MutationObserver || !window.WebKitMutationObserver || !window.MozMutationObserver) return false;
  // if (!window.Promise) return false;
  // if (!window.localStorage && !window.sessionStorage) return false;
  return true;
}
