type TUnit = boolean;

/**
 * 播放器设置选项
 */
interface IPlayerConfig {
  liveId?: string | number;
  setting?: {
    loop: boolean;
    muted: boolean;
    autoplay: boolean;
    volume: number;
  };
  danmaku?: {
    active: boolean;
  };
  preview?: {
    active: boolean;
  };
  mini?: {
    active: boolean;
  };
  [arg: string]: unknown;
}

/**
 * 播放器基础设置
 */
interface IPlayerDefaultConfig {
  liveId?: string | number;
  setting: {
    loop: boolean;
    muted: boolean;
    autoplay: boolean;
    volume: number;
  };
  danmaku: {
    active: boolean;
  };
  preview: {
    active: boolean;
  };
  mini: {
    active: boolean;
  };
}

interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [arg: string]: string | number | any;
}

interface IRes {
  returncode: number;
  message: string;
  result: {
    [args: string]: string | number;
  };
}

declare const Hls;

declare interface HTMLVideoElement {
  webkitEnterFullscreen(options?: FullscreenOptions): Promise<void>;
  webkitEnterFullScreen(options?: FullscreenOptions): Promise<void>;
}

declare interface HTMLDivElement {
  mozRequestFullScreen(options?: FullscreenOptions): Promise<void>;
  webkitRequestFullscreen(options?: FullscreenOptions): Promise<void>;
  msRequestFullscreen(options?: FullscreenOptions): Promise<void>;
}

declare interface Document {
  cancelFullScreen(): void;
  mozCancelFullScreen(): void;
  webkitCancelFullScreen(): void;
  webkitCancelFullscreen(): void;
  msCancelFullScreen(): void;
  msExitFullscreen(): void;
}
