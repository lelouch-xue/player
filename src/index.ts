import Player from "./core/player";

new Player("#my-player", {
  container: "",
  // 是否直播
  // 视频源信息
  video: {
    type: "hls",
    loop: false, // 是否开启循环播放
    muted: false, // 是否开启静音
    autoplay: true, // 是否开启自动播放
    volume: 40, // 默认声音大小
  },
  danmaku: {
    active: false,
  },
  // 预览缩略图
  preview: {
    active: true, // 是否激活
  },
  mini: {
    active: true,
  },
});

export default Player;
