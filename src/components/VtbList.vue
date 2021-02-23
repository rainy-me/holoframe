<template>
  <ul class="vtb-list">
    <li>
      <button class="btn" @click.stop="toggleSearch">
        <svg
          v-if="showSearch"
          class="icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <svg
          v-else
          class="icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
      </button>
    </li>
  </ul>
  <div v-show="showSearch">
    <div class="searchInput">
      <input v-model="searchString" class="search" type="text" placeholder="name..." />
      <span :class="['vtb', 'all', { checked: all }]" @click="() => toggleVtbAll()">all</span>
      <span class="vtb" @click="() => clearVtbAll()">clear</span>
    </div>
    <ul class="vtb-list">
      <li
        v-for="vtb in searchedVtbs"
        :key="vtb.nameJP"
        :class="['vtb', { checked: vtb.check }]"
        :title="`${vtb.nameJP}(${vtb.nameEN})`"
        @click.stop="toggleVtb(vtb.nameJP)"
      >{{ vtb.nameJP }}</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useState } from "../store";

const { vtbs, all, toggleVtb, toggleVtbAll, clearVtbAll, fetchStreams, scrollToLiveStream } = useState();
const searchString = ref("");
const allVtbs = computed(() => Object.entries(vtbs).map(([, v]) => v));

const searchedVtbs = computed(() => {
  if (!searchString.value) {
    return allVtbs.value;
  }
  const searchStringUpperCase = searchString.value.toUpperCase();
  return allVtbs.value.filter((vtb) =>
    `${vtb.nameJP}${vtb.nameEN}`.toUpperCase().includes(searchStringUpperCase)
  );
});

const checkedVtbs = computed(() => allVtbs.value.filter((vtb) => vtb.check));

const showSearch = ref(false);
const toggleSearch = () => {
  if (showSearch.value) {
    scrollToLiveStream();
  }
  showSearch.value = !showSearch.value;
};
// const searchColor = computed(() =>
//   showSearch.value ? "pink" : "yellowgreen"
// );
</script>

<style scoped>
.searchInput {
  display: grid;
  grid-template-columns: 2fr 0.5fr 0.5fr;
  padding: 1rem 0 0;
}
.vtb-list {
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  /* max-height: 10rem; */
  overflow: scroll;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 1rem 0 0;
}

.vtb {
  font-size: 1rem;
  list-style: none;
  color: #ccc;
  padding: 2px;
  margin: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  border-radius: 5px;
  text-align: center;
}
.checked {
  background: #fff;
  color: #000;
}
.search {
  appearance: none;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 5px;
  font-size: 1.2rem;
  width: 100%;
  outline: none;
  color: #fff;
  padding: 3px 5px;
  border: 2px #ccc solid;
}
.all {
  width: 100%;
}
.search:hover {
  border: 2px skyblue solid;
}
.btn {
  width: 100%;
  height: 100%;
  appearance: none;
  border: 0;
  background-color: rgba(0, 0, 0, 0.6);
  font-size: 1.2rem;
  cursor: pointer;
  display: block;
  color: aquamarine;
}
</style>
