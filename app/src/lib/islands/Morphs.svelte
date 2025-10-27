<script lang="ts">
	import PMBtn from "$lib/components/PMBtn.svelte"
	import { drawHistogram } from "$lib/core/histogram";
	import { pushHistory } from "$lib/core/history";
	import { blackhatWasm, closingWasm, cylinderWasm, dilationWasm, erosionWasm, gradientWasm, openingWasm } from "$lib/core/wasm";

	export let se: Int32Array
	export let seW: number
	export let seH: number

	export let canvas: HTMLCanvasElement
	export let ctx: CanvasRenderingContext2D | null
	export let originalImageData: ImageData | null
	export let histCanvas: HTMLCanvasElement
	export let histCtx: CanvasRenderingContext2D

	const applyErosion = () => {
		if (!originalImageData) return

		const processed = erosionWasm(originalImageData, se, seW, seH)

		ctx!.putImageData(processed, 0, 0)
		originalImageData = processed
		
		drawHistogram(processed, histCtx, histCanvas)
		pushHistory(processed, processed.width, processed.height)
	}

	const applyDilation = () => {
		if (!originalImageData) return

		const processed = dilationWasm(originalImageData, se, seW, seH)

		ctx!.putImageData(processed, 0, 0)
		originalImageData = processed

		drawHistogram(processed, histCtx, histCanvas)
		pushHistory(processed, processed.width, processed.height)
	}

	const applyOpening = () => {
		if (!originalImageData) return

		const processed = openingWasm(originalImageData, se, seW, seH)

		ctx!.putImageData(processed, 0, 0)
		originalImageData = processed
		
		drawHistogram(processed, histCtx, histCanvas)
		pushHistory(processed, processed.width, processed.height)
	}

	const applyClosing = () => {
		if (!originalImageData) return

		const processed = closingWasm(originalImageData, se, seW, seH)

		ctx!.putImageData(processed, 0, 0)
		originalImageData = processed
		
		drawHistogram(processed, histCtx, histCanvas)
		pushHistory(processed, processed.width, processed.height)
	}

	const applyGradient = () => {
		if (!originalImageData) return

		const processed = gradientWasm(originalImageData, se, seW, seH)

		ctx!.putImageData(processed, 0, 0)
		originalImageData = processed
		
		drawHistogram(processed, histCtx, histCanvas)
		pushHistory(processed, processed.width, processed.height)
	}

	const applyCylinder = () => {
		if (!originalImageData) return

		const processed = cylinderWasm(originalImageData, se, seW, seH)

		ctx!.putImageData(processed, 0, 0)
		originalImageData = processed
		
		drawHistogram(processed, histCtx, histCanvas)
		pushHistory(processed, processed.width, processed.height)
	}

	const applyBlackHat = () => {
		if (!originalImageData) return

		const processed = blackhatWasm(originalImageData, se, seW, seH)

		ctx!.putImageData(processed, 0, 0)
		originalImageData = processed
		
		drawHistogram(processed, histCtx, histCanvas)
		pushHistory(processed, processed.width, processed.height)
	}
</script>

<div class="flex space-x-4 items-end">
	<div class="flex flex-col space-y-2">
		<PMBtn label="SE ширина" bind:value={seW} min={0} max={200} step={1}  />
		<PMBtn label="SE высота" bind:value={seH} min={0} max={200} step={1}  />
		<div class="flex">
			<label for="textarea" class="mr-2 text-gray-400">SE </label>
			<textarea rows="3" bind:value={se} class="w-48 px-2 py-1 rounded bg-border text-gray-400"></textarea>
		</div>
	</div>
	<div class="ml-6 flex flex-wrap self-start space-x-2 space-y-2">
		<button on:click={applyErosion} class="relative overflow-hidden rounded-md bg-border px-5 py-2.5 text-gray-400 duration-300 cursor-pointer [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:translate-y-1 active:scale-x-110 active:scale-y-90">Эрозия</button>
		<button on:click={applyDilation} class="inline-flex h-12 items-center justify-center rounded-md bg-border px-6 font-medium text-gray-400 transition cursor-pointer active:scale-95">Дилатация</button>
		<button on:click={applyOpening} class="relative overflow-hidden rounded-md bg-border px-5 py-2.5 text-gray-400 duration-300 cursor-pointer [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:translate-y-1 active:scale-x-110 active:scale-y-90">Открытие</button>
		<button on:click={applyClosing} class="inline-flex h-12 items-center justify-center rounded-md bg-border px-6 font-medium text-gray-400 transition cursor-pointer active:scale-95">Закрытие</button>
		<button on:click={applyGradient} class="inline-flex h-12 items-center justify-center rounded-md bg-border px-6 font-medium text-gray-400 transition cursor-pointer active:scale-95">Градиент</button>
		<button on:click={applyCylinder} class="relative overflow-hidden rounded-md bg-border px-5 py-2.5 text-gray-400 duration-300 cursor-pointer [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:translate-y-1 active:scale-x-110 active:scale-y-90">Цилиндр</button>
		<button on:click={applyBlackHat} class="inline-flex h-12 items-center justify-center rounded-md bg-border px-6 font-medium text-gray-400 transition cursor-pointer active:scale-95">Черная шляпа</button>
	</div>
</div>
