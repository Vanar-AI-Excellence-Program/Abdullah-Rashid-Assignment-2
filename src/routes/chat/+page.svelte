<script lang="ts">
	import { onMount } from 'svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import ChatMessage from '$lib/components/chat/ChatMessage.svelte';
	import ChatInput from '$lib/components/chat/ChatInput.svelte';
	import ConversationList from '$lib/components/chat/ConversationList.svelte';

	interface Message {
		id: string;
		role: 'user' | 'assistant';
		content: string;
		createdAt: string;
		isStreaming?: boolean;
	}

	interface Conversation {
		id: string;
		title: string;
		createdAt: string;
		updatedAt: string;
	}

	interface Props {
		data: {
			user: {
				id: string;
				name?: string | null;
				email?: string | null;
				role?: 'user' | 'admin';
			};
		};
	}

	let { data }: Props = $props();

	let conversations = $state<Conversation[]>([]);
	let messages = $state<Message[]>([]);
	let activeConversationId = $state<string | null>(null);
	let isLoading = $state(false);
	let isSending = $state(false);
	let isStreaming = $state(false);
	let error = $state('');
	let sidebarOpen = $state(true);
	let messagesContainer: HTMLDivElement;

	onMount(async () => {
		await loadConversations();
	});

	async function loadConversations() {
		isLoading = true;
		try {
			const response = await fetch('/api/chat/conversations');
			const result = await response.json();

			if (response.ok) {
				conversations = result.conversations;
			} else {
				error = result.error || 'Failed to load conversations';
			}
		} catch (err) {
			error = 'Failed to load conversations';
		} finally {
			isLoading = false;
		}
	}

	async function loadMessages(conversationId: string) {
		isLoading = true;
		try {
			const response = await fetch(`/api/chat/conversations/${conversationId}`);
			const result = await response.json();

			if (response.ok) {
				messages = result.messages;
				activeConversationId = conversationId;
				scrollToBottom();
			} else {
				error = result.error || 'Failed to load messages';
			}
		} catch (err) {
			error = 'Failed to load messages';
		} finally {
			isLoading = false;
		}
	}

	async function sendMessage(content: string) {
		error = '';
		isSending = true;
		isStreaming = true;

		// Add user message to UI immediately
		const userMessage: Message = {
			id: crypto.randomUUID(),
			role: 'user',
			content,
			createdAt: new Date().toISOString()
		};
		messages = [...messages, userMessage];

		// Add placeholder for assistant message
		const assistantMessageId = crypto.randomUUID();
		const assistantMessage: Message = {
			id: assistantMessageId,
			role: 'assistant',
			content: '',
			createdAt: new Date().toISOString(),
			isStreaming: true
		};
		messages = [...messages, assistantMessage];
		scrollToBottom();

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					message: content,
					conversationId: activeConversationId
				})
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to send message');
			}

			const reader = response.body?.getReader();
			if (!reader) throw new Error('No reader available');

			const decoder = new TextDecoder();
			let buffer = '';

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split('\n\n');
				buffer = lines.pop() || '';

				for (const line of lines) {
					if (line.startsWith('data: ')) {
						try {
							const data = JSON.parse(line.slice(6));

							if (data.conversationId) {
								activeConversationId = data.conversationId;
							}

							if (data.text) {
								// Update the assistant message content
								messages = messages.map((msg) =>
									msg.id === assistantMessageId
										? { ...msg, content: msg.content + data.text }
										: msg
								);
								scrollToBottom();
							}

							if (data.title) {
								// Update conversation title in the list
								conversations = conversations.map((conv) =>
									conv.id === activeConversationId
										? { ...conv, title: data.title }
										: conv
								);
							}

							if (data.isNewConversation) {
								await loadConversations();
							}

							if (data.done) {
								// Mark streaming as complete
								messages = messages.map((msg) =>
									msg.id === assistantMessageId
										? { ...msg, isStreaming: false }
										: msg
								);
							}

							if (data.error) {
								throw new Error(data.error);
							}
						} catch (parseError) {
							// Skip invalid JSON
							console.error('Parse error:', parseError);
						}
					}
				}
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to send message';
			// Remove the failed messages
			messages = messages.filter(
				(m) => m.id !== userMessage.id && m.id !== assistantMessageId
			);
		} finally {
			isSending = false;
			isStreaming = false;
		}
	}

	async function deleteConversation(conversationId: string) {
		if (!confirm('Are you sure you want to delete this conversation?')) return;

		try {
			const response = await fetch(`/api/chat/conversations/${conversationId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				conversations = conversations.filter((c) => c.id !== conversationId);
				if (activeConversationId === conversationId) {
					activeConversationId = null;
					messages = [];
				}
			} else {
				error = 'Failed to delete conversation';
			}
		} catch (err) {
			error = 'Failed to delete conversation';
		}
	}

	function startNewChat() {
		activeConversationId = null;
		messages = [];
	}

	function scrollToBottom() {
		setTimeout(() => {
			if (messagesContainer) {
				messagesContainer.scrollTop = messagesContainer.scrollHeight;
			}
		}, 50);
	}

	async function handleSignOut() {
		await fetch('/api/auth/logout', { method: 'POST' });
		await invalidateAll();
		goto('/');
	}
</script>

<svelte:head>
	<title>Chat - Auth App</title>
</svelte:head>

<div class="h-screen flex flex-col bg-slate-50">
	<!-- Navigation -->
	<nav class="sticky top-0 z-50 bg-white border-b border-slate-200">
		<div class="px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between h-16 items-center">
				<div class="flex items-center gap-4">
					<!-- Sidebar Toggle -->
					<button
						onclick={() => sidebarOpen = !sidebarOpen}
						class="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors lg:hidden"
						aria-label="Toggle sidebar"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
						</svg>
					</button>
					<a href="/" class="flex items-center gap-2">
						<div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
							<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
							</svg>
						</div>
						<span class="text-xl font-bold text-slate-900">AuthApp</span>
					</a>
				</div>
				<div class="flex items-center gap-4">
					<a href="/dashboard" class="text-sm text-slate-600 hover:text-slate-900 transition-colors">
						Dashboard
					</a>
					<Button onclick={handleSignOut} variant="ghost" size="sm">Sign Out</Button>
				</div>
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<div class="flex-1 flex overflow-hidden">
		<!-- Sidebar -->
		<aside class="
			{sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
			fixed lg:static inset-y-0 left-0 top-16 z-40 w-72 bg-white border-r border-slate-200 
			transition-transform duration-300 lg:translate-x-0
		">
			<ConversationList
				{conversations}
				activeId={activeConversationId}
				onSelect={loadMessages}
				onDelete={deleteConversation}
				onNewChat={startNewChat}
			/>
		</aside>

		<!-- Overlay for mobile -->
		{#if sidebarOpen}
			<button
				class="fixed inset-0 bg-black/50 z-30 lg:hidden"
				onclick={() => sidebarOpen = false}
				aria-label="Close sidebar"
			></button>
		{/if}

		<!-- Chat Area -->
		<main class="flex-1 flex flex-col min-w-0">
			{#if error}
				<div class="p-4">
					<Alert type="error" dismissible>{error}</Alert>
				</div>
			{/if}

			<!-- Messages -->
			<div
				bind:this={messagesContainer}
				class="flex-1 overflow-y-auto p-4 space-y-4"
			>
				{#if messages.length === 0 && !isLoading}
					<div class="h-full flex flex-col items-center justify-center text-center px-4">
						<div class="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
							<svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
							</svg>
						</div>
						<h2 class="text-xl font-bold text-slate-900 mb-2">Start a conversation</h2>
						<p class="text-slate-600 max-w-sm">
							Ask me anything! I can help with questions, writing, coding, math, and much more.
						</p>
						<div class="mt-6 flex flex-wrap justify-center gap-2">
							<button
								onclick={() => sendMessage('Explain quantum computing in simple terms')}
								class="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
							>
								🔬 Explain quantum computing
							</button>
							<button
								onclick={() => sendMessage('Write a short poem about coding')}
								class="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
							>
								✍️ Write a poem
							</button>
							<button
								onclick={() => sendMessage('Help me learn JavaScript basics')}
								class="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
							>
								💻 Learn JavaScript
							</button>
						</div>
					</div>
				{:else}
					{#each messages as message (message.id)}
						<ChatMessage
							role={message.role}
							content={message.content}
							isStreaming={message.isStreaming}
						/>
					{/each}
					{#if isSending && messages[messages.length - 1]?.content === ''}
						<ChatMessage
							role="assistant"
							content=""
							isLoading={true}
						/>
					{/if}
				{/if}
			</div>

			<!-- Input -->
			<div class="border-t border-slate-200 bg-white p-4">
				<div class="max-w-3xl mx-auto">
					<ChatInput
						onSend={sendMessage}
						disabled={isSending}
						placeholder={isSending ? 'AI is responding...' : 'Type your message...'}
					/>
					<p class="text-xs text-slate-400 text-center mt-2">
						AI can make mistakes. Consider checking important information.
					</p>
				</div>
			</div>
		</main>
	</div>
</div>