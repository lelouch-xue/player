class ArtInfo implements IArtInfo {
  container: HTMLDivElement;
  template!: TArtInfoTmpl;

  constructor(options) {
    this.container = options.container;

    this.init();
  }

  init() {
    const _info = ".atplayer-video-info-panel--wrap";
    const infopanel: HTMLDivElement = <HTMLDivElement>(
      this.container.querySelector(`${_info}`)
    );

    const home: HTMLDivElement = <HTMLDivElement>(
      (infopanel ?? this.container).querySelector('[data-value="home"]')
    );
    const link: HTMLDivElement = <HTMLDivElement>(
      (infopanel ?? this.container).querySelector('[data-value="link"]')
    );
    const version: HTMLDivElement = <HTMLDivElement>(
      (infopanel ?? this.container).querySelector('[data-value="version"]')
    );
    const verinput: HTMLInputElement = <HTMLInputElement>(
      (infopanel ?? this.container).querySelector("#info-version")
    );
    const linkinput: HTMLInputElement = <HTMLInputElement>(
      (infopanel ?? this.container).querySelector("#info-link")
    );
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

export interface IArtInfo {
  container: HTMLDivElement;
  template: {
    infopanel: HTMLDivElement;
    home: HTMLDivElement;
    link: HTMLDivElement;
    version: HTMLDivElement;
    verinput: HTMLInputElement;
    linkinput: HTMLInputElement;
    [args: string]: HTMLElement;
  };
}

export type TArtInfoTmpl = IArtInfo["template"];

export default ArtInfo;
