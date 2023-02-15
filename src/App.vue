<template>
	<div id="app" class="main-window">
		<nx-layout>
			<template slot="main-panel">
				<keep-alive :exclude="['GlobalSetting']">
					<router-view />
				</keep-alive>
			</template>
		</nx-layout>
	</div>
</template>

<script lang="ts" setup>
import NxLayout from '@/layout/NxLayout.vue'
import { useAppStore } from '@/store/pinia'
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRouter } from "@/hooks/vue-router-api";
import { useI18n } from "vue-i18n-bridge";

const appStore = useAppStore()
const { theme, language } = storeToRefs(appStore)
const router = useRouter()
const { t } = useI18n()

onMounted(() => {
	appStore.changeTheme(theme.value)
	if (process.env.NODE_ENV !== 'development') {
		router.push({
			name: 'Home'
		})
	}
})

</script>

<style lang="scss">
#app {
	width: 100%;
	height: 100%;
	background-color: var(--n-bg-color-light);

	.control-panel {
		width: 100%;
		height: 100%;
	}

	.main-window {
		.control-panel {
			background-color: var(--n-bg-color-light);
		}
	}
}
</style>
