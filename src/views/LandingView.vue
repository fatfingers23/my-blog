<script setup lang="ts">
import ArticleList from "../components/ArticleList.vue";
import {ref} from "vue";

let darkMode = ref(false);
if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
  darkMode.value = true;
}

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
          <h1 class="font-poppins text-3xl font-black uppercase md:text-7xl">
            Hey, i'm Bailey or FatFingers 👋
          </h1>
          <p class="py-6 font-poppins text-left">
            Sometimes serious, sometimes not. In my day job, I'm a team lead and full stack developer for a dotnet web application. In my free time, I follow whatever interests me. Be it retro gaming, retro console modding, microcontrollers, or anything else. Usually, it changes from week to week. I plan on covering my current hyperfixation here.
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
          </div>
        </div>
      </div>
    </div>
    <ArticleList />
  </div>
</template>

<style scoped>

</style>
