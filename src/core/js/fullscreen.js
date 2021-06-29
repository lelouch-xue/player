import utils from '../utils';
import Icons from './icons';

const CLASS_PLAYER_FULLED = `atplayer-fulled`;
const CLASS_PLAYER_WEB_FIX = `atplayer-web-fullscreen-fix`;

class FullScreen {
  constructor(player) {
    this.player = player;
    this.lastScrollPosition = { left: 0, top: 0 };
    this.player.events.on('webfullscreen', () => {
      this.player.resize();
    });
    this.player.events.on('webfullscreen_cancel', () => {
      this.player.resize();
      utils.setScrollPosition(this.lastScrollPosition);
    });

    const fullscreenchange = () => {
      this.player.resize();
      if (this.isFullScreen('browser')) {
        this.player.events.trigger('fullscreen');
        this.switchFullIcon(true);
      } else {
        utils.setScrollPosition(this.lastScrollPosition);
        this.player.events.trigger('fullscreen_cancel');
        this.switchFullIcon(false);
      }
    };
    const docfullscreenchange = () => {
      const fullEle = document.fullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
      if (fullEle && fullEle !== this.player.container) {
        return;
      }
      this.player.resize();
      if (fullEle) {
        this.player.events.trigger('fullscreen');
        this.switchFullIcon(true);
      } else {
        utils.setScrollPosition(this.lastScrollPosition);
        this.player.events.trigger('fullscreen_cancel');
        this.switchFullIcon(false);
      }
    };
    if (/Firefox/.test(navigator.userAgent)) {
      document.addEventListener('mozfullscreenchange', docfullscreenchange);
      document.addEventListener('fullscreenchange', docfullscreenchange);
    } else {
      this.player.container.addEventListener('fullscreenchange', fullscreenchange);
      this.player.container.addEventListener('webkitfullscreenchange', fullscreenchange);
      document.addEventListener('msfullscreenchange', docfullscreenchange);
      document.addEventListener('MSFullscreenChange', docfullscreenchange);
    }
  }

  isFullScreen(type = 'browser') {
    switch (type) {
      case 'browser':
        return (
          document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement
        );
      case 'web':
        return this.player.container.classList.contains(CLASS_PLAYER_FULLED);
    }
  }

  request(type = 'browser') {
    const anotherType = type === 'browser' ? 'web' : 'browser';
    const anotherTypeOn = this.isFullScreen(anotherType);
    if (!anotherTypeOn) {
      this.lastScrollPosition = utils.getScrollPosition();
    }

    switch (type) {
      case 'browser':
        if (this.player.container.requestFullscreen) {
          this.player.container.requestFullscreen();
        } else if (this.player.container.mozRequestFullScreen) {
          this.player.container.mozRequestFullScreen();
        } else if (this.player.container.webkitRequestFullscreen) {
          this.player.container.webkitRequestFullscreen();
        } else if (this.player.video.webkitEnterFullscreen) {
          // Safari for iOS
          this.player.video.webkitEnterFullscreen();
        } else if (this.player.video.webkitEnterFullScreen) {
          this.player.video.webkitEnterFullScreen();
        } else if (this.player.container.msRequestFullscreen) {
          this.player.container.msRequestFullscreen();
        }
        break;
      case 'web':
        this.player.container.classList.add(CLASS_PLAYER_FULLED);
        document.body.classList.add(CLASS_PLAYER_WEB_FIX);
        this.player.events.trigger('webfullscreen');
        break;
    }

    if (anotherTypeOn) {
      this.cancel(anotherType);
    }

    this.switchFullIcon(true);
  }

  cancel(type = 'browser') {
    switch (type) {
      case 'browser':
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.webkitCancelFullscreen) {
          document.webkitCancelFullscreen();
        } else if (document.msCancelFullScreen) {
          document.msCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        break;
      case 'web':
        this.player.container.classList.remove(CLASS_PLAYER_FULLED);
        document.body.classList.remove(CLASS_PLAYER_WEB_FIX);
        this.player.events.trigger('webfullscreen_cancel');
        break;
    }

    this.switchFullIcon(false);
  }

  toggle(type = 'browser') {
    if (this.isFullScreen(type)) {
      this.cancel(type);
    } else {
      this.request(type);
    }
  }

  switchFullIcon(isFull) {
    console.log(Icons.fullscreenOff);
    this.player.template.controller.fullscreenIcon.innerHTML = isFull ? Icons.fullscreenOn : Icons.fullscreenOff;

    this.player.template.controller.fullscreenIcon.setAttribute('aria-label', isFull ? '取消全屏' : '全屏');
  }
}

export default FullScreen;
