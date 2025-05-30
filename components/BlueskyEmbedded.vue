<script setup lang="ts">
defineProps< {
  postAtUri: string,
}>();

const embeddedId = String(Math.random()).slice(2);
const iframeHeight = ref(100);
if (import.meta.client) {
  window.addEventListener("message", function (event) {
    if (event.origin == "https://embed.bsky.app") {
      if (embeddedId !== event.data.id) {
        return;
      }
      iframeHeight.value = event.data.height;
    }
  });
}

</script>

<template>
  <ClientOnly>
    <div
      class="bluesky-embed"
      style="max-width: 600px; width: 100%; margin-top: 10px; margin-bottom: 10px; display: flex;">
      <iframe
        :data-bluesky-id="embeddedId"
        :src="`https://embed.bsky.app/embed/${postAtUri.replace('at://', '')}?colorMode=system&id=${embeddedId}`"
        width="100%"
        :height="`${iframeHeight}px`"
        style="border: none; display: block; flex-grow: 1; border-radius: 15px;"
        frameborder="0"
        scrolling="no"
      />
    </div>
  </ClientOnly>
</template>

<style scoped>

</style>