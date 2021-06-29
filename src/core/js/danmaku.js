import Danmaku from 'danmaku/dist/esm/danmaku.dom.js';
import utils from '../utils';

function random() {
  return Math.floor(Math.random() * 10 + 1);
}
/**
 * 弹幕队列管理池
 * 执行方案参考yplayer,15条逐次添加
 */
class DanmakuPool {
  constructor(options) {
    this._danmuQueue = [];
    this._danmuQueueClone = [];
    console.log(options, options.video);
    this.danmaku = new Danmaku({
      container: document.getElementById('atplayer-video-danmaku-pool'),
      media: options.video,
      engine: 'DOM',
      comments: [],
      speed: 144,
    });
  }

  /**
   *
   * @returns
   */
  run() {
    const dm = this.danmaku;
    let queue = this._danmuQueue;
    let clone = this._danmuQueueClone;
    if (!clone.length || !dm) return;
    if (clone.length > 15) clone.length = 15;
    queue.push(...clone);
    clone.length = 0;
    const step = queue.splice(0, 15);
    for (let i = 0, len = step.length; i < len; i++) {
      const _f = step.shift();
      (async function (item) {
        await utils.delay(parseInt(random() * 100), () => {
          dm.emit(item); // 真正展示弹幕
        });
      })(_f);
    }
  }

  add(opts = {}) {
    if (!this.danmaku) return;
    // 别人发的弹幕默认样式
    const baseOpts = {
      text: '',
      mode: 'rtl',
      style: {
        fontSize: '22px',
        color: '#ffffff',
        // border: '1px solid #337ab7',
        // textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000'
      },
    };
    // 自己发的弹幕默认样式
    const newOpts = {
      text: '',
      mode: 'rtl',
      style: {
        fontSize: '24px',
        color: '#ff0000',
        // border: '1px solid #337ab7',
        textShadow: '-1px -1px #c00101, -1px 1px #c00101, 1px -1px #c00101, 1px 1px #c00101',
      },
    };
    if (opts.isnew) {
      this._danmuQueueClone.unshift(Object.assign({}, newOpts, opts));
    } else {
      this._danmuQueueClone.push(Object.assign({}, baseOpts, opts));
    }
  }

  pause() {
    this.danmaku.pause = true;
  }

  play() {
    this.danmaku.pause = false;
  }

  resize() {
    this.danmaku.resize();
  }

  clear() {
    this._danmuQueue = [];
    this._danmuQueueClone = [];
    this.danmaku.clear();
  }
}

export default DanmakuPool;
