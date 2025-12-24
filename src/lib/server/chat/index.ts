import { db } from '../db/index.js';
import { chatConversations, chatMessages } from '../db/schema.js';
import { eq, and, asc, desc } from 'drizzle-orm';
import type { MessageRole } from '../db/schema.js';

export interface ChatMessageData {
	role: MessageRole;
	content: string;
}

// Create a new conversation
export async function createConversation(userId: string, title?: string) {
	const [conversation] = await db
		.insert(chatConversations)
		.values({
			userId,
			title: title || 'New Chat'
		})
		.returning();

	return conversation;
}

// Get all conversations for a user
export async function getUserConversations(userId: string) {
	return await db
		.select()
		.from(chatConversations)
		.where(eq(chatConversations.userId, userId))
		.orderBy(desc(chatConversations.updatedAt));
}

// Get a specific conversation (with ownership check)
export async function getConversation(conversationId: string, userId: string) {
	return await db.query.chatConversations.findFirst({
		where: and(
			eq(chatConversations.id, conversationId),
			eq(chatConversations.userId, userId)
		)
	});
}

// Get messages for a conversation (with ownership check)
export async function getConversationMessages(conversationId: string, userId: string) {
	// First verify the conversation belongs to the user
	const conversation = await getConversation(conversationId, userId);
	if (!conversation) {
		return null;
	}

	return await db
		.select()
		.from(chatMessages)
		.where(eq(chatMessages.conversationId, conversationId))
		.orderBy(asc(chatMessages.createdAt));
}

// Save a message
export async function saveMessage(
	conversationId: string,
	userId: string,
	role: MessageRole,
	content: string
) {
	const [message] = await db
		.insert(chatMessages)
		.values({
			conversationId,
			userId,
			role,
			content
		})
		.returning();

	// Update conversation timestamp
	await db
		.update(chatConversations)
		.set({ updatedAt: new Date() })
		.where(eq(chatConversations.id, conversationId));

	return message;
}

// Update conversation title
export async function updateConversationTitle(
	conversationId: string,
	userId: string,
	title: string
) {
	return await db
		.update(chatConversations)
		.set({ title, updatedAt: new Date() })
		.where(
			and(
				eq(chatConversations.id, conversationId),
				eq(chatConversations.userId, userId)
			)
		)
		.returning();
}

// Delete a conversation (and all its messages via cascade)
export async function deleteConversation(conversationId: string, userId: string) {
	return await db
		.delete(chatConversations)
		.where(
			and(
				eq(chatConversations.id, conversationId),
				eq(chatConversations.userId, userId)
			)
		);
}

// Get messages formatted for AI context
export async function getMessagesForAI(conversationId: string, userId: string) {
	const messages = await getConversationMessages(conversationId, userId);
	if (!messages) return null;

	return messages.map((msg) => ({
		role: msg.role as 'user' | 'assistant',
		content: msg.content
	}));
}