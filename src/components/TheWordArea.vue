<script lang="ts" setup>
import TheWord from './TheWord.vue'
import { useAppStore } from '@/stores/appStore'

const appStore = useAppStore()

function isHighlightedWrong(index: number) {
  if (appStore.currentWordIndex !== index)
    return false

  return !appStore
    .allWords[index]
    .startsWith(appStore.input)
}
</script>

<template>
  <div class="word-area-container">
    <div class="word-area">
      <TheWord
        v-for="(word, index) in appStore.allWords"
        :key="`${word}${index}`"
        :word="word"
        :highlighted="appStore.currentWordIndex === index"
        :highlightedWrong="isHighlightedWrong(index)"
        :status="appStore.wordStatuses[index]"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.word-area-container {
  width: 100%;
  display: flex;
  background-color: rgb(var(--black));
  border-radius: 10px;
}

.word-area {
  margin: 20px;
  height: 100px;
  line-height: 40px;
  letter-spacing: 2px;
  font-size: 20px;
  overflow: hidden;
  white-space: pre;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  color: rgb(var(--white));
  justify-content: space-between;
}
</style>
