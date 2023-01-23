<script lang="ts">
import { ref, watch, watchPostEffect } from 'vue'
import { useKey } from '@/composables/useKey'
import type { Option } from '@/types'

export enum DrawerPosition {
  Right,
  Left,
}
</script>

<script lang="ts" setup>
interface Props {
  visible?: boolean
  position?: DrawerPosition
}

interface Emits {
  (e: 'update:visible', visible: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  position: DrawerPosition.Right,
})
const emit = defineEmits<Emits>()

function handleAnimation(el: Element, done: () => void, enter = false) {
  const content = el.children[0]

  const wrapperBg = window.getComputedStyle(el).backgroundColor

  const wrapperFrames: Keyframe[] = enter
    ? [
        { backgroundColor: 'rgba(0, 0, 0, 0)', backdropFilter: 'blur(0px)' },
        { backgroundColor: wrapperBg, backdropFilter: 'blur(2px)' },
      ]
    : [
        { backgroundColor: wrapperBg, backdropFilter: 'blur(2px)' },
        { backgroundColor: 'rgba(0, 0, 0, 0)', backdropFilter: 'blur(0px)' },
      ]

  const contentFrameStart = props.position === DrawerPosition.Left
    ? { transform: 'translateX(-100%)' }
    : { transform: 'translateX(100%)' }

  const contentFrameEnd = { transform: 'translateX(0%)' }

  const contentFrames = enter
    ? [contentFrameStart, contentFrameEnd]
    : [contentFrameEnd, contentFrameStart]

  const animOptions: KeyframeAnimationOptions = { duration: 250, easing: 'ease' }

  el.animate(wrapperFrames, animOptions)
  content.animate(contentFrames, animOptions)
    .addEventListener('finish', done)
}

useKey('esc', () => {
  emit('update:visible', false)
}, { source: () => props.visible })

const drawerContentEl = ref<Option<HTMLElement>>(null)
let lastFocusedEl: Option<HTMLElement> = null
watch(() => props.visible, (visible) => {
  if (visible) {
    lastFocusedEl = document.activeElement as HTMLElement
    drawerContentEl.value?.focus()
  }
  else {
    lastFocusedEl?.focus()
    lastFocusedEl = null
  }
}, { flush: 'post' })
</script>

<template>
  <Teleport to="body">
    <Transition
      :css="false"
      @enter="(el: Element, done: () => void) => handleAnimation(el, done, true)"
      @leave="(el: Element, done: () => void) => handleAnimation(el, done, false)"
    >
      <div
        v-if="visible"
        class="drawer"
        :class="{
          'drawer-right': position === DrawerPosition.Right,
          'drawer-left': position === DrawerPosition.Left,
        }"
        @click.self="emit('update:visible', false)"
      >
        <div
          ref="drawerContentEl"
          tabindex="0"
          class="drawer-content"
        >
          <Suspense>
            <slot />
          </Suspense>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.drawer {
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  background-color: rgba(var(--black), .3);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;

  &.drawer-right {
    justify-content: flex-end;
  }

  &.drawer-left {
    justify-content: flex-start;
  }

  .drawer-content {
    outline: none;
    overflow: auto;
    padding: 15px;
    width: 100%;
    max-width: 500px;
    height: 100%;
    background-color: rgb(var(--black));
  }
}
</style>
