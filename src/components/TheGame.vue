<script lang="ts" setup>
import { computed, onMounted, ref, shallowRef } from 'vue'
import randomWords from 'random-words'
import { nanoid } from 'nanoid'
import TheHeading from './TheHeading.vue'
import TheInput from './TheInput.vue'
import TheWordArea from './TheWordArea.vue'
import TheDrawer, { DrawerPosition } from './TheDrawer.vue'
import TheButton from './TheButton.vue'
import HistoryDrawerContent from './HistoryDrawerContent.vue'
import { useAppStore } from '@/stores/appStore'
import { ColorCSSVars, WordStatus } from '@/constants'
import { Timer } from '@/utils/timer'
import { count } from '@/utils/count'
import type { Option } from '@/types'
import { type TestHistoryItem, historyDb } from '@/utils/db'
import { useKey } from '@/composables/useKey'

const appStore = useAppStore()

const timer = new Timer(60)

const timerLabel = ref(timer.toString())
const drawerVisible = ref(false)
const historyDrawerVisible = ref(false)
const inputInstance = shallowRef<Option<InstanceType<typeof TheInput>>>(null)

const correctCount = computed(() => count(appStore.wordStatuses, status => status === WordStatus.Correct))
const wrongCount = computed(() => count(appStore.wordStatuses, status => status === WordStatus.Wrong))

timer.onUpdate(() => {
  timerLabel.value = timer.toString()
})

timer.onFinish(() => {
  appStore.ended = true
  drawerVisible.value = true

  historyDb.setItem<TestHistoryItem>(nanoid(), {
    correctCount: correctCount.value,
    wrongCount: wrongCount.value,
    seconds: timer.initialSeconds,
    date: Date.now(),
  })
})

function reset(withNewWords = false) {
  appStore.started = false
  appStore.ended = false
  appStore.currentWordIndex = 0
  appStore.wordStatuses = []
  timer.reset()
  focusToInput()
  inputInstance.value?.clear()

  if (withNewWords)
    appStore.allWords = randomWords(400)
}

function start() {
  appStore.started = true
  timer.start()
}

function handleType() {
  if (!appStore.started && !appStore.ended)
    start()
}

function handleConfirm(input: string) {
  const word = appStore.allWords[appStore.currentWordIndex]

  appStore.wordStatuses[appStore.currentWordIndex] = input === word
    ? WordStatus.Correct
    : WordStatus.Wrong

  appStore.currentWordIndex += 1
}

function focusToInput() {
  setTimeout(() => {
    document.getElementById('game-input')?.focus()
  })
}

onMounted(focusToInput)

useKey('alt+r', () => {
  reset()
}, { input: true, prevent: true })

useKey('alt+h', () => {
  historyDrawerVisible.value = !historyDrawerVisible.value
}, { input: true, prevent: true })
</script>

<template>
  <TheHeading
    bold
    center
    class="mb-6"
  >
    Typing Test
  </TheHeading>

  <TheWordArea class="mb-6" />

  <TheInput
    id="game-input"
    ref="inputInstance"
    class="mb-6"
    :placeholder="!appStore.started && !appStore.ended ? 'Type here to start test' : undefined"
    :disabled="appStore.ended"
    @type="handleType"
    @confirm="handleConfirm"
  />

  <div class="text-center">
    <TheHeading
      :level="4"
      center
      inline
      @click="drawerVisible = !drawerVisible"
    >
      {{ timerLabel }}
    </TheHeading>
  </div>

  <br>

  <div class="flex gap-7px flex-row flex-nowrap">
    <TheButton @click="historyDrawerVisible = true">
      History
    </TheButton>

    <TheButton
      v-if="appStore.started"
      class="ml-auto"
      @click="reset(true)"
    >
      Reset
    </TheButton>
  </div>

  <TheDrawer
    v-model:visible="historyDrawerVisible"
    :position="DrawerPosition.Left"
  >
    <HistoryDrawerContent />
  </TheDrawer>

  <TheDrawer v-model:visible="drawerVisible">
    <TheHeading
      center
      :color="ColorCSSVars.Accent"
    >
      Results
    </TheHeading>
    <br>

    <div>
      <TheHeading
        :level="4"
        :color="ColorCSSVars.White"
        inline
      >
        Correct: {{ correctCount }}
      </TheHeading>
    </div>
    <br>
    <TheHeading
      :level="4"
      :color="ColorCSSVars.White"
    >
      Wrong: {{ wrongCount }}
    </TheHeading>
  </TheDrawer>
</template>
