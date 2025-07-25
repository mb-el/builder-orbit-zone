import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Camera,
  Grid3X3
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface ImageUploadProps {
  onImageSelect?: (files: File[]) => void;
  onImageRemove?: (index: number) => void;
  maxSizeMB?: number;
  maxImages?: number;
  acceptedFormats?: string[];
  className?: string;
  multiple?: boolean;
}

const ImageUpload = ({ 
  onImageSelect,
  onImageRemove,
  maxSizeMB = 10,
  maxImages = 10,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  className = "",
  multiple = true
}: ImageUploadProps) => {
  const { t } = useTranslation();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    // Validate total number of images
    if (selectedImages.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    files.forEach(file => {
      // Validate file type
      if (!acceptedFormats.includes(file.type)) {
        setError(`Please select valid image formats: ${acceptedFormats.join(', ')}`);
        return;
      }

      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        setError(`Each image must be less than ${maxSizeMB}MB`);
        return;
      }

      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    if (validFiles.length === 0) return;

    setError(null);
    const updatedImages = [...selectedImages, ...validFiles];
    const updatedPreviews = [...imagePreviews, ...newPreviews];
    
    setSelectedImages(updatedImages);
    setImagePreviews(updatedPreviews);
    
    // Simulate upload progress
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          onImageSelect?.(updatedImages);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    
    setSelectedImages(updatedImages);
    setImagePreviews(updatedPreviews);
    onImageRemove?.(index);
    
    if (updatedImages.length === 0) {
      setUploadProgress(0);
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (selectedImages.length > 0) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Image Grid */}
            <div className={`grid gap-3 ${
              selectedImages.length === 1 ? 'grid-cols-1' : 
              selectedImages.length === 2 ? 'grid-cols-2' : 
              'grid-cols-3'
            }`}>
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Remove Button */}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                  
                  {/* File Size */}
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {formatFileSize(selectedImages[index].size)}
                  </div>
                </div>
              ))}
              
              {/* Add More Button */}
              {selectedImages.length < maxImages && (
                <div 
                  className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={openFileDialog}
                >
                  <ImageIcon className="w-6 h-6 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground">Add More</span>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading images...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
            
            {uploadProgress === 100 && !isUploading && (
              <div className="text-sm text-green-600 font-medium">
                ✓ {selectedImages.length} image(s) uploaded successfully
              </div>
            )}

            {/* Image Info */}
            <div className="text-sm text-muted-foreground">
              {selectedImages.length} of {maxImages} images selected
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div 
          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onClick={openFileDialog}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-primary" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{t('upload_photo')}</h3>
              <p className="text-muted-foreground text-sm">
                {multiple ? 'Drag and drop images here, or click to browse' : 'Drag and drop an image here, or click to browse'}
              </p>
              <p className="text-xs text-muted-foreground">
                Supports JPEG, PNG, WebP, GIF up to {maxSizeMB}MB each
                {multiple && ` (max ${maxImages} images)`}
              </p>
            </div>
            
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="w-4 h-4" />
                Choose {multiple ? 'Files' : 'File'}
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Camera className="w-4 h-4" />
                {t('take_photo')}
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileSelect}
          multiple={multiple}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
