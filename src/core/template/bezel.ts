class TplBezel implements IArtBezel {
  container: HTMLDivElement;
  template: TArtBezelTmpl;

  constructor(options) {
    this.container = options.container;
    console.log(this.container);
    this.init();
  }

  init() {
    const _bezel = ".atplayer-video-bezel--wrap";
    const bezel = this.container.querySelector(`${_bezel}`);

    const icon = (bezel ?? this.container).querySelector(
      ".atplayer-bezel-icon"
    ) as HTMLDivElement;

    this.template = {
      icon,
    };
  }
}

export interface IArtBezel {
  container: HTMLDivElement;
  template?: {
    icon: HTMLDivElement;
  };
}

export type TArtBezelTmpl = IArtBezel["template"];

export default TplBezel;
