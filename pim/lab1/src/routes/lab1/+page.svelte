
<script lang="ts">
	import * as ExifReader from "exifreader"
	import { rotate90Wasm } from "$lib/core/wasm"
	import { onMount } from "svelte";

	import { drawHistogram } from "$lib/core/histogram";
	import { pushHistory, resetHistory, undo } from "$lib/core/history";
	import Kernel from "$lib/islands/Kernel.svelte";
	import Morphs from "$lib/islands/Morphs.svelte";
	import Filters from "$lib/islands/Filters.svelte";

	let file: File | null = null
	let imageUrl: string | null = null
	let canvas: HTMLCanvasElement
	let ctx: CanvasRenderingContext2D | null = null

	let histCanvas: HTMLCanvasElement
	let histCtx: CanvasRenderingContext2D 

	let originalImageData: ImageData | null = null

	let fileSize = ""
	let resolution = ""
	let format = ""
	let colorDepth = ""
	let colorModel = "RGB"
	let exifInfo: Record<string, any> = {}

	let brightness = 100
	let contrast = 100
	let saturation = 100
	let grayscale = false

	let se: Int32Array = new Int32Array([1,1,1,1,1,1,1,1,1])
	let seW = 3
	let seH = 3
	let kW = 3
	let kH = 3
	let kernel: Float32Array = new Float32Array([0, -1, 0, -1, 5, -1, 0, -1, 0])

	let activeTab: "filters" | "morphs" | "kernel" = "filters"

	const rotate90 = () => {
		const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height)

		if (!imageData) return

		const rotated = rotate90Wasm(imageData)

		canvas.width = rotated.width
		canvas.height = rotated.height
		ctx!.putImageData(rotated, 0, 0)

		originalImageData = rotated

		pushHistory(rotated, rotated.width, rotated.height)
	}

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

	const handleFileUpload = async (e: Event) => {
		const input = e.target as HTMLInputElement

		if (input.files && input.files[0]) {
			file = input.files[0]
			imageUrl = URL.createObjectURL(file)

			fileSize = (file.size / 1024).toFixed(2) + " KB"

			format = file.type

			const tags = await ExifReader.load(await file.arrayBuffer())
			exifInfo = {
				Camera: tags["Model"]?.description,
				Make: tags["Make"]?.description,
				Lens: tags["LensModel"]?.description,
				ISO: tags["ISOSpeedRatings"]?.description,
				Date: tags["DateTimeOriginal"]?.description,
			}

			const img = new Image()

			img.src = imageUrl
			img.onload = () => {
				resolution = `${img.width}x${img.height}`
				colorDepth = "24-bit" 
				canvas.width = img.width
				canvas.height = img.height
				ctx = canvas.getContext("2d")
				ctx?.drawImage(img, 0, 0)

				originalImageData = ctx!.getImageData(0, 0, canvas.width, canvas.height)

				resetHistory(originalImageData, originalImageData.width, originalImageData.height)
			}
		}
	}

	const saveImage = () => {
		const link = document.createElement("a")

		link.download = "processed.png"
		link.href = canvas.toDataURL()
		link.click()
	}

	onMount(async () => {
		await initWasm()
	})

	$: if (histCanvas) {
		histCtx = histCanvas.getContext("2d") as CanvasRenderingContext2D
	}

</script>



<div class="min-h-screen bg-dots p-6 space-y-6">
	{#if !imageUrl}
		<div class="flex items-center justify-center w-full">
			<label
				for="dropzone-file"
				class="flex flex-col items-center justify-center w-[80vw] h-[75vh] border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-bg"
			>
				<div
					class="flex flex-col items-center justify-center pt-5 pb-6"
				>
					<svg
						class="w-8 h-8 mb-4 text-gray-500"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 20 16"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
						/>
					</svg>
					<p class="mb-2 text-sm text-gray-500">
						Загрузить файл
					</p>
					<p class="text-xs text-gray-500">
						SVG, PNG, JPG or GIF
					</p>
				</div>
				<input 
					id="dropzone-file" 
					accept="image/*"
					type="file"
					on:change={handleFileUpload} class="hidden" />
			</label>
		</div>
	{:else}
		<div
			class="max-w-full max-h-[60vh] grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-bg border-2 border-border rounded-lg"
		>	
			<div class="h-full flex flex-col justify-between">
				<div class="relative space-y-2">
					<p>Размер: {fileSize}</p>
					<p>Разрешение: {resolution}</p>
					<p>Глубина цвета: {colorDepth}</p>
					<p>Формат: {format}</p>
					<p>Цветовая модель: {colorModel}</p>
					<p>EXIF:</p>
					<ul class="list-disc ml-6">
						{#each Object.entries(exifInfo) as [key, val]}
							<li>{key}: {val}</li>
						{/each}
					</ul>
					
				</div>
				<div class="w-full h-12 max-w-lg border border-border rounded-full bottom-4 opacity-75">
            		<div class="grid h-full max-w-lg grid-cols-3 mx-auto">
					<button
						class="px-4 py-2 cursor-pointer hover:font-black duration-300"
						on:click={rotate90}>Повернуть 90°</button
					>
					<button class="px-4 py-2 bg-border uppercase cursor-pointer hover:font-black duration-300" on:click={undoStep}>ctrl + z</button>
					<button
						class="px-4 py-2 cursor-pointer hover:font-black duration-300"
						on:click={saveImage}>Сохранить</button
					>
					</div>
				</div>
			</div>
			

			<canvas
				bind:this={canvas}
				
				class="max-w-[50vw] max-h-[50vh] border rounded shadow"
			>
			</canvas>
		</div>
		<div class="flex items-end">
			<div class="flex flex-1 flex-col">
				<div class="flex items-end ml-6">
					<button class="px-6 bg-border rounded-tl-full border-t-2 border-x-2 border-border cursor-pointer duration-300" class:py-1={activeTab === "filters"} on:click={() => (activeTab = "filters")}>Фильтры</button>
					<button class="px-6 bg-border border-t-2 border-x-2 border-border cursor-pointer duration-300" class:py-1={activeTab === "morphs"} on:click={() => (activeTab = "morphs")}>Морфы</button>
					<button class="px-6 bg-border rounded-tr-full border-t-2 border-x-2 border-border cursor-pointer duration-300" class:py-1={activeTab === "kernel"} on:click={() => (activeTab = "kernel")}>Ядро</button>
				</div>
				<div class="max-w-full h-48 flex flex-col justify-center items-start p-6 bg-bg border-2 border-border rounded-lg">
					{#if activeTab === "filters"}
						<Filters bind:brightness bind:contrast bind:saturation bind:grayscale {canvas} {ctx} {originalImageData} {histCanvas} {histCtx} />
					{:else if activeTab === "morphs"}
						<Morphs bind:se bind:seW bind:seH {canvas} {ctx} {originalImageData} {histCanvas} {histCtx} />
					{:else if activeTab === "kernel"}
						<Kernel bind:kernel bind:kW bind:kH {canvas} {ctx} {originalImageData} {histCanvas} {histCtx} />
					{/if}
				</div>
			</div>
			<div class="ml-6 p-6 bg-bg border-2 border-border rounded-lg">
				<canvas bind:this={histCanvas} width="512" height="200" class="w-full h-48 bg-black rounded"></canvas>
			</div>
		</div>
	{/if}
</div>
