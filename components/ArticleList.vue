<script setup lang="ts">
const whereQuery = import.meta.dev ? null : [{draft: false}];
</script>

<template>
  <ContentList
    v-slot="{ list }"
    path="/articles"
    :where="whereQuery"
    :sort="[{ date: -1 }]"
  >
    <div class="pb-10">
      <div
        v-for="article in list"
        :key="article._path"
      >
        <div class="mb-4 px-1 md:px-5 card md:card-side bg-base-100 shadow-xl">
          <figure>
            <img
              :src="article.image.src"
              class="object-scale-down h-60 w-60"
              :alt="article.image.alt"
            >
          </figure>
          <div class="card-body">
            <h2 class="card-title">
              {{ article.title }}
            </h2>
            <p>{{ article.description }}</p>
            <div class="card-actions justify-between">
              <div class="badge badge-accent badge-outline">
                {{ new Date(article.date).toLocaleString() }}
              </div>
              <NuxtLink
                :to="article._path"
                class="btn btn-primary btn-outline">
                Read
              </NuxtLink>
            </div>



          </div>
        </div>
      </div>
    </div>
  </ContentList>

</template>

<style scoped>

</style>
