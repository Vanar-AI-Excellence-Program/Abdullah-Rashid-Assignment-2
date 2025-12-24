<script lang="ts">
	interface Props {
		onSend: (message: string) => void;
		disabled?: boolean;
		placeholder?: string;
	}

	let { onSend, disabled = false, placeholder = 'Type your message...' }: Props = $props();

	let message = $state('');

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (message.trim() && !disabled) {
			onSend(message.trim());
			message = '';
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	}
</script>

<form onsubmit={handleSubmit} class="flex gap-3">
	<div class="flex-1 relative">
		<textarea
			bind:value={message}
			onkeydown={handleKeydown}
			{placeholder}
			{disabled}
			rows="1"
			class="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-50 disabled:cursor-not-allowed transition-all duration-200"
			style="min-height: 48px; max-height: 120px;"
		></textarea>
	</div>
<button
	type="submit"
	disabled={disabled || !message.trim()}
	aria-label="Send message"
	class="px-4 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
>
	<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
	</svg>
</button>
</form>