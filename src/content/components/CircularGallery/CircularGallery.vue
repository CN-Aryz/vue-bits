<template>
  <div class="circular-gallery" ref="containerRef"></div>
</template>

<script setup lang="ts">
import { CircularGalleryApp } from "./CircularGalleryApp";
import type { CircularGalleryProps } from "./types";

const props = withDefaults(defineProps<CircularGalleryProps>(), {
  bend: 3,
  textColor: "#ffffff",
  borderRadius: 0.05,
  font: "bold 30px DM Sans",
});

const containerRef = ref<HTMLElement | null>(null);

watchEffect((onClearup) => {
  if (!containerRef.value) {
    return;
  }
  const { items, bend, textColor, borderRadius, font } = props;
  const app = new CircularGalleryApp(containerRef.value, {
    // @ts-ignore
    items,
    bend,
    textColor,
    borderRadius,
    font,
  });
  onClearup(() => {
    app.destroy();
  });
});
</script>

<style scoped>
.circular-gallery {
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: grab;
}

.circular-gallery:active {
  cursor: grabbing;
}
</style>
