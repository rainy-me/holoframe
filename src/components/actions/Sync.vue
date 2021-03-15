<template>
  <span :class="['icon-sync', { animate }]">
    <Refresh />
  </span>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import { Refresh } from '@/icons'
const props = defineProps({
  animate: Boolean,
});
</script>

<style scoped>
@keyframes r {
  from {
    transform: rotate(1turn);
  }
  to {
    transform: rotate(0);
  }
}

.icon-sync {
  color: #ccc;
  height: 100%;
  display: inline-grid;
  place-items: center;
}
.animate {
  animation: r 1s linear infinite;
}
</style>
