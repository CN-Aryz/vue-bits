<template>
  <div :style="{ fontSize: toPx(size), display: 'flex' }">
    <component class="icon" :is="as" size="1em"></component>
  </div>
</template>

<script setup lang="ts">
import type { IconType } from "vue-icons-plus";

const toPx = (value: string | number) =>
  typeof value === "string" ? value : `${value}px`;

withDefaults(defineProps<{ as: IconType; size?: string | number }>(), {
  size: 16,
});
</script>

<style scoped>
.icon {
  width: 1em;
  height: 1em;
  display: inline-block;
  line-height: 1em;
  flex-shrink: 0;
  color: currentcolor;
}
</style>
