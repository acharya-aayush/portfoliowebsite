import { AALoader, AALoadingScreen } from '@/components/ui/aa-loader';
import { useState } from 'react';

/**
 * Demo page showcasing the AA Loader component
 * Navigate to /loader-demo to see this page
 */
const LoaderDemo = () => {
  const [showFullScreen, setShowFullScreen] = useState(false);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-heading font-bold text-gold mb-8 text-center">
          AA Loader Variants
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Stroke Variant */}
          <div className="glass p-8 rounded-lg">
            <h2 className="text-xl font-heading font-semibold mb-4 text-center text-foreground">
              Stroke Animation
            </h2>
            <p className="text-sm text-muted-foreground mb-6 text-center">
              Discord-style stroke tracing animation
            </p>
            <div className="flex justify-center">
              <AALoader size={150} variant="stroke" />
            </div>
          </div>

          {/* Pulse Variant */}
          <div className="glass p-8 rounded-lg">
            <h2 className="text-xl font-heading font-semibold mb-4 text-center text-foreground">
              Pulse Animation
            </h2>
            <p className="text-sm text-muted-foreground mb-6 text-center">
              Breathing effect with scale
            </p>
            <div className="flex justify-center">
              <AALoader size={150} variant="pulse" />
            </div>
          </div>

          {/* Glow Variant */}
          <div className="glass p-8 rounded-lg">
            <h2 className="text-xl font-heading font-semibold mb-4 text-center text-foreground">
              Glow Animation
            </h2>
            <p className="text-sm text-muted-foreground mb-6 text-center">
              Pulsating glow effect
            </p>
            <div className="flex justify-center">
              <AALoader size={150} variant="glow" />
            </div>
          </div>
        </div>

        {/* Different Sizes */}
        <div className="glass p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-heading font-semibold mb-6 text-center text-foreground">
            Size Variations
          </h2>
          <div className="flex justify-center items-end gap-8 flex-wrap">
            <div className="text-center">
              <AALoader size={80} variant="stroke" />
              <p className="text-sm text-muted-foreground mt-2">Small (80px)</p>
            </div>
            <div className="text-center">
              <AALoader size={120} variant="stroke" />
              <p className="text-sm text-muted-foreground mt-2">Medium (120px)</p>
            </div>
            <div className="text-center">
              <AALoader size={180} variant="stroke" />
              <p className="text-sm text-muted-foreground mt-2">Large (180px)</p>
            </div>
            <div className="text-center">
              <AALoader size={240} variant="stroke" />
              <p className="text-sm text-muted-foreground mt-2">XL (240px)</p>
            </div>
          </div>
        </div>

        {/* Full Screen Demo */}
        <div className="glass p-8 rounded-lg text-center">
          <h2 className="text-2xl font-heading font-semibold mb-4 text-foreground">
            Full Screen Loading
          </h2>
          <p className="text-muted-foreground mb-6">
            Click the button below to see the full-screen loading experience
          </p>
          <button
            onClick={() => setShowFullScreen(true)}
            className="px-8 py-3 bg-gold text-background font-semibold rounded-lg hover:bg-gold/90 transition-colors"
          >
            Show Full Screen Loader
          </button>
        </div>

        {/* Usage Code */}
        <div className="mt-12 glass p-8 rounded-lg">
          <h2 className="text-2xl font-heading font-semibold mb-4 text-foreground">
            Usage
          </h2>
          <pre className="bg-black/30 p-4 rounded overflow-x-auto text-sm">
            <code className="text-gold">{`import { AALoader, AALoadingScreen } from '@/components/ui/aa-loader';

// Basic loader
<AALoader size={150} variant="stroke" />

// With different variants
<AALoader size={150} variant="pulse" />
<AALoader size={150} variant="glow" />

// Full screen loading
<AALoadingScreen />`}</code>
          </pre>
        </div>
      </div>

      {/* Full Screen Loader Overlay */}
      {showFullScreen && (
        <div onClick={() => setShowFullScreen(false)}>
          <AALoadingScreen />
        </div>
      )}
    </div>
  );
};

export default LoaderDemo;
