<template>
  <h-frame-grid :ids="ids" @remove="remove" />
  <h-controls @add="add" @clear="clear" />
</template>

<script setup>
import { ref, watchEffect } from "vue";
import hFrameGrid from "./components/FrameGrid.vue";
import hControls from "./components/Controls.vue";

export default {
  components: {
    hFrameGrid,
    hControls,
  },
};

const __holoframe__ = `__holoframe__`;

export const ids = ref(JSON.parse(localStorage.getItem(__holoframe__)) ?? []);

export const add = (hash) => {
  ids.value.push(hash);
};
export const remove = (x) => {
  ids.value = ids.value.filter((_, y) => x !== y);
};
export const clear = () => {
  ids.value = [];
};

watchEffect(() => {
  const data = JSON.stringify(ids.value);
  localStorage.setItem(__holoframe__, data);
});
</script>

<style scoped>
.empty {
  width: 100vw;
  height: 100vh;
  position: fixed;
  color: #fff;
  display: grid;
  place-items: center;
}
</style>
