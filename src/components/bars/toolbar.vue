<template>
	<div class="pt-toolbar" :style="style">
		<div class="left">
			<slot name="left"></slot>
		</div>
		<div class="center" :style="centerStyle">
			<slot name="center"></slot>
		</div>
		<div class="right">
			<slot name="right"></slot>
		</div>
	</div>
</template>

<script>
export default {
	name: "PtToolbar",
	props: {
		/**
		 * 工具栏上的iconSize
		 */
		leftWidth: {
			type: Number,
			default: 0
		},
		rightWidth: {
			type: Number,
			default: 0
		},
		centerStyle: {
			type: Object,
			default() {
				return {}
			}
		},
		height: {
			type: Number,
			default: 40
		}
	},

	computed: {
		style() {
			return {
				height: this.height + "px"
			}
		}
	}
}
</script>

<style lang="scss">
.pt-toolbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: {
		left: 10px;
		right: 10px;
	}
	color: #FFFFFF;
	background-color: var(--n-bg-color-base);

	.left {
		flex-shrink: 0;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 5px;
		box-sizing: border-box;
		padding: 5px;
	}

	.center {
		flex-grow: 1;
	}

	.right {
		flex-shrink: 0;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 5px;
		box-sizing: border-box;
		padding: 5px;
	}
}
</style>
