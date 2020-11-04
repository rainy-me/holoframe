export * from "./types";

export function createIframe(videoId: string) {
  return new window.YT.Player(videoId, {
    videoId,
    events: {
      onReady(event) {
        event.target.playVideo();
      },
      onStateChange() {},
    },
  });
}
