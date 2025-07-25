import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  UserPlus,
  Share,
  Video,
  Camera,
  Gift,
  Bell,
  BellRing,
  Check,
  X,
  MoreHorizontal,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "share" | "mention" | "live" | "gift";
  user: {
    username: string;
    avatar: string;
    isVerified?: boolean;
  };
  content: string;
  timestamp: Date;
  isRead: boolean;
  postImage?: string;
  actionUrl?: string;
}

interface NotificationPanelProps {
  className?: string;
}

const NotificationPanel = ({ className = "" }: NotificationPanelProps) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "like",
      user: {
        username: "alice_wonder",
        avatar: "/placeholder.svg",
        isVerified: true,
      },
      content: "liked your photo",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
      postImage: "/placeholder.svg",
    },
    {
      id: "2",
      type: "comment",
      user: { username: "bob_creator", avatar: "/placeholder.svg" },
      content: 'commented on your post: "Amazing content! 🔥"',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      isRead: false,
      postImage: "/placeholder.svg",
    },
    {
      id: "3",
      type: "follow",
      user: {
        username: "emma_travels",
        avatar: "/placeholder.svg",
        isVerified: true,
      },
      content: "started following you",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: true,
    },
    {
      id: "4",
      type: "share",
      user: { username: "mike_fitness", avatar: "/placeholder.svg" },
      content: "shared your post to their story",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      isRead: true,
      postImage: "/placeholder.svg",
    },
    {
      id: "5",
      type: "live",
      user: { username: "sarah_cook", avatar: "/placeholder.svg" },
      content: "is live now! Join the stream",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      isRead: false,
    },
    {
      id: "6",
      type: "mention",
      user: { username: "alex_photos", avatar: "/placeholder.svg" },
      content: "mentioned you in a comment",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      isRead: false,
      postImage: "/placeholder.svg",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-4 h-4 text-red-500 fill-current" />;
      case "comment":
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case "follow":
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case "share":
        return <Share className="w-4 h-4 text-purple-500" />;
      case "live":
        return <Video className="w-4 h-4 text-red-500" />;
      case "mention":
        return <MessageCircle className="w-4 h-4 text-orange-500" />;
      case "gift":
        return <Gift className="w-4 h-4 text-pink-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5" />
            <h3 className="font-semibold">{t("notifications")}</h3>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-0">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 p-4 hover:bg-accent/50 cursor-pointer transition-colors border-b border-border/50 last:border-b-0 ${
                    !notification.isRead ? "bg-primary/5" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  {/* User Avatar with notification icon */}
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={notification.user.avatar} />
                      <AvatarFallback>
                        {notification.user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-background rounded-full flex items-center justify-center border border-border">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-semibold hover:underline">
                            {notification.user.username}
                          </span>
                          {notification.user.isVerified && (
                            <Check className="w-3 h-3 inline ml-1 text-blue-500 fill-current" />
                          )}
                          <span className="ml-1">{notification.content}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimeAgo(notification.timestamp)}
                        </p>
                      </div>

                      {/* Post thumbnail if available */}
                      {notification.postImage && (
                        <div className="ml-3">
                          <img
                            src={notification.postImage}
                            alt="Post"
                            className="w-10 h-10 rounded object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* Action buttons for certain notification types */}
                    {notification.type === "follow" && (
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" className="text-xs">
                          Follow Back
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          View Profile
                        </Button>
                      </div>
                    )}

                    {notification.type === "live" && (
                      <div className="mt-2">
                        <Button size="sm" className="text-xs gap-1">
                          <Video className="w-3 h-3" />
                          Join Live
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Unread indicator and remove button */}
                  <div className="flex flex-col items-center gap-1">
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPanel;
