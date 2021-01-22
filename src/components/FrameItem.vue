<template>
  <div class="frame">
    <div class="control">
      <div class="close" @click="removeStream(id)">X</div>
      <div class="comment hover" @click="openComment(id)">comment</div>
      <div class="reload hover" @click="reload">
        <sync-icon :animate="loading" />
      </div>
      <div class="mute hover" @click="focusMute(id)">
        <svg
          class="icon"
          fill="none"
          stroke="#ccc"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
      </div>
      <a
        class="link"
        :href="`https://www.youtube.com/watch?v=${id}`"
        target="_blank"
      >
        Original
      </a>
    </div>
    <div :id="id" />
  </div>
</template>

<script lang="ts" setup="props">
import { onMounted, watch, ref, defineProps } from "vue";
import { useState } from "../store";
import SyncIcon from "./SyncIcon.vue";

const props = defineProps({
  id: String,
  muted: Boolean,
});

// eslint-disable-next-line no-undef
let player = null as null | YT.Player;
const loading = ref(true);

watch(
  () => loading.value,
  () => {
    console.log(loading.value);
  }
);

const load = () => {
  let interval = window.setInterval(() => {
    if (!window.YT) return;
    window.clearInterval(interval);
    player = new window.YT.Player(props.id, {
      videoId: props.id,
      events: {
        onReady() {
          loading.value = false;
          player?.playVideo();
        },
        onStateChange(event) {
          switch (event.data) {
            case window.YT.PlayerState.PLAYING: {
              loading.value = false;
              break;
            }
          }
        },
      },
    });
  }, 200);
};

onMounted(() => {
  load();
});

const reload = () => {
  loading.value = true;
  player?.loadVideoById(props.id);
};

watch(
  () => props.muted,
  () => {
    if (!player) return;
    if (props.muted) {
      player.mute();
    } else {
      player.unMute();
    }
  }
);

const { removeStream, focusMute } = useState();

const openComment = (id: string) =>
  window.open(`https://www.youtube.com/live_chat?v=${id}`);
</script>

<style scoped>
.view {
  display: grid;
  grid-template-rows: v-bind(size);
  grid-template-columns: v-bind(size);
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
  user-select: none;
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
  background-color: hotpink;
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

.mute {
  display: grid;
  place-items: center;
  margin: 0 5px;
  padding: 0 5px;
  border-radius: 10px;
}

.reload {
  display: grid;
  place-items: center;
  margin: 0 5px;
  padding: 0 5px;
  border-radius: 10px;
  color: #ccc;
}
.reload svg {
  width: 1.4rem;
  height: 1.4rem;
}

.hover:hover {
  background-color: #333;
}

.link {
  background-color: aquamarine;
  padding: 0 10px;
  display: grid;
  border-radius: 10px;
  place-items: center;
}
.link:hover {
  background-color: lightskyblue;
}
</style>
