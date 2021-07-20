const PREFIX = 'ATHM_PBP'; // 前缀

/**
 * 获取
 */
const get = (key, def) => {
  const _p = key.startsWith(PREFIX);
  if (!_p) key = `${PREFIX}_${key}`;
  var value = window.localStorage.getItem(key);

  if (value == null) {
    set(key, def);
  }

  return value || def;
};

/**
 * 设置
 */
const set = (key, value) => {
  const _p = key.startsWith(PREFIX);
  if (!_p) key = `${PREFIX}_${key}`;
  window.localStorage.setItem(key, value);
};

const clear = () => {
  window.localStorage.clear();
};

const storage = {
  get,
  set,
  clear,
};

export default storage;
