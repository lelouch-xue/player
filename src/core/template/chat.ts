class ArtChat implements IArtChat {
  container!: HTMLDivElement;
  template!: TArtChatTmpl;

  constructor(options) {
    this.container = options.container;
    this.init();
  }

  init() {
    const _sendbar = ".atplayer-sendbar";
    const sendBar = document.querySelector(_sendbar) ?? this.container;

    const sendInput = <HTMLInputElement>(
      sendBar.querySelector("#atplayer-send-input")
    );
    const sendBtn = <HTMLButtonElement>(
      sendBar.querySelector("#atplayer-send-btn")
    );

    this.template = {
      sendInput,
      sendBtn,
    };
  }
}

export interface IArtChat {
  container: HTMLDivElement;
  template: {
    [arg: string]: HTMLElement;
  };
}

export type TArtChatTmpl = IArtChat["template"];

export default ArtChat;
