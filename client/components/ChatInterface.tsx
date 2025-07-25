import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import VideoPlayer from "./VideoPlayer";
import { 
  Send, 
  Smile, 
  Paperclip, 
  Camera, 
  Mic, 
  MicOff,
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
  Check,
  CheckCheck
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'video' | 'audio' | 'file';
  mediaUrl?: string;
  isRead: boolean;
  isDelivered: boolean;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: Date;
  unreadCount: number;
  lastMessage?: Message;
}

interface ChatInterfaceProps {
  className?: string;
}

const ChatInterface = ({ className = "" }: ChatInterfaceProps) => {
  const { t } = useTranslation();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chats: Chat[] = [
    {
      id: '1',
      name: 'Alice Wonder',
      avatar: '/placeholder.svg',
      isOnline: true,
      unreadCount: 3,
      lastMessage: {
        id: '1',
        senderId: '1',
        senderName: 'Alice Wonder',
        senderAvatar: '/placeholder.svg',
        content: 'Hey! How are you doing?',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        type: 'text',
        isRead: false,
        isDelivered: true
      }
    },
    {
      id: '2',
      name: 'Bob Creator',
      avatar: '/placeholder.svg',
      isOnline: false,
      lastSeen: new Date(Date.now() - 30 * 60 * 1000),
      unreadCount: 0,
      lastMessage: {
        id: '2',
        senderId: 'me',
        senderName: 'Me',
        senderAvatar: '/placeholder.svg',
        content: 'Thanks for sharing that video!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: 'text',
        isRead: true,
        isDelivered: true
      }
    },
    {
      id: '3',
      name: 'Emma Travels',
      avatar: '/placeholder.svg',
      isOnline: true,
      unreadCount: 1,
      lastMessage: {
        id: '3',
        senderId: '3',
        senderName: 'Emma Travels',
        senderAvatar: '/placeholder.svg',
        content: '📸 Sent a photo',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        type: 'image',
        mediaUrl: '/placeholder.svg',
        isRead: false,
        isDelivered: true
      }
    }
  ];

  useEffect(() => {
    if (selectedChat) {
      // Mock messages for selected chat
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: selectedChat.id,
          senderName: selectedChat.name,
          senderAvatar: selectedChat.avatar,
          content: 'Hey! How are you doing today?',
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          type: 'text',
          isRead: true,
          isDelivered: true
        },
        {
          id: '2',
          senderId: 'me',
          senderName: 'Me',
          senderAvatar: '/placeholder.svg',
          content: 'I\'m doing great! Just working on some new features.',
          timestamp: new Date(Date.now() - 55 * 60 * 1000),
          type: 'text',
          isRead: true,
          isDelivered: true
        },
        {
          id: '3',
          senderId: selectedChat.id,
          senderName: selectedChat.name,
          senderAvatar: selectedChat.avatar,
          content: 'That sounds awesome! Can you share a screenshot?',
          timestamp: new Date(Date.now() - 50 * 60 * 1000),
          type: 'text',
          isRead: true,
          isDelivered: true
        },
        {
          id: '4',
          senderId: 'me',
          senderName: 'Me',
          senderAvatar: '/placeholder.svg',
          content: 'Sure! Here\'s what I\'m working on.',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          type: 'text',
          isRead: true,
          isDelivered: true
        },
        {
          id: '5',
          senderId: 'me',
          senderName: 'Me',
          senderAvatar: '/placeholder.svg',
          content: '',
          timestamp: new Date(Date.now() - 40 * 60 * 1000),
          type: 'image',
          mediaUrl: '/placeholder.svg',
          isRead: true,
          isDelivered: true
        }
      ];
      setMessages(mockMessages);
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'Me',
      senderAvatar: '/placeholder.svg',
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
      isRead: false,
      isDelivered: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className={`flex h-[calc(100vh-8rem)] bg-background ${className}`}>
      {/* Chat List */}
      <div className="w-80 border-r border-border">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-semibold">{t('messages')}</h2>
        </div>
        
        <div className="overflow-y-auto h-full">
          {chats.map(chat => (
            <div
              key={chat.id}
              className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
                selectedChat?.id === chat.id ? 'bg-accent' : ''
              }`}
              onClick={() => setSelectedChat(chat)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={chat.avatar} />
                    <AvatarFallback>{chat.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{chat.name}</h3>
                    <div className="flex items-center gap-2">
                      {chat.lastMessage && (
                        <span className="text-xs text-muted-foreground">
                          {formatTime(chat.lastMessage.timestamp)}
                        </span>
                      )}
                      {chat.unreadCount > 0 && (
                        <Badge className="w-5 h-5 flex items-center justify-center text-xs">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.lastMessage?.content || 'No messages yet'}
                    </p>
                    {chat.lastMessage?.senderId === 'me' && (
                      <div className="flex items-center">
                        {chat.lastMessage.isRead ? (
                          <CheckCheck className="w-4 h-4 text-blue-500" />
                        ) : chat.lastMessage.isDelivered ? (
                          <CheckCheck className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Check className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  {!chat.isOnline && chat.lastSeen && (
                    <p className="text-xs text-muted-foreground">
                      Last seen {formatLastSeen(chat.lastSeen)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-card">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="md:hidden">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedChat.avatar} />
                  <AvatarFallback>{selectedChat.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                {selectedChat.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                )}
              </div>
              
              <div>
                <h3 className="font-medium">{selectedChat.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedChat.isOnline ? 'Online' : `Last seen ${selectedChat.lastSeen ? formatLastSeen(selectedChat.lastSeen) : 'recently'}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                {message.senderId !== 'me' && (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={message.senderAvatar} />
                    <AvatarFallback>{message.senderName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-[70%] ${message.senderId === 'me' ? 'order-first' : ''}`}>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      message.senderId === 'me'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.type === 'text' && (
                      <p className="text-sm">{message.content}</p>
                    )}
                    
                    {message.type === 'image' && message.mediaUrl && (
                      <div className="space-y-2">
                        {message.content && <p className="text-sm">{message.content}</p>}
                        <img
                          src={message.mediaUrl}
                          alt="Shared image"
                          className="max-w-full h-auto rounded-lg"
                        />
                      </div>
                    )}
                    
                    {message.type === 'video' && message.mediaUrl && (
                      <div className="space-y-2">
                        {message.content && <p className="text-sm">{message.content}</p>}
                        <VideoPlayer
                          src={message.mediaUrl}
                          className="max-w-full"
                          showControls={true}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className={`flex items-center gap-1 mt-1 ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.senderId === 'me' && (
                      <div className="flex items-center">
                        {message.isRead ? (
                          <CheckCheck className="w-3 h-3 text-blue-500" />
                        ) : message.isDelivered ? (
                          <CheckCheck className="w-3 h-3 text-muted-foreground" />
                        ) : (
                          <Check className="w-3 h-3 text-muted-foreground" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-border bg-card">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="w-5 h-5" />
              </Button>
              
              <Button variant="ghost" size="icon">
                <Camera className="w-5 h-5" />
              </Button>
              
              <div className="flex-1">
                <Input
                  placeholder={`Message ${selectedChat.name}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="border-none shadow-none focus-visible:ring-0"
                />
              </div>
              
              <Button variant="ghost" size="icon">
                <Smile className="w-5 h-5" />
              </Button>
              
              {newMessage.trim() ? (
                <Button size="icon" onClick={sendMessage}>
                  <Send className="w-5 h-5" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onMouseDown={() => setIsRecording(true)}
                  onMouseUp={() => setIsRecording(false)}
                  onMouseLeave={() => setIsRecording(false)}
                  className={isRecording ? 'bg-red-500 text-white' : ''}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
              )}
            </div>
            
            {isRecording && (
              <div className="mt-2 text-sm text-red-500 text-center">
                Recording... Release to send
              </div>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-muted/20">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Select a chat</h3>
            <p className="text-muted-foreground">Choose a conversation to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
