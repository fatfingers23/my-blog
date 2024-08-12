<script setup lang="ts">
import Articles from "../Articles.json";
</script>

<template>
	<div v-for="(article, index) in Articles" :key="index">
	<div class="px-5 card card-side bg-base-100 shadow-xl">
		<figure>
			<img
				:src="article.coverImage"
				class="object-scale-down h-60 w-60"
				alt="An image about the article" />
		</figure>
		<div class="card-body">
			<h2 class="card-title">{{article.title}}</h2>
			<p>{{article.description}}</p>
			<div class="card-actions justify-end">
				<button class="btn btn-primary">Read</button>
			</div>
		</div>
	</div>
	</div>
</template>

<style scoped>

</style>
