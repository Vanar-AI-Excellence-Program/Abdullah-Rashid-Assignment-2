<script lang="ts">
	import { marked } from 'marked';

	interface Props {
		content: string;
	}

	let { content }: Props = $props();

	// Configure marked options
	marked.setOptions({
		gfm: true,
		breaks: true
	});

	let html = $derived(marked.parse(content) as string);
</script>

<div class="markdown-content prose prose-sm max-w-none">
	{@html html}
</div>

<style>
	.markdown-content :global(h1) {
		font-size: 1.5rem;
		font-weight: 700;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
		color: inherit;
	}

	.markdown-content :global(h2) {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
		color: inherit;
	}

	.markdown-content :global(h3) {
		font-size: 1.1rem;
		font-weight: 600;
		margin-top: 0.75rem;
		margin-bottom: 0.5rem;
		color: inherit;
	}

	.markdown-content :global(p) {
		margin-bottom: 0.5rem;
		line-height: 1.6;
	}

	.markdown-content :global(p:last-child) {
		margin-bottom: 0;
	}

	.markdown-content :global(ul),
	.markdown-content :global(ol) {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
	}

	.markdown-content :global(li) {
		margin-bottom: 0.25rem;
	}

	.markdown-content :global(code) {
		background-color: rgba(0, 0, 0, 0.1);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-size: 0.875em;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	}

	.markdown-content :global(pre) {
		background-color: #1e293b;
		color: #e2e8f0;
		padding: 1rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		margin: 0.75rem 0;
	}

	.markdown-content :global(pre code) {
		background-color: transparent;
		padding: 0;
		color: inherit;
	}

	.markdown-content :global(blockquote) {
		border-left: 4px solid #6366f1;
		padding-left: 1rem;
		margin: 0.75rem 0;
		color: inherit;
		opacity: 0.9;
		font-style: italic;
	}

	.markdown-content :global(a) {
		color: #6366f1;
		text-decoration: underline;
	}

	.markdown-content :global(a:hover) {
		color: #4f46e5;
	}

	.markdown-content :global(strong) {
		font-weight: 600;
	}

	.markdown-content :global(em) {
		font-style: italic;
	}

	.markdown-content :global(hr) {
		border: none;
		border-top: 1px solid currentColor;
		opacity: 0.2;
		margin: 1rem 0;
	}

	.markdown-content :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 0.75rem 0;
		font-size: 0.875rem;
	}

	.markdown-content :global(th),
	.markdown-content :global(td) {
		border: 1px solid rgba(0, 0, 0, 0.1);
		padding: 0.5rem;
		text-align: left;
	}

	.markdown-content :global(th) {
		background-color: rgba(0, 0, 0, 0.05);
		font-weight: 600;
	}

	/* Adjust colors for dark backgrounds (user messages) */
	:global(.bg-indigo-500) .markdown-content :global(code) {
		background-color: rgba(255, 255, 255, 0.2);
	}

	:global(.bg-indigo-500) .markdown-content :global(pre) {
		background-color: rgba(0, 0, 0, 0.3);
	}

	:global(.bg-indigo-500) .markdown-content :global(a) {
		color: #c7d2fe;
	}

	:global(.bg-indigo-500) .markdown-content :global(th),
	:global(.bg-indigo-500) .markdown-content :global(td) {
		border-color: rgba(255, 255, 255, 0.2);
	}

	:global(.bg-indigo-500) .markdown-content :global(th) {
		background-color: rgba(255, 255, 255, 0.1);
	}
</style>