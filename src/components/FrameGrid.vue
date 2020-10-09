<template>
  <div class="view" v-if="ids.length">
    <div class="frame" v-for="(id, i) in ids" :key="id">
      <div class="frame-control">
        <div class="close" @click="$emit('remove', i)">X</div>
        <div class="comment" @click="openComment(id)">comment</div>
        <a :href="`https://www.youtube.com/watch?v=${id}`" target="_blank">
          https://www.youtube.com/watch?v={{ id }}
        </a>
      </div>
      <iframe
        :src="`https://www.youtube.com/embed/${id}?autoplay=1`"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  </div>
  <p class="empty" v-else>No videos</p>
</template>

<script lang="ts" setup="props">
import { computed } from "vue";

export default {
  props: ["ids"],
};

declare const props: {
  ids: string[];
};

export const size = computed(() =>
  Array(Math.ceil(Math.sqrt(props.ids.length)))
    .fill("1fr")
    .join(" ")
);

export const openComment = (id: string) =>
  window.open(`https://www.youtube.com/live_chat?v=${id}`);
</script>

<style scoped vars="{ size }">
.view {
  display: grid;
  grid-template-rows: var(--size);
  grid-template-columns: var(--size);
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
.frame .frame-control {
  transition: 0.3s all ease-in-out;
  opacity: 0;
  position: absolute;
  z-index: 1000000;
  height: 50px;
  left: 0;
  top: 0;
  cursor: pointer;
  display: flex;
  width: fit-content;
}

.frame-control:hover {
  opacity: 1;
}

.frame .close {
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
  font-weight: bold;
  background-color: #fff;
  border: 3px solid #000;
  cursor: pointer;
}

.frame .comment {
  transition: 0.3s all ease-in-out;
  width: 100px;
  height: 50px;
  display: grid;
  place-items: center;
  font-weight: bold;
  left: 50px;
  top: 0;
  color: #fff;
  background-color: #000;
  border: 1px solid #fff;
  cursor: pointer;
}
</style>
