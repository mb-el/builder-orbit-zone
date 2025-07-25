import { useState, useEffect, useCallback, useRef } from 'react';

export interface VRARDevice {
  id: string;
  name: string;
  type: 'vr' | 'ar';
  connected: boolean;
  capabilities: string[];
}

export interface VRARSession {
  active: boolean;
  mode: 'immersive-vr' | 'immersive-ar' | 'inline' | null;
  referenceSpace: XRReferenceSpace | null;
  inputSources: XRInputSource[];
}

export const useVRAR = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isARSupported, setIsARSupported] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<VRARDevice[]>([]);
  const [currentSession, setCurrentSession] = useState<VRARSession>({
    active: false,
    mode: null,
    referenceSpace: null,
    inputSources: [],
  });
  const [error, setError] = useState<string | null>(null);
  
  const sessionRef = useRef<XRSession | null>(null);
  const rendererRef = useRef<any>(null);

  // Check WebXR support
  useEffect(() => {
    const checkSupport = async () => {
      if ('xr' in navigator) {
        setIsSupported(true);
        
        try {
          // Check VR support
          const vrSupported = await navigator.xr.isSessionSupported('immersive-vr');
          setIsVRSupported(vrSupported);
          
          // Check AR support
          const arSupported = await navigator.xr.isSessionSupported('immersive-ar');
          setIsARSupported(arSupported);
          
          // Mock device detection (real implementation would use WebXR Device API)
          const devices: VRARDevice[] = [];
          
          if (vrSupported) {
            devices.push({
              id: 'vr-headset-1',
              name: 'VR Headset',
              type: 'vr',
              connected: true,
              capabilities: ['6dof', 'hand-tracking', 'eye-tracking'],
            });
          }
          
          if (arSupported) {
            devices.push({
              id: 'ar-device-1',
              name: 'AR Device',
              type: 'ar',
              connected: true,
              capabilities: ['plane-detection', 'hit-test', 'occlusion'],
            });
          }
          
          setAvailableDevices(devices);
        } catch (err) {
          console.warn('WebXR feature detection failed:', err);
        }
      } else {
        setIsSupported(false);
        console.warn('WebXR not supported in this browser');
      }
    };

    checkSupport();
  }, []);

  // Start VR session
  const startVRSession = useCallback(async () => {
    if (!isVRSupported) {
      setError('VR not supported');
      return false;
    }

    try {
      const session = await navigator.xr.requestSession('immersive-vr', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['hand-tracking', 'eye-tracking'],
      });

      sessionRef.current = session;
      
      // Get reference space
      const referenceSpace = await session.requestReferenceSpace('local-floor');
      
      setCurrentSession({
        active: true,
        mode: 'immersive-vr',
        referenceSpace,
        inputSources: [],
      });

      // Handle session end
      session.addEventListener('end', () => {
        setCurrentSession({
          active: false,
          mode: null,
          referenceSpace: null,
          inputSources: [],
        });
        sessionRef.current = null;
      });

      // Handle input sources
      session.addEventListener('inputsourceschange', (event) => {
        setCurrentSession(prev => ({
          ...prev,
          inputSources: Array.from(session.inputSources),
        }));
      });

      setError(null);
      return true;
    } catch (err) {
      setError(`Failed to start VR session: ${err.message}`);
      return false;
    }
  }, [isVRSupported]);

  // Start AR session
  const startARSession = useCallback(async () => {
    if (!isARSupported) {
      setError('AR not supported');
      return false;
    }

    try {
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['plane-detection', 'hit-test', 'dom-overlay'],
        domOverlay: { root: document.body },
      });

      sessionRef.current = session;
      
      // Get reference space
      const referenceSpace = await session.requestReferenceSpace('local-floor');
      
      setCurrentSession({
        active: true,
        mode: 'immersive-ar',
        referenceSpace,
        inputSources: [],
      });

      // Handle session end
      session.addEventListener('end', () => {
        setCurrentSession({
          active: false,
          mode: null,
          referenceSpace: null,
          inputSources: [],
        });
        sessionRef.current = null;
      });

      // Handle input sources
      session.addEventListener('inputsourceschange', (event) => {
        setCurrentSession(prev => ({
          ...prev,
          inputSources: Array.from(session.inputSources),
        }));
      });

      setError(null);
      return true;
    } catch (err) {
      setError(`Failed to start AR session: ${err.message}`);
      return false;
    }
  }, [isARSupported]);

  // End current session
  const endSession = useCallback(async () => {
    if (sessionRef.current) {
      try {
        await sessionRef.current.end();
      } catch (err) {
        console.warn('Error ending XR session:', err);
      }
    }
  }, []);

  // Toggle VR mode
  const toggleVR = useCallback(async () => {
    if (currentSession.active && currentSession.mode === 'immersive-vr') {
      await endSession();
    } else {
      return await startVRSession();
    }
  }, [currentSession, endSession, startVRSession]);

  // Toggle AR mode
  const toggleAR = useCallback(async () => {
    if (currentSession.active && currentSession.mode === 'immersive-ar') {
      await endSession();
    } else {
      return await startARSession();
    }
  }, [currentSession, endSession, startARSession]);

  // Get current session object
  const getSession = useCallback(() => sessionRef.current, []);

  return {
    // Support flags
    isSupported,
    isVRSupported,
    isARSupported,
    
    // Device info
    availableDevices,
    
    // Session state
    currentSession,
    
    // Actions
    startVRSession,
    startARSession,
    endSession,
    toggleVR,
    toggleAR,
    getSession,
    
    // Error handling
    error,
  };
};

export default useVRAR;
