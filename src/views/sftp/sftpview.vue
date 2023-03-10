<template>
	<div class="pt-sftp-view">
		<!-- <pt-file-view :getFs="session.value?.getFS" :cwd="sftp.dir" :hostInfo="sftp.hostInfo" /> -->
		<!-- <pt-auth-dialog ref="dialogRef" @authOk="handleAuthOk" /> -->
		hello
	</div>
</template>

<script lang="ts">
	export default {
		name: 'PtSftpView'
	}
</script>

<script setup lang="ts">
	import { getCurrentInstance, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
	import PtFileView from '@/views/components/fileview/fileview.vue'

	const props = defineProps<{ sessionId: number }>()

	const sftp = reactive({
		currentDir: '/',
		dir: '/',
		hostInfo: {}
	})
	const session = ref()
	const dialogRef = ref()
	const fsInstance = ref()
	const instance = getCurrentInstance()

	const getFs = async () => {
		console.log('session', session.value)
		return session.value && (await session.value?.getFS())
	}

	const handleAuthOk = () => {
	}
	onMounted(async () => {
		// @ts-ignore
		session.value = instance?.proxy.$sessionManager.getSessionInstanceById(props.sessionId)
		fsInstance.value = await session.value.getFS()
		// 绑定控制事件
		session.value.on('control', (data: any) => {
			dialogRef.value?.show(data)
		})
		// 绑定销毁事件
		session.value.on('close', () => {
			// destroy sftp instance
			// debugger
			// this.$el.parentNode.removeChild(this.$el)
		})
		// 解构获取sftp信息
		const { sftpDirt, username, hostAddress, uuid } = session.value.cfg
		sftp.dir = sftpDirt
		sftp.hostInfo = {
			username: username,
			host: hostAddress,
			uuid: uuid
		}

		nextTick(async () => {
			const fs = await session.value.getFs()
			const dir = await fs.readdir('/')
			console.log('dir', fs, dir)
		})
	})
	onUnmounted(async () => {
		console.log('销毁')
		fsInstance.value?.dispose()
	})
</script>

<style scoped></style>
