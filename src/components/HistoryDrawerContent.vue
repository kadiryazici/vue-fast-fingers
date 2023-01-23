<script lang="ts" setup>
import { shallowRef } from 'vue'
import TheHeading from './TheHeading.vue'
import TheButton, { ButtonColors } from './TheButton.vue'
import { type TestHistoryItem, historyDb } from '@/utils/db'
import { ColorCSSVars } from '@/constants'
import { Timer } from '@/utils/timer'

const historyItems = shallowRef(await Promise.all(
  (await historyDb.keys())
    .map(key => historyDb.getItem(key) as Promise<TestHistoryItem>),
))

async function clear() {
  await historyDb.clear()
  historyItems.value = []
}
</script>

<template>
  <TheHeading
    center
    bold
    :color="ColorCSSVars.Accent"
  >
    History
  </TheHeading>

  <div class="my-6 text-center">
    <TheButton
      :color="ButtonColors.Accent"
      @click="clear"
    >
      Clear
    </TheButton>
  </div>

  <div
    v-for="item of historyItems"
    :key="item.date"
    :style="{ color: 'rgb(var(--white))' }"
    class="history-item"
  >
    <div class="seconds">
      {{ Timer.toTimeString(item.seconds) }}
    </div>
    <div class="correct-count">
      Correct <br> {{ item.correctCount }}
    </div>
    <div class="wrong-count">
      Wrong <br>
      {{ item.wrongCount }}
    </div>
    <div class="date">
      {{ new Date(item.date).toLocaleDateString(undefined, { day: '2-digit', month: 'long' }) }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.history-item {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;

  + .history-item {
    margin-top: 20px;
  }

  .seconds,
  .correct-count,
  .wrong-count,
  .date {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
    flex-wrap: wrap;
    padding: 20px;
    text-align: center;
    background-color: rgba(var(--white), .2);

    & + * {
      border-left: 1px solid black;
    }
  }

  .seconds {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    color: rgb(var(--white));
    width: 100%;
  }

  .correct-count {
    width: 100%;
    color: rgb(var(--correct));
  }

  .wrong-count {
    width: 100%;

    color: rgb(var(--wrong));
  }

  .date {
    color: rgb(var(--white));
    width: 100%;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
}
</style>
