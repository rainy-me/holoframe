import { ref, reactive, watchEffect, inject, computed } from "vue";
import { VTB, Stream, StreamItem, streamStorage, vtbStorage } from "./utils";

export const stateSymbol = Symbol(`__holoframe__`);

export const createStore = () => {
  const streams = ref<StreamItem[]>(streamStorage.get());
  const streamRecords = reactive<Record<string, Stream>>({});
  const streamIds = computed(() => streams.value.map((s) => s.id));

  const muted = ref(false);
  const fetching = ref(true);
  const vtbs = reactive<Record<string, VTB>>(vtbStorage.get());

  watchEffect(() => {
    streamStorage.set(streams.value);
  });

  const addStream = (id: string) => {
    if (streams.value.some((s) => s.id === id)) {
      return;
    }
    streams.value.push({ id, muted: muted.value });
  };

  async function fetchStreams() {
    fetching.value = true;
    await doFetch();
    fetching.value = false;

    async function doFetch() {
      const vtbs = getCheckedVtbs();
      Object.keys(streamRecords).forEach((k) => {
        if (vtbs.includes(k)) return;
        delete streamRecords[k];
      });

      if (!vtbs.length) {
        // streamRecords = {}
        return;
      }
      const res = await fetch("https://api.yue.coffee/api/tv/v1.1", {
        method: "post",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vtbs),
      });
      const { data, error }: { data: Stream[]; error: any } = await res.json();
      if (error) return;
      data.forEach((stream) => {
        stream.length = getRelativeTime(stream.startTime);
        streamRecords[stream.id] = stream;
      });
    }
  }
  async function fetchTitle(id: string) {
    streamRecords[id].title = "fetching...";
    const res = await fetch("https://api.yue.coffee/api/v1/page-title", {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: `https://www.youtube.com/watch?v=${id}`,
      }),
    });
    const { data, error } = await res.json();
    if (error) return;
    streamRecords[id].title = data.title;
  }
  const units: Record<string, number> = {
    year: 24 * 60 * 60 * 1000 * 365,
    month: (24 * 60 * 60 * 1000 * 365) / 12,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000,
  };

  const getRelativeTime = (timestamp: number) => {
    let elapsed = Date.now() - timestamp;
    let timeString: string[] = [];
    for (const u in units) {
      if (Math.abs(elapsed) > units[u]) {
        let count = Math.floor(elapsed / units[u]);
        // timeString.push(`${count} ${u}${count > 1 ? "s" : ""}`);
        timeString.push(`${count}`.padStart(2, "0"));
        elapsed -= count * units[u];
      }
    }
    return timeString.join(":") + " ago";
  };

  function updateStreamTime() {
    Object.values(streamRecords).forEach((stream) => {
      if (!stream.isStreaming) return;
      stream.length = getRelativeTime(stream.startTime);
    });
  }
  function removeStream(id: string) {
    streams.value = streams.value.filter((x) => x.id !== id);
  }
  function clearStreams() {
    streams.value = [];
  }
  function toggleMuteAll() {
    muted.value = !muted.value;
    streams.value = streams.value.map((x) => ({ ...x, muted: muted.value }));
  }
  function focusMute(id: string) {
    streams.value = streams.value.map((x) => {
      return { ...x, muted: x.id !== id };
    });
  }
  // setvtbs(names: string[]) {
  //   names.forEach((name) => {
  //     if (!vtbs[name]) return;
  //     vtbs[name].check = false;
  //   });
  //   vtbStorage.set(vtbs);
  // },
  function getCheckedVtbs() {
    return Object.keys(vtbs).filter((k) => vtbs[k].check);
  }
  function toggleVtb(name: string) {
    if (vtbs[name] === undefined) return;
    vtbs[name].check = !vtbs[name].check;
    vtbStorage.set(vtbs);
    fetchStreams();
  }

  function scrollToLiveStream() {
    let firstStreamingId: null | string = null;
    for (const data of Object.values(streamRecords)) {
      if (data.isStreaming) {
        firstStreamingId = data.id;
        break;
      }
    }
    setTimeout(() => {
      document.querySelector(`#stream-${firstStreamingId}`)?.scrollIntoView({
        behavior: "smooth",
      });
    });
  }

  return {
    fetching,
    muted,
    vtbs,
    streams,
    streamIds,
    streamRecords,
    addStream,
    fetchStreams,
    fetchTitle,
    updateStreamTime,
    removeStream,
    clearStreams,
    toggleMuteAll,
    focusMute,
    getCheckedVtbs,
    scrollToLiveStream,
    toggleVtb,
  };
};

export const useState = () =>
  inject(stateSymbol) as ReturnType<typeof createStore>;
