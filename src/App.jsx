import React, { useEffect, useState } from 'react';

import {
  ArrowLeft,
  CheckCircle2,
  FileVideo,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

import { FileUploader } from './components/FileUploader';
import { ResolutionPicker } from './components/ResolutionPicker';
import { ConversionProgress } from './components/ConversionProgress';
import VideoPreview from './components/VideoPreview';

import {
  convertVideo,
  getVideoMetadata,
} from './services/converter';

const DEFAULT_PRESET = {
  id: '720p',
  label: 'Balanced Size',
  sublabel: '720p • Ideal for sharing and web',
  height: 720,
};

function App() {
  const [step, setStep] = useState(1);

  const [sourceFile, setSourceFile] = useState(null);
  const [sourceMeta, setSourceMeta] = useState(null);

  const [selectedPreset, setSelectedPreset] =
    useState(DEFAULT_PRESET);

  const [format, setFormat] = useState('mp4');

  const [progress, setProgress] = useState(0);
  const [processedTime, setProcessedTime] = useState(0);

  const [result, setResult] = useState(null);

  const [error, setError] = useState('');
  const [isLoadingMetadata, setIsLoadingMetadata] =
    useState(false);

  const [cancelConversion, setCancelConversion] =
    useState(null);

  const [isConverting, setIsConverting] = useState(false);

  const handleFileSelect = async (file) => {
    setError('');

    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file.');
      return;
    }

    try {
      setIsLoadingMetadata(true);

      const metadata = await getVideoMetadata(file);

      setSourceFile(file);
      setSourceMeta(metadata);
      
      // Auto-select the highest preset that doesn't exceed source resolution
      const PRESETS = [
        {
          id: '144p',
          label: 'Tiny',
          sublabel: '144p • Maximum compression',
          height: 144,
        },
        {
          id: '240p',
          label: 'Very Small',
          sublabel: '240p • Low-bandwidth video',
          height: 240,
        },
        {
          id: '360p',
          label: 'Small',
          sublabel: '360p • Small file size',
          height: 360,
        },
        {
          id: '480p',
          label: 'Compact',
          sublabel: '480p • Fast uploads',
          height: 480,
        },
        {
          id: '720p',
          label: 'Balanced',
          sublabel: '720p • Great for sharing',
          height: 720,
        },
        {
          id: '1080p',
          label: 'Full HD',
          sublabel: '1080p • Best quality',
          height: 1080,
        },
      ];
      
      const validPresets = PRESETS.filter(p => p.height <= metadata.height);
      const bestPreset = validPresets.length > 0 
        ? validPresets[validPresets.length - 1] 
        : PRESETS[0];
      
      setSelectedPreset(bestPreset);
      setResult(null);
      setProgress(0);
      setProcessedTime(0);

      setStep(2);
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
          'Unable to read this video. The format may not be supported by your browser.'
      );
    } finally {
      setIsLoadingMetadata(false);
    }
  };

  const handleConvert = async () => {
    if (!sourceFile || !sourceMeta) return;

    setError('');
    setResult(null);
    setProgress(0);
    setProcessedTime(0);
    setIsConverting(true);
    setStep(3);

    try {
      const converted = await convertVideo({
        file: sourceFile,
        preset: selectedPreset,
        format,

        onProgress: (value, processedSeconds) => {
          setProgress(value);
          setProcessedTime(processedSeconds);
        },

        onCancelReady: (cancelFn) => {
          setCancelConversion(() => cancelFn);
        },
      });

      setResult({
        ...converted,
        originalFile: sourceFile,
        originalMeta: sourceMeta,
        preset: selectedPreset,
        format,
      });

      setStep(4);
    } catch (err) {
      console.error(err);

      if (
        err?.name === 'ConversionCanceledError' ||
        err?.message?.toLowerCase().includes('cancel')
      ) {
        setError('Conversion cancelled.');
      } else {
        setError(
          err?.message ||
            'Something went wrong while converting the video.'
        );
      }

      setStep(2);
    } finally {
      setIsConverting(false);
      setCancelConversion(null);
    }
  };

  const handleCancel = async () => {
    if (cancelConversion) {
      await cancelConversion();
    }
  };

  const reset = () => {
    if (result?.url) {
      URL.revokeObjectURL(result.url);
    }

    setStep(1);
    setSourceFile(null);
    setSourceMeta(null);
    setSelectedPreset(DEFAULT_PRESET);
    setFormat('mp4');
    setProgress(0);
    setProcessedTime(0);
    setResult(null);
    setError('');
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
    }

    if (step === 3) {
      return;
    }

    if (step === 4) {
      setStep(2);
    }
  };

  useEffect(() => {
    return () => {
      if (result?.url) {
        URL.revokeObjectURL(result.url);
      }
    };
  }, [result]);

  return (
    <main className="app">
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <div className="container">

        <header className="header">
          <div className="brand">
            <div className="brand-icon">
              <FileVideo size={24} />
            </div>

            <div>
              <h1>Video Converter</h1>

              <p>
                Convert and compress videos directly in your browser.
              </p>
            </div>
          </div>

          
        </header>

        <div className="steps">
          <Step
            number="1"
            label="Upload"
            active={step === 1}
            complete={step > 1}
          />

          <div className="step-line" />

          <Step
            number="2"
            label="Quality"
            active={step === 2}
            complete={step > 2}
          />

          <div className="step-line" />

          <Step
            number="3"
            label="Convert"
            active={step === 3}
            complete={step > 3}
          />

          <div className="step-line" />

          <Step
            number="4"
            label="Result"
            active={step === 4}
            complete={false}
          />
        </div>

        {error && (
          <div className="error-box">
            <strong>Conversion error</strong>
            <span>{error}</span>
          </div>
        )}

        <section className="card">

          {step > 1 && step !== 3 && (
            <button
              className="back-button"
              onClick={goBack}
            >
              <ArrowLeft size={16} />
              Back
            </button>
          )}

          {step === 1 && (
            <FileUploader
              onFileSelect={handleFileSelect}
              isLoading={isLoadingMetadata}
            />
          )}

          {step === 2 && sourceFile && sourceMeta && (
            <ResolutionPicker
              sourceMeta={sourceMeta}
              sourceFile={sourceFile}
              selectedPreset={selectedPreset}
              onSelectPreset={setSelectedPreset}
              format={format}
              onFormatChange={setFormat}
              onConvert={handleConvert}
            />
          )}

          {step === 3 && (
            <ConversionProgress
              progress={progress}
              processedTime={processedTime}
              duration={sourceMeta?.duration || 0}
              file={sourceFile}
              preset={selectedPreset}
              onCancel={handleCancel}
            />
          )}

          {step === 4 && result && (
            <VideoPreview
              result={result}
              onReset={reset}
            />
          )}

        </section>

        <footer className="footer">
          <CheckCircle2 size={15} />
          Processing happens locally on your device
        </footer>

      </div>
    </main>
  );
}

function Step({
  number,
  label,
  active,
  complete,
}) {
  return (
    <div
      className={`step ${
        active ? 'active' : ''
      } ${complete ? 'complete' : ''}`}
    >
      <div className="step-number">
        {complete ? (
          <CheckCircle2 size={17} />
        ) : (
          number
        )}
      </div>

      <span>{label}</span>
    </div>
  );
}

export default App;