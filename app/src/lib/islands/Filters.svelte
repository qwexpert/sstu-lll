<script lang="ts">
	import { applyFiltersWasm, initWasm } from "$lib/core/wasm"
	import { drawHistogram } from "$lib/core/histogram"
	import { pushHistory } from "$lib/core/history"
	import PMBtn from "$lib/components/PMBtn.svelte";
	import { onMount } from "svelte";

	export let brightness: number
	export let contrast: number
	export let saturation: number
	export let grayscale: boolean
	// svelte-ignore export_let_unused
	export let canvas: HTMLCanvasElement
	export let ctx: CanvasRenderingContext2D | null
	export let originalImageData: ImageData | null
	export let histCanvas: HTMLCanvasElement
	export let histCtx: CanvasRenderingContext2D

	const applyFilters = async () => {
		if (!originalImageData) return

		const processed = await applyFiltersWasm(
			originalImageData,
			brightness,
			contrast,
			saturation,
			grayscale
		)

		ctx!.putImageData(processed, 0, 0)
		drawHistogram(processed, histCtx, histCanvas)
		pushHistory(processed, processed.width, processed.height)
	}

	onMount(async () => await initWasm())
</script>

<div class="flex gap-6 items-center w-full">
	<div class="flex flex-col space-y-2 ">
		<PMBtn label="Яркость" bind:value={brightness} min={0} max={200} step={1} onChange={applyFilters} />
		<PMBtn label="Контраст" bind:value={contrast} min={0} max={200} step={1} onChange={applyFilters} />
		<PMBtn label="Насыщенность" bind:value={saturation} min={0} max={200} step={1} onChange={applyFilters} />

	</div>
	<div>
		<input type="checkbox" id="react-option" value="" class="hidden peer" bind:checked={grayscale} on:change={applyFilters} >
		<label for="react-option" class="inline-flex h-12 items-center justify-center px-6 py-20 rounded-md bg-border font-medium text-gray-400 transition cursor-pointer active:scale-95">Ч/Б</label>
	</div>
</div>

