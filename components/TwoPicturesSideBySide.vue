<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col md:flex-row md:space-x-4">
    <div class="w-full md:w-1/2">
      <ContentSlot
        :use="$slots.one"
        unwrap="img"
      />

    </div>
    <div class="w-full md:w-1/2">
      <ContentSlot
        :use="$slots.two"
        unwrap="img"
      />
    </div>
  </div>

</template>

<style scoped>

</style>
