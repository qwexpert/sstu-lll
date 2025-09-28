<script lang="ts">
	import PMBtn from "$lib/components/PMBtn.svelte";
	import { drawHistogram } from "$lib/core/histogram";
	import { pushHistory } from "$lib/core/history";
	import { applyKernelWasm, embossWasm, motionBlurWasm, sharpenWasm } from "$lib/core/wasm";

	export let kernel: Float32Array
	export let kW: number
	export let kH: number

	export let canvas: HTMLCanvasElement
	export let ctx: CanvasRenderingContext2D | null
	export let originalImageData: ImageData | null
	export let histCanvas: HTMLCanvasElement
	export let histCtx: CanvasRenderingContext2D

	const applyCustomKernel = () => {
		if (!originalImageData) return

		const processed = applyKernelWasm(originalImageData, kernel, kW, kH)

		ctx!.putImageData(processed, 0, 0)
		originalImageData = processed

		drawHistogram(processed, histCtx, histCanvas)
		pushHistory(processed, processed.width, processed.height)
	}

	const applySharpen = () => {
		if (!originalImageData) return

		const processed = sharpenWasm(originalImageData)

		ctx!.putImageData(processed, 0, 0)
		originalImageData = processed
		
		drawHistogram(processed, histCtx, histCanvas)
		pushHistory(processed, processed.width, processed.height)
	}

	const applyMotionBlur = () => {
		if (!originalImageData) return

		const processed = motionBlurWasm(originalImageData)

		ctx!.putImageData(processed, 0, 0)
		originalImageData = processed
		
		drawHistogram(processed, histCtx, histCanvas)
		pushHistory(processed, processed.width, processed.height)
	}

	const applyEmboss = () => {
		if (!originalImageData) return

		const processed = embossWasm(originalImageData)

		ctx!.putImageData(processed, 0, 0)
		originalImageData = processed
		
		drawHistogram(processed, histCtx, histCanvas)
		pushHistory(processed, processed.width, processed.height)
	}
</script>

<div class="flex space-x-4 items-end">
	<div class="space-y-2">
		<PMBtn label="Kernel ширина" bind:value={kW} min={0} max={200} step={1}  />
		<PMBtn label="Kernel высота" bind:value={kH} min={0} max={200} step={1}  />
		<div class="flex">
			<label for="number" class="mr-2 text-gray-400">Kernel</label>
			<textarea id="number"  rows="3" bind:value={kernel} class="w-48 px-2 py-1 rounded bg-border text-gray-400"></textarea>
		</div>
	</div>
	<div class="self-center">
		<button on:click={applyCustomKernel} class="inline-flex h-12 items-center justify-center px-2 py-20 rounded-md bg-border font-medium text-gray-400 transition cursor-pointer active:scale-95">Применить</button>
	</div>
	<div>
		<button on:click={applySharpen} class="inline-flex h-12 items-center justify-center rounded-md bg-border px-6 font-medium text-gray-400 transition cursor-pointer active:scale-95">Резкость</button>
		<button on:click={applyMotionBlur} class="inline-flex h-12 items-center justify-center rounded-md bg-border px-6 font-medium text-gray-400 transition cursor-pointer active:scale-95">Размытие</button>
		<button on:click={applyEmboss} class="inline-flex h-12 items-center justify-center rounded-md bg-border px-6 font-medium text-gray-400 transition cursor-pointer active:scale-95">Тиснение</button>
	</div>
</div>
