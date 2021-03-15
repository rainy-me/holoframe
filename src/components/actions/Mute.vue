<template>
    <button class="base add" @click="toggleMuteAll">
        <VolumeOff v-if="muted" />
        <VolumeUp v-else />
    </button>
</template>

<script setup lang="ts">
import { VolumeUp, VolumeOff } from '@/icons'
import { useState } from "@/store";

const {
    muted,
    toggleMuteAll,
} = useState();
</script>