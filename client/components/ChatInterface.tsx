import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  CheckCheck,
  Heart,
  Copy,
  Reply,
  Forward,
  Download,
  Flag,
  Trash2,
  Edit3
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMobileKeyboard, useMessageInteractions, useMobileInputFocus } from "@/hooks/useMobileInteractions";
import { useLongPress } from "@/lib/reactExtensions";

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
  reactions?: { [emoji: string]: string[] }; // emoji -> user IDs
  replyTo?: string; // message ID being replied to
  isEdited?: boolean;
  editedAt?: Date;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: Date;
  unreadCount: number;
  lastMessage?: Message;
  isTyping?: boolean;
}

interface ChatInterfaceProps {
  className?: string;
}

const ChatInterface = ({ className = "" }: ChatInterfaceProps) => {
  const { t } = useTranslation();
  const { copyMessage } = useMessageInteractions();
  const { handleInputFocus } = useMobileInputFocus();
  useMobileKeyboard();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const emojis = ['❤️', '👍', '😂', '😮', '😢', '😡', '👏', '🔥'];

  const chats: Chat[] = [
    {
      id: '1',
      name: 'Alice Wonder',
      avatar: '/placeholder.svg',
      isOnline: true,
      unreadCount: 3,
      isTyping: false,
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
      isTyping: false,
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
      isTyping: true,
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
          isDelivered: true,
          reactions: { '❤️': ['me'], '👍': [selectedChat.id] }
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
          isRead: false,
          isDelivered: true,
          isEdited: true,
          editedAt: new Date(Date.now() - 44 * 60 * 1000)
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
          isRead: false,
          isDelivered: true
        }
      ];
      setMessages(mockMessages);
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Enhanced mobile keyboard support
  useEffect(() => {
    const handleResize = () => {
      if (messageInputRef.current && document.activeElement === messageInputRef.current) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      isDelivered: true,
      replyTo: replyingTo?.id
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
    setReplyingTo(null);

    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        description: "Message copied to clipboard! 📋",
        duration: 2000,
      });
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 50, 50]);
      }
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = content;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        toast({
          description: "Message copied to clipboard! 📋",
          duration: 2000,
        });
      } catch (err) {
        toast({
          description: "Failed to copy message",
          duration: 2000,
        });
      }
      
      document.body.removeChild(textArea);
    }
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...msg.reactions };
        if (reactions[emoji]) {
          if (reactions[emoji].includes('me')) {
            reactions[emoji] = reactions[emoji].filter(id => id !== 'me');
            if (reactions[emoji].length === 0) {
              delete reactions[emoji];
            }
          } else {
            reactions[emoji] = [...reactions[emoji], 'me'];
          }
        } else {
          reactions[emoji] = ['me'];
        }
        return { ...msg, reactions };
      }
      return msg;
    }));

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  };

  const replyToMessage = (message: Message) => {
    setReplyingTo(message);
    messageInputRef.current?.focus();
  };

  const editMessage = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message && message.senderId === 'me') {
      setEditingMessage(messageId);
      setNewMessage(message.content);
      messageInputRef.current?.focus();
    }
  };

  const saveEditedMessage = () => {
    if (!editingMessage || !newMessage.trim()) return;

    setMessages(prev => prev.map(msg => {
      if (msg.id === editingMessage) {
        return {
          ...msg,
          content: newMessage,
          isEdited: true,
          editedAt: new Date()
        };
      }
      return msg;
    }));

    setEditingMessage(null);
    setNewMessage("");
  };

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    toast({
      description: "Message deleted",
      duration: 2000,
    });
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
      <div className="w-80 border-r border-border max-md:hidden">
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
                    <div className="flex-1">
                      {chat.isTyping ? (
                        <div className="flex items-center gap-1 text-primary">
                          <div className="flex gap-1">
                            <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                            <div className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                          <span className="text-sm">typing...</span>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.lastMessage?.content || 'No messages yet'}
                        </p>
                      )}
                    </div>
                    {chat.lastMessage?.senderId === 'me' && (
                      <div className="flex items-center ml-2">
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
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setSelectedChat(null)}
              >
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
                  {selectedChat.isTyping ? 'typing...' :
                   selectedChat.isOnline ? 'Online' : 
                   `Last seen ${selectedChat.lastSeen ? formatLastSeen(selectedChat.lastSeen) : 'recently'}`}
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

          {/* Reply Banner */}
          {replyingTo && (
            <div className="px-4 py-2 bg-muted/50 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Reply className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Replying to {replyingTo.senderName}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6"
                  onClick={() => setReplyingTo(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground truncate ml-6">
                {replyingTo.content}
              </p>
            </div>
          )}

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
                  {/* Reply indicator */}
                  {message.replyTo && (
                    <div className="mb-1 pl-2 border-l-2 border-primary">
                      <p className="text-xs text-muted-foreground">
                        Replying to previous message
                      </p>
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-2 relative group ${
                      message.senderId === 'me'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                    {...useLongPress(() => setSelectedMessage(message.id), { threshold: 500 })}
                  >
                    {message.type === 'text' && (
                      <p className="text-sm select-text">{message.content}</p>
                    )}
                    
                    {message.type === 'image' && message.mediaUrl && (
                      <div className="space-y-2">
                        {message.content && <p className="text-sm select-text">{message.content}</p>}
                        <img
                          src={message.mediaUrl}
                          alt="Shared image"
                          className="max-w-full h-auto rounded-lg"
                        />
                      </div>
                    )}
                    
                    {message.type === 'video' && message.mediaUrl && (
                      <div className="space-y-2">
                        {message.content && <p className="text-sm select-text">{message.content}</p>}
                        <VideoPlayer
                          src={message.mediaUrl}
                          className="max-w-full"
                          showControls={true}
                        />
                      </div>
                    )}

                    {/* Message actions menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity ${
                            message.senderId === 'me' ? 'text-primary-foreground/70' : 'text-foreground/70'
                          }`}
                        >
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => copyMessage(message.content)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => replyToMessage(message)}>
                          <Reply className="w-4 h-4 mr-2" />
                          Reply
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Forward className="w-4 h-4 mr-2" />
                          Forward
                        </DropdownMenuItem>
                        {message.senderId === 'me' && (
                          <DropdownMenuItem onClick={() => editMessage(message.id)}>
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {message.mediaUrl && (
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Flag className="w-4 h-4 mr-2" />
                          Report
                        </DropdownMenuItem>
                        {message.senderId === 'me' && (
                          <DropdownMenuItem 
                            onClick={() => deleteMessage(message.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Reactions */}
                  {message.reactions && Object.keys(message.reactions).length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {Object.entries(message.reactions).map(([emoji, userIds]) => (
                        <button
                          key={emoji}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
                            userIds.includes('me')
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted hover:bg-accent'
                          }`}
                          onClick={() => addReaction(message.id, emoji)}
                        >
                          <span>{emoji}</span>
                          <span>{userIds.length}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Quick reactions */}
                  <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {emojis.slice(0, 4).map(emoji => (
                      <button
                        key={emoji}
                        className="w-6 h-6 rounded-full bg-background/80 hover:bg-background flex items-center justify-center text-xs transition-all hover:scale-110"
                        onClick={() => addReaction(message.id, emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  
                  <div className={`flex items-center gap-1 mt-1 ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.isEdited && (
                      <span className="text-xs text-muted-foreground opacity-70">
                        (edited)
                      </span>
                    )}
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
              
              <div className="flex-1 relative">
                <Input
                  ref={messageInputRef}
                  placeholder={editingMessage ? "Edit message..." : `Message ${selectedChat.name}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="border-none shadow-none focus-visible:ring-0 pr-10"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="sentences"
                />
                {newMessage && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6"
                    onClick={() => setNewMessage("")}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <Button variant="ghost" size="icon" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <Smile className="w-5 h-5" />
              </Button>
              
              {newMessage.trim() ? (
                <Button 
                  size="icon" 
                  onClick={editingMessage ? saveEditedMessage : sendMessage}
                  className="bg-primary hover:bg-primary/90"
                >
                  {editingMessage ? <Check className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onMouseDown={() => setIsRecording(true)}
                  onMouseUp={() => setIsRecording(false)}
                  onMouseLeave={() => setIsRecording(false)}
                  onTouchStart={() => setIsRecording(true)}
                  onTouchEnd={() => setIsRecording(false)}
                  className={isRecording ? 'bg-red-500 text-white' : ''}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
              )}
            </div>
            
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="mt-2 p-2 bg-background border rounded-lg shadow-lg">
                <div className="grid grid-cols-8 gap-2">
                  {emojis.map(emoji => (
                    <button
                      key={emoji}
                      className="p-2 hover:bg-accent rounded text-lg transition-colors"
                      onClick={() => {
                        setNewMessage(prev => prev + emoji);
                        setShowEmojiPicker(false);
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {isRecording && (
              <div className="mt-2 text-sm text-red-500 text-center flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                Recording voice message... Release to send
              </div>
            )}

            {editingMessage && (
              <div className="mt-2 text-sm text-muted-foreground text-center">
                Editing message • Press Enter to save or Escape to cancel
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
