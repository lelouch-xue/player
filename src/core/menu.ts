import type IPlayer from "./player";

class ContextMenu {
  player: IPlayer;
  isshow: boolean;
  constructor(player) {
    this.player = player;
    this.isshow = false;

    document.addEventListener("contextmenu", (evt: MouseEvent) => {
      const container = this.player.container;
      if (!container.contains(<HTMLElement>evt.target) && this.isshow) {
        this.hide();
      }
    });

    this.player.container.addEventListener("contextmenu", (e) => {
      const event: MouseEvent = e || <MouseEvent>window.event;
      event.preventDefault();

      const clientRect = this.player.container.getBoundingClientRect();
      this.show(
        event.clientX - clientRect.left,
        event.clientY - clientRect.top
      );
    });

    document.addEventListener("click", (evt) => {
      const info = this.player.template.info.infopanel;
      if (!info.contains(<HTMLElement>evt.target)) this.hide();
    });
  }

  show(x, y) {
    const info = this.player.template.info.infopanel;
    info.classList.add("atplayer-video-info-panel-show");

    const clientRect = this.player.container.getBoundingClientRect();
    if (x + info.offsetWidth >= clientRect.width) {
      info.style.right = clientRect.width - x + "px";
      info.style.left = "initial";
    } else {
      info.style.left = x + "px";
      info.style.right = "initial";
    }
    if (y + info.offsetHeight >= clientRect.height) {
      info.style.bottom = clientRect.height - y + "px";
      info.style.top = "initial";
    } else {
      info.style.top = y + "px";
      info.style.bottom = "initial";
    }

    this.isshow = true;
    // this.player.events.trigger('contextmenu_show');
  }

  hide() {
    const info = this.player.template.info.infopanel;
    info.classList.remove("atplayer-video-info-panel-show");

    this.isshow = false;
    // this.player.events.trigger('contextmenu_hide');
  }
}

export default ContextMenu;
