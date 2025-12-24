<script lang="ts">
	import MarkdownRenderer from './MarkdownRenderer.svelte';

	interface Props {
		role: 'user' | 'assistant';
		content: string;
		isLoading?: boolean;
		isStreaming?: boolean;
	}

	let { role, content, isLoading = false, isStreaming = false }: Props = $props();
</script>

<div class="flex gap-4 {role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in">
	<!-- Avatar -->
	<div class="flex-shrink-0">
		{#if role === 'user'}
			<div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
				<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
				</svg>
			</div>
		{:else}
			<div class="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
				<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
				</svg>
			</div>
		{/if}
	</div>

	<!-- Message Content -->
	<div class="flex-1 max-w-[80%] {role === 'user' ? 'text-right' : ''}">
		<div class="inline-block px-4 py-3 rounded-2xl {
			role === 'user' 
				? 'bg-indigo-500 text-white rounded-tr-sm' 
				: 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
		}">
			{#if isLoading}
				<div class="flex items-center gap-1.5 py-1">
					<span class="w-2 h-2 bg-current rounded-full animate-bounce opacity-60" style="animation-delay: 0ms"></span>
					<span class="w-2 h-2 bg-current rounded-full animate-bounce opacity-60" style="animation-delay: 150ms"></span>
					<span class="w-2 h-2 bg-current rounded-full animate-bounce opacity-60" style="animation-delay: 300ms"></span>
				</div>
			{:else}
				<div class="text-sm">
					<MarkdownRenderer {content} />
					{#if isStreaming}
						<span class="inline-block w-2 h-4 bg-current animate-pulse ml-0.5 align-middle"></span>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	@keyframes fade-in {
		from { opacity: 0; transform: translateY(8px); }
		to { opacity: 1; transform: translateY(0); }
	}
	.animate-fade-in {
		animation: fade-in 0.3s ease-out;
	}
</style>