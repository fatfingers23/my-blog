<script setup lang="ts">
defineProps< {
  videoLink: string
}>();

</script>

<template>
  <video
    :src="videoLink"
    preload="auto"
    controls>
    <source
      :src="videoLink"
      type="video/mp4" >
  </video>

</template>
