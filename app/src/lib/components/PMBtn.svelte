<script lang="ts">

    export let label = "Value"
    export let value = 100
    export let min = 0
    export let max = 200
    export let step = 1
    export let onChange: (() => void) | null = null

    const clampValue = (val: number) => Math.min(max, Math.max(min, val))

    const handleInput = (e: Event) => {
        const target = e.target as HTMLInputElement
        target.value = target.value.replace(/\D/g, '')
        value = clampValue(Number(target.value))
        onChange?.()
    }

    const minus = () => {
        value = clampValue(value - step)
        onChange?.()
    }

    const plus = () => {
        value = clampValue(value + step)
        onChange?.()
    }
</script>

<form class="w-full flex justify-between items-center space-x-2">
    <label for="btn" class="text-sm font-medium text-gray-400">{label}</label>
    <div id="btn" class="relative flex items-start max-w-[8rem]">
        <button type="button" on:click={minus} class="bg-border border border-border rounded-s-lg p-3 h-11 focus:ring-[#343434] focus:ring-2 focus:outline-none cursor-pointer">-</button>
        <input
        type="text"
        bind:value={value}
        on:input={handleInput}
        class="appearance-none bg-border border-x-0 border-border h-11 text-center text-gray-400 text-sm focus:outline-none block w-full py-2.5"
        placeholder={String(max)}
        required
        />
        <button type="button" on:click={plus} class="bg-border border border-border rounded-e-lg p-3 h-11 focus:ring-[#343434] focus:ring-2 focus:outline-none cursor-pointer">+</button>
    </div>
</form>
