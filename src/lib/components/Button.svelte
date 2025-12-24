<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		type?: 'button' | 'submit' | 'reset';
		variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		loading?: boolean;
		class?: string;
		onclick?: () => void;
		children?: Snippet;
	}

	let {
		type = 'button',
		variant = 'primary',
		size = 'md',
		disabled = false,
		loading = false,
		class: className = '',
		onclick,
		children
	}: Props = $props();

	const baseClasses = `
		inline-flex items-center justify-center font-medium rounded-xl
		transition-all duration-200 ease-out
		focus:outline-none focus:ring-2 focus:ring-offset-2
		disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
		transform hover:-translate-y-0.5 active:translate-y-0
	`;

	const variantClasses = {
		primary: `
			bg-gradient-to-r from-indigo-500 to-indigo-600 text-white
			hover:from-indigo-600 hover:to-indigo-700
			focus:ring-indigo-500
			shadow-md hover:shadow-lg
		`,
		secondary: `
			bg-white text-slate-700 border border-slate-200
			hover:bg-slate-50 hover:border-slate-300
			focus:ring-slate-500
			shadow-sm hover:shadow-md
		`,
		danger: `
			bg-gradient-to-r from-red-500 to-red-600 text-white
			hover:from-red-600 hover:to-red-700
			focus:ring-red-500
			shadow-md hover:shadow-lg
		`,
		ghost: `
			bg-transparent text-slate-600
			hover:bg-slate-100 hover:text-slate-900
			focus:ring-slate-500
		`,
		outline: `
			bg-transparent text-indigo-600 border-2 border-indigo-500
			hover:bg-indigo-50
			focus:ring-indigo-500
		`
	};

	const sizeClasses = {
		sm: 'px-3 py-1.5 text-sm gap-1.5',
		md: 'px-5 py-2.5 text-sm gap-2',
		lg: 'px-6 py-3 text-base gap-2'
	};
</script>

<button
	{type}
	class="{baseClasses} {variantClasses[variant]} {sizeClasses[size]} {className}"
	disabled={disabled || loading}
	{onclick}
>
	{#if loading}
		<svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
			<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
		</svg>
	{/if}
	{#if children}
		{@render children()}
	{/if}
</button>