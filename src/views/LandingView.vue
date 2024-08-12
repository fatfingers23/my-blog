<script setup lang="ts">
import ArticleList from "../components/ArticleList.vue";
	
	
</script>

<template>
	<div class="flex flex-col">
	<div
		id="Me"
		class="hero py-10 flex justify-center">
		<div
		class="hero-content flex-col lg:flex-row-reverse">
		
		<div class="text-center lg:text-start">
				<h1 class="font-poppins text-3xl font-black uppercase md:text-7xl">				
						Hey, i'm Bailey or FatFingers 👋			
				</h1>
				<p class="py-6 font-poppins lg:max-w-lg">
						 Sometimes serious, sometimes not. In my day job, I'm a team lead and full stack developer for a dotnet web application. In my free time, I follow whatever interests me. Be it retro gaming, retro console modding, microcontrollers, or anything else. Usually, it changes from week to week. I plan on covering my current hyperfixation here.
				</p>
				<div class="flex gap-2 max-lg:justify-center">
						<a href="https://github.com/fatfingers23" class="btn btn-neutral md:btn-lg rounded-full font-poppins shadow-md">
GitHub</a>
				
				</div>
		</div>
	</div>
	</div>

	<ArticleList class="px-5"
	/>
	</div>
</template>

<style scoped>

</style>
