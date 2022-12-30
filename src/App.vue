<template>
	<div id="app" class="main-window mycolor">
		<nx-layout
			:title="$t('app.powertools-shell')"
			:isMainWindow="true"
			:leftPanel="left_panel"
			:topPanel="top_panel">
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
import * as EventBus from '@/services/eventbus'

const appStore = useAppStore()
const { theme, language, configPanel } = storeToRefs(appStore)
const left_panel = ref(true)
const top_panel = ref(true)
const router = useRouter()


onMounted(() => {
	window.document.documentElement.setAttribute('nx-theme', theme.value)
	if (process.env.NODE_ENV !== 'development') {
		router.push({
			name: 'Home'
		})
	}
	EventBus.subscript('enter-fullscreen', async () => {
		try {
			left_panel.value = false
			top_panel.value = false
			EventBus.publish('session-config-panel', 'close')
			await document.body.requestFullscreen()
		} catch (e) {
			// pass
		}
	})
	document.addEventListener('fullscreenchange', () => {
		const isFullscreen = !!document.fullscreenElement
		if (!isFullscreen) {
			if (configPanel.value) {
				EventBus.publish('session-config-panel', 'open')
			}
			left_panel.value = true
			top_panel.value = true
		}
	})
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
