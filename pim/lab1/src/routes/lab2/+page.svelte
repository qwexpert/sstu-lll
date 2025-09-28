<script lang="ts">
	import * as ExifReader from "exifreader";
	import { onMount } from "svelte";
	// Импортируй свою обёртку над WASM (файл который экспортирует initWasm и функции)
	// <- реализуй этот модуль при сборке WASM

	// UI / state
	let file: File | null = null;
	let imageUrl: string | null = null;
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;

	let originalImageData: ImageData | null = null;

	let fileSize = "";
	let resolution = "";
	let format = "";
	let colorDepth = "";
	let colorModel = "RGB";
	let exifInfo: Record<string, any> = {};

	// controls
	let selectedMorph = "erosion";
	const morphOps = [
		{ id: "erosion", label: "Эрозия" },
		{ id: "dilation", label: "Дилатация" },
		{ id: "opening", label: "Открытие" },
		{ id: "closing", label: "Закрытие" },
		{ id: "gradient", label: "Градиент" },
		{ id: "tophat", label: "Цилиндр (Top-hat)" },
		{ id: "blackhat", label: "Чёрная шляпа" },
	];

	// structural element matrix input (user editable)
	let kernelText = "1 1 1\n1 1 1\n1 1 1"; // default 3x3 square
	let kernelDivisor = 1; // for convolution kernels when used
	let kernelOffset = 0;

	// other effects params
	let sharpenAmount = 1; // if implemented in WASM
	let motionRadius = 10;
	let motionAngle = 0;

	// median params
	let medianRadius = 1;

	// helpers
	const handleFileUpload = async (e: Event) => {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			file = input.files[0];
			imageUrl = URL.createObjectURL(file);

			fileSize = (file.size / 1024).toFixed(2) + " KB";
			format = file.type;

			const tags = await ExifReader.load(await file.arrayBuffer());
			exifInfo = {
				Camera: tags["Model"]?.description,
				Make: tags["Make"]?.description,
				Lens: tags["LensModel"]?.description,
				ISO: tags["ISOSpeedRatings"]?.description,
				Date: tags["DateTimeOriginal"]?.description,
			};

			const img = new Image();
			img.src = imageUrl;
			img.onload = () => {
				resolution = `${img.width}x${img.height}`;
				colorDepth = "24-bit";
				canvas.width = img.width;
				canvas.height = img.height;
				ctx = canvas.getContext("2d");
				ctx?.drawImage(img, 0, 0);
				originalImageData = ctx!.getImageData(
					0,
					0,
					canvas.width,
					canvas.height
				);
			};
		}
	};

	// parse kernel text -> number[][]
	function parseKernel(text: string): number[][] {
		const rows = text
			.trim()
			.split(/\r?\n/)
			.map((r) => r.trim())
			.filter((r) => r.length > 0);
		const matrix: number[][] = rows.map((r) =>
			r.split(/\s+/).map((v) => Number(v))
		);
		// basic validation: rectangular
		const width = matrix[0].length;
		for (const row of matrix) {
			if (row.length !== width) {
				throw new Error(
					"Структурный элемент должен быть прямоугольной матрицей"
				);
			}
		}
		return matrix;
	}

	// Apply morphological operation via WASM
	const applyMorphology = async () => {
		if (!originalImageData || !ctx) return;
		try {
			const kernel = parseKernel(kernelText);
			// applyMorphologyWasm expected to return ImageData
			const processed: ImageData = await applyMorphologyWasm(
				originalImageData,
				selectedMorph,
				kernel
			);
			ctx.putImageData(processed, 0, 0);
			originalImageData = processed;
		} catch (err) {
			console.error("Kernel parse / morphology error:", err);
			alert("Ошибка: " + err.message);
		}
	};

	// Sharpen (WASM)
	const applySharpen = async () => {
		if (!originalImageData || !ctx) return;
		const processed: ImageData = await sharpenWasm(
			originalImageData,
			sharpenAmount
		);
		ctx.putImageData(processed, 0, 0);
		originalImageData = processed;
	};

	// Motion blur (linear blur along angle)
	const applyMotionBlur = async () => {
		if (!originalImageData || !ctx) return;
		const processed: ImageData = await motionBlurWasm(
			originalImageData,
			motionRadius,
			motionAngle
		);
		ctx.putImageData(processed, 0, 0);
		originalImageData = processed;
	};

	// Emboss (WASM)
	const applyEmboss = async () => {
		if (!originalImageData || !ctx) return;
		const processed: ImageData = await embossWasm(originalImageData);
		ctx.putImageData(processed, 0, 0);
		originalImageData = processed;
	};

	// Apply custom convolution kernel (user matrix)
	const applyCustomKernel = async () => {
		if (!originalImageData || !ctx) return;
		try {
			const kernel = parseKernel(kernelText);
			const processed: ImageData = await applyKernelWasm(
				originalImageData,
				kernel,
				kernelDivisor,
				kernelOffset
			);
			ctx.putImageData(processed, 0, 0);
			originalImageData = processed;
		} catch (err) {
			console.error(err);
			alert("Ошибка парсинга ядра: " + err.message);
		}
	};

	// Median filter
	const applyMedian = async () => {
		if (!originalImageData || !ctx) return;
		const processed: ImageData = await medianFilterWasm(
			originalImageData,
			medianRadius
		);
		ctx.putImageData(processed, 0, 0);
		originalImageData = processed;
	};

	// rotate90 (uses wasm helper)
	const rotate90 = async () => {
		if (!originalImageData || !ctx) return;
		const rotated: ImageData = await rotate90Wasm(originalImageData);
		canvas.width = rotated.width;
		canvas.height = rotated.height;
		ctx.putImageData(rotated, 0, 0);
		originalImageData = rotated;
	};

	// Save current canvas (use temp canvas to ensure size)
	const saveImage = () => {
		if (!originalImageData) return;
		const tempCanvas = document.createElement("canvas");
		const tempCtx = tempCanvas.getContext("2d");
		if (!tempCtx) return;
		tempCanvas.width = originalImageData.width;
		tempCanvas.height = originalImageData.height;
		tempCtx.putImageData(originalImageData, 0, 0);
		const link = document.createElement("a");
		link.download = "lab2-processed.png";
		link.href = tempCanvas.toDataURL("image/png");
		link.click();
	};

	// Histogram drawing (reuse pattern)
	let histCanvas: HTMLCanvasElement;
	let histCtx: CanvasRenderingContext2D;
	const drawHistogram = (imageData: ImageData) => {
		if (!imageData || !histCtx) return;
		histCtx.clearRect(0, 0, histCanvas.width, histCanvas.height);

		const binsR = new Array(256).fill(0);
		const binsG = new Array(256).fill(0);
		const binsB = new Array(256).fill(0);

		const data = imageData.data;
		for (let i = 0; i < data.length; i += 4) {
			binsR[data[i]]++;
			binsG[data[i + 1]]++;
			binsB[data[i + 2]]++;
		}

		const maxVal = Math.max(
			Math.max(...binsR),
			Math.max(...binsG),
			Math.max(...binsB)
		);
		const w = histCanvas.width;
		const h = histCanvas.height;
		const scale = h / (maxVal || 1);

		for (let i = 0; i < 256; i++) {
			const x = (i / 256) * w;
			histCtx.fillStyle = "red";
			histCtx.fillRect(x, h, w / 256, -binsR[i] * scale);
			histCtx.fillStyle = "green";
			histCtx.fillRect(x, h, w / 256, -binsG[i] * scale);
			histCtx.fillStyle = "blue";
			histCtx.fillRect(x, h, w / 256, -binsB[i] * scale);
		}
	};

	// onMount init WASM
	onMount(async () => {
		await initWasm();
		if (histCanvas)
			histCtx = histCanvas.getContext("2d") as CanvasRenderingContext2D;
	});

	// Reactive: whenever originalImageData changes, redraw histogram
	$: if (originalImageData && histCtx) {
		drawHistogram(originalImageData);
	}
