/**
 *
 * 整个播放器模板
 *
 * @Author: Xuejian
 * @Date: 2021-05-28 10:10:43
 * @ModifiedBy: Xuejian
 * @ModifiedTime: 2021-05-28 10:10:43
 */

import playerArt from '~art/player.art';

class TplPlayer {
  constructor(options) {
    const { container } = options;
    this.container = container;
    this.init();
  }

  init() {
    const html = playerArt({
      top: 1231231232134,
      array: [
        { type: 1, price: 10 },
        { type: 2, price: 12 },
        { type: 3, price: 18 },
      ],
    });
    this.container.innerHTML = html;

    // this.playBtn = this.container.querySelector('');
  }
}

export default TplPlayer;
