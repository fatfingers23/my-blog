<script setup lang="ts">
import {ref,onMounted} from "vue";
import {useHead} from "@unhead/vue";


useHead({
  title: "Bailey's Blog",
  meta: [
    {
      name: "description",
      content: "A personal blog about whatever I'm interested in at the moment."
    }
  ]
});

const darkMode = ref(false);
onMounted(() => {
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    darkMode.value = true;
  }
});

</script>

<template>
  <div class="flex flex-col">
    <div
      class="hero py-10 flex justify-center"
    >
      <div
        class="hero-content flex-col"
      >
        <div class="text-center lg:text-start">
          <h1 class="font-poppins text-3xl font-black uppercase md:text-5xl">
            Hey, i'm Bailey 👋
          </h1>
          <p class="py-6 font-poppins text-left">
            Sometimes serious, sometimes not. In my day job, I'm a team lead on a dotnet web application. In my free time, I follow whatever interests me. Be it retro gaming, retro console modding, microcontrollers, or anything else. Mostly will be talking about embedded development here, but can be a bit of anything.
            <a
              href="https://oasiscenter.org/"
              class="link text-primary">Thinking of sponsoring me? Maybe make a donation to the Oasis Center instead!</a>
          </p>
          <div class="flex gap-2 max-lg:justify-center justify-center">
            <a
              href="https://github.com/fatfingers23"
              class="btn btn-outline btn-accent md:btn-lg rounded-full font-poppins shadow-md"
            >
              <img
                v-if="darkMode"
                class="object-contain w-16"
                alt="Github logo"
                src="../assets/GitHub_Logo_dark.png"
              >
              <img
                v-else
                class="object-contain w-16"
                alt="Github logo"
                src="../assets/GitHub_Logo_light.png"
              >
            </a>

            <a
              href="https://bsky.app/profile/baileytownsend.dev"
              class="btn btn-outline btn-accent md:btn-lg rounded-full font-poppins shadow-md"
            >
              <svg
                fill="none"
                viewBox="0 0 64 57"
                width="28"
                style="width: 28px; height: 24.9375px;"><path
                  fill="#0085ff"
                  d="M13.873 3.805C21.21 9.332 29.103 20.537 32 26.55v15.882c0-.338-.13.044-.41.867-1.512 4.456-7.418 21.847-20.923 7.944-7.111-7.32-3.819-14.64 9.125-16.85-7.405 1.264-15.73-.825-18.014-9.015C1.12 23.022 0 8.51 0 6.55 0-3.268 8.579-.182 13.873 3.805ZM50.127 3.805C42.79 9.332 34.897 20.537 32 26.55v15.882c0-.338.13.044.41.867 1.512 4.456 7.418 21.847 20.923 7.944 7.111-7.32 3.819-14.64-9.125-16.85 7.405 1.264 15.73-.825 18.014-9.015C62.88 23.022 64 8.51 64 6.55c0-9.818-8.578-6.732-13.873-2.745Z"/></svg>
            </a>

            <a
              href="/feed.xml"
              target="_blank"
              class="btn btn-outline btn-accent md:btn-lg rounded-full font-poppins shadow-md">
              RSS
              <img
                v-if="darkMode"
                width="24"
                height="24"
                src="https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/24/FFFFFF/external-rss-feed-video-and-movie-tanah-basah-basic-outline-tanah-basah.png"
                alt="external-rss-feed-video-and-movie-tanah-basah-basic-outline-tanah-basah">
              <img
                v-else
                width="24"
                height="24"
                src="https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/24/external-rss-feed-video-and-movie-tanah-basah-basic-outline-tanah-basah.png"
                alt="external-rss-feed-video-and-movie-tanah-basah-basic-outline-tanah-basah">
            </a>

          </div>

        </div>
      </div>
    </div>
    <ArticleList />
  </div>
</template>

<style scoped>

</style>
