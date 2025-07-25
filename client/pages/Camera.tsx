import Layout from "@/components/Layout";
import CameraCapture from "@/components/CameraCapture";
import { useState } from "react";

export default function Camera() {
  const [showCamera, setShowCamera] = useState(true);

  if (!showCamera) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Camera</h1>
            <button 
              onClick={() => setShowCamera(true)}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg"
            >
              Open Camera
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <CameraCapture 
          onCapture={(blob, type) => {
            console.log('Captured:', type, blob);
            // Handle the captured media
          }}
          onClose={() => setShowCamera(false)}
        />
      </div>
    </Layout>
  );
}
