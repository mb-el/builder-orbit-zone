# Firebase Configuration Setup

This guide will help you set up Firebase for the CreatePost component with image/video uploads and Firestore integration.

## Prerequisites

1. A Firebase project (create one at https://console.firebase.google.com)
2. Firebase Authentication enabled
3. Cloud Firestore database created
4. Cloud Storage bucket created

## Setup Steps

### 1. Get Firebase Configuration

1. Go to your Firebase Console
2. Click on Project Settings (gear icon)
3. Scroll down to "Your apps" section
4. Click "Add app" and select Web (</>) if you haven't already
5. Copy the config object

### 2. Update Firebase Configuration

Replace the placeholder values in `client/lib/firebase.ts` with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 3. Set up Firestore Security Rules

In the Firebase Console, go to Firestore Database > Rules and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Posts collection
    match /posts/{postId} {
      allow read: if true; // Public read
      allow write: if request.auth != null; // Authenticated users can write
    }
    
    // Users collection (if needed)
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Set up Storage Security Rules

In the Firebase Console, go to Storage > Rules and update:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Images folder
    match /images/{allPaths=**} {
      allow read: if true; // Public read
      allow write: if request.auth != null 
        && request.resource.size < 10 * 1024 * 1024 // 10MB limit
        && request.resource.contentType.matches('image/.*');
    }
    
    // Videos folder
    match /videos/{allPaths=**} {
      allow read: if true; // Public read
      allow write: if request.auth != null 
        && request.resource.size < 100 * 1024 * 1024 // 100MB limit
        && request.resource.contentType.matches('video/.*');
    }
  }
}
```

### 5. Environment Variables (Optional)

Create a `.env.local` file in your project root:

```bash
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Then update `client/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

## Features Implemented

### ✅ File Validation
- **Images**: Max 10MB, JPEG/PNG/WebP/GIF formats, up to 10 files
- **Videos**: Max 100MB, MP4/WebM/OGG formats, 1 file
- Real-time validation with user-friendly error messages

### ✅ Media Upload
- **Firebase Storage**: Automatic upload with progress tracking
- **Image Compression**: Automatic compression to reduce file size
- **Video Thumbnails**: Auto-generated thumbnails for videos
- **Unique Filenames**: UUID-based naming to prevent conflicts

### ✅ Post Creation
- **Firestore Integration**: Posts saved with metadata
- **Multi-language Support**: Full i18n implementation
- **Rich Metadata**: Feelings, location, tagged friends, privacy settings
- **Real-time Progress**: Upload progress with stage indicators

### ✅ Enhanced UX
- **Live Previews**: Image and video previews before upload
- **Error Handling**: Comprehensive error states and recovery
- **Loading States**: Progress indicators and disabled states
- **Toast Notifications**: Real-time feedback for all actions

### ✅ Camera Integration
- **Photo Capture**: Direct camera photo capture
- **Video Recording**: Camera video recording
- **Multiple Cameras**: Front/back camera switching
- **Fallback Support**: File upload when camera unavailable

## Firestore Data Structure

Posts are stored in Firestore with this structure:

```javascript
{
  content: "Post text content",
  mediaUrls: ["https://storage.googleapis.com/..."],
  feeling: "Happy",
  location: "New York, NY",
  taggedFriends: ["Alice Wonder", "Bob Creator"],
  privacy: "public",
  authorId: "user123",
  authorName: "John Doe",
  authorAvatar: "https://...",
  createdAt: Timestamp,
  likes: 0,
  comments: 0,
  shares: 0
}
```

## Troubleshooting

### Common Issues

1. **Storage Upload Fails**
   - Check storage rules
   - Verify file size limits
   - Ensure user is authenticated

2. **Firestore Write Fails**
   - Check Firestore rules
   - Verify user authentication
   - Check network connectivity

3. **Camera Not Working**
   - Ensure HTTPS (required for camera access)
   - Check browser permissions
   - Verify camera availability

### Debug Mode

Enable debug mode by setting `debug: true` in `client/lib/i18n.ts` for detailed logs.

## Production Checklist

- [ ] Update Firebase security rules for production
- [ ] Set up proper user authentication
- [ ] Configure CORS for your domain
- [ ] Set up Cloud Functions for additional processing
- [ ] Enable Firebase Analytics (optional)
- [ ] Set up monitoring and alerts
