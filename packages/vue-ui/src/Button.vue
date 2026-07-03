<script setup lang="ts">
import { computed } from 'vue'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success'
export type ButtonSize    = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?:  ButtonVariant
    size?:     ButtonSize
    loading?:  boolean
    fullWidth?: boolean
    disabled?: boolean
    type?:     'button' | 'submit' | 'reset'
  }>(),
  {
    variant:   'primary',
    size:      'md',
    loading:   false,
    fullWidth: false,
    disabled:  false,
    type:      'button',
  },
)

const classes = computed(() => [
  'ui-btn',
  `ui-btn--${props.variant}`,
  `ui-btn--${props.size}`,
  props.fullWidth && 'ui-btn--full',
  props.loading   && 'ui-btn--loading',
])
</script>

<template>
  <button
    :class="classes"
    :type="type"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
// Host app bundler resolves 'shared-styles/...' via includePaths: [packages/]
@use 'shared-styles/src/tokens' as t;

.ui-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border: 1px solid transparent;
  border-radius: t.$radius;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  line-height: 1;
  transition: background 0.15s, color 0.15s, border-color 0.15s,
              opacity 0.15s, box-shadow 0.15s;

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(t.$primary, 0.25);
  }

  &:disabled,
  &--loading {
    opacity: 0.55;
    cursor: not-allowed;
    pointer-events: none;
  }

  // ── Sizes ──────────────────────────────────────────────
  &--sm { padding: 0.35rem 0.75rem; font-size: 0.8rem; }
  &--md { padding: 0.55rem 1.1rem;  font-size: 0.9rem; }
  &--lg { padding: 0.75rem 1.5rem;  font-size: 1rem;   }

  &--full { width: 100%; }

  // ── Variants ───────────────────────────────────────────
  &--primary {
    background: t.$primary;
    color: white;
    &:hover:not(:disabled):not(.ui-btn--loading) { background: t.$primary-hover; }
  }

  &--secondary {
    background: t.$surface;
    color: t.$text;
    border-color: t.$border;
    &:hover:not(:disabled):not(.ui-btn--loading) { background: t.$bg; }
  }

  &--outline {
    background: transparent;
    color: t.$primary;
    border-color: t.$primary;
    &:hover:not(:disabled):not(.ui-btn--loading) { background: #eff6ff; }
  }

  &--danger {
    background: t.$error;
    color: white;
    &:hover:not(:disabled):not(.ui-btn--loading) { background: t.$error-hover; }
  }

  &--success {
    background: t.$success;
    color: white;
    &:hover:not(:disabled):not(.ui-btn--loading) { background: t.$success-hover; }
  }
}
</style>
