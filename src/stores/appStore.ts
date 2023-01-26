import { markRaw, reactive, ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import randomWords from 'random-words'
import type { WordStatus } from '@/constants'
import { DrawerPosition } from '@/components/TheDrawer.vue'

type DrawerComponent = (new () => { $props: Record<string, any> }) | (() => JSX.Element)
export const useAppStore = defineStore('counter', () => {
  const allWords = shallowRef<string[]>(randomWords({ exactly: 400, maxLength: 7 }))
  const wordStatuses = ref<WordStatus[]>([])
  const currentWordIndex = ref(0)
  const started = ref(false)
  const ended = ref(false)
  const input = ref('')

  const drawers = reactive<{
    id: string
    component: DrawerComponent
    position: DrawerPosition
  }[]>([])

  function showDrawer<T extends (new () => { $props: Record<string, any> }) | (() => JSX.Element) >(
    component: T,
    position = DrawerPosition.Right,
  ) {
    drawers.push({
      id: nanoid(),
      component: markRaw(component),
      position,
    })
  }

  function closeDrawer(id: string) {
    const index = drawers.findIndex(drawer => drawer.id === id)
    if (index >= 0)
      drawers.splice(index, 1)
  }

  return {
    allWords,
    started,
    ended,
    wordStatuses,
    currentWordIndex,
    drawers,
    input,
    showDrawer,
    closeDrawer,
  }
})
