<script setup lang="ts">
import TheContent from './components/TheContent.vue'
import TheGame from './components/TheGame.vue'
import { useAppStore } from './stores/appStore'

const appStore = useAppStore()
</script>

<template>
  <TheContent>
    <TheGame />
  </TheContent>
</template>
