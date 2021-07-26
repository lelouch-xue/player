import loadjs from "loadjs";

/**
 * 加载 cdn js
 * @param url string or string[]
 * @returns promise
 */
const Loadjs = (url: string | Array<string>) => {
  return new Promise((_resolve, _reject) => {
    loadjs(url, {
      async: true,
      success: () => {
        _resolve(true);
      },
      error: () => {
        _reject(false);
      },
    });
  });
};

type TQuerysParams = {
  [args: string]: string;
};

const getUrlQuerys = (): TQuerysParams => {
  const s = location.search.length ? location.search.substring(1) : "";
  const a = s.length ? s.split("&") : [];
  const r: TQuerysParams = {};
  a.forEach((item) => {
    const t = item.split("=");
    r[decodeURIComponent(t[0])] = decodeURIComponent(t[1]);
  });
  return r;
};

/**
 * @function 去除 url 里面的协议头
 * @param { url: string } 要转换的地址
 * @return { string } 转换后的地址
 */
const deleteProtocol = (url): string => {
  if (!url) return "";
  return url.replace(/^http[s]*:/i, "");
};

export { Loadjs, getUrlQuerys, deleteProtocol };
