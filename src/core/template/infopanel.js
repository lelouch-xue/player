/**
 * @Author: Xuejian
 * @Date: 2021-06-16 14:50:25
 * @ModifiedBy: Xuejian
 * @ModifiedTime: 2021-06-16 14:50:25
 */

class TplInfoPanel {
  constructor(options) {
    this.container = options.container;
    this.options = options.options;

    this.init();
  }

  init() {
    const _info = '.atplayer-video-info-panel--wrap';
    const infopanel = this.container.querySelector(`${_info}`);

    const home = (infopanel ?? this.container).querySelector('[data-value="home"]');
    const link = (infopanel ?? this.container).querySelector('[data-value="link"]');
    const version = (infopanel ?? this.container).querySelector('[data-value="version"]');
    const verinput = (infopanel ?? this.container).querySelector('#info-version');
    const linkinput = (infopanel ?? this.container).querySelector('#info-link');
    this.template = {
      infopanel,
      home,
      link,
      version,
      verinput,
      linkinput,
    };
  }
}

export default TplInfoPanel;
