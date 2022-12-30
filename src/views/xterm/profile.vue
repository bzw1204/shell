<template>
	<div style="height: 100%">
		<ThemeList v-model:selectedTheme.sync="selectedTheme" @change="handleChange" />
	</div>
</template>

<script setup>
import ThemeList from "./components/ThemeList.vue";

const handleChange = (data) => {
	console.log('选中的主题', data)
}
const selectedTheme = 'AdventureTime'

</script>

<style scoped>

</style>