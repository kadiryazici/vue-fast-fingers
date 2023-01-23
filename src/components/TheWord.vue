<script lang="ts" setup>
import { ref, watchPostEffect } from 'vue'
import { WordStatus } from '@/constants'

interface Props {
  word: string
  status: WordStatus
  highlighted: boolean
}

const props = withDefaults(defineProps<Props>(), {
  status: WordStatus.None,
  highlighted: false,
})

const element = ref<HTMLElement>()

watchPostEffect(() => {
  if (props.highlighted) {
    element.value!.scrollIntoView({
      behavior: 'auto',
      inline: 'start',
    })
  }
})
</script>

<template>
  <span
    ref="element"
    class="word"
    :class="{
      'word-correct': status === WordStatus.Correct,
      'word-wrong': status === WordStatus.Wrong,
      'word-highlighted': highlighted,
    }"
  >{{ word }}</span>
</template>

<style lang="scss" scoped>
.word {
  padding: 5px;
  border-radius: 3px;
  display: inline-block;

  &-highlighted {
    background-color: rgb(var(--accent));
    color: rgb(var(--black));
  }

  &-correct {
    color: rgb(var(--correct))
  }

  &-wrong {
    color: rgb(var(--wrong))
  }
}
</style>
