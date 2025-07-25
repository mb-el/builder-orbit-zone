import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LanguageSwitcher from "./LanguageSwitcher";
import {
  Home,
  Search,
  MessageCircle,
  Heart,
  PlusSquare,
  User,
  Video,
  Menu,
  Moon,
  Sun,
  Camera,
  Send,
  Settings,
  LogOut,
  Bell,
  BellRing,
  Users,
  BookmarkPlus,
  Archive,
  HelpCircle,
  Shield,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuthState } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [notificationCount, setNotificationCount] = useState(3);
  const { t } = useTranslation();
  const { user, signOut } = useAuthState();

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const navItems = [
    { name: t("home"), icon: Home, path: "/", mobile: true },
    { name: t("search"), icon: Search, path: "/search", mobile: true },
    { name: t("reels"), icon: Video, path: "/reels", mobile: true },
    {
      name: t("messages"),
      icon: MessageCircle,
      path: "/messages",
      mobile: true,
    },
    {
      name: t("notifications"),
      icon: Heart,
      path: "/notifications",
      mobile: false,
    },
    { name: t("create"), icon: PlusSquare, path: "/create", mobile: false },
    { name: t("camera"), icon: Camera, path: "/camera", mobile: false },
    { name: t("settings"), icon: Settings, path: "/settings", mobile: false },
    { name: t("profile"), icon: User, path: "/profile", mobile: true },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex-col z-50">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                S
              </span>
            </div>
            <span className="text-xl font-bold text-foreground">
              SocialFusion
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-3 py-3 rounded-lg mb-2 transition-colors ${
                isActive(item.path)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">@johndoe</p>
            </div>
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="w-8 h-8"
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-card border-b border-border z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                S
              </span>
            </div>
            <span className="text-xl font-bold text-foreground">
              SocialFusion
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={() => navigate("/camera")}
              title={t("camera")}
            >
              <Camera className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 relative"
              onClick={() => navigate("/messages")}
              title={t("send")}
            >
              <Send className="w-4 h-4" />
              {notificationCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">
                    {notificationCount}
                  </span>
                </div>
              )}
            </Button>
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="w-8 h-8"
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Menu className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate("/notifications")}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      {hasNotifications ? (
                        <BellRing className="w-4 h-4" />
                      ) : (
                        <Bell className="w-4 h-4" />
                      )}
                      <span>{t("notifications")}</span>
                    </div>
                    {notificationCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {notificationCount}
                      </span>
                    )}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/create")}>
                  <PlusSquare className="w-4 h-4 mr-2" />
                  <span>{t("create")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="w-4 h-4 mr-2" />
                  <span>{t("profile")}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  <span>Saved Posts</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="w-4 h-4 mr-2" />
                  <span>Friends</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Archive className="w-4 h-4 mr-2" />
                  <span>Archive</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="w-4 h-4 mr-2" />
                  <span>{t("settings")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="w-4 h-4 mr-2" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Shield className="w-4 h-4 mr-2" />
                  <span>Privacy & Safety</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer"
                  onClick={async () => {
                    try {
                      await signOut();
                      toast({
                        title: t('registration.logout'),
                        description: "You have been signed out successfully.",
                      });
                      navigate('/auth');
                    } catch (error) {
                      console.error('Logout error:', error);
                      toast({
                        title: "Error",
                        description: "Failed to sign out. Please try again.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>{t('registration.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="flex items-center justify-around py-2">
          {navItems
            .filter((item) => item.mobile)
            .map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                  isActive(item.path) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;
