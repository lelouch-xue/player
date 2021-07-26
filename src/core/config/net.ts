import { deleteProtocol } from "@/utils";
import { getLiveInfo } from "../api";

interface ILiveInfo {
  poster?: string;
  isLive: boolean;
  url: string;
}

interface ILiveInfoResult {
  [args: string]: string;
}

/**
 * 通过直播间id获取信息
 * @param liveId 直播id
 * @returns ILiveInfo
 */
const getLiveInfoById = async (liveId: string | number) => {
  const { result, returncode } = await getLiveInfo(liveId);
  if (!returncode && result) {
    const { livepublishstatus, livehlsurl, livecover, videohlsurl } = <
      ILiveInfoResult
    >result;

    let info!: ILiveInfo;

    switch (+livepublishstatus) {
      case 0:
        break;
      case 1:
        info = {
          isLive: true,
          url: livehlsurl,
          poster: deleteProtocol(livecover),
        };
        break;
      case 2:
        info = {
          isLive: false,
          url: videohlsurl,
          poster: deleteProtocol(livecover),
        };
        break;
      case 3:
        break;
      default:
        break;
    }
    return Promise.resolve(info);
  } else {
    return Promise.reject("获取直播信息失败");
  }
};

export { getLiveInfoById };
