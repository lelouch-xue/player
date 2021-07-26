class ArtLoading implements IArtLoading {
  container!: HTMLDivElement;
  template!: TArtLoadingTmpl;
  constructor(options) {
    this.container = options.container;

    this.init();
  }

  init() {
    const block = <HTMLDivElement>(
      this.container.querySelector(".atplayer-video-loading")
    );
    this.template = {
      block,
    };
  }
}

export interface IArtLoading {
  container: HTMLDivElement;
  template: {
    block: HTMLDivElement;
  };
}

export type TArtLoadingTmpl = IArtLoading["template"];

export default ArtLoading;
