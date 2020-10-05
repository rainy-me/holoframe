<template>
  <div>
    <div class="view" v-if="hashList.length">
      <div class="frame" v-for="(hash, i) in hashList" :key="hash">
        <div class="frame-control">
          <div class="close" @click="removeHash(i)">X</div>
          <div class="comment" @click="popup(hash)">comment</div>
          <a :href="`https://www.youtube.com/watch?v=${hash}`" target="_blank">
            https://www.youtube.com/watch?v={{ hash }}
          </a>
        </div>
        <iframe
          :src="`https://www.youtube.com/embed/${hash}?autoplay=1`"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </div>
    <div class="empty" v-else>No videos</div>
    <div class="control" @mouseover="showControls" @mouseleave="hideControls">
      <div class="control-panel">
        <input
          class="control-base"
          type="text"
          v-model="hashInput"
          @keydown.enter="addHash"
        />
        <button class="control-base add" @click="addHash(hashInput.value)">
          add
        </button>
        <button class="control-base clear" @click="clearHash">clear</button>
        <button class="control-base add" @click="toggleOpen">
          {{ open ? "▲" : "▼" }}
        </button>
        <button class="control-base add" @click="getLives">⟳</button>
      </div>
      <ul v-if="open" class="live-list">
        <li
          :class="['live', { 'is-streaming': live.isStreaming }]"
          @click="addHash(live.hash)"
          v-for="live in Object.values(lives)"
          :key="live.hash"
        >
          <div class="live-content">
            <span class="start">{{ live.start }}</span>
            <span class="member">{{ live.member }}</span>
            <span class="hash">
              {{ live.hash }}
            </span>
            <span class="outlink">
              <a
                @click.stop
                :href="live.url"
                target="_blank"
                rel="nofollow noopener"
              >
                ◥
              </a>
            </span>
          </div>
          <span class="title">
            <span v-if="live.title">{{ live.title }}</span>
            <span v-else @click.stop="getLiveTitle(live.hash)">get title</span>
          </span>
          <div class="live-detail">
            <img
              class="thumbnail"
              :src="`https://img.youtube.com/vi/${live.hash}/mqdefault.jpg`"
              :alt="live.title"
            />
            <span class="is-streaming-text" v-if="live.isStreaming">LIVE</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
export const hashInput = ref("");
export const hashList = ref([]);
export const size = computed(() =>
  Array(Math.ceil(Math.sqrt(hashList.value.length)))
    .fill("1fr")
    .join(" ")
);

export const addHash = (hash) => {
  hashList.value.push(hash);
  popup(hash);
};
export const removeHash = (x) =>
  (hashList.value = hashList.value.filter((_, y) => x !== y));

export const clearHash = () => {
  hashList.value = [];
};

export const controls = ref(1);
export const showControls = () => (controls.value = 1);
export const hideControls = () => (controls.value = 1);

export const lives = reactive({});
// export const hashList = ref<{member:string,hash:string,url:string,title?:string}[]>([]);
export const getLives = async () => {
  const res = await fetch("https://api.yue.coffee/api/v1/hololive");
  const { data, error } = await res.json();
  if (error) return;
  data.forEach((live) => {
    lives[live.hash] = live;
  });
};

onMounted(() => {
  getLives();
});

export const getLiveTitle = async (hash) => {
  lives[hash].title = "⟳";
  const res = await fetch("https://api.yue.coffee/api/v1/page-title", {
    method: "post",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: `https://www.youtube.com/watch?v=${hash}`,
    }),
  });
  const { data, error } = await res.json();
  if (error) return;
  lives[hash].title = data.title;
};

export const open = ref(true);
export const toggleOpen = () => (open.value = !open.value);

export const popup = (hash) =>
  window.open(
    `https://www.youtube.com/live_chat?v=${hash}`,
    "popup",
    "width=600,height=600"
  );
</script>

<style scoped vars="{ size, controls }">
.view {
  display: grid;
  grid-template-rows: var(--size);
  grid-template-columns: var(--size);
  height: 100vh;
}
.control {
  transition: 0.3s all ease-in-out;
  opacity: var(--controls);
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10000000;
  font-size: 30px;
  width: 30rem;
  overflow: scroll;
}
.control-base {
  transition: 0.3s all ease-in-out;
  height: 40px;
  border: 0;
  outline: 0;
  font-size: 24px;
  border: 0;
  appearance: none;
}
.control input {
  width: 15rem;
  color: #ccc;
  background-color: #333;
}

.control button {
  cursor: pointer;
}
.control-panel {
  background-color: #333;
  display: grid;
  grid-template-columns: auto auto auto auto auto;
}

.control button:hover {
  background-color: #222;
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
  opacity: 1;
  position: absolute;
  z-index: 1000000;
  height: 50px;
  left: 0;
  top: 0;
  cursor: pointer;
  display: flex;
  width: fit-content;
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

.empty {
  width: 100vw;
  height: 100vh;
  position: fixed;
  color: #fff;
  display: grid;
  place-items: center;
}
.live-list {
  max-height: 80vh;
  overflow: scroll;
  list-style: none;
  font-size: 1rem;
  padding: 0;
}
.live-content {
  height: 1.6rem;
  transition: 0.1s all ease-in-out;
  display: grid;
  grid-template-columns: auto 8rem auto auto;
  justify-content: space-between;
  gap: 1rem;
}

.live-content:hover {
  /* background-color: #666; */
}

.live {
  cursor: pointer;
  transition: 0.3s all ease-in-out;
  position: relative;
  background-color: #000;
  margin-bottom: 1rem;
  padding: 1rem;
}

.is-streaming {
  border: 2px solid greenyellow;
  border-radius: 1rem;
}

.is-streaming-text {
  color: greenyellow;
  display: grid;
  place-items: center;
  font-weight: bold;
  font-size: 2rem;
}

.live:hover {
  background-color: #333;
}

.live:hover .thumbnail {
  /* opacity: 1; */
  /* transform: translateY(0); */
}

.start {
  color: #000;
  background-color: #fff;
  border-radius: 5px;
  display: grid;
  place-items: center;
  padding: 0 1rem;
}

.thumbnail {
  pointer-events: none;
  /* transition: 0.3s all ease-in-out; */
  /* opacity: 0; */
  /* transform: translateY(-10px); */
  /* position: absolute; */
  /* top: 1.6rem; */
  /* left: clac(50% - 160px); */
  width: 200px;
  height: 100px;
  /* background-color: #000; */
  /* box-shadow: 0 0 3px #333; */
  /* z-index: 100000000; */
}

.live-detail {
  display: grid;
  grid-template-columns: auto 1fr;
}

.member {
  color: hotpink;
  /* border-radius: 5px; */
  /* background-color: hotpink; */
  padding: 3px;
  display: grid;
  place-items: center;
}
.hash {
  color: skyblue;
}
.outlink {
  color: #fff;
}
.title {
  color: yellowgreen;
  display: inline-block;
  cursor: pointer;
  margin: 5px 0 10px;
}
a {
  color: inherit;
  text-decoration: none;
}
</style>
