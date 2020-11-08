import { ref, reactive, watchEffect, inject, computed } from "vue";
import { VTB, StreamItem, streamStorage, vtbStorage } from "./utils";

export const stateSymbol = Symbol(`__holoframe__`);

export const createStore = () => {
  const streams = ref<StreamItem[]>(streamStorage.get());
  const streamIds = computed(() => streams.value.map((s) => s.id));

  const muted = ref(false);
  const vtbs = reactive<Record<string, VTB>>(vtbStorage.get());

  watchEffect(() => {
    streamStorage.set(streams.value);
  });

  return {
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
    muted,
    toggleMuteAll() {
      muted.value = !muted.value;
      streams.value = streams.value.map((x) => ({ ...x, muted: muted.value }));
    },
    focusMute(id: string) {
      streams.value = streams.value.map((x) => {
        return { ...x, muted: x.id !== id };
      });
    },
    vtbs,
    // setvtbs(names: string[]) {
    //   names.forEach((name) => {
    //     if (!vtbs[name]) return;
    //     vtbs[name].check = false;
    //   });
    //   vtbStorage.set(vtbs);
    // },
    getCheckedVtbs() {
      return Object.keys(vtbs).filter((k) => vtbs[k].check);
    },
    toggleVtb(name: string) {
      if (vtbs[name] === undefined) return;
      vtbs[name].check = !vtbs[name].check;
      vtbStorage.set(vtbs);
    },
  };
};

export const useState = () =>
  inject(stateSymbol) as ReturnType<typeof createStore>;
