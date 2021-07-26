import { getLiveInfoById } from "./net";

const generate = async (id: number | string) => {
  return await getLiveInfoById(id);
};

export { generate };
