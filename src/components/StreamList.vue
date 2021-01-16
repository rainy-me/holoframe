<template>
  <div class="list">
    <div ref="list" />
    <vtb-list />
    <div v-if="fetching" class="fetching">
      <sync-icon animate />
    </div>
    <div v-else>
      <ul class="stream-list">
        <li
          v-for="(stream, i) in Object.values(streamRecords)"
          :id="`stream-${stream.id}`"
          :key="stream.id"
          :class="['stream', { 'is-streaming': stream.isStreaming }]"
          :tabindex="i"
          @click="addStream(stream.id)"
        >
          <div class="content">
            <span class="start">
              {{ formatTime(stream.startTime) }}
            </span>
            <span
              class="member"
              :style="{
                '--member--color': stream.members[0].color ?? '#ccc',
              }"
            >
              {{ stream.members[0].name }}
            </span>
            <span :class="['producer', producerMap[stream.producer]]">{{
              stream.producer
            }}</span>
            <span class="outlink">
              <a
                :href="stream.url"
                target="_blank"
                rel="nofollow noopener"
                @click.stop
              >
                <svg
                  class="icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  ></path>
                </svg>
              </a>
            </span>
          </div>
          <span class="title">
            <span v-if="stream.title">{{ stream.title }}</span>
            <span v-else @click.stop="fetchTitle(stream.id)"> get title </span>
          </span>
          <div class="detail">
            <img
              class="thumbnail"
              :src="stream.thumbnail"
              :alt="stream.title"
            />
            <span v-if="stream.isStreaming" class="is-streaming-text">
              LIVE
              <small class="time-relative"> started {{ stream.length }} </small>
            </span>
          </div>
        </li>
      </ul>
    </div>
    <svg
      class="up"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      @click="scrollToTop"
    >
      <path
        class="path"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M5 11l7-7 7 7M5 19l7-7 7 7"
      />
    </svg>
  </div>
</template>

<script lang="ts" setup="{ root }">
import { ref, onMounted } from "vue";
import type { Stream } from "@/utils";
import { useState } from "../store";
import SyncIcon from "./SyncIcon.vue";
import vtbList from "./VtbList.vue";

export default {
  components: {
    vtbList,
    SyncIcon,
  },
};

export const refs = ref<HTMLLIElement[]>([]);
export const {
  fetching,
  streamRecords,
  addStream,
  fetchTitle,
  fetchStreams,
  updateStreamTime,
  getCheckedVtbs,
  scrollToLiveStream,
} = useState();

onMounted(async () => {
  await fetchStreams();
  setInterval(() => {
    updateStreamTime();
  }, 1000);
  scrollToLiveStream();
});

const intl = new Intl.DateTimeFormat("default", {
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});

export const formatTime = (date: Date) => {
  return intl.format(date);
};

export const producerMap: Record<Stream["producer"], string> = {
  Hololive: "hololive",
  にじさんじ: "nijisanji",
};

export const list = ref<HTMLDivElement | null>(null);

export const scrollToTop = () => {
  list.value?.scrollIntoView({ block: "end", behavior: "smooth" });
};
</script>

<style scoped>
.list {
  margin: 0 10px;
}
.stream-list {
  overflow: scroll;
  list-style: none;
  font-size: 1rem;
  padding: 0;
  margin: 1rem 0;
}
.content {
  height: 1.6rem;
  transition: 0.1s all ease-in-out;
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  justify-content: space-between;
  gap: 1rem;
}

/* .content:hover { */
/* background-color: #666; */
/* } */

.stream {
  cursor: pointer;
  position: relative;
  background-color: rgba(0, 0, 0, 0.6);
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 1rem;
}

.is-streaming {
  border: 2px solid greenyellow;
}

.is-streaming-text {
  color: greenyellow;
  display: grid;
  place-items: center;
  font-weight: bold;
  font-size: 2rem;
}

.stream:hover {
  background-color: #333;
}

/* .stream:hover .thumbnail {
  opacity: 1;
  transform: translateY(0);
} */

.start {
  color: #fff;
  /* background-color: #fff; */
  border-radius: 5px;
  display: grid;
  place-items: center;
}

.thumbnail {
  pointer-events: none;
  /* transition: 0.3s all ease-in-out; */
  /* opacity: 0; */
  /* transform: translateY(-10px); */
  /* position: absolute; */
  /* top: 1.6rem; */
  /* left: clac(50% - 160px); */
  width: 200px;
  height: 100px;
  /* background-color: #000; */
  /* box-shadow: 0 0 3px #333; */
  /* z-index: 100000000; */
}

.detail {
  display: grid;
  grid-template-columns: auto 1fr;
}

.member {
  color: #000;
  border-radius: 5px;
  background-color: var(--member--color);
  padding: 3px;
  display: grid;
  place-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.id {
  color: skyblue;
}
.outlink {
  color: #fff;
}
.title {
  color: yellowgreen;
  display: inline-block;
  cursor: pointer;
  margin: 5px 0 10px;
}
.time-relative {
  font-size: 1rem;
  color: #666;
  text-align: center;
}
.producer {
  display: grid;
  place-items: center;
  border-radius: 5px;
  background: #eee;
  color: rgb(48, 48, 48);
  width: 6rem;
}

.hololive {
  background: rgba(95, 220, 238);
  color: rgb(48, 48, 48);
}
.nijisanji {
  background: rgb(50, 76, 111);
  color: #fff;
}

.fetching {
  height: 2rem;
  margin: 2rem 0;
  text-align: center;
}
.up {
  transition: 0.3s all ease-in-out;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 1rem;
  padding: 5px;
  background: linear-gradient(30deg, gold, aqua);
  box-shadow: 0 0 4px #ccc;
  background-clip: content-box;
  opacity: 0.5;
  cursor: pointer;
}
.up:hover {
  opacity: 1;
  box-shadow: 0 0 2px #000 inset, 0 0 4px #ccc;
}
.up:hover .path {
  animation: move 1s infinite forwards;
}

@keyframes move {
  0% {
    opacity: 0;
    transform: translateY(45%);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(-45%);
  }
}
</style>
