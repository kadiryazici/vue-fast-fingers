import type { HotkeysEvent } from 'hotkeys-js'
import hotkeys from 'hotkeys-js'
import type { Ref } from 'vue'
import { onMounted, onUnmounted, unref, watch } from 'vue'

type MaybeRef<T> = T | Ref<T>

export interface UseKeyOptions {
  prevent?: MaybeRef<boolean>
  stop?: MaybeRef<boolean>
  repeat?: MaybeRef<boolean>
  input?: MaybeRef<boolean>
  source?: (() => boolean) | Ref<boolean>
}

export type UseKeyCallback = (event: KeyboardEvent, hotkeysEvent: HotkeysEvent) => void

const getLast = <T>(arr: T[]) => arr[arr.length - 1]

const isInputing = () =>
  document.activeElement instanceof HTMLTextAreaElement
   || document.activeElement?.hasAttribute('contenteditable')
   || document.activeElement instanceof HTMLInputElement
   || document.activeElement instanceof HTMLSelectElement

hotkeys.filter = () => true

const bindings = new Map<string, UseKeyCallback[]>()

export function useKey(keys: string, callback: UseKeyCallback, options: UseKeyOptions = {}) {
  let initialized = false

  const keyList = keys
    .split(',')
    .map(key => key.trim())
    .filter(Boolean)

  const handler: UseKeyCallback = (event, hotkeysEvent) => {
    if (!unref(options.input) && isInputing())
      return
    if (unref(options.prevent))
      event.preventDefault()
    if (unref(options.stop))
      event.stopPropagation()
    if (!unref(options.repeat) && event.repeat)
      return

    callback(event, hotkeysEvent)
  }

  const init = () => {
    if (initialized)
      return

    initialized = true

    for (const key of keyList) {
      if (bindings.has(key)) {
        bindings.set(key, [...bindings.get(key)!, handler])
      }
      else {
        bindings.set(key, [handler])
        hotkeys(key, (...args) => {
          const func = getLast(bindings.get(key)!)
          func(...args)
        })
      }
    }
  }

  const destroy = () => {
    if (!initialized)
      return

    initialized = false

    for (const key of keyList) {
      bindings.set(
        key,
        bindings.get(key)!.filter(cb => cb !== handler),
      )
      if (bindings.get(key)!.length === 0) {
        bindings.delete(key)
        hotkeys.unbind(key)
      }
    }
  }

  if (options.source) {
    watch(
      options.source,
      (newSourceValue) => {
        if (newSourceValue)
          init()
        else destroy()
      },
      { immediate: true, flush: 'post' },
    )
  }
  else {
    onMounted(init)
  }

  onUnmounted(destroy)
}
