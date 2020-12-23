import { VTB, StreamItem } from "./types";
import vtbs from "../assets/vtbs.json";

export * from "./types";

export function createIframe(
  videoId: string,
  options?: ConstructorParameters<typeof window.YT.Player>[1]
) {
  return new window.YT.Player(videoId, {
    videoId,
    events: {
      onReady(event) {
        event.target.playVideo();
      },
    },
    ...options,
  });
}

const createStorage = <T>(options: { key: string; init: T }) => {
  const { key, init } = options;
  return {
    get() {
      try {
        if (!key) return init;
        const stored = localStorage.getItem(key);
        if (!stored) return init;
        return JSON.parse(stored) as T;
      } catch {
        return init;
      }
    },
    set(value: T) {
      localStorage.setItem(key, JSON.stringify(value));
    },
  };
};

export const streamStorage = createStorage<StreamItem[]>({
  key: `__holoframe__.streams`,
  init: [],
});

export const vtbStorage = createStorage<Record<string, VTB>>({
  key: `__holoframe__.vtbs.v1`,
  init: Object.fromEntries(vtbs.map((v) => [v.nameJP, v])),
});
