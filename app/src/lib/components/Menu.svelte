<script lang="ts">
	import { goto } from "$app/navigation"
	import { drawHistogram } from "$lib/core/histogram"
	import { pushHistory, undo } from "$lib/core/history"
	import { rotate90Wasm } from "$lib/core/wasm"

	export let canvas: HTMLCanvasElement
	export let ctx: CanvasRenderingContext2D | null
	export let originalImageData: ImageData | null

	export let histCanvas: HTMLCanvasElement
	export let histCtx: CanvasRenderingContext2D

	export let brightness = 100
	export let contrast = 100
	export let saturation = 100
	export let grayscale = false

	const rotate90 = () => {
		const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height)

		if (!imageData) return

		const rotated = rotate90Wasm(imageData)

		canvas.width = rotated.width
		canvas.height = rotated.height
		ctx!.putImageData(rotated, 0, 0)

		originalImageData = rotated

		pushHistory(rotated, rotated.width, rotated.height)
	};

	const undoStep = () => {
		const prev = undo()

		if (!prev || !ctx) return

		canvas.width = prev.width
		canvas.height = prev.height

		ctx.putImageData(prev.imageData, 0, 0)
		originalImageData = prev.imageData

		brightness = 100
		contrast = 100
		saturation = 100
		grayscale = false

		drawHistogram(prev.imageData, histCtx, histCanvas)
	}

	const saveImage = () => {
		const link = document.createElement("a")

		link.download = "processed.png"
		link.href = canvas.toDataURL()
		link.click()
	}
</script>

<div class="w-full my-0 p-12 flex justify-center fixed bottom-0">
	<div
		class="fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-bg border border-border rounded-full bottom-4 left-1/2 transition duration-300 opacity-25 hover:opacity-75"
	>
		<div class="grid h-full max-w-lg grid-cols-4 mx-auto">
			<button
				on:click={() => goto("/")}
				data-tooltip-target="tooltip-home"
				type="button"
				class="inline-flex flex-col items-center justify-center px-5 rounded-s-full hover:bg-red-800/15 group cursor-pointer duration-300"
			>
				<svg class="w-5 h-5 mb-1 text-gray-400 group-hover:text-red-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  					<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"/>
				</svg>
				<span class="sr-only">Back</span>
			</button>
			<button
				on:click={rotate90}
				class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group cursor-pointer duration-300"
			>
				<svg
					class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="3"
						d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
					/>
				</svg>

				<span class="sr-only">Rotate</span>
			</button>
			<button
				on:click={undoStep}
				class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-800 group cursor-pointer duration-300"
			>
				<svg
					class="w-5 h-5 mb-1 text-gray-400 group-hover:text-blue-500"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="3"
						d="M3 9h13a5 5 0 0 1 0 10H7M3 9l4-4M3 9l4 4"
					/>
				</svg>

				<span class="sr-only">Undo</span>
			</button>
			<button
				on:click={saveImage}
				class="inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-green-800/15 group cursor-pointer duration-300"
			>
				<svg
					class="w-5 h-5 mb-1 text-gray-400 group-hover:text-green-500"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="3"
						d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4"
					/>
				</svg>

				<span class="sr-only">Save</span>
			</button>
		</div>
	</div>
</div>
