<template>
	<nx-modal title="home.fileview.rename-dialog.title" :visible="visible" @cancel="cancel" @ok="ok">
		<el-form ref="renameFormRef" :model="renameForm" :rules="rules" label-width="100px" class="demo-ruleForm">
			<el-form-item label="文件名称" prop="dirname">
				<el-input v-model="renameForm.dirname" :placeholder="t('home.fileview.rename-dialog.placeholder')" />
			</el-form-item>
		</el-form>
	</nx-modal>
</template>

<script lang="ts" setup>

import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n-bridge";

const { t } = useI18n()
const visible = ref(false)
const renameFormRef = ref()
const renameForm = reactive<{ dirname: string }>({ dirname: '' })
const emits = defineEmits(['ok'])
const validString = (rule: any, value: string, callback: Function) => {
	const reg = new RegExp('[\\\\/:*?"<>|]')
	if (reg.test(value)) {
		callback(new Error(t('home.fileview.rename-dialog.invalid-name', ['\\ / : * ? < > " |'])));
	} else {
		callback();
	}
}
const rules = {
	dirname: [
		{
			required: true,
			message: t('home.fileview.rename-dialog.invalid-name', ['\\ / : * ? < > " |']),
			trigger: 'change'
		},
		{
			validator: validString,
			trigger: 'change'
		}
	]
}
const show = (fileName?: string) => {
	visible.value = true
	renameForm.dirname = fileName || ''
}

const cancel = () => {
	visible.value = false
}

const ok = () => {
	renameFormRef.value?.validate((valid: boolean) => {
		valid && emits('ok', renameForm.dirname)
	});
}
defineExpose({ show })
</script>