<template>
  <svg
    :class="['icon-sync', { animate }]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2.5"
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
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
  display: inline-block;
}
.animate {
  animation: r 1s linear infinite;
}
</style>
