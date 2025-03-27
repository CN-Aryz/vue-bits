<script setup lang="ts">
import ElasticSlider from "./content/components/ElasticSlider/ElasticSlider.vue";
</script>

<template>
  <div
    style="
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    "
  >
    <ElasticSlider
      :startingValue="500"
      :defaultValue="750"
      :maxValue="1000"
      isStepped
      :stepSize="10"
    />
  </div>
</template>

<style scoped></style>
