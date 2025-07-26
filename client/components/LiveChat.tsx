import { useLiveChat, sendLiveMessage, LiveMessage } from "@/hooks/useLiveChat";
import { useState } from "react";

interface Props {
  chatId: string;
  user: { uid: string; displayName: string };
}

export default function LiveChat({ chatId, user }: Props) {
  const { messages, loading } = useLiveChat(chatId);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendLiveMessage(chatId, {
      senderId: user.uid,
      senderName: user.displayName,
      content: input,
    });
    setInput("");
  };

  return (
    <div>
      <div>
        {loading ? "Loading..." : messages.map(m => (
          <div key={m.id}>
            <b>{m.senderName}:</b> {m.content}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
