<template>
  <transition-group tag="div" v-if="streamIds.length" name="view" class="view" :style="layoutStyle">
    <FrameItem
      v-for="stream in streams"
      :id="stream.id"
      :key="stream.id"
      :muted="stream.muted"
      class="frame view-item"
    />
  </transition-group>
  <p v-else class="empty">No videos</p>
</template>

<script lang="ts" setup="props">
import { defineEmit } from "vue";
import { useState } from "@/store";
import { layoutStyle } from '@/store/layout'
import FrameItem from "./FrameItem.vue";

const emits = defineEmit(["remove"]);

const { streams, streamIds } = useState();

const openComment = (id: string) =>
  window.open(`https://www.youtube.com/live_chat?v=${id}`);
</script>

<style scoped>
.view {
  display: grid;
  height: 100vh;
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
.control {
  opacity: 0;
  position: absolute;
  z-index: 20000000;
  height: 50px;
  left: 0;
  top: 0;
  cursor: pointer;
  display: flex;
  width: fit-content;
  background-color: #000;
  box-shadow: 0 0 1rem #ccc;
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

.control:hover {
  opacity: 1;
}

.close {
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
  font-weight: bold;
  background-color: #fff;
  border-radius: 100%;
  border: 3px solid #000;
  cursor: pointer;
}
.close:hover {
  background-color: red;
  color: #fff;
}

.comment {
  width: 100px;
  height: 50px;
  display: grid;
  place-items: center;
  font-weight: bold;
  left: 50px;
  top: 0;
  color: #fff;
  cursor: pointer;
  border-radius: 10px;
}
.comment:hover {
  background-color: #333;
}
.link {
  background-color: skyblue;
  padding: 0 10px;
  display: grid;
  border-radius: 10px;
  place-items: center;
}
.link:hover {
  background-color: lightskyblue;
}
.view-item {
  display: inline-block;
  margin-right: 10px;
}
.view-item-enter-active,
.view-item-leave-active {
  transition: all 1s ease;
}
.view-item-enter-from,
.view-item-leave-to {
  opacity: 0;
  transform: translateY(30px);
  position: absolute;
}
</style>
