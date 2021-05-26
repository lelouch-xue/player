import playerTpl from '../../template/player.art';

class Player {
  constructor(option: any) {
    console.log(option)
    this.init();
  }

  init() {
    const str = playerTpl('', {
      top: '测试',
    });
    console.log(str);
  }
}


export default Player;
