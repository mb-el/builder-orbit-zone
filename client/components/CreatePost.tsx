import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Globe,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Upload
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  uploadPostWithMedia,
  MediaFile,
  validateFiles,
  compressImage,
  generateVideoThumbnail
} from "@/lib/firebaseService";
import { useAuthState, getCurrentUser } from "@/hooks/useAuth";

interface CreatePostProps {
  onPostCreated?: (postId: string) => void;
  className?: string;
}

const CreatePost = ({ onPostCreated, className }: CreatePostProps) => {
  const { t } = useTranslation();
  
  // Basic state
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Media states
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  
  // UI states
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  
  // Post metadata
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [taggedFriends, setTaggedFriends] = useState<string[]>([]);
  const [privacySetting, setPrivacySetting] = useState<'public' | 'friends' | 'private'>('public');
  
  // Upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Media previews
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const feelings = [
    { icon: '😊', label: t('feeling_happy') || 'Happy' },
    { icon: '😂', label: t('feeling_laughing') || 'Laughing' },
    { icon: '😍', label: t('feeling_in_love') || 'In love' },
    { icon: '😎', label: t('feeling_cool') || 'Cool' },
    { icon: '🤗', label: t('feeling_grateful') || 'Grateful' },
    { icon: '😴', label: t('feeling_sleepy') || 'Sleepy' },
    { icon: '🎉', label: t('feeling_celebrating') || 'Celebrating' },
    { icon: '💪', label: t('feeling_strong') || 'Strong' },
  ];

  // Handle feeling selection
  const handleFeelingSelect = useCallback((feeling: string) => {
    setSelectedFeeling(feeling);
    toast({
      description: t('feeling_added', { feeling }) || `Feeling ${feeling} added to your post! 😊`,
      duration: 2000,
    });
  }, [t]);

  // Handle location selection
  const handleLocationSelect = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates
          const mockLocation = `${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`;
          setSelectedLocation(mockLocation);
          toast({
            description: t('location_added') || `Location added to your post! 📍`,
            duration: 2000,
          });
        },
        () => {
          // Fallback to mock locations
          const locations = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Miami, FL'];
          const randomLocation = locations[Math.floor(Math.random() * locations.length)];
          setSelectedLocation(randomLocation);
          toast({
            description: t('location_added') || `Location "${randomLocation}" added to your post! 📍`,
            duration: 2000,
          });
        }
      );
    }
  }, [t]);

  // Handle friend tagging
  const handleTagFriends = useCallback(() => {
    const friends = ['Alice Wonder', 'Bob Creator', 'Emma Travels', 'Mike Fitness', 'Sarah Cook'];
    const randomFriend = friends[Math.floor(Math.random() * friends.length)];
    if (!taggedFriends.includes(randomFriend)) {
      setTaggedFriends(prev => [...prev, randomFriend]);
      toast({
        description: t('friend_tagged', { name: randomFriend }) || `${randomFriend} tagged in your post! 👥`,
        duration: 2000,
      });
    }
  }, [taggedFriends, t]);

  // Handle privacy change
  const handlePrivacyChange = useCallback((privacy: 'public' | 'friends' | 'private') => {
    setPrivacySetting(privacy);
    toast({
      description: t('privacy_set', { privacy }) || `Privacy set to ${privacy}`,
      duration: 1500,
    });
  }, [t]);

  // Generate media previews
  const generatePreviews = useCallback(async (files: File[]) => {
    const images = files.filter(file => file.type.startsWith('image/'));
    const videos = files.filter(file => file.type.startsWith('video/'));
    
    // Generate image previews
    if (images.length > 0) {
      const previews = images.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
    
    // Generate video preview and thumbnail
    if (videos.length > 0) {
      const video = videos[0];
      const preview = URL.createObjectURL(video);
      setVideoPreview(preview);
      
      try {
        const thumbnail = await generateVideoThumbnail(video);
        setVideoThumbnail(thumbnail);
      } catch (error) {
        console.warn('Could not generate video thumbnail:', error);
      }
    }
  }, []);

  // Handle image selection
  const handleImageSelect = useCallback(async (files: File[]) => {
    setUploadError(null);
    
    // Validate files
    const validation = validateFiles(files, 'image');
    if (!validation.valid) {
      setUploadError(validation.errors.join(', '));
      return;
    }
    
    try {
      // Compress images
      const compressedFiles = await Promise.all(
        files.map(file => compressImage(file, 0.8))
      );
      
      setSelectedImages(compressedFiles);
      await generatePreviews(compressedFiles);
      
      const mediaFiles: MediaFile[] = compressedFiles.map(file => ({
        file,
        type: 'image'
      }));
      setMediaFiles(prev => [...prev.filter(m => m.type !== 'image'), ...mediaFiles]);
      
      setShowImageUpload(false);
    } catch (error) {
      setUploadError('Failed to process images');
      console.error('Image processing error:', error);
    }
  }, [generatePreviews]);

  // Handle video selection
  const handleVideoSelect = useCallback(async (file: File) => {
    setUploadError(null);
    
    // Validate file
    const validation = validateFiles([file], 'video');
    if (!validation.valid) {
      setUploadError(validation.errors.join(', '));
      return;
    }
    
    setSelectedVideo(file);
    await generatePreviews([file]);
    
    const mediaFile: MediaFile = { file, type: 'video' };
    setMediaFiles(prev => [...prev.filter(m => m.type !== 'video'), mediaFile]);
    
    setShowVideoUpload(false);
  }, [generatePreviews]);

  // Handle camera capture
  const handleCameraCapture = useCallback(async (blob: Blob, type: 'photo' | 'video') => {
    const file = new File(
      [blob], 
      `${type}_${Date.now()}.${type === 'photo' ? 'jpg' : 'webm'}`, 
      { type: type === 'photo' ? 'image/jpeg' : 'video/webm' }
    );
    
    if (type === 'photo') {
      await handleImageSelect([...selectedImages, file]);
    } else {
      await handleVideoSelect(file);
    }
    
    setShowCamera(false);
  }, [handleImageSelect, handleVideoSelect, selectedImages]);

  // Remove media file
  const removeMediaFile = useCallback((index: number, type: 'image' | 'video') => {
    if (type === 'image') {
      const updatedImages = selectedImages.filter((_, i) => i !== index);
      setSelectedImages(updatedImages);
      
      // Update previews
      const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
      setImagePreviews(updatedPreviews);
      
      // Revoke URL to prevent memory leaks
      URL.revokeObjectURL(imagePreviews[index]);
    } else {
      setSelectedVideo(null);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
      setVideoThumbnail(null);
    }
    
    setMediaFiles(prev => prev.filter(m => !(m.type === type)));
  }, [selectedImages, imagePreviews, videoPreview]);

  // Handle post submission
  const handlePostSubmit = useCallback(async () => {
    if (!content.trim() && mediaFiles.length === 0) {
      toast({
        description: t('post_empty_error') || 'Please add some content or media to your post',
        duration: 3000,
      });
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    setUploadProgress(0);

    try {
      // Mock user data - in a real app, get from auth context
      const userData = {
        authorId: 'user123',
        authorName: 'John Doe',
        authorAvatar: '/placeholder.svg'
      };

      const postId = await uploadPostWithMedia(
        content,
        mediaFiles,
        {
          feeling: selectedFeeling,
          location: selectedLocation,
          taggedFriends,
          privacy: privacySetting,
          ...userData
        },
        (stage, progress) => {
          setUploadStage(stage);
          setUploadProgress(progress);
        }
      );

      setUploadSuccess(true);
      onPostCreated?.(postId);
      
      toast({
        description: t('post_created_success') || '🎉 Post created successfully!',
        duration: 3000,
      });

      // Reset form
      setTimeout(() => {
        resetForm();
      }, 2000);

    } catch (error: any) {
      setUploadError(error.message || 'Failed to create post');
      toast({
        description: t('post_creation_error') || 'Failed to create post. Please try again.',
        duration: 5000,
      });
    } finally {
      setIsUploading(false);
    }
  }, [content, mediaFiles, selectedFeeling, selectedLocation, taggedFriends, privacySetting, onPostCreated, t]);

  // Reset form
  const resetForm = useCallback(() => {
    setContent("");
    setIsExpanded(false);
    setSelectedImages([]);
    setSelectedVideo(null);
    setMediaFiles([]);
    setSelectedFeeling(null);
    setSelectedLocation(null);
    setTaggedFriends([]);
    setPrivacySetting('public');
    setUploadError(null);
    setUploadSuccess(false);
    setUploadProgress(0);
    setUploadStage("");
    
    // Clean up preview URLs
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setImagePreviews([]);
    setVideoPreview(null);
    setVideoThumbnail(null);
  }, [imagePreviews, videoPreview]);

  return (
    <Card className={`mb-6 ${className}`}>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <Textarea
              placeholder={t('whats_on_mind', { name: 'John' }) || "What's on your mind, John?"}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="min-h-[50px] border-none resize-none shadow-none focus-visible:ring-0 p-0 text-base placeholder:text-muted-foreground"
              disabled={isUploading}
            />
            
            {isExpanded && (
              <div className="mt-4 space-y-4">
                {/* Upload Progress */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">{uploadStage}</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground">{uploadProgress.toFixed(0)}% complete</p>
                  </div>
                )}

                {/* Upload Error */}
                {uploadError && (
                  <Alert className="border-red-500/50 bg-red-50 dark:bg-red-950/20">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-700 dark:text-red-300">
                      {uploadError}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Upload Success */}
                {uploadSuccess && (
                  <Alert className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-700 dark:text-green-300">
                      {t('post_created_success') || 'Post created successfully! 🎉'}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Media Upload Options */}
                <div className="flex items-center gap-4 flex-wrap">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-green-600 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                    onClick={() => setShowImageUpload(true)}
                    disabled={isUploading}
                  >
                    <Image className="w-5 h-5 mr-2" />
                    {t('photo') || 'Photo'}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                    onClick={() => setShowVideoUpload(true)}
                    disabled={isUploading || selectedVideo !== null}
                  >
                    <Video className="w-5 h-5 mr-2" />
                    {t('video') || 'Video'}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-orange-600 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950"
                    onClick={() => setShowCamera(true)}
                    disabled={isUploading}
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    {t('camera') || 'Camera'}
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-yellow-600 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950"
                        disabled={isUploading}
                      >
                        <Smile className="w-5 h-5 mr-2" />
                        {selectedFeeling ? `${t('feeling') || 'Feeling'} ${selectedFeeling}` : t('feeling') || 'Feeling'}
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
                    disabled={isUploading}
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    {selectedLocation || t('location') || 'Location'}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-600 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950"
                    onClick={handleTagFriends}
                    disabled={isUploading}
                  >
                    <Users className="w-5 h-5 mr-2" />
                    {taggedFriends.length > 0 ? `${taggedFriends.length} ${t('friends') || 'friend(s)'}` : t('tag_friends') || 'Tag Friends'}
                  </Button>
                </div>

                {/* Media Previews */}
                {(selectedImages.length > 0 || selectedVideo) && (
                  <div className="mt-4 space-y-3">
                    {/* Image Previews */}
                    {selectedImages.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {imagePreviews.slice(0, 9).map((preview, index) => (
                          <div key={index} className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeMediaFile(index, 'image')}
                              disabled={isUploading}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                        {selectedImages.length > 9 && (
                          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                            <span className="text-sm text-muted-foreground">+{selectedImages.length - 9} more</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Video Preview */}
                    {selectedVideo && videoPreview && (
                      <div className="relative group">
                        <video
                          src={videoPreview}
                          className="w-full h-48 object-cover rounded-lg"
                          controls
                          poster={videoThumbnail || undefined}
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeMediaFile(0, 'video')}
                          disabled={isUploading}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Post Meta Info */}
                {(selectedFeeling || selectedLocation || taggedFriends.length > 0) && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedFeeling && (
                      <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/20 px-2 py-1 rounded-full text-xs">
                        <Smile className="w-3 h-3" />
                        <span>{t('feeling') || 'Feeling'} {selectedFeeling}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-4 h-4 p-0 hover:bg-transparent"
                          onClick={() => setSelectedFeeling(null)}
                          disabled={isUploading}
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
                          disabled={isUploading}
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
                          disabled={isUploading}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Privacy and Submit */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center gap-2" disabled={isUploading}>
                        <div className={`w-2 h-2 rounded-full ${
                          privacySetting === 'public' ? 'bg-green-500' :
                          privacySetting === 'friends' ? 'bg-blue-500' : 'bg-gray-500'
                        }`}></div>
                        <span className="text-sm text-muted-foreground capitalize">
                          {t(privacySetting) || privacySetting}
                        </span>
                        <Globe className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handlePrivacyChange('public')} className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>{t('public') || 'Public'}</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePrivacyChange('friends')} className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>{t('friends_only') || 'Friends only'}</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePrivacyChange('private')} className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                          <span>{t('only_me') || 'Only me'}</span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={resetForm}
                      disabled={isUploading}
                    >
                      {t('cancel') || 'Cancel'}
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handlePostSubmit}
                      disabled={(!content.trim() && mediaFiles.length === 0) || isUploading}
                      className="px-6"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t('posting') || 'Posting...'}
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          {t('post') || 'Post'}
                        </>
                      )}
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
              onImageSelect={handleImageSelect}
              onImageRemove={() => {}}
              multiple={true}
              maxImages={10}
              maxSizeMB={10}
            />
            <Button
              variant="ghost"
              className="mt-4 w-full"
              onClick={() => setShowImageUpload(false)}
            >
              {t('close') || 'Close'}
            </Button>
          </div>
        </div>
      )}

      {showVideoUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full">
            <VideoUpload 
              onVideoSelect={handleVideoSelect}
              onVideoRemove={() => setSelectedVideo(null)}
              maxSizeMB={100}
            />
            <Button
              variant="ghost"
              className="mt-4 w-full"
              onClick={() => setShowVideoUpload(false)}
            >
              {t('close') || 'Close'}
            </Button>
          </div>
        </div>
      )}

      {showCamera && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full">
            <CameraCapture 
              onCapture={handleCameraCapture}
              onClose={() => setShowCamera(false)}
            />
          </div>
        </div>
      )}

      {/* Hidden file input for additional uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          const images = files.filter(f => f.type.startsWith('image/'));
          const videos = files.filter(f => f.type.startsWith('video/'));
          
          if (images.length > 0) handleImageSelect(images);
          if (videos.length > 0 && !selectedVideo) handleVideoSelect(videos[0]);
        }}
      />
    </Card>
  );
};

export default CreatePost;
