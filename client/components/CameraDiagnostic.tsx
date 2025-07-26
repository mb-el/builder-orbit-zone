import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Info,
  Monitor,
  Wifi,
  Lock,
  Smartphone,
} from 'lucide-react';

interface DiagnosticResult {
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'info';
  message: string;
  details?: string;
}

interface CameraDiagnosticProps {
  onClose?: () => void;
}

const CameraDiagnostic: React.FC<CameraDiagnosticProps> = ({ onClose }) => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results: DiagnosticResult[] = [];

    try {
      // 1. Check browser support
      results.push({
        name: 'Browser Support',
        status: navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? 'pass' : 'fail',
        message: navigator.mediaDevices && navigator.mediaDevices.getUserMedia 
          ? 'getUserMedia API is supported' 
          : 'getUserMedia API is not supported',
        details: navigator.mediaDevices && navigator.mediaDevices.getUserMedia 
          ? 'Your browser supports camera access'
          : 'Please use a modern browser like Chrome, Firefox, or Safari'
      });

      // 2. Check HTTPS
      const isSecure = location.protocol === 'https:' || location.hostname === 'localhost';
      results.push({
        name: 'Secure Context',
        status: isSecure ? 'pass' : 'fail',
        message: isSecure ? 'Site is using HTTPS or localhost' : 'Site must use HTTPS for camera access',
        details: isSecure 
          ? 'Camera access is allowed on secure connections'
          : 'Camera access requires HTTPS in most browsers'
      });

      // 3. Check permissions
      if (navigator.permissions) {
        try {
          const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
          results.push({
            name: 'Camera Permission',
            status: permission.state === 'granted' ? 'pass' : 
                   permission.state === 'denied' ? 'fail' : 'warning',
            message: `Permission status: ${permission.state}`,
            details: permission.state === 'granted' 
              ? 'Camera permission has been granted'
              : permission.state === 'denied'
              ? 'Camera permission was denied. Please reset permissions and try again'
              : 'Camera permission needs to be requested'
          });
        } catch (err) {
          results.push({
            name: 'Camera Permission',
            status: 'warning',
            message: 'Could not check permission status',
            details: 'Permission API may not be fully supported'
          });
        }
      }

      // 4. Enumerate devices
      try {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);

        results.push({
          name: 'Device Detection',
          status: videoDevices.length > 0 ? 'pass' : 'fail',
          message: `${videoDevices.length} camera device(s) found`,
          details: videoDevices.length > 0 
            ? 'Camera devices are available on this system'
            : 'No camera devices detected. Please check if a camera is connected'
        });

        // Check if device labels are available
        const hasLabels = videoDevices.some(device => device.label);
        if (videoDevices.length > 0) {
          results.push({
            name: 'Device Labels',
            status: hasLabels ? 'pass' : 'warning',
            message: hasLabels ? 'Device labels available' : 'Device labels not available',
            details: hasLabels 
              ? 'Device information is accessible'
              : 'Grant camera permission to see device labels'
          });
        }
      } catch (err) {
        results.push({
          name: 'Device Detection',
          status: 'fail',
          message: 'Failed to enumerate devices',
          details: `Error: ${err.message}`
        });
      }

      // 5. Test basic camera access
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        stream.getTracks().forEach(track => track.stop());
        
        results.push({
          name: 'Camera Access Test',
          status: 'pass',
          message: 'Successfully accessed camera',
          details: 'Basic camera functionality is working'
        });
      } catch (err: any) {
        results.push({
          name: 'Camera Access Test',
          status: 'fail',
          message: `Camera access failed: ${err.name}`,
          details: err.message || 'Unknown error occurred during camera access test'
        });
      }

      // 6. Check MediaRecorder support
      results.push({
        name: 'Video Recording',
        status: window.MediaRecorder ? 'pass' : 'fail',
        message: window.MediaRecorder ? 'MediaRecorder API supported' : 'MediaRecorder API not supported',
        details: window.MediaRecorder 
          ? 'Video recording functionality is available'
          : 'Video recording is not supported in this browser'
      });

      // 7. Check supported video formats
      if (window.MediaRecorder) {
        const formats = [
          'video/webm;codecs=vp9',
          'video/webm;codecs=vp8',
          'video/webm',
          'video/mp4'
        ];
        const supportedFormats = formats.filter(format => MediaRecorder.isTypeSupported(format));
        
        results.push({
          name: 'Video Formats',
          status: supportedFormats.length > 0 ? 'pass' : 'warning',
          message: `${supportedFormats.length} video format(s) supported`,
          details: supportedFormats.length > 0 
            ? `Supported: ${supportedFormats.join(', ')}`
            : 'Limited video format support'
        });
      }

    } catch (err) {
      results.push({
        name: 'Diagnostic Error',
        status: 'fail',
        message: 'Diagnostic test failed',
        details: `Unexpected error: ${err.message}`
      });
    }

    setDiagnostics(results);
    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'fail':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const overallStatus = diagnostics.length > 0 
    ? diagnostics.some(d => d.status === 'fail') 
      ? 'fail' 
      : diagnostics.some(d => d.status === 'warning') 
      ? 'warning' 
      : 'pass'
    : 'info';

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Camera Diagnostic
          {getStatusIcon(overallStatus)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <Alert className={`border ${getStatusColor(overallStatus)}`}>
          <AlertDescription>
            {overallStatus === 'pass' && 'All camera diagnostics passed successfully!'}
            {overallStatus === 'warning' && 'Camera diagnostics completed with warnings.'}
            {overallStatus === 'fail' && 'Camera diagnostics found issues that need attention.'}
            {overallStatus === 'info' && 'Running camera diagnostics...'}
          </AlertDescription>
        </Alert>

        {/* Diagnostic Results */}
        <div className="space-y-3">
          {diagnostics.map((result, index) => (
            <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
              {getStatusIcon(result.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{result.name}</h4>
                  <Badge className={getStatusColor(result.status)}>
                    {result.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{result.message}</p>
                {result.details && (
                  <p className="text-xs text-muted-foreground mt-1 bg-muted p-2 rounded">
                    {result.details}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Device Information */}
        {devices.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">Available Camera Devices</h4>
            <div className="space-y-2">
              {devices.map((device, index) => (
                <div key={device.deviceId} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <Camera className="w-4 h-4" />
                  <div>
                    <p className="text-sm font-medium">
                      {device.label || `Camera ${index + 1}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Device ID: {device.deviceId.slice(0, 20)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Information */}
        <div className="mt-6 p-3 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">System Information</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>Browser: {navigator.userAgent.split(' ')[0]}</div>
            <div>Platform: {navigator.platform}</div>
            <div>Protocol: {location.protocol}</div>
            <div>Host: {location.hostname}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button onClick={runDiagnostics} disabled={isRunning} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Running...' : 'Run Again'}
          </Button>
          {onClose && (
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraDiagnostic;
