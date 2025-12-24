<script lang="ts">
	interface Conversation {
		id: string;
		title: string;
		createdAt: string;
		updatedAt: string;
	}

	interface Props {
		conversations: Conversation[];
		activeId: string | null;
		onSelect: (id: string) => void;
		onDelete: (id: string) => void;
		onNewChat: () => void;
	}

	let { conversations, activeId, onSelect, onDelete, onNewChat }: Props = $props();

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));

		if (days === 0) return 'Today';
		if (days === 1) return 'Yesterday';
		if (days < 7) return `${days} days ago`;
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}
</script>

<div class="flex flex-col h-full">
	<!-- New Chat Button -->
	<div class="p-3 border-b border-slate-200">
		<button
			onclick={onNewChat}
			class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors duration-200 text-sm font-medium"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
			</svg>
			New Chat
		</button>
	</div>

	<!-- Conversation List -->
	<div class="flex-1 overflow-y-auto p-2">
		{#if conversations.length === 0}
			<div class="text-center py-8 px-4">
				<svg class="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
				</svg>
				<p class="text-sm text-slate-500">No conversations yet</p>
				<p class="text-xs text-slate-400 mt-1">Start a new chat to begin</p>
			</div>
		{:else}
			<div class="space-y-1">
				{#each conversations as conversation (conversation.id)}
					<div
						class="group relative flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 {
							activeId === conversation.id 
								? 'bg-indigo-50 border border-indigo-200' 
								: 'hover:bg-slate-100'
						}"
					>
						<button
							onclick={() => onSelect(conversation.id)}
							class="flex-1 text-left min-w-0"
						>
							<p class="text-sm font-medium text-slate-800 truncate">
								{conversation.title || 'New Chat'}
							</p>
							<p class="text-xs text-slate-500">
								{formatDate(conversation.updatedAt)}
							</p>
						</button>
					<button
	                        onclick={(e) => {
		                        e.stopPropagation();
		                         onDelete(conversation.id);
	                        }}
	                    class="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
	                    aria-label="Delete conversation"
    >
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
							</svg>
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>