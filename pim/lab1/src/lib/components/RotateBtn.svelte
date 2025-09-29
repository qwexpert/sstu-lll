<script lang="ts">
	import { pushHistory } from "$lib/core/history";
	import { rotate90Wasm } from "$lib/core/wasm"

    export let canvas: HTMLCanvasElement
    export let ctx: CanvasRenderingContext2D | null
    export let originalImageData: ImageData | null

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
</script>

<button class="px-4 py-2 cursor-pointer hover:font-black duration-300" on:click={rotate90}>Повернуть 90°</button>