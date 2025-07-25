import PlaceholderPage from "@/components/PlaceholderPage";
import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  return (
    <PlaceholderPage
      title="Search & Discover"
      description="Find friends, trending content, hashtags, and discover new creators. This powerful search feature will help you explore everything SocialFusion has to offer."
      icon={<SearchIcon className="w-12 h-12 text-blue-500" />}
    />
  );
}
