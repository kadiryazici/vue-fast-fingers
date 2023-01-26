<script lang="ts" setup>
import { useAppStore } from '@/stores/appStore'

interface Props {
  placeholder?: string
  disabled?: boolean
}

interface Emits {
  (e: 'confirm', value: string): void
  (e: 'type'): void
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})
const emit = defineEmits<Emits>()

const appStore = useAppStore()

function handleConfirm() {
  emit('confirm', appStore.input)
  appStore.input = ''
}

function handleKeydown(e: KeyboardEvent) {
  if (e.code === 'Spacebar' || e.code === 'Space' || e.code === 'Enter' || e.code === 'NumpadEnter') {
    e.preventDefault()
    if (appStore.input.trim().length > 0)
      handleConfirm()
  }
}
</script>

<template>
  <input
    v-model.trim="appStore.input"
    :placeholder="props.placeholder"
    :disabled="props.disabled || undefined"
    :class="{ disabled: props.disabled }"
    @keydown="handleKeydown"
    @input="emit('type')"
  >
</template>

<style lang="scss" scoped>
input {
  width: 100%;
  font-size: 20px;
  background-color: rgb(var(--black));
  border-radius: 10px;
  padding: 10px 25px;
  border: none;
  line-height: 30px;
  color: rgb(var(--white));
  caret-color: rgb(var(--accent));

  &.disabled {
    opacity: .3;
  }
}
</style>
