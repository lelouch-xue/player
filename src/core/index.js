/**
 * @Author: Xuejian
 * @Date: 2021-05-26 15:21:24
 * @ModifiedBy: Xuejian
 * @ModifiedTime: 2021-05-26 15:21:24
 */

import TplPlayer from './template/TplPlayer';
import '~css/index.scss';

class Player {
  // 容器
  // target tag

  constructor(options) {
    console.log(options.container);
    this.options = options;
    this.container = options.container;

    const _dom = document.querySelector(options.container);
    this.container = _dom ?? undefined;
    console.log(_dom);
    // eslint-disable-next-line no-unused-vars
    const playerTpl = new TplPlayer({
      container: this.container,
    });
  }

  /**
   * 初始化播放器
   */
  init() {}

  // static get version() {
  //   // eslint-disable-next-line no-undef
  //   return GLOBAL_VERSION;
  // }
}

export default Player;
