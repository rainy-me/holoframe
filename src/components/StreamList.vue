<template>
  <ul class="list">
    <li
      :class="['stream', { 'is-streaming': stream.isStreaming }]"
      @click="$emit('add', stream.id)"
      v-for="stream in Object.values(streams)"
      :key="stream.id"
    >
      <div class="content">
        <span class="start">{{ stream.start }}</span>
        <span class="member">{{ stream.member }}</span>
        <span class="id">
          {{ stream.id }}
        </span>
        <span class="outlink">
          <a
            @click.stop
            :href="stream.url"
            target="_blank"
            rel="nofollow noopener"
          >
            ◥
          </a>
        </span>
      </div>
      <span class="title">
        <span v-if="stream.title">{{ stream.title }}</span>
        <span v-else @click.stop="getTitle(stream.id)"> get title </span>
      </span>
      <div class="detail">
        <img class="thumbnail" :src="stream.thumbnail" :alt="stream.title" />
        <span class="is-streaming-text" v-if="stream.isStreaming">
          stream
          <small class="time-relative"> started {{ stream.length }} </small>
        </span>
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from "vue";

type Stream = {
  member: string;
  id: string;
  url: string;
  start: string;
  timestamp: number;
  isStreaming: boolean;
} & {
  title?: string;
  length?: string;
};

export const streams = reactive<Record<string, Stream>>({});

onMounted(() => {
  getStreams();
  setInterval(() => {
    Object.values(streams).forEach((stream) => {
      setLength(stream);
    });
  }, 1000);
});

export const getStreams = async () => {
  const res = await fetch("https://api.yue.coffee/api/v1/hololive");
  const { data, error } = await res.json();
  if (error) return;
  data.forEach((stream) => {
    streams[stream.id] = stream;
    setLength(stream);
  });
};

const setLength = (stream: Stream) => {
  if (!stream.isStreaming) return;
  stream.length = getRelativeTime(stream.timestamp);
};

export const getTitle = async (id: string) => {
  streams[id].title = "⟳";
  const res = await fetch("https://api.yue.coffee/api/v1/page-title", {
    method: "post",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: `https://www.youtube.com/watch?v=${id}`,
    }),
  });
  const { data, error } = await res.json();
  if (error) return;
  streams[id].title = data.title;
};

const units = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};

const getRelativeTime = (timestamp) => {
  let elapsed = Date.now() - timestamp;
  let timeString: string[] = [];
  for (const u in units) {
    if (Math.abs(elapsed) > units[u]) {
      let count = Math.floor(elapsed / units[u]);
      // timeString.push(`${count} ${u}${count > 1 ? "s" : ""}`);
      timeString.push(`${count}`.padStart(2, "0"));
      elapsed -= count * units[u];
    }
  }
  return timeString.join(":") + " ago";
};
</script>

<style scoped>
.list {
  max-height: 80vh;
  overflow: scroll;
  list-style: none;
  font-size: 1rem;
  padding: 0;
}
.content {
  height: 1.6rem;
  transition: 0.1s all ease-in-out;
  display: grid;
  grid-template-columns: auto 8rem auto auto;
  justify-content: space-between;
  gap: 1rem;
}

/* .content:hover { */
/* background-color: #666; */
/* } */

.stream {
  cursor: pointer;
  transition: 0.3s all ease-in-out;
  position: relative;
  background-color: rgba(0, 0, 0, 0.6);
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 1rem;
}

.is-streaming {
  border: 2px solid greenyellow;
}

.is-streaming-text {
  color: greenyellow;
  display: grid;
  place-items: center;
  font-weight: bold;
  font-size: 2rem;
}

.stream:hover {
  background-color: #333;
}

/* .stream:hover .thumbnail {
  opacity: 1;
  transform: translateY(0);
} */

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

.detail {
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
.id {
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
.time-relative {
  font-size: 1rem;
  color: #666;
}
</style>
