import { json, type RequestEvent } from '@sveltejs/kit';
import { getConversationMessages, deleteConversation } from '$lib/server/chat/index.js';

export const GET = async (event: RequestEvent) => {
	const session = event.locals.session;

	if (!session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const conversationId = event.params.id;

	if (!conversationId) {
		return json({ error: 'Conversation ID is required' }, { status: 400 });
	}

	try {
		const messages = await getConversationMessages(conversationId, session.user.id);

		if (messages === null) {
			return json({ error: 'Conversation not found' }, { status: 404 });
		}

		return json({ messages });
	} catch (error) {
		console.error('Get messages error:', error);
		return json({ error: 'Failed to fetch messages' }, { status: 500 });
	}
};

export const DELETE = async (event: RequestEvent) => {
	const session = event.locals.session;

	if (!session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const conversationId = event.params.id;

	if (!conversationId) {
		return json({ error: 'Conversation ID is required' }, { status: 400 });
	}

	try {
		await deleteConversation(conversationId, session.user.id);
		return json({ success: true });
	} catch (error) {
		console.error('Delete conversation error:', error);
		return json({ error: 'Failed to delete conversation' }, { status: 500 });
	}
};