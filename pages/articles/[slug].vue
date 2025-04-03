<script setup lang="ts">

</script>

<template>
  <div class="p-1 md:p-6 shadow-md">
    <NuxtLink
      to="/"
      class="text-blue-500 hover:underline mb-4 inline-block"
    >
      &larr; Back to Articles
    </NuxtLink>
    <div class="md:flex md:justify-center">
      <ContentDoc>
        <template #not-found>
          <h1>This article has not been written yet</h1>
        </template>
        <template #default="{ doc }">
          <article class="prose">
            <figure class="mb-6">
              <img
                :src="doc.image.src"
                :alt="doc.image.alt"
                class="w-full object-cover rounded-lg h-60"
              >
            </figure>
            <a
              href="https://oasiscenter.org/"
              class="link text-primary">Thinking of sponsoring me? Maybe make a donation to the Oasis Center instead!</a>
            <div class="p-6 rounded-lg mb-6">
              <h1 class="mb-2 font-poppins text-2xl font-black md:text-4xl ">
                {{ doc.title }}
              </h1>
              <p class="text-gray-600">
                {{ new Date(doc.date).toLocaleString() }}
              </p>
            </div>
            <ContentRenderer :value="doc" />
          </article>
        </template>
      </ContentDoc>
    </div>
    <NuxtLink
      to="/"
      class="text-blue-500 hover:underline mb-4 inline-block"
    >
      &larr; Back to Articles
    </NuxtLink>
  </div>
</template>

<style scoped>

</style>
