<template>
  <ul class="vtb-list">
    <!-- <li
      v-for="vtb in checkedVtbs"
      :key="vtb.name"
      :class="['vtb', { checked: vtb.check }]"
      @click.stop="toggleVtb(vtb.nameJP)"
    >
      {{ vtb.nameJP }}
    </li> -->
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
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </button>
    </li>
    <li class="vtb">
      <button class="refetch" @click.stop="fetchStreams">
        <sync-icon />
      </button>
    </li>
  </ul>
  <div v-show="showSearch">
    <input
      v-model="searchString"
      class="search"
      type="text"
      placeholder="name..."
    />
    <ul class="vtb-list">
      <li
        v-for="vtb in searchedVtbs"
        :key="vtb.nameJP"
        :class="['vtb', { checked: vtb.check }]"
        :title="`${vtb.nameJP}(${vtb.nameEN})`"
        @click.stop="toggleVtb(vtb.nameJP)"
      >
        {{ vtb.nameJP }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useState } from "../store";
import SyncIcon from "./SyncIcon.vue";

export default {
  components: {
    SyncIcon,
  },
};

export const { vtbs, toggleVtb, fetchStreams } = useState();
export const searchString = ref("");
export const allVtbs = computed(() => Object.entries(vtbs).map(([, v]) => v));

export const searchedVtbs = computed(() => {
  if (!searchString.value) {
    return allVtbs.value;
  }
  const searchStringUpperCase = searchString.value.toUpperCase();
  return allVtbs.value.filter((vtb) =>
    `${vtb.nameJP}${vtb.nameEN}`.toUpperCase().includes(searchStringUpperCase)
  );
});

export const checkedVtbs = computed(() =>
  allVtbs.value.filter((vtb) => vtb.check)
);

export const showSearch = ref(false);
export const toggleSearch = () => (showSearch.value = !showSearch.value);
// export const searchColor = computed(() =>
//   showSearch.value ? "pink" : "yellowgreen"
// );
</script>

<style scoped>
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
.search:hover {
  border: 2px skyblue solid;
}
.btn {
  width: 100%;
  appearance: none;
  border: 0;
  background-color: rgba(0, 0, 0, 0.6);
  font-size: 1.2rem;
  cursor: pointer;
  display: block;
  color: aquamarine;
}
.refetch {
  width: 100%;
  height: 100%;
  appearance: none;
  border: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: aquamarine;
  height: 1.4rem;
  cursor: pointer;
}
</style>
