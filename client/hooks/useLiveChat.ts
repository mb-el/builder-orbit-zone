import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, Timestamp } from "firebase/firestore";

export interface LiveMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Timestamp;
}

export function useLiveChat(chatId: string) {
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chatId) return;
    const msgsRef = collection(db, "chats", chatId, "messages");
    const msgsQuery = query(msgsRef, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(msgsQuery, (snapshot) => {
      const newMessages: LiveMessage[] = [];
      snapshot.forEach((doc) => {
        newMessages.push({ id: doc.id, ...doc.data() } as LiveMessage);
      });
      setMessages(newMessages);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [chatId]);

  return { messages, loading };
}

export async function sendLiveMessage(chatId: string, msg: Omit<LiveMessage, "id" | "timestamp">) {
  const msgsRef = collection(db, "chats", chatId, "messages");
  await addDoc(msgsRef, {
    ...msg,
    timestamp: Timestamp.now(),
  });
}
