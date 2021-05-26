/**
 * @Author: Xuejian
 * @Date: 2021-05-26 15:21:24
 * @ModifiedBy: Xuejian
 * @ModifiedTime: 2021-05-26 15:21:24
 */

import { test } from "~/core/utils/index";
import PlayerTpl from "~/core/component/playerTpl";
// import "~css/index.scss";

class Player {

  // 容器
  container: HTMLElement | undefined  = undefined;
  // target tag
  target: string = "";

  constructor(option: any) {
    const {
      el
    } = option;

    const _dom = document.querySelector(el);
    this.container = _dom ?? undefined;
    this.target = el;
    const playerTpl: any = new PlayerTpl({});

    this.container?.appendChild(playerTpl);
    test();
  }

  /**
   * 初始化播放器
   */
  init() {}
}

export default Player;
