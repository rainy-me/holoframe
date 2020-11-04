import { ref, watchEffect, inject, computed } from "vue";
import { StreamItem } from "@/utils";

const __holoframe__ = `__holoframe__`;

const savedStreams: StreamItem[] =
  JSON.parse(localStorage.getItem(__holoframe__) ?? "[]") ?? [];

export const stateSymbol = Symbol(__holoframe__);

export const createStore = () => {
  const streams = ref<StreamItem[]>(savedStreams);
  const streamIds = computed(() => streams.value.map((s) => s.id));

  watchEffect(() => {
    const data = JSON.stringify(streams.value);
    localStorage.setItem(__holoframe__, data);
  });

  const muted = ref(false);

  return {
    muted,
    streams,
    streamIds,
    addStream(id: string) {
      streams.value.push({ id, muted: muted.value });
    },
    removeStream(id: string) {
      streams.value = streams.value.filter((x) => x.id !== id);
    },
    clearStreams() {
      streams.value = [];
    },
    toggleMuteAll() {
      muted.value = !muted.value;
      streams.value = streams.value.map((x) => ({ ...x, muted: muted.value }));
    },
    focusMute(id: string) {
      streams.value = streams.value.map((x) => {
        return { ...x, muted: x.id !== id };
      });
    },
  };
};

export const useState = () =>
  inject(stateSymbol) as ReturnType<typeof createStore>;
