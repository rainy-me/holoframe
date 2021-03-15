<template>
  <FrameGrid />
  <Controls />
</template>

<script lang="ts" setup>
import FrameGrid from "./components/FrameGrid.vue";
import Controls from "./components/Controls.vue";
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
