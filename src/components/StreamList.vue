<template>
  <div class="filter">
    <span class="member hololive">Hololive</span>
    <span class="member nijisanji">にじさんじ</span>
    <span 
    class="member"
    :style="{
          '--member--color': member.show?(member.color ?? '#ccc'):''
        }"
    :key="member.name"
    v-for="(member) in members"
    >
    {{member.name}}
    </span>
  </div>
  <ul class="list">
    <li
      :ref="(el) => (refs[i] = el)"
      :class="['stream', { 'is-streaming': stream.isStreaming }]"
      @click="$emit('add', stream.id)"
      v-for="(stream, i) in Object.values(streams)"
      :key="stream.id"
    >
      <div class="content">
        <span class="start">
          {{formatTime(stream.startTime)}}
        </span>
        <span class="member" :style="{
          '--member--color': stream.members[0].color ?? '#ccc'
        }">{{ stream.members[0].name }}</span>
        <span :class="['producer',producerMap[stream.producer]]">{{stream.producer}}</span>
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
          LIVE
          <small class="time-relative"> started {{ stream.length }} </small>
        </span>
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { ref, reactive,watch, onMounted, nextTick } from "vue";
import {getLocalData,setLocalData} from '../utils'

export type Stream = {
  members: {
    id?: string | number;
    name: string;
    avatar?: string;
    color?: string;
  }[];
  id: string;
  url: string;
  thumbnail: string;
  startTime: number;
  endTime?: number;
  isStreaming?: boolean;
  title?: string;
  description?: string;
  producer: "Hololive" | "にじさんじ";
}& {
  length?: string;
};

export const streams = reactive<Record<string, Stream>>({});
export const refs = ref<HTMLLIElement[]>([]);

onMounted(async () => {
  await getStreams();
  setInterval(() => {
    Object.values(streams).forEach((stream) => {
      setLength(stream);
    });
  }, 1000);
});

export const getStreams = async () => {
  const res = await fetch("https://api.yue.coffee/api/tv/v1");
  const { data, error }: { data: Stream[]; error: any } = await res.json();
  if (error) return;
  let firstStreamingSet = false;
  data.forEach((stream, i) => {
    streams[stream.id] = stream;
    setLength(stream);
    if (firstStreamingSet || !stream.isStreaming) return;
    firstStreamingSet = true;
    nextTick(() => {
      console.log("scroll");
      refs.value[i].scrollIntoView({
        behavior: "smooth",
      });
    });
  });
};

const setLength = (stream: Stream) => {
  if (!stream.isStreaming) return;
  stream.length = getRelativeTime(stream.startTime);
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

const units:Record<string,number> = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};

const getRelativeTime = (timestamp:number) => {
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

const intl =   new Intl.DateTimeFormat('default', {
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
})

export const formatTime = (date:Date)=>{
  return intl.format(date)
}

export const producerMap:Record<Stream['producer'],string>= {
  Hololive: 'hololive',
  'にじさんじ': 'nijisanji'
}

type Member = {
  show:boolean
} & Stream['members'][number]

export const members = ref<Member[]>([])

watch(streams,(updates)=>{
  let seen = new Set<string>()
  members.value = Object.values(updates).map(u=>u.members[0]).reduce((acc,m)=>{
    if (seen.has(m.name)) return acc
    return [...acc,{...m,show:true}]
  },[] as Member[])
})

export const toggleFilter =(name:string)=>{
  const filters = getLocalData("filters") ??{}
  filters[name] = !filters[name]
  setLocalData("filters",filters)
}

</script>

<style scoped>
.filter{
  background: #fff;
  font-size: 1rem;
  grid-template-columns: auto auto auto auto;
  display: grid;
  max-height: 10rem;
  overflow: scroll;
}
.list {
  overflow: scroll;
  list-style: none;
  font-size: 1rem;
  padding: 0;
}
.content {
  height: 1.6rem;
  transition: 0.1s all ease-in-out;
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  justify-content: space-between;
  gap: 1rem;
}

/* .content:hover { */
/* background-color: #666; */
/* } */

.stream {
  cursor: pointer;
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
  color: #fff;
  /* background-color: #fff; */
  border-radius: 5px;
  display: grid;
  place-items: center;
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
  height: 1.6rem;
  color: #000;
  border-radius: 5px;
  background-color: var(--member--color);
  padding: 3px;
  display: grid;
  place-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  text-align: center;
}
.producer{
    display: grid;
    place-items: center;
    border-radius: 5px;
    background: #eee;
    color: rgb(48, 48, 48);
    width: 6rem;
}

.hololive{
      background: rgba(95,220,238);
      color: rgb(48, 48, 48);
}
.nijisanji{
      background: rgb(50,76,111);
      color: #fff;
}

</style>
