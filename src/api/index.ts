import { Stream } from "@/utils";

interface APIResponse<T> {
  data?: T;
  error?: any;
}
const shouldMock = process.env.NODE_ENV === "development" && true;

const withData = (data: any) =>
  ({
    method: "post",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  } as const);

export default {
  async fetchStreams(vtbs: string[]): Promise<APIResponse<Stream[]>> {
    if (shouldMock) {
      return (await import("./mock")).streams as any;
    }

    const res = await fetch(
      "https://api.yue.coffee/api/tv/v1.1",
      withData(vtbs)
    );
    return res.json();
  },
  async fetchTitle(id: string): Promise<APIResponse<{ title: string }>> {
    if (shouldMock) {
      return { data: { title: "mock_title" } };
    }
    const res = await fetch(
      "https://api.yue.coffee/api/v1/page-title",
      withData({
        url: `https://www.youtube.com/watch?v=${id}`,
      })
    );
    return res.json();
  },
};
