<template>
  <button :class="['option', { focus }]" @click="layout = name">
    <ViewGridAdd v-if="name === 'grid'" />
    <ViewList v-if="name === 'vertical'" />
    <ViewBoards v-if="name === 'horizontal'" />
  </button>
</template>
<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { layout } from '@/store/layout'
import { ViewGridAdd, ViewList, ViewBoards } from '@/icons'

import type { Layout } from '@/store/layout'

const props = defineProps<{ name: Layout }>()

const focus = computed(() => layout.value === props.name)

</script>

<style>
.option {
  display: grid;
  place-items: center;
  border-radius: 5px;
  background-color: rgb(100 100 100 / 0.4);
  cursor: pointer;
}

.option:hover {
  background-color: rgb(100 100 100 / 0.6);
}

.focus svg {
  color: aquamarine;
}
</style>