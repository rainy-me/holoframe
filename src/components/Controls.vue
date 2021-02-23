<template>
  <div
    :class="['control', { hide: !open }]"
    @mouseover="showControls"
    @mouseleave="hideControls"
  >
    <div class="panel">
      <div class="shortcut">
        <input
          v-model="idInput"
          class="base"
          type="text"
          @keydown.enter="addStream(idInput)"
        />
        <button class="base add" @click="addStream(idInput)">add</button>
        <!-- <button class="base clear" @click="clearStreams()">clear</button> -->
        <button class="base refetch" @click.stop="openThenFetch">
          <sync-icon :animate="fetching" />
        </button>
        <button class="base add" @click="toggleOpen">
          <svg
            v-if="open"
            class="icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M5 15l7-7 7 7"
            />
          </svg>
          <svg
            v-else
            class="icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </button>
        <button class="base add" @click="toggleMuteAll">
          <svg
            v-if="muted"
            class="icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              clip-rule="evenodd"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
            />
          </svg>
          <svg
            v-else
            class="icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
        </button>
      </div>
    </div>
    <h-stream-list v-show="open" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useState } from "../store";
import hStreamList from "./StreamList.vue";
import SyncIcon from "./SyncIcon.vue";

const {
  fetching,
  addStream,
  fetchStreams,
  clearStreams,
  muted,
  toggleMuteAll,
  scrollToLiveStream,
} = useState();

const idInput = ref("");

const controls = ref(1);
const showControls = () => (controls.value = 1);
const hideControls = () => (controls.value = 1);
const openThenFetch = async () => {
  open.value = true;
  await fetchStreams();
  scrollToLiveStream();
};

const open = ref(true);
const toggleOpen = () => {
  if ((open.value = !open.value)) {
    scrollToLiveStream();
  }
};
</script>

<style scoped>
.control {
  opacity: v-bind(controls);
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10000000;
  height: 100vh;
  font-size: 30px;
  width: 30rem;
  max-width: 100vw;
  overflow: scroll;
}
.base {
  height: 40px;
  min-width: 40px;
  border: 0;
  outline: 0;
  font-size: 24px;
  border: 0;
  appearance: none;
}
.control input {
  width: 14rem;
  padding-left: 10px;
  color: #ccc;
  background-color: transparent;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-left: 3px solid aquamarine;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  border-right: 1px solid transparent;
  caret-color: aquamarine;
}

.control input:hover {
  background-color: #333;
}

.control button {
  cursor: pointer;
}

.control button:hover {
  background-color: #333;
}

.panel {
  position: sticky;
  top: 0;
  z-index: 500;
  background-color: rgba(0, 0, 0, 0.8);
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  margin-bottom: 7px;
  box-shadow: 0 0 3px #ccc, 0 0 0.5rem #000, 0 0 1rem #000;
}
.panel:after {
  width: calc(100% - 5px);
  margin-left: 5px;
  height: 3px;
  position: absolute;
  top: 100%;
  content: "";
  /* background: #777; */
  /* box-shadow: 0 0 2px #000 inset; */
  /* linear-gradient(to right, aquamarine, hotpink); */
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.shortcut {
  display: flex;
  justify-content: space-between;
}

.add {
  background-color: transparent;
  color: #ccc;
}
.clear {
  background-color: transparent;
  color: palevioletred;
}
.hide {
  height: max-content;
}
.refetch {
  display: grid;
  place-content: center;
  appearance: none;
  border: 0;
  background-color: rgba(0, 0, 0, 0.6);
  cursor: pointer;
  padding: 10px;
  width: 40px;
  color: aquamarine;
}
</style>
