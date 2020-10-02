<template>
  <div>
    <div class="view" v-if="hashList.length">
      <div class="frame" v-for="(hash, i) in hashList" :key="hash">
        <div class="close" @click="removeHash(i)">X</div>
        <iframe
          width="560"
          height="315"
          :src="`https://www.youtube.com/embed/${hash}?autoplay=1`"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </div>
    <div class="empty" v-else>No videos</div>
    <div class="control" @mouseover="showControls" @mouseleave="hideControls">
      <input
        class="control-base"
        type="text"
        v-model="hashInput"
        @keydown.enter="addHash"
      />
      <button class="control-base add" @click="addHash">add</button>
      <button class="control-base clear" @click="clearHash">clear</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
export const hashInput = ref("");
export const hashList = ref([]);
export const size = computed(() =>
  Array(Math.ceil(Math.sqrt(hashList.value.length)))
    .fill("1fr")
    .join(" ")
);

export const addHash = () => {
  hashList.value.push(hashInput.value);
};
export const removeHash = (x) =>
  (hashList.value = hashList.value.filter((_, y) => x !== y));

export const clearHash = () => {
  hashList.value = [];
};

export const controls = ref(1);
export const showControls = () => (controls.value = 1);
export const hideControls = () => (controls.value = 0);
</script>

<style scoped vars="{ size, controls }">
.view {
  display: grid;
  grid-template-rows: var(--size);
  grid-template-columns: var(--size);
  height: 100vh;
}
.control {
  transition: 0.3s all ease-in-out;
  opacity: var(--controls);
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;
  font-size: 30px;
}
.control-base {
  transition: 0.3s all ease-in-out;
  height: 50px;
  border: 0;
  outline: 0;
  font-size: 30px;
  border: 0;
  appearance: none;
}
.control input {
  width: 300px;
  color: #ccc;
  background-color: #333;
}

.control button {
  width: 100px;
  cursor: pointer;
}

.control button:hover {
  background-color: #222;
}

.add {
  background-color: #333;
  color: #ccc;
}
.clear {
  background-color: #333;
  color: palevioletred;
}

.frame {
  position: relative;
}
.frame .close {
  transition: 0.3s all ease-in-out;
  opacity: 0;
  position: absolute;
  z-index: 10;
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
  font-weight: bold;
  left: 0;
  top: 0;
  background-color: #fff;
  border: 3px solid #000;
  cursor: pointer;
}
.frame .close:hover {
  opacity: 1;
}
.empty {
  width: 100vw;
  height: 100vh;
  position: fixed;
  color: #fff;
  display: grid;
  place-items: center;
}
</style>
