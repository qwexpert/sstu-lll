<script lang="ts">
	import * as ExifReader from "exifreader";
	export let onFileUpload: (file: File, imageData: ImageData) => void;

	let input: HTMLInputElement;
	let imageUrl: string | null = null;

	const handleFileUpload = async (e: Event) => {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;

		imageUrl = URL.createObjectURL(file);

		const img = new Image();
		img.src = imageUrl;
		await img.decode();

		const canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		const ctx = canvas.getContext("2d")!;
		ctx.drawImage(img, 0, 0);
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

		onFileUpload(file, imageData);
	};
</script>

<div class="flex items-center justify-center w-full">
    <label
        for="dropzone-file"
        class="flex flex-col items-center justify-center w-[80vw] h-[75vh] border-2 border-[#343434] border-dashed rounded-lg cursor-pointer bg-[#121212]"
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
            bind:this={input}
            on:change={handleFileUpload} class="hidden" />
    </label>
</div>