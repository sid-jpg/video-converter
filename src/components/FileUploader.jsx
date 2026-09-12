import React, { useRef, useState } from 'react';

import {
  UploadCloud,
  FileVideo,
  Sparkles,
  Loader2,
} from 'lucide-react';

import { formatBytes } from '../utils/formatters';

export function FileUploader({
  onFileSelect,
  isLoading,
}) {
  const inputRef = useRef(null);

  const [isDragging, setIsDragging] =
    useState(false);

  const validateAndSelect = (file) => {
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Please select a video file.');
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    validateAndSelect(file);
  };

  const handleInput = (event) => {
    const file = event.target.files?.[0];

    validateAndSelect(file);

    event.target.value = '';
  };

  const handleSampleVideo = async () => {
    try {
      const canvas = document.createElement('canvas');

      canvas.width = 1280;
      canvas.height = 720;

      const ctx = canvas.getContext('2d');

      if (!ctx || !canvas.captureStream) {
        throw new Error(
          'Your browser does not support sample video generation.'
        );
      }

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 56px sans-serif';
      ctx.textAlign = 'center';

      ctx.fillText(
        'Sample Video',
        canvas.width / 2,
        canvas.height / 2
      );

      ctx.font = '24px sans-serif';

      ctx.fillStyle = '#94a3b8';

      ctx.fillText(
        'Browser Video Converter',
        canvas.width / 2,
        canvas.height / 2 + 50
      );

      const stream = canvas.captureStream(30);

      const mimeType =
        MediaRecorder.isTypeSupported(
          'video/webm;codecs=vp9'
        )
          ? 'video/webm;codecs=vp9'
          : 'video/webm';

      const recorder = new MediaRecorder(
        stream,
        { mimeType }
      );

      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => {
          track.stop();
        });

        const blob = new Blob(chunks, {
          type: 'video/webm',
        });

        const file = new File(
          [blob],
          'sample-video.webm',
          {
            type: 'video/webm',
          }
        );

        onFileSelect(file);
      };

      recorder.start();

      setTimeout(() => {
        if (recorder.state !== 'inactive') {
          recorder.stop();
        }
      }, 3000);
    } catch (error) {
      console.error(error);
      alert(
        error?.message ||
          'Could not generate sample video.'
      );
    }
  };

  return (
    <div>

      <div className="section-heading">
        <span className="eyebrow">
          STEP 1
        </span>

        <h2>
          Choose a video
        </h2>

        <p>
          Everything is processed locally in your browser.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="video/*,.mkv,.mov"
        hidden
        onChange={handleInput}
      />

      <div
        className={`drop-zone ${
          isDragging ? 'dragging' : ''
        } ${isLoading ? 'loading' : ''}`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => {
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        onClick={() => {
          if (!isLoading) {
            inputRef.current?.click();
          }
        }}
      >
        {isLoading ? (
          <>
            <Loader2
              size={42}
              className="spin"
            />

            <h3>Reading video...</h3>

            <p>
              Extracting video metadata
            </p>
          </>
        ) : (
          <>
            <div className="upload-icon">
              <UploadCloud size={34} />
            </div>

            <h3>
              Choose a video or drag it here
            </h3>

            <p>
              MP4, WebM, MOV, MKV and other supported
              formats
            </p>

            <button
              className="primary-button"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                inputRef.current?.click();
              }}
            >
              <UploadCloud size={18} />
              Select video
            </button>
          </>
        )}
      </div>



      <div className="privacy-note">
        <FileVideo size={16} />

        <span>
          Your video stays on your device.
          Nothing is uploaded to a server.
        </span>
      </div>
    </div>
  );
}