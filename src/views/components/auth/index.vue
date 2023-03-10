<template>
	<nx-modal title="components.auth.title" :visible.sync="visible">

	</nx-modal>
</template>

<script lang="ts" setup>
import NxModal from "@/components/modal/NxModal.vue";
import { onMounted, ref } from "vue";

const visible = ref(false)

const show = (data: Record<string, any>) => {
	const { type, username, data: methods } = data
}

onMounted(() => {

})

defineExpose({
	show
})
</script>