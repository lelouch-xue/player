import _debug from '../utils/console';

class Bezel {
  constructor(bezel) {
    this.bezel = bezel;

    this.bezel.addEventListener('animationend', () => {
      this.bezel.classList.remove('atplayer-bezel-transition');
    });
  }

  switch(icon) {
    this.bezel.innerHTML = icon;
    this.bezel.classList.add('atplayer-bezel-transition');
  }
}

export default Bezel;
