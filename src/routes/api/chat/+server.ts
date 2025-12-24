import { type RequestEvent } from '@sveltejs/kit';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, generateText } from 'ai';
import { env } from '$env/dynamic/private';
import {
	createConversation,
	getConversation,
	saveMessage,
	getMessagesForAI,
	updateConversationTitle
} from '$lib/server/chat/index.js';

const google = createGoogleGenerativeAI({
	apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY
});

export const POST = async (event: RequestEvent) => {
	const session = event.locals.session;

	// Check authentication
	if (!session?.user?.id) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const userId = session.user.id;

	try {
		const { message, conversationId } = await event.request.json();

		if (!message || typeof message !== 'string') {
			return new Response(JSON.stringify({ error: 'Message is required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		let currentConversationId = conversationId;
		let isNewConversation = false;

		// Create new conversation if not provided
		if (!currentConversationId) {
			const conversation = await createConversation(userId);
			currentConversationId = conversation.id;
			isNewConversation = true;
		} else {
			// Verify conversation belongs to user
			const conversation = await getConversation(currentConversationId, userId);
			if (!conversation) {
				return new Response(JSON.stringify({ error: 'Conversation not found' }), {
					status: 404,
					headers: { 'Content-Type': 'application/json' }
				});
			}
		}

		// Save user message
		await saveMessage(currentConversationId, userId, 'user', message);

		// Get conversation history for context
		const conversationHistory = await getMessagesForAI(currentConversationId, userId);

		// Prepare messages for AI
		const messages = conversationHistory || [];

		// Stream AI response
		const result = streamText({
			model: google('gemini-2.5-flash'),
			system: 'You are a helpful, friendly assistant. Be concise but thorough in your responses. Remember the context of the conversation. You can use Markdown formatting in your responses for better readability (headings, lists, code blocks, bold, italic, etc.).',
			messages: messages.map((msg) => ({
				role: msg.role,
				content: msg.content
			}))
		});

		// Create a custom stream that saves the message when complete
		const encoder = new TextEncoder();
		let fullResponse = '';

		const stream = new ReadableStream({
			async start(controller) {
				// Send conversation ID and isNewConversation flag first
				controller.enqueue(
					encoder.encode(`data: ${JSON.stringify({ conversationId: currentConversationId, isNewConversation })}\n\n`)
				);

				try {
					for await (const chunk of result.textStream) {
						fullResponse += chunk;
						controller.enqueue(
							encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`)
						);
					}

					// Save the complete response
					await saveMessage(currentConversationId, userId, 'assistant', fullResponse);

					// Generate title for new conversations
					if (isNewConversation) {
						const titleResponse = await generateText({
							model: google('gemini-2.5-flash'),
							prompt: `Generate a very short title (3-5 words max) for a conversation that starts with: "${message}". Only respond with the title, nothing else.`
						});
						await updateConversationTitle(currentConversationId, userId, titleResponse.text.trim());
						controller.enqueue(
							encoder.encode(`data: ${JSON.stringify({ title: titleResponse.text.trim() })}\n\n`)
						);
					}

					controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
					controller.close();
				} catch (error) {
					console.error('Stream error:', error);
					controller.enqueue(
						encoder.encode(`data: ${JSON.stringify({ error: 'Stream error occurred' })}\n\n`)
					);
					controller.close();
				}
			}
		});

		return new Response(stream, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				'Connection': 'keep-alive'
			}
		});
	} catch (error) {
		console.error('Chat API error:', error);
		return new Response(JSON.stringify({ error: 'Failed to generate response' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};