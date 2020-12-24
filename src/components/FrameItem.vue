<template>
  <div class="frame">
    <div class="control">
      <div class="close" @click="removeStream(id)">X</div>
      <div class="comment hover" @click="openComment(id)">comment</div>
      <div class="reload hover" @click="reload()">
        <sync-icon :animate="loading" />
      </div>
      <div class="mute hover" @click="focusMute(id)">🎧</div>
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
import { onMounted, watch, ref } from "vue";
import { useState } from "../store";
import { createIframe } from "../utils";
import SyncIcon from "./SyncIcon.vue";

export default {
  components: {
    SyncIcon,
  },
  props: ["id", "muted"],
};

declare const props: {
  id: string;
  muted: boolean;
};

// eslint-disable-next-line no-undef
let player = null as null | YT.Player;
export const loading = ref(true);

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

export const reload = () => {
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

export const { removeStream, focusMute } = useState();

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
