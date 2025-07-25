import { storage, db, areFirebaseServicesAvailable } from "./firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export interface MediaFile {
  file: File;
  type: "image" | "video";
  url?: string;
  uploadProgress?: number;
}

export interface PostData {
  content: string;
  mediaUrls: string[];
  feeling?: string;
  location?: string;
  taggedFriends: string[];
  privacy: "public" | "friends" | "private";
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: any;
  likes: number;
  comments: number;
  shares: number;
}

// File validation constants
export const FILE_VALIDATION = {
  IMAGE: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    maxFiles: 10,
  },
  VIDEO: {
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ["video/mp4", "video/webm", "video/ogg", "video/quicktime"],
    maxFiles: 1,
  },
};

/**
 * Validate file size and type
 */
export const validateFile = (
  file: File,
  type: "image" | "video",
): { valid: boolean; error?: string } => {
  const validation =
    FILE_VALIDATION[type.toUpperCase() as keyof typeof FILE_VALIDATION];

  // Check file size
  if (file.size > validation.maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${validation.maxSize / (1024 * 1024)}MB limit`,
    };
  }

  // Check file type
  if (!validation.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${validation.allowedTypes.join(", ")}`,
    };
  }

  return { valid: true };
};

/**
 * Validate multiple files
 */
export const validateFiles = (
  files: File[],
  type: "image" | "video",
): { valid: boolean; errors: string[] } => {
  const validation =
    FILE_VALIDATION[type.toUpperCase() as keyof typeof FILE_VALIDATION];
  const errors: string[] = [];

  // Check number of files
  if (files.length > validation.maxFiles) {
    errors.push(`Maximum ${validation.maxFiles} ${type}(s) allowed`);
  }

  // Validate each file
  files.forEach((file, index) => {
    const result = validateFile(file, type);
    if (!result.valid) {
      errors.push(`File ${index + 1}: ${result.error}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Upload a single file to Firebase Storage with progress tracking
 */
export const uploadFileToStorage = (
  file: File,
  path: string,
  onProgress?: (progress: number) => void,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Check if Firebase Storage is available
    if (!areFirebaseServicesAvailable() || !storage) {
      console.warn("Firebase Storage not available, returning mock URL");
      // Simulate upload progress
      const simulateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;
          onProgress?.(progress);
          if (progress >= 100) {
            clearInterval(interval);
            resolve(
              `https://via.placeholder.com/400x300?text=${encodeURIComponent(file.name)}`,
            );
          }
        }, 100);
      };
      simulateProgress();
      return;
    }

    const fileId = uuidv4();
    const fileName = `${fileId}_${file.name}`;
    const storageRef = ref(storage, `${path}/${fileName}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => {
        console.error("Upload error:", error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      },
    );
  });
};

/**
 * Upload multiple files to Firebase Storage
 */
export const uploadMultipleFiles = async (
  files: File[],
  onProgress?: (fileIndex: number, progress: number) => void,
): Promise<string[]> => {
  const uploadPromises = files.map((file, index) => {
    const path = file.type.startsWith("image/") ? "images" : "videos";
    return uploadFileToStorage(file, path, (progress) => {
      onProgress?.(index, progress);
    });
  });

  return Promise.all(uploadPromises);
};

/**
 * Create a new post in Firestore
 */
export const createPost = async (
  postData: Omit<PostData, "createdAt" | "likes" | "comments" | "shares">,
): Promise<string> => {
  try {
    // Check if Firestore is available
    if (!areFirebaseServicesAvailable() || !db) {
      console.warn("Firestore not available, returning mock post ID");
      return "demo-post-" + Date.now();
    }

    const docRef = await addDoc(collection(db, "posts"), {
      ...postData,
      createdAt: serverTimestamp(),
      likes: 0,
      comments: 0,
      shares: 0,
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

/**
 * Upload media files and create post
 */
export const uploadPostWithMedia = async (
  content: string,
  mediaFiles: MediaFile[],
  metadata: {
    feeling?: string;
    location?: string;
    taggedFriends: string[];
    privacy: "public" | "friends" | "private";
    authorId: string;
    authorName: string;
    authorAvatar: string;
  },
  onProgress?: (stage: string, progress: number) => void,
): Promise<string> => {
  try {
    onProgress?.("Validating files...", 0);

    // Validate all files
    const imageFiles = mediaFiles
      .filter((m) => m.type === "image")
      .map((m) => m.file);
    const videoFiles = mediaFiles
      .filter((m) => m.type === "video")
      .map((m) => m.file);

    if (imageFiles.length > 0) {
      const imageValidation = validateFiles(imageFiles, "image");
      if (!imageValidation.valid) {
        throw new Error(imageValidation.errors.join(", "));
      }
    }

    if (videoFiles.length > 0) {
      const videoValidation = validateFiles(videoFiles, "video");
      if (!videoValidation.valid) {
        throw new Error(videoValidation.errors.join(", "));
      }
    }

    onProgress?.("Uploading media...", 10);

    // Upload media files
    const mediaUrls: string[] = [];
    const allFiles = mediaFiles.map((m) => m.file);

    if (allFiles.length > 0) {
      const uploadedUrls = await uploadMultipleFiles(
        allFiles,
        (fileIndex, progress) => {
          const overallProgress = 10 + (progress / allFiles.length) * 60;
          onProgress?.(
            `Uploading file ${fileIndex + 1}/${allFiles.length}`,
            overallProgress,
          );
        },
      );
      mediaUrls.push(...uploadedUrls);
    }

    onProgress?.("Creating post...", 80);

    // Create post in Firestore
    const postId = await createPost({
      content,
      mediaUrls,
      ...metadata,
    });

    onProgress?.("Post created successfully!", 100);

    return postId;
  } catch (error) {
    console.error("Error uploading post:", error);
    throw error;
  }
};

/**
 * Generate thumbnail for video files
 */
export const generateVideoThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    video.addEventListener("loadeddata", () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      video.currentTime = 1; // Seek to 1 second
    });

    video.addEventListener("seeked", () => {
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnail = canvas.toDataURL("image/jpeg", 0.8);
        resolve(thumbnail);
      } else {
        reject(new Error("Could not get canvas context"));
      }
    });

    video.addEventListener("error", () => {
      reject(new Error("Error loading video"));
    });

    video.src = URL.createObjectURL(file);
  });
};

/**
 * Compress image file
 */
export const compressImage = (
  file: File,
  quality: number = 0.8,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions (max 1920x1080)
      let { width, height } = img;
      const maxWidth = 1920;
      const maxHeight = 1080;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error("Failed to compress image"));
            }
          },
          "image/jpeg",
          quality,
        );
      } else {
        reject(new Error("Could not get canvas context"));
      }
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
};
