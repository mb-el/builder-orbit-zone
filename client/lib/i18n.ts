import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      search: 'Search', 
      messages: 'Messages',
      notifications: 'Notifications',
      profile: 'Profile',
      create: 'Create',
      reels: 'Reels',
      settings: 'Settings',
      
      // Common actions
      like: 'Like',
      comment: 'Comment',
      share: 'Share',
      save: 'Save',
      follow: 'Follow',
      following: 'Following',
      send: 'Send',
      post: 'Post',
      cancel: 'Cancel',
      
      // Content
      'whats_on_mind': "What's on your mind, {{name}}?",
      'suggested_for_you': 'Suggested for you',
      'see_all': 'See All',
      'trending': 'Trending',
      'your_activity': 'Your Activity',
      'your_story': 'Your Story',
      'view_all_comments': 'View all {{count}} comments',
      'load_more_posts': 'Load More Posts',
      'back_to_home': 'Back to Home',
      'continue_building': 'Continue Building',
      
      // Stats
      posts: 'Posts',
      followers: 'Followers', 
      following_stat: 'Following',
      likes: 'Likes',
      
      // Time
      hours_ago: '{{count}}h',
      days_ago: '{{count}}d',
      minutes_ago: '{{count}}m',
      
      // Placeholders
      'search_discover_desc': 'Find friends, trending content, hashtags, and discover new creators. This powerful search feature will help you explore everything SocialFusion has to offer.',
      'messages_chat_desc': 'Real-time messaging with support for text, voice notes, photos, videos, and audio/video calls. Connect with friends and family instantly.',
      'reels_videos_desc': 'Create and discover short-form videos with powerful editing tools, effects, and filters. Share your creativity with the world through engaging video content.',
      'notifications_desc': 'Stay updated with likes, comments, follows, mentions, and all your social activity. Never miss an important interaction with push notifications.',
      'create_content_desc': 'Share your moments with posts, stories, reels, and live streams. Use powerful editing tools, filters, and effects to bring your content to life.',
      'profile_desc': 'Manage your profile, view your posts and activity, customize your settings, and see your follower analytics. Your personal space on SocialFusion.',
      
      // Camera & Media
      'take_photo': 'Take Photo',
      'record_video': 'Record Video',
      'upload_photo': 'Upload Photo',
      'upload_video': 'Upload Video',
      'camera': 'Camera',
      'gallery': 'Gallery',
      'photo': 'Photo',
      'video': 'Video',
      'close': 'Close',

      // Feelings
      'feeling': 'Feeling',
      'feeling_happy': 'Happy',
      'feeling_laughing': 'Laughing',
      'feeling_in_love': 'In love',
      'feeling_cool': 'Cool',
      'feeling_grateful': 'Grateful',
      'feeling_sleepy': 'Sleepy',
      'feeling_celebrating': 'Celebrating',
      'feeling_strong': 'Strong',
      'feeling_added': 'Feeling {{feeling}} added to your post!',

      // Location & Friends
      'location': 'Location',
      'location_added': 'Location added to your post!',
      'tag_friends': 'Tag Friends',
      'friends': 'friends',
      'friend_tagged': '{{name}} tagged in your post!',

      // Privacy
      'public': 'Public',
      'friends_only': 'Friends only',
      'only_me': 'Only me',
      'privacy_set': 'Privacy set to {{privacy}}',

      // Post submission
      'posting': 'Posting...',
      'post_empty_error': 'Please add some content or media to your post',
      'post_created_success': 'Post created successfully!',
      'post_creation_error': 'Failed to create post. Please try again.',
    }
  },
  ar: {
    translation: {
      // Navigation
      home: 'الرئيسية',
      search: 'البحث',
      messages: 'الرسائل',
      notifications: 'الإشعارات',
      profile: 'الملف الشخصي',
      create: 'إنشاء',
      reels: 'الريلز',
      settings: 'الإعدادات',
      
      // Common actions
      like: 'إعجاب',
      comment: 'تعليق',
      share: 'مشاركة',
      save: 'حفظ',
      follow: 'متابعة',
      following: 'متابَع',
      send: 'إرسال',
      post: 'نشر',
      cancel: 'إلغاء',
      
      // Content
      'whats_on_mind': 'ما الذي تفكر فيه، {{name}}؟',
      'suggested_for_you': 'مقترح لك',
      'see_all': 'عرض الكل',
      'trending': 'الأكثر تداولاً',
      'your_activity': 'نشاطك',
      'your_story': 'قصتك',
      'view_all_comments': 'عرض جميع التعليقات الـ {{count}}',
      'load_more_posts': 'تحميل المزيد من المنشورات',
      'back_to_home': 'العودة للرئيسية',
      'continue_building': 'متابعة البناء',
      
      // Stats
      posts: 'المنشورات',
      followers: 'المتابعون',
      following_stat: 'المتابَعون',
      likes: 'الإعجابات',
      
      // Time
      hours_ago: '{{count}} س',
      days_ago: '{{count}} ي',
      minutes_ago: '{{count}} د',
      
      // Placeholders
      'search_discover_desc': 'ابحث عن الأصدقاء والمحتوى الرائج والهاشتاغات واكتشف منشئي محتوى جدد. ستساعدك ميزة البحث القوية هذه في استكشاف كل ما يقدمه SocialFusion.',
      'messages_chat_desc': 'المراسلة الفورية مع دعم النصوص والرسائل الصوتية والصور ومقاطع الفيديو والمكالمات الصوتية/المرئية. تواصل مع الأصدقاء والعائلة فوراً.',
      'reels_videos_desc': 'أنشئ واكتشف مقاطع فيديو قصيرة باستخدام أدوات تحرير قوية وتأثيرات وفلاتر. شارك إبداعك مع العالم من خلال محتوى فيديو جذاب.',
      'notifications_desc': 'ابق على اطلاع بالإعجابات والتعليقات والمتابعات والإشارات وجميع أنشطتك الاجتماعية. لا تفوت أي تفاعل مهم مع إشعارات الدفع.',
      'create_content_desc': 'شارك لحظاتك بالمنشورات والقصص والريلز وا��بث المباشر. استخدم أدوات التحرير القوية والفلاتر والتأثيرات لإحياء محتواك.',
      'profile_desc': 'أدر ملفك الشخصي واعرض منشوراتك ونشاطك وخصص إعداداتك واطلع على تحليلات متابعيك. مساحتك الشخصية على SocialFusion.',
      
      // Camera & Media
      'take_photo': 'التقاط صورة',
      'record_video': 'تسجيل فيديو',
      'upload_photo': 'رفع صورة',
      'upload_video': 'رفع فيديو',
      'camera': 'الكاميرا',
      'gallery': 'المعرض',
      'photo': 'صورة',
      'video': 'فيديو',
      'close': 'إغلاق',

      // Feelings
      'feeling': 'الشعور',
      'feeling_happy': 'سعيد',
      'feeling_laughing': 'ضاحك',
      'feeling_in_love': 'واقع في الحب',
      'feeling_cool': 'رائع',
      'feeling_grateful': 'ممتن',
      'feeling_sleepy': 'نعسان',
      'feeling_celebrating': 'محتفل',
      'feeling_strong': 'قوي',
      'feeling_added': 'تمت إضافة الشعور {{feeling}} لمنشورك!',

      // Location & Friends
      'location': 'الموقع',
      'location_added': 'تمت إضافة الموقع لمنشورك!',
      'tag_friends': 'وسم الأصدقاء',
      'friends': 'أصدقاء',
      'friend_tagged': 'تم وسم {{name}} في منشورك!',

      // Privacy
      'public': 'عام',
      'friends_only': 'الأصدقاء فقط',
      'only_me': 'أنا فقط',
      'privacy_set': 'تم ضبط الخصوصية إلى {{privacy}}',

      // Post submission
      'posting': 'جاري النشر...',
      'post_empty_error': 'يرجى إضافة محتوى أو وسائط لمنشورك',
      'post_created_success': 'تم إنشاء المنشور بنجاح!',
      'post_creation_error': 'فشل في إنشاء المنشور. يرجى المحاولة مرة أخرى.',
    }
  },
  fr: {
    translation: {
      // Navigation
      home: 'Accueil',
      search: 'Rechercher',
      messages: 'Messages',
      notifications: 'Notifications',
      profile: 'Profil',
      create: 'Créer',
      reels: 'Reels',
      settings: 'Paramètres',
      
      // Common actions
      like: 'J\'aime',
      comment: 'Commenter',
      share: 'Partager',
      save: 'Enregistrer',
      follow: 'Suivre',
      following: 'Suivi',
      send: 'Envoyer',
      post: 'Publier',
      cancel: 'Annuler',
      
      // Content
      'whats_on_mind': 'À quoi pensez-vous, {{name}} ?',
      'suggested_for_you': 'Suggéré pour vous',
      'see_all': 'Voir tout',
      'trending': 'Tendances',
      'your_activity': 'Votre activité',
      'your_story': 'Votre story',
      'view_all_comments': 'Voir les {{count}} commentaires',
      'load_more_posts': 'Charger plus de publications',
      'back_to_home': 'Retour à l\'accueil',
      'continue_building': 'Continuer la construction',
      
      // Stats
      posts: 'Publications',
      followers: 'Abonnés',
      following_stat: 'Abonnements',
      likes: 'J\'aime',
      
      // Time
      hours_ago: '{{count}}h',
      days_ago: '{{count}}j',
      minutes_ago: '{{count}}min',
      
      // Placeholders
      'search_discover_desc': 'Trouvez des amis, du contenu tendance, des hashtags et découvrez de nouveaux créateurs. Cette puissante fonction de recherche vous aidera à explorer tout ce que SocialFusion a à offrir.',
      'messages_chat_desc': 'Messagerie en temps réel avec prise en charge du texte, des notes vocales, des photos, des vidéos et des appels audio/vidéo. Connectez-vous instantanément avec vos amis et votre famille.',
      'reels_videos_desc': 'Créez et découvrez des vidéos courtes avec des outils d\'édition puissants, des effets et des filtres. Partagez votre créativité avec le monde grâce à un contenu vidéo engageant.',
      'notifications_desc': 'Restez informé des likes, commentaires, follows, mentions et de toute votre activité sociale. Ne manquez jamais une interaction importante avec les notifications push.',
      'create_content_desc': 'Partagez vos moments avec des publications, des stories, des reels et des streams en direct. Utilisez des outils d\'édition puissants, des filtres et des effets pour donner vie à votre contenu.',
      'profile_desc': 'Gérez votre profil, consultez vos publications et votre activité, personnalisez vos paramètres et consultez vos analyses d\'abonnés. Votre espace personnel sur SocialFusion.',
      
      // Camera & Media
      'take_photo': 'Prendre une photo',
      'record_video': 'Enregistrer une vidéo',
      'upload_photo': 'Télécharger une photo',
      'upload_video': 'Télécharger une vidéo',
      'camera': 'Appareil photo',
      'gallery': 'Galerie',
      'photo': 'Photo',
      'video': 'Vidéo',
      'close': 'Fermer',

      // Feelings
      'feeling': 'Sentiment',
      'feeling_happy': 'Heureux',
      'feeling_laughing': 'Rieur',
      'feeling_in_love': 'Amoureux',
      'feeling_cool': 'Cool',
      'feeling_grateful': 'Reconnaissant',
      'feeling_sleepy': 'Endormi',
      'feeling_celebrating': 'En fête',
      'feeling_strong': 'Fort',
      'feeling_added': 'Sentiment {{feeling}} ajouté à votre publication!',

      // Location & Friends
      'location': 'Lieu',
      'location_added': 'Lieu ajouté à votre publication!',
      'tag_friends': 'Identifier des amis',
      'friends': 'amis',
      'friend_tagged': '{{name}} identifié dans votre publication!',

      // Privacy
      'public': 'Public',
      'friends_only': 'Amis seulement',
      'only_me': 'Moi seulement',
      'privacy_set': 'Confidentialité définie sur {{privacy}}',

      // Post submission
      'posting': 'Publication...',
      'post_empty_error': 'Veuillez ajouter du contenu ou des médias à votre publication',
      'post_created_success': 'Publication créée avec succès!',
      'post_creation_error': 'Échec de la création de la publication. Veuillez réessayer.',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
