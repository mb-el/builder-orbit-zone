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
    { name: t("home"), icon: Home, path: "/", mobile: true, priority: 1 },
    { name: t("search"), icon: Search, path: "/search", mobile: true, priority: 2 },
    { name: t("create"), icon: PlusSquare, path: "/create", mobile: true, priority: 3 },
    { name: t("reels"), icon: Video, path: "/reels", mobile: true, priority: 4 },
    {
      name: t("notifications"),
      icon: Heart,
      path: "/notifications",
      mobile: true,
      priority: 5,
    },
    {
      name: t("messages"),
      icon: MessageCircle,
      path: "/messages",
      mobile: false, // Moved to top bar
      priority: 6,
    },
    { name: t("camera"), icon: Camera, path: "/camera", mobile: false, priority: 7 },
    { name: t("settings"), icon: Settings, path: "/settings", mobile: false, priority: 8 },
    { name: t("profile"), icon: User, path: "/profile", mobile: false, priority: 9 }, // Moved to dropdown
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
      <div className="md:hidden fixed top-0 left-0 right-0 bg-card border-b border-border z-50 no-scroll-x">
        <div className="flex items-center justify-between px-2 mobile-xs:px-3 py-2 mobile-sm:py-2.5">
          {/* Logo - Optimized for small screens */}
          <Link to="/" className="flex items-center gap-1 mobile-sm:gap-1.5 min-w-0 flex-shrink">
            <div className="w-6 h-6 mobile-sm:w-7 mobile-sm:h-7 bg-primary rounded-md flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold text-[10px] mobile-sm:text-xs">
                S
              </span>
            </div>
            <span className="text-base mobile-sm:text-lg font-bold text-foreground truncate hidden mobile-md:block">
              SocialFusion
            </span>
            <span className="text-base mobile-sm:text-lg font-bold text-foreground truncate mobile-md:hidden hidden mobile-xs:block">
              SF
            </span>
          </Link>

          {/* Action Icons - Essential actions visible */}
          <div className="flex items-center gap-0.5 mobile-sm:gap-1 flex-shrink-0">
            {/* Messages with notification badge */}
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 mobile-sm:w-9 mobile-sm:h-9 relative touch-target-optimized"
              onClick={() => navigate("/messages")}
              title={t("messages")}
            >
              <MessageCircle className="w-3.5 h-3.5 mobile-sm:w-4 mobile-sm:h-4" />
              {notificationCount > 0 && (
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 mobile-sm:w-3.5 mobile-sm:h-3.5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-[8px] mobile-sm:text-[10px] text-white font-bold leading-none">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                </div>
              )}
            </Button>

            {/* Camera */}
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 mobile-sm:w-9 mobile-sm:h-9 touch-target-optimized"
              onClick={() => navigate("/camera")}
              title={t("camera")}
            >
              <Camera className="w-3.5 h-3.5 mobile-sm:w-4 mobile-sm:h-4" />
            </Button>

            {/* Profile with Avatar */}
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 mobile-sm:w-9 mobile-sm:h-9 p-0 touch-target-optimized"
              onClick={() => navigate("/profile")}
              title={t("profile")}
            >
              <Avatar className="w-5 h-5 mobile-sm:w-6 mobile-sm:h-6">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-[10px] mobile-sm:text-xs">JD</AvatarFallback>
              </Avatar>
            </Button>

            {/* More Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8 mobile-sm:w-9 mobile-sm:h-9 touch-target-optimized">
                  <Menu className="w-3.5 h-3.5 mobile-sm:w-4 mobile-sm:h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                {/* Settings & Theme */}
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="w-4 h-4 mr-3" />
                  <span>{t("settings")}</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={toggleDarkMode}>
                  {isDark ? (
                    <>
                      <Sun className="w-4 h-4 mr-3" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 mr-3" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </DropdownMenuItem>

                <div className="px-2 py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Language:</span>
                    <LanguageSwitcher />
                  </div>
                </div>

                <DropdownMenuSeparator />

                {/* Social Features */}
                <DropdownMenuItem>
                  <BookmarkPlus className="w-4 h-4 mr-3" />
                  <span>Saved Posts</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="w-4 h-4 mr-3" />
                  <span>Friends</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Archive className="w-4 h-4 mr-3" />
                  <span>Archive</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Help & Support */}
                <DropdownMenuItem>
                  <HelpCircle className="w-4 h-4 mr-3" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Shield className="w-4 h-4 mr-3" />
                  <span>Privacy & Safety</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Logout */}
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
                  <LogOut className="w-4 h-4 mr-3" />
                  <span>{t('registration.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar - Enhanced with all essential navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 no-scroll-x landscape-compact">
        <div className="flex items-center justify-around py-1 mobile-sm:py-1.5 px-0.5 mobile-sm:px-1">
          {navItems
            .filter((item) => item.mobile)
            .sort((a, b) => a.priority - b.priority)
            .map((item) => {
              const isItemActive = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex flex-col items-center gap-0.5 px-1 mobile-sm:px-2 py-1 mobile-sm:py-1.5 rounded-lg transition-all duration-200 relative min-w-0 flex-1 touch-target-optimized ${
                    isItemActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <div className="relative">
                    <item.icon className={`w-4 h-4 mobile-sm:w-5 mobile-sm:h-5 transition-transform ${
                      isItemActive ? "scale-110" : ""
                    }`} />
                    {/* Notification badge for notifications tab */}
                    {item.path === '/notifications' && hasNotifications && (
                      <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 mobile-sm:w-2 mobile-sm:h-2 bg-red-500 rounded-full"></div>
                    )}
                    {/* Active indicator */}
                    {isItemActive && (
                      <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-0.5 mobile-sm:h-1 bg-primary rounded-full"></div>
                    )}
                  </div>
                  <span className={`text-[9px] mobile-sm:text-[10px] font-medium truncate max-w-full leading-tight ${
                    isItemActive ? "text-primary" : ""
                  }`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
        </div>
        {/* Safe area for devices with home indicator */}
        <div className="h-safe-area-inset-bottom bg-card min-h-[8px]"></div>
      </div>
    </>
  );
};

export default Navigation;
