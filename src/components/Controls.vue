<template>
  <div
    :class="['control', { hide: !open }]"
    @mouseover="showControls"
    @mouseleave="hideControls"
  >
    <div class="panel">
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
export const hideControls = () => (controls.value = 0);

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
  width: 15rem;
  color: #ccc;
  background-color: #333;
}

.control button {
  cursor: pointer;
}

.control button:hover {
  background-color: #222;
}

.panel {
  position: sticky;
  top: 0;
  z-index: 500;
  background-color: #333;
  display: grid;
  grid-template-columns: auto auto auto auto auto;
}

.add {
  background-color: #333;
  color: #ccc;
}
.clear {
  background-color: #333;
  color: palevioletred;
}
.hide {
  height: max-content;
}
</style>
