<script lang="ts">
export enum ButtonColors {
  Accent,
  Black,
}
</script>

<script lang="ts" setup>
interface Props {
  color?: ButtonColors
}

const props = withDefaults(defineProps<Props>(), {
  color: ButtonColors.Black,
})
</script>

<template>
  <button
    class="button"
    :class="{
      'button-accent': props.color === ButtonColors.Accent,
      'button-black': props.color === ButtonColors.Black,
    }"
  >
    <span
      v-if="$slots.icon != null"
      class="button-icon"
    >
      <slot name="icon" />
    </span>

    <span class="button-content">
      <slot />
    </span>
  </button>
</template>

<style lang="scss" scoped>
.button {
  padding: 10px;
  transition: transform .2s ease;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;

  @include focus-visible();

  &.button-accent {
    background-color: rgb(var(--accent));
    color: rgb(var(--black));
  }

  &.button-black {
    background-color: rgb(var(--black));
    color: rgb(var(--accent));
  }

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(.9);
  }

  &-icon {
    margin-right: 6px;

    :deep(.icon) {
      font-size: 20px;
      vertical-align: middle;
    }
  }
}
</style>
