<template>
  <Adjustments @click="show = !show" />
  <transition name="setting">
    <div v-if="show" class="setting">
      <h2 class="title">Layout</h2>
      <div class="content">
        <ConfigOption name="grid" />
        <ConfigOption name="vertical" />
        <ConfigOption name="horizontal" />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ConfigOption from './ConfigOption.vue'
const show = ref(false);
import { Adjustments } from '@/icons'

</script>

<style>
.setting {
  position: fixed;
  top: 3rem;
  width: 28rem;
  right: 0;
  background-color: rgb(0.9 0.9 0.9 / 1);
  box-shadow: 0 0 1rem aquamarine;
  text-align: left;
  padding: 0 1rem 1rem;
  margin: 10px 1rem;
  border-radius: 1rem;
}

.setting-enter-active {
  transition: all 0.15s ease-out;
}
.setting-leave-active {
  transition: all 0.15s cubic-bezier(1, 0.5, 0.8, 1);
}
.setting-enter-from,
.setting-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.title {
  font-size: 1.4rem;
}
.content {
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 2rem;
  margin: 0 1rem;
}
</style>