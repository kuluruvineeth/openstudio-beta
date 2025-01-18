import { generateShortUUID, sortSessions } from '@/helper/utils';
import type { TChatMessage, TChatSession } from '@/types';
import { database } from '@repo/database';
import { schema } from '@repo/database/schema';
import { eq } from 'drizzle-orm';
import moment from 'moment';

export class SessionsService {
  private messagesService: MessagesService;

  constructor(messagesService: MessagesService) {
    this.messagesService = messagesService;
  }

  async getSessions(): Promise<TChatSession[]> {
    return database.select().from(schema.chatSessions) || [];
  }

  async setSession(chatSession: TChatSession) {
    await database.insert(schema.chatSessions).values(chatSession);
  }

  async updateSession(
    sessionId: string,
    newSession: Partial<Omit<TChatSession, 'id'>>
  ) {
    await database
      .update(schema.chatSessions)
      .set(newSession)
      .where(eq(schema.chatSessions.id, sessionId));
  }

  async getSessionById(id: string) {
    const session = await database
      ?.select()
      .from(schema.chatSessions)
      .where(eq(schema.chatSessions.id, id))
      .limit(1);
    return session?.[0] || null;
  }

  async removeSessionById(id: string) {
    try {
      this.messagesService.removeMessages(id);
      const deletedSession = await database
        ?.delete(schema.chatSessions)
        .where(eq(schema.chatSessions.id, id))
        .returning();

      const session = await this.getSessionById(id);
      return session;
    } catch (error) {
      console.error(error);
    }
  }

  async createNewSession(): Promise<TChatSession | null> {
    const sessions = await this.getSessions();

    const latestSession = sortSessions(sessions, 'createdAt')?.[0];

    const latestSessionMessages =
      (await this.messagesService.getMessages(latestSession?.id)) || [];

    if (latestSession && latestSessionMessages?.length === 0) {
      return latestSession;
    }

    const newSession = await database
      ?.insert(schema.chatSessions)
      .values({
        id: generateShortUUID(),
        title: 'Untitled',
        createdAt: moment().toDate(),
      })
      .returning();

    return newSession?.[0] || null;
  }

  async clearSessions() {
    await database?.delete(schema.chatMessages);
    await database?.delete(schema.chatSessions);
  }

  async addSessions(sessions: TChatSession[]) {
    await database?.insert(schema.chatSessions).values(sessions);
  }
}

export class MessagesService {
  async getAllMessages() {
    return await database?.select().from(schema.chatMessages);
  }

  async addAllMessages(messages: TChatMessage[]) {
    await database?.insert(schema.chatMessages).values(messages);
  }

  async getMessages(parentId: string): Promise<TChatMessage[]> {
    return (
      (await database
        ?.select()
        .from(schema.chatMessages)
        .where(eq(schema.chatMessages.parentId, parentId))) || []
    );
  }

  async setMessages(parentId: string, messages: TChatMessage[]) {
    await database?.insert(schema.chatMessages).values(
      messages?.map((message) => ({
        ...message,
        parentId,
        sessionId: parentId,
      }))
    );
  }

  async addMessage(parentId: string, chatMessage: TChatMessage) {
    await database
      ?.insert(schema.chatMessages)
      .values({
        ...chatMessage,
        parentId,
        sessionId: parentId,
      })
      .onConflictDoUpdate({
        target: schema.chatMessages.id,
        set: chatMessage,
      });
  }

  async addMessages(parentId: string, messages: TChatMessage[]) {
    await database?.insert(schema.chatMessages).values(
      messages?.map((message) => ({
        ...message,
        parentId,
        sessionId: parentId,
      }))
    );
  }

  async removeMessage(
    parentId: string,
    messageId: string
  ): Promise<TChatMessage[]> {
    await database
      ?.delete(schema.chatMessages)
      .where(eq(schema.chatMessages.id, messageId));
    return this.getMessages(parentId);
  }

  async removeMessages(parentId: string) {
    await database
      ?.delete(schema.chatMessages)
      .where(eq(schema.chatMessages.parentId, parentId))
      .returning();
  }
}

const messagesServiceInstance = new MessagesService();
export const sessionsService = new SessionsService(messagesServiceInstance);
export const messagesService = messagesServiceInstance;
