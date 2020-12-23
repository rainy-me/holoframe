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
        <button class="base clear" @click="clearStreams()">clear</button>
        <button class="base add" @click="toggleOpen">
          {{ open ? "▲" : "▼" }}
        </button>
        <button class="base add" @click="toggleMuteAll()">
          {{ muted ? "🔉" : "🔇" }}
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

export default {
  components: {
    hStreamList,
  },
};
export const idInput = ref("");

export const controls = ref(1);
export const showControls = () => (controls.value = 1);
// export const hideControls = () => (controls.value = 0);

export const open = ref(true);
export const toggleOpen = () => (open.value = !open.value);
export const { addStream, clearStreams, muted, toggleMuteAll } = useState();
</script>

<style scoped vars="{ controls }">
.control {
  opacity: var(--controls);
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
  /* padding: 5px; */
  margin-bottom: 7px;
}
.panel:after {
  width: calc(100% - 5px);
  margin-left: 5px;
  height: 7px;
  position: absolute;
  top: 100%;
  content: "";
  background: linear-gradient(to right, aquamarine, hotpink);
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  box-shadow: 0 0 5px #000;
}

.shortcut {
  display: grid;
  grid-template-columns: auto auto auto auto auto;
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
</style>
