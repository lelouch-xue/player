import Player from '~/core/index';
import { getLiveInfo } from '../src/core/api';

const player1 = new Player({
  container: '#my-player1',
  live: false,
  video: {
    loop: false,
    url: 'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
    autoplay: true,
    muted: true,
    type: 'mp4',
  },
  danmaku: {
    active: false,
  },
});

const btn01 = document.getElementById('btn-sendDanma-01');
const btn02 = document.getElementById('btn-sendDanma-02');
const btn03 = document.getElementById('btn-sendDanma-03');
const input = document.getElementById('input-text');

btn01.onclick = function () {
  const msg = input.value;
  player1.addBarrage({
    text: msg,
    isnew: true,
  });
};

btn02.onclick = function () {
  const msg = input.value;
  Array(15)
    .fill(0)
    .forEach((item, index) => {
      player1.addBarrage({
        text: `${msg} --${index}`,
      });
    });
};
btn03.onclick = function () {
  const msg = input.value;
  Array(100)
    .fill(0)
    .forEach((item, index) => {
      player1.addBarrage({
        text: `${msg} --${index}`,
      });
    });
};
const player2 = new Player({
  container: '#my-player2',
  live: false,
  video: {
    loop: false,
    url: 'http://vc9-tx2-pl-agv.autohome.com.cn/video-5/889E92CFB4EAA501/2021-07-19/76E546C722FF157D6F15C4841F4F2CE2-300/index.m3u8?key=8A48019BFC9FBEFC342D97F85362CBE4',
    autoplay: true,
    type: 'hls',
  },
  danmaku: {
    active: false,
  },
});
// const player2 = new Player({
//   container: '#my-player2',
//   live: false,
//   video: {
//     loop: false,
//     url: 'http://hdllive-sale.autohome.com.cn/athmlive-sale/z1_athmlive-sale_102111.flv',
//     autoplay: true,
//     type: 'flv',
//     muted: false,
//   },
//   danmaku: {
//     active: false,
//   },
// });
console.log(111)
getLiveInfo(103054).then((res) => console.log(res));
