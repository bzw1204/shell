<template>
	<el-dialog
		:title="t(props.title)"
		:close-on-click-modal="false"
		:show-close="false"
		:append-to-body="true"
		width="400px"
		v-bind="$attrs"
	>
		<slot name="default" />
		<div slot="footer" class="dialog-footer">
			<el-button @click="cancel">{{ t('components.Cancel') }}</el-button>
			<el-button type="primary" @click="ok">{{ t('components.OK') }}</el-button>
		</div>
	</el-dialog>
</template>

<script lang="ts">
export default {
	name: 'NxModal'
}
</script>

<script lang="ts" setup>
import { useI18n } from "vue-i18n-bridge";

interface IProps {
	title: string
}

const props = withDefaults(defineProps<IProps>(), {
	title: ''
})
const emits = defineEmits(['cancel', 'ok'])
const { t } = useI18n()

const cancel = () => {
	emits('cancel')
}

const ok = () => {
	emits('ok')
}

</script>