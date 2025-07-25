import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, areFirebaseServicesAvailable } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from '@/hooks/use-toast';
import FirebaseNotice from './FirebaseNotice';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  phoneNumber: string;
  dateOfBirth: string;
}

interface LoginData {
  email: string;
  password: string;
}

const Registration: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('signup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [signupData, setSignupData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    phoneNumber: '',
    dateOfBirth: '',
  });

  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateSignupForm = () => {
    if (!signupData.email || !signupData.password || !signupData.displayName) {
      setError(t('registration.errorRequired'));
      return false;
    }

    if (!validateEmail(signupData.email)) {
      setError(t('registration.errorInvalidEmail'));
      return false;
    }

    if (!validatePassword(signupData.password)) {
      setError(t('registration.errorWeakPassword'));
      return false;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError(t('registration.errorPasswordMismatch'));
      return false;
    }

    if (signupData.displayName.length < 2) {
      setError(t('registration.errorShortName'));
      return false;
    }

    return true;
  };

  const validateLoginForm = () => {
    if (!loginData.email || !loginData.password) {
      setError(t('registration.errorRequired'));
      return false;
    }

    if (!validateEmail(loginData.email)) {
      setError(t('registration.errorInvalidEmail'));
      return false;
    }

    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateSignupForm()) return;

    setLoading(true);

    try {
      // Check if Firebase is properly configured
      if (!areFirebaseServicesAvailable() || !auth || !db) {
        // Demo mode - simulate successful registration
        toast({
          title: t('registration.successTitle'),
          description: t('registration.successMessage') + ' (Demo Mode)',
        });
        navigate('/');
        return;
      }

      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signupData.email,
        signupData.password
      );

      // Update user profile
      await updateProfile(userCredential.user, {
        displayName: signupData.displayName,
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: signupData.email,
        displayName: signupData.displayName,
        phoneNumber: signupData.phoneNumber,
        dateOfBirth: signupData.dateOfBirth,
        createdAt: new Date().toISOString(),
        isOnline: true,
        followers: 0,
        following: 0,
        posts: 0,
        bio: '',
        location: '',
        website: '',
        verified: false,
      });

      toast({
        title: t('registration.successTitle'),
        description: t('registration.successMessage'),
      });

      navigate('/');
    } catch (error: any) {
      console.error('Signup error:', error);

      // Handle specific Firebase errors
      if (error.message?.includes('Network connection failed')) {
        setError('Network connection failed. Please check your internet connection and try again.');
      } else {
        switch (error.code) {
          case 'auth/email-already-in-use':
            setError(t('registration.errorEmailExists'));
            break;
          case 'auth/weak-password':
            setError(t('registration.errorWeakPassword'));
            break;
          case 'auth/invalid-email':
            setError(t('registration.errorInvalidEmail'));
            break;
          case 'auth/network-request-failed':
            setError('Network connection failed. Please check your internet connection and Firebase configuration.');
            break;
          default:
            setError(t('registration.errorGeneral'));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateLoginForm()) return;

    setLoading(true);

    try {
      // Check if Firebase is properly configured
      if (!areFirebaseServicesAvailable() || !auth) {
        // Demo mode - simulate successful login
        toast({
          title: t('registration.loginSuccessTitle'),
          description: t('registration.loginSuccessMessage') + ' (Demo Mode)',
        });
        navigate('/');
        return;
      }

      await signInWithEmailAndPassword(auth, loginData.email, loginData.password);

      toast({
        title: t('registration.loginSuccessTitle'),
        description: t('registration.loginSuccessMessage'),
      });

      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);

      // Handle specific Firebase errors
      if (error.message?.includes('Network connection failed')) {
        setError('Network connection failed. Please check your internet connection and try again.');
      } else {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            setError(t('registration.errorInvalidCredentials'));
            break;
          case 'auth/too-many-requests':
            setError(t('registration.errorTooManyAttempts'));
            break;
          case 'auth/network-request-failed':
            setError('Network connection failed. Please check your internet connection and Firebase configuration.');
            break;
          default:
            setError(t('registration.errorGeneral'));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignupInputChange = (field: keyof FormData, value: string) => {
    setSignupData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleLoginInputChange = (field: keyof LoginData, value: string) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {t('registration.welcome')}
          </CardTitle>
          <CardDescription>{t('registration.subtitle')}</CardDescription>
        </CardHeader>

        <CardContent>
          <FirebaseNotice />
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup">{t('registration.signup')}</TabsTrigger>
              <TabsTrigger value="login">{t('registration.login')}</TabsTrigger>
            </TabsList>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="signup" className="space-y-4 mt-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">{t('registration.fullName')}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="displayName"
                      type="text"
                      placeholder={t('registration.enterFullName')}
                      value={signupData.displayName}
                      onChange={(e) => handleSignupInputChange('displayName', e.target.value)}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('registration.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('registration.enterEmail')}
                      value={signupData.email}
                      onChange={(e) => handleSignupInputChange('email', e.target.value)}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">{t('registration.phoneNumber')}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder={t('registration.enterPhoneNumber')}
                      value={signupData.phoneNumber}
                      onChange={(e) => handleSignupInputChange('phoneNumber', e.target.value)}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">{t('registration.dateOfBirth')}</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={signupData.dateOfBirth}
                      onChange={(e) => handleSignupInputChange('dateOfBirth', e.target.value)}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('registration.password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('registration.enterPassword')}
                      value={signupData.password}
                      onChange={(e) => handleSignupInputChange('password', e.target.value)}
                      className="pl-10 pr-10"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">{t('registration.passwordRequirements')}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('registration.confirmPassword')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={t('registration.confirmPasswordPlaceholder')}
                      value={signupData.confirmPassword}
                      onChange={(e) => handleSignupInputChange('confirmPassword', e.target.value)}
                      className="pl-10 pr-10"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('registration.creatingAccount') : t('registration.createAccount')}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="login" className="space-y-4 mt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loginEmail">{t('registration.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="loginEmail"
                      type="email"
                      placeholder={t('registration.enterEmail')}
                      value={loginData.email}
                      onChange={(e) => handleLoginInputChange('email', e.target.value)}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loginPassword">{t('registration.password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="loginPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('registration.enterPassword')}
                      value={loginData.password}
                      onChange={(e) => handleLoginInputChange('password', e.target.value)}
                      className="pl-10 pr-10"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('registration.signingIn') : t('registration.signIn')}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Registration;
