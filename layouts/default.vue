<script setup lang="ts">
import { SpeedInsights } from "@vercel/speed-insights/nuxt";

</script>

<template>
  <main class="bg-base-200">
    <div class="container mx-auto md:p-8 p-3 min-h-screen">
      <slot />
      <SpeedInsights />
    </div>
  </main>
</template>

<style scoped>

</style>
