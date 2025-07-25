import Layout from "@/components/Layout";
import Stories from "@/components/Stories";
import CreatePost from "@/components/CreatePost";
import Post from "@/components/Post";
import NotificationPanel from "@/components/NotificationPanel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dot, Users, TrendingUp, Bell } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Index() {
  const { t } = useTranslation();
  const [showNotifications, setShowNotifications] = useState(false);
  const samplePosts = [
    {
      id: 1,
      username: "alice_wonder",
      avatar: "/placeholder.svg",
      location: "New York, NY",
      timeAgo: "2h",
      content: "Just discovered this amazing coffee shop in Brooklyn! The latte art is incredible ☕️✨ #CoffeeLovers #Brooklyn",
      media: {
        type: 'image' as const,
        url: "/placeholder.svg",
        aspectRatio: "4/3"
      },
      likes: 1234,
      comments: 89,
      isLiked: false,
      isSaved: false
    },
    {
      id: 2,
      username: "bob_creator",
      avatar: "/placeholder.svg",
      timeAgo: "4h",
      content: "Behind the scenes of my latest project! Can't wait to share the final result with you all 🎬🔥",
      media: {
        type: 'video' as const,
        url: "/placeholder.svg",
        aspectRatio: "16/9"
      },
      likes: 2156,
      comments: 134,
      isLiked: true,
      isSaved: true
    },
    {
      id: 3,
      username: "emma_travels",
      avatar: "/placeholder.svg",
      location: "Santorini, Greece",
      timeAgo: "1d",
      content: "Sunset in Santorini never gets old 🌅 This place is pure magic! Already planning my next visit.",
      media: {
        type: 'image' as const,
        url: "/placeholder.svg",
        aspectRatio: "1/1"
      },
      likes: 3420,
      comments: 256,
      isLiked: false,
      isSaved: false
    }
  ];

  const suggestedUsers = [
    { username: "mike_fitness", name: "Mike Johnson", isFollowing: false },
    { username: "sarah_cook", name: "Sarah Miller", isFollowing: false },
    { username: "alex_photos", name: "Alex Chen", isFollowing: true },
  ];

  const trendingTopics = [
    { tag: "#TechNews", posts: "125k posts" },
    { tag: "#Travel2024", posts: "89k posts" },
    { tag: "#Photography", posts: "234k posts" },
    { tag: "#Fitness", posts: "167k posts" },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-8">
            {/* Stories */}
            <div className="mb-6">
              <Stories />
            </div>

            {/* Create Post */}
            <CreatePost />

            {/* Posts Feed */}
            <div className="space-y-6">
              {samplePosts.map((post) => (
                <Post key={post.id} {...post} />
              ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center mt-8">
              <Button variant="outline" className="px-8">
                {t('load_more_posts')}
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Notifications Panel */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant={showNotifications ? "default" : "outline"}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="gap-2"
                >
                  <Bell className="w-4 h-4" />
                  {t('notifications')}
                </Button>
              </div>
              {showNotifications && (
                <NotificationPanel className="animate-in slide-in-from-top-2 duration-200" />
              )}
            </div>
            {/* Suggested Users */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">{t('suggested_for_you')}</h3>
                  <Button variant="link" size="sm" className="text-xs p-0 h-auto">
                    {t('see_all')}
                  </Button>
                </div>
                <div className="space-y-3">
                  {suggestedUsers.map((user) => (
                    <div key={user.username} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">@{user.username}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={user.isFollowing ? "outline" : "default"}
                        className="text-xs px-4"
                      >
                        {user.isFollowing ? t('following') : t('follow')}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">{t('trending')}</h3>
                </div>
                <div className="space-y-3">
                  {trendingTopics.map((topic) => (
                    <div key={topic.tag} className="cursor-pointer hover:bg-accent rounded-lg p-2 -m-2 transition-colors">
                      <p className="font-medium text-sm text-primary">{topic.tag}</p>
                      <p className="text-xs text-muted-foreground">{topic.posts}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-4">{t('your_activity')}</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">127</p>
                    <p className="text-xs text-muted-foreground">{t('posts')}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">2.4k</p>
                    <p className="text-xs text-muted-foreground">{t('followers')}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">1.8k</p>
                    <p className="text-xs text-muted-foreground">{t('following_stat')}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">12.5k</p>
                    <p className="text-xs text-muted-foreground">{t('likes')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
