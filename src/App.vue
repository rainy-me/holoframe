<template>
  <h-frame-grid />
  <h-controls />
</template>

<script lang="ts" setup>
import hFrameGrid from "./components/FrameGrid.vue";
import hControls from "./components/Controls.vue";

export default {
  components: {
    hFrameGrid,
    hControls,
  },
};
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
