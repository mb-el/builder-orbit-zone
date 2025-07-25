import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "./ImageUpload";
import VideoUpload from "./VideoUpload";
import CameraCapture from "./CameraCapture";
import {
  Image,
  Video,
  Smile,
  MapPin,
  Users,
  Camera,
  X,
  Globe
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const CreatePost = () => {
  const { t } = useTranslation();
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [taggedFriends, setTaggedFriends] = useState<string[]>([]);
  const [privacySetting, setPrivacySetting] = useState<'public' | 'friends' | 'private'>('public');

  const feelings = [
    { icon: '😊', label: 'Happy' },
    { icon: '😂', label: 'Laughing' },
    { icon: '😍', label: 'In love' },
    { icon: '😎', label: 'Cool' },
    { icon: '🤗', label: 'Grateful' },
    { icon: '😴', label: 'Sleepy' },
    { icon: '🎉', label: 'Celebrating' },
    { icon: '💪', label: 'Strong' },
  ];

  const handleFeelingSelect = (feeling: string) => {
    setSelectedFeeling(feeling);
    toast({
      description: `Feeling ${feeling} added to your post! 😊`,
      duration: 2000,
    });
  };

  const handleLocationSelect = () => {
    // Simulate location selection
    const locations = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Miami, FL'];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    setSelectedLocation(randomLocation);
    toast({
      description: `Location "${randomLocation}" added to your post! 📍`,
      duration: 2000,
    });
  };

  const handleTagFriends = () => {
    // Simulate friend tagging
    const friends = ['Alice Wonder', 'Bob Creator', 'Emma Travels'];
    const randomFriend = friends[Math.floor(Math.random() * friends.length)];
    if (!taggedFriends.includes(randomFriend)) {
      setTaggedFriends([...taggedFriends, randomFriend]);
      toast({
        description: `${randomFriend} tagged in your post! 👥`,
        duration: 2000,
      });
    }
  };

  const handlePrivacyChange = (privacy: 'public' | 'friends' | 'private') => {
    setPrivacySetting(privacy);
    toast({
      description: `Privacy set to ${privacy}`,
      duration: 1500,
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <Textarea
              placeholder={t('whats_on_mind', { name: 'John' })}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="min-h-[50px] border-none resize-none shadow-none focus-visible:ring-0 p-0 text-base placeholder:text-muted-foreground"
            />
            
            {isExpanded && (
              <div className="mt-4 space-y-4">
                {/* Media Upload Options */}
                <div className="flex items-center gap-4 flex-wrap">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-green-600 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                    onClick={() => setShowImageUpload(true)}
                  >
                    <Image className="w-5 h-5 mr-2" />
                    Photo
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                    onClick={() => setShowVideoUpload(true)}
                  >
                    <Video className="w-5 h-5 mr-2" />
                    Video
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-orange-600 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950"
                    onClick={() => setShowCamera(true)}
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    {t('camera')}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950">
                        <Smile className="w-5 h-5 mr-2" />
                        {selectedFeeling ? `Feeling ${selectedFeeling}` : 'Feeling'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      {feelings.map((feeling) => (
                        <DropdownMenuItem
                          key={feeling.label}
                          onClick={() => handleFeelingSelect(feeling.label)}
                          className="cursor-pointer"
                        >
                          <span className="text-lg mr-2">{feeling.icon}</span>
                          <span>{feeling.label}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={handleLocationSelect}
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    {selectedLocation || 'Location'}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-600 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950"
                    onClick={handleTagFriends}
                  >
                    <Users className="w-5 h-5 mr-2" />
                    {taggedFriends.length > 0 ? `${taggedFriends.length} friend(s)` : 'Tag Friends'}
                  </Button>
                </div>

                {/* Media Previews */}
                {(selectedImages.length > 0 || selectedVideo) && (
                  <div className="mt-4 space-y-3">
                    {selectedImages.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {selectedImages.slice(0, 3).map((file, index) => (
                          <div key={index} className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 w-6 h-6"
                              onClick={() => {
                                const updated = selectedImages.filter((_, i) => i !== index);
                                setSelectedImages(updated);
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                        {selectedImages.length > 3 && (
                          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                            <span className="text-sm text-muted-foreground">+{selectedImages.length - 3} more</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {selectedVideo && (
                      <div className="relative">
                        <video
                          src={URL.createObjectURL(selectedVideo)}
                          className="w-full h-48 object-cover rounded-lg"
                          controls
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 w-6 h-6"
                          onClick={() => setSelectedVideo(null)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Post Actions */}
                {/* Post Meta Info */}
                {(selectedFeeling || selectedLocation || taggedFriends.length > 0) && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedFeeling && (
                      <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/20 px-2 py-1 rounded-full text-xs">
                        <Smile className="w-3 h-3" />
                        <span>Feeling {selectedFeeling}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-4 h-4 p-0 hover:bg-transparent"
                          onClick={() => setSelectedFeeling(null)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                    {selectedLocation && (
                      <div className="flex items-center gap-1 bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded-full text-xs">
                        <MapPin className="w-3 h-3" />
                        <span>{selectedLocation}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-4 h-4 p-0 hover:bg-transparent"
                          onClick={() => setSelectedLocation(null)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                    {taggedFriends.map((friend) => (
                      <div key={friend} className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/20 px-2 py-1 rounded-full text-xs">
                        <Users className="w-3 h-3" />
                        <span>{friend}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-4 h-4 p-0 hover:bg-transparent"
                          onClick={() => setTaggedFriends(taggedFriends.filter(f => f !== friend))}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          privacySetting === 'public' ? 'bg-green-500' :
                          privacySetting === 'friends' ? 'bg-blue-500' : 'bg-gray-500'
                        }`}></div>
                        <span className="text-sm text-muted-foreground capitalize">{privacySetting}</span>
                        <Globe className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handlePrivacyChange('public')} className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Public</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePrivacyChange('friends')} className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Friends only</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePrivacyChange('private')} className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                          <span>Only me</span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setIsExpanded(false);
                        setContent("");
                        setSelectedImages([]);
                        setSelectedVideo(null);
                        setSelectedFeeling(null);
                        setSelectedLocation(null);
                        setTaggedFriends([]);
                      }}
                    >
                      {t('cancel')}
                    </Button>
                    <Button 
                      size="sm"
                      disabled={!content.trim() && selectedImages.length === 0 && !selectedVideo}
                      className="px-6"
                    >
                      {t('post')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Media Upload Modals */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full">
            <ImageUpload 
              onImageSelect={(files) => {
                setSelectedImages(files);
                setShowImageUpload(false);
              }}
              onImageRemove={() => {}}
            />
            <Button
              variant="ghost"
              className="mt-4 w-full"
              onClick={() => setShowImageUpload(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {showVideoUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full">
            <VideoUpload 
              onVideoSelect={(file) => {
                setSelectedVideo(file);
                setShowVideoUpload(false);
              }}
              onVideoRemove={() => setSelectedVideo(null)}
            />
            <Button
              variant="ghost"
              className="mt-4 w-full"
              onClick={() => setShowVideoUpload(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {showCamera && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full">
            <CameraCapture 
              onCapture={(blob, type) => {
                if (type === 'photo') {
                  const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
                  setSelectedImages([...selectedImages, file]);
                } else {
                  const file = new File([blob], `video_${Date.now()}.webm`, { type: 'video/webm' });
                  setSelectedVideo(file);
                }
                setShowCamera(false);
              }}
              onClose={() => setShowCamera(false)}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default CreatePost;
