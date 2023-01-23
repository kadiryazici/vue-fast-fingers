<script lang="ts" setup>
import { ColorCSSVars } from '@/constants'

interface Props {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  bold?: boolean
  center?: boolean
  color?: ColorCSSVars
  inline?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  level: 1,
  bold: false,
  center: false,
  color: ColorCSSVars.Black,
  inline: false,
})
</script>

<template>
  <div
    class="heading"
    :class="[
      `heading-${level}`,
      {
        'heading-bold': bold,
        'heading-center': center,
        'heading-inline': inline,
      },
    ]"
    :style="{ color: `rgb(${color})` }"
    role="heading"
    :aria-level="level"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.heading {
  &-1 {
    font-size: 40px;
  }
  &-2 {
    font-size: 35px;
  }
  &-3 {
    font-size: 30px;
  }
  &-4 {
    font-size: 25px;
  }
  &-5 {
    font-size: 20px;
  }
  &-6 {
    font-size: 15px;
  }

  &-bold {
    font-weight: bold;
  }

  &-center {
    text-align: center;
  }

  &-inline {
    display: inline-block;
  }
}
</style>
