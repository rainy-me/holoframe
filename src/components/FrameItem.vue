<template>
  <div
    class="frame"
  >
    <div class="control">
      <div
        class="close"
        @click="$emit('remove', i)"
      >
        X
      </div>
      <div
        class="comment"
        @click="openComment(id)"
      >
        comment
      </div>
      <a
        class="link"
        :href="`https://www.youtube.com/watch?v=${id}`"
        target="_blank"
      >
        Original        </a>
    </div>
    <div :id="id"/>
  </div>
</template>

<script lang="ts" setup="props">
import { onMounted } from "vue";
import { createIframe } from '../utils'

export default {
  props: ["ids"],
  emits: ["remove"],
};

declare const props: {
  id: string;
};

onMounted(()=>{
  createIframe(props.id)
})

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
.close:hover{
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
.comment:hover{
  background-color: #333;
}
.link{
  background-color:skyblue;
  padding: 0 10px;
  display: grid;
  border-radius: 10px;
  place-items: center;
}
.link:hover{
  background-color:lightskyblue;
}
</style>
