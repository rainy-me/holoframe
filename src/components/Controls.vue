<template>
  <div class="control" @mouseover="showControls" @mouseleave="hideControls">
    <div class="panel">
      <input
        class="base"
        type="text"
        v-model="idInput"
        @keydown.enter="$emit('add', idInput)"
      />
      <button class="base add" @click="$emit('add', idInput)">add</button>
      <button class="base clear" @click="$emit('clear')">clear</button>
      <button class="base add" @click="toggleOpen">
        {{ open ? "▲" : "▼" }}
      </button>
      <button class="base add" @click="$emit('refresh')">⟳</button>
    </div>
    <h-stream-list v-if="open" @add="(hash) => $emit('add', hash)" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
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
</script>

<style scoped vars="{ controls }">
.control {
  transition: 0.3s all ease-in-out;
  opacity: var(--controls);
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10000000;
  font-size: 30px;
  width: 30rem;
  overflow: scroll;
}
.base {
  transition: 0.3s all ease-in-out;
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
</style>