</script>

<div class="min-h-screen bg-dots p-6 space-y-6">
	{#if !imageUrl}
		<div class="flex items-center justify-center w-full">
			<label
				for="dropzone-file"
				class="flex flex-col items-center justify-center w-[80vw] h-[75vh] border-2 border-[#343434] border-dashed rounded-lg cursor-pointer panel"
			>
				<div
					class="flex flex-col items-center justify-center pt-5 pb-6"
				>
					<svg
						class="w-8 h-8 mb-4 text-gray-500"
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
					<p class="mb-2 text-sm text-gray-500">Загрузить файл</p>
					<p class="text-xs text-gray-500">SVG, PNG, JPG или GIF</p>
				</div>
				<input
					id="dropzone-file"
					accept="image/*"
					type="file"
					on:change={handleFileUpload}
					class="hidden"
				/>
			</label>
		</div>
	{:else}
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<div class="col-span-2 panel space-y-4">
				<div class="flex justify-between items-start">
					<div>
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

					<div class="flex flex-col gap-2">
						<button
							class="px-3 py-1 border border-blue-600 text-blue-600 rounded"
							on:click={rotate90}>Повернуть 90°</button
						>
						<button
							class="px-3 py-1 border border-green-600 text-green-600 rounded"
							on:click={saveImage}>Сохранить</button
						>
					</div>
				</div>

				<div class="flex gap-4">
					<div class="flex-1">
						<canvas
							bind:this={canvas}
							class="w-full border rounded shadow"
						></canvas>
					</div>

					<div class="w-64 space-y-3">
						<div class="control">
							<label class="block text-sm font-medium mb-1"
								>Морфология</label
							>
							<select
								bind:value={selectedMorph}
								class="w-full bg-[#0f0f0f] text-white p-2 rounded"
							>
								{#each morphOps as m}
									<option value={m.id}>{m.label}</option>
								{/each}
							</select>
							<button
								class="mt-2 px-3 py-1 border rounded w-full"
								on:click={applyMorphology}>Применить</button
							>
						</div>

						<div class="control">
							<label class="block text-sm font-medium mb-1"
								>Структурный элемент (матрица)</label
							>
							<textarea class="kernel" bind:value={kernelText}
							></textarea>
							<div class="flex gap-2 mt-2">
								<input
									type="number"
									bind:value={kernelDivisor}
									class="w-1/2 p-1 bg-[#0f0f0f] rounded"
									placeholder="divisor"
								/>
								<input
									type="number"
									bind:value={kernelOffset}
									class="w-1/2 p-1 bg-[#0f0f0f] rounded"
									placeholder="offset"
								/>
							</div>
							<button
								class="mt-2 px-3 py-1 border rounded w-full"
								on:click={applyCustomKernel}
								>Применить ядро</button
							>
						</div>

						<div class="control">
							<label class="block text-sm font-medium mb-1"
								>Медианная фильтрация (радиус)</label
							>
							<input
								type="number"
								min="1"
								bind:value={medianRadius}
								class="w-full p-2 bg-[#0f0f0f] rounded"
							/>
							<button
								class="mt-2 px-3 py-1 border rounded w-full"
								on:click={applyMedian}>Применить медиану</button
							>
						</div>

						<div class="control">
							<label class="block text-sm font-medium mb-1"
								>Резкость</label
							>
							<input
								type="range"
								min="0"
								max="5"
								step="0.5"
								bind:value={sharpenAmount}
								class="w-full"
							/>
							<button
								class="mt-2 px-3 py-1 border rounded w-full"
								on:click={applySharpen}
								>Применить резкость</button
							>
						</div>

						<div class="control">
							<label class="block text-sm font-medium mb-1"
								>Размытие в движении</label
							>
							<input
								type="number"
								min="1"
								bind:value={motionRadius}
								class="w-full p-1 bg-[#0f0f0f] rounded"
							/>
							<input
								type="number"
								min="0"
								max="360"
								bind:value={motionAngle}
								class="w-full p-1 bg-[#0f0f0f] rounded mt-1"
							/>
							<button
								class="mt-2 px-3 py-1 border rounded w-full"
								on:click={applyMotionBlur}
								>Применить motion blur</button
							>
						</div>

						<div class="control">
							<label class="block text-sm font-medium mb-1"
								>Тиснение</label
							>
							<button
								class="px-3 py-1 border rounded w-full"
								on:click={applyEmboss}
								>Применить тиснение</button
							>
						</div>
					</div>
				</div>
			</div>

			<div class="panel">
				<h3 class="font-semibold mb-2">Гистограмма</h3>
				<canvas
					bind:this={histCanvas}
					width="512"
					height="200"
					class="w-full h-48 bg-black rounded"
				></canvas>
				<div class="mt-4">
					<p class="font-semibold">Дополнительно</p>
					<ul class="list-disc ml-6 text-sm">
						<li>
							Структурный элемент задаётся матрицей — размерность
							любая.
						</li>
						<li>
							Морфологические комбинации (opening/closing) —
							реализованы в WASM.
						</li>
						<li>
							Все тяжёлые операции выполняются в Rust/C и
							возвращают ImageData.
						</li>
					</ul>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.panel {
		background: #121212;
		border: 2px solid #232323;
		padding: 1rem;
		border-radius: 0.5rem;
	}
	.control {
		margin-bottom: 0.5rem;
	}
	textarea.kernel {
		width: 100%;
		height: 80px;
		background: #0f0f0f;
		color: #e6e6e6;
		padding: 0.5rem;
		border-radius: 0.25rem;
		border: 1px solid #2b2b2b;
	}
</style>
