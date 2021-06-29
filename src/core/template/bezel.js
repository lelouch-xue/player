import _debug from '../utils/console';

/**
 * @Author: Xuejian
 * @Date: 2021-06-16 14:50:25
 * @ModifiedBy: Xuejian
 * @ModifiedTime: 2021-06-16 14:50:25
 */
class TplBezel {
  constructor(options) {
    this.container = options.container;
    this.options = options.options;
    console.log(this.container);
    this.init();
  }

  init() {
    const _bezel = '.atplayer-video-bezel--wrap';
    const bezel = this.container.querySelector(`${_bezel}`);

    const icon = (bezel ?? this.container).querySelector('.atplayer-bezel-icon');

    this.template = {
      icon,
    };
  }
}

export default TplBezel;
