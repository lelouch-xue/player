/* eslint-disable no-unused-vars */
import DPlayer from '~/js/index';

const dp1 = new DPlayer({
  container: document.getElementById('my-player1'),
  autoplay: false,
  loop: true,
  video: {
    url: 'https://vc9-al1-pl-agv.autohome.com.cn/video-7/9C9DF5843CD64975/2021-06-02/B59E08FFE073ACCE6F15C4841F4F2CE2-0.mp4',
    type: 'auto',
  },
});

const dp2 = new DPlayer({
  container: document.getElementById('my-player2'),
  live: true,
  autoplay: true,
  video: {
    url: 'https://vc9-al1-pl-agv.autohome.com.cn/video-46/889E92CFB4EAA501/2021-05-21/6070A1532CA81F566F15C4841F4F2CE2-300/index.m3u8',
    type: 'hls',

    // type: 'customHls',
    // customType: {
    //   customHls: function (video, player) {
    //     // eslint-disable-next-line no-undef
    //     const hls = new Hls();
    //     hls.loadSource(video.src);
    //     hls.attachMedia(video);
    //   },
    // },
  },
});
