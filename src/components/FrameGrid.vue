<template>
  <div v-if="streamIds.length" class="view">
    <h-frame-item
      v-for="stream in streams"
      :id="stream.id"
      :key="stream.id"
      :muted="stream.muted"
      class="frame"
    />
  </div>
  <p v-else class="empty">No videos</p>
</template>

<script lang="ts" setup="props">
import { computed } from "vue";
import { useState } from "../store";
import hFrameItem from "./FrameItem.vue";

export default {
  components: {
    hFrameItem,
  },
  emits: ["remove"],
};

export const { streams, streamIds } = useState();

export const c = computed(() => {
  let cc = Array(Math.ceil(Math.sqrt(streamIds.value.length)))
    .fill("1fr")
    .join(" ");
  return cc;
});

export const r = computed(() =>
  streamIds.value.length
    ? Array(
        Math.ceil(
          streamIds.value.length / Math.ceil(Math.sqrt(streamIds.value.length))
        )
      )
        .fill("1fr")
        .join(" ")
    : ""
);

export const openComment = (id: string) =>
  window.open(`https://www.youtube.com/live_chat?v=${id}`);
</script>

<style scoped vars="{ r, c }">
.view {
  display: grid;
  grid-template-rows: var(--r);
  grid-template-columns: var(--c);
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
</style>
