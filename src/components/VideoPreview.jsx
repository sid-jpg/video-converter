import React, { useEffect, useState } from 'react';
import { Download, RotateCcw, Play, CheckCircle2 } from 'lucide-react';

export default function VideoPreview({ result, onReset }) {
  const [originalUrl, setOriginalUrl] = useState(null);

  // Create preview URL for original uploaded video
  useEffect(() => {
    if (!result?.originalFile) {
      setOriginalUrl(null);
      return;
    }

    const url = URL.createObjectURL(result.originalFile);
    setOriginalUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [result?.originalFile]);

  if (!result) {
    return null;
  }

  const {
    url: convertedUrl,
    blob,
    width,
    height,
    preset,
    format,
  } = result;

  const originalFile = result.originalFile;

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.floor(
      Math.log(bytes) / Math.log(1024)
    );

    return `${(
      bytes / Math.pow(1024, index)
    ).toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
  };

  const originalSize = originalFile?.size || 0;
  const convertedSize = blob?.size || 0;

  const savedBytes = originalSize - convertedSize;

  const savings =
    originalSize > 0
      ? Math.max(
          0,
          Math.round(
            (savedBytes / originalSize) * 100
          )
        )
      : 0;

  const filename =
    originalFile?.name
      ?.replace(/\.[^/.]+$/, '') || 'converted-video';

  const extension =
    format === 'webm' ? 'webm' : 'mp4';

  const downloadName =
    `${filename}-${preset?.label || `${height}p`}.${extension}`;

  return (
    <div>

      {/* Header */}
      <div className="success-heading">
        <div className="success-icon">
          <CheckCircle2 size={24} />
        </div>
        <div>
          <h2>Your video is ready</h2>
          <p>
            Preview the original and converted versions
            before downloading.
          </p>
        </div>
      </div>

      {/* Video comparison */}
      <div className="video-comparison">

        {/* Original */}
        <div className="video-panel">
          <div className="video-panel-header">
            <span>Original</span>
            {originalSize > 0 && (
              <span>{formatBytes(originalSize)}</span>
            )}
          </div>
          {originalUrl ? (
            <video
              src={originalUrl}
              controls
              preload="metadata"
              playsInline
            />
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#64748b',
              gap: '10px'
            }}>
              <Play size={32} />
              <span>Preview unavailable</span>
            </div>
          )}
        </div>

        {/* Converted */}
        <div className="video-panel">
          <div className="video-panel-header">
            <span>Converted</span>
            {convertedSize > 0 && (
              <span>{formatBytes(convertedSize)}</span>
            )}
          </div>
          <video
            src={convertedUrl}
            controls
            preload="metadata"
            playsInline
          />
        </div>

      </div>

      {/* Conversion information */}
      <div className="result-details">
        <div>
          <span>Resolution</span>
          <strong>
            {width} × {height}
          </strong>
        </div>

        <div>
          <span>Format</span>
          <strong>
            {extension.toUpperCase()}
          </strong>
        </div>

        <div>
          <span>Output size</span>
          <strong className={savings > 0 ? 'positive' : 'neutral'}>
            {formatBytes(convertedSize)}
          </strong>
        </div>

        <div>
          <span>Size reduction</span>
          <strong className={savings > 0 ? 'positive' : 'neutral'}>
            {savings}%
          </strong>
        </div>

      </div>

      {/* Actions */}
      <div className="result-actions">

        <a
          href={convertedUrl}
          download={downloadName}
          className="primary-button"
        >
          <Download size={18} />
          Download {extension.toUpperCase()}
        </a>

        <button
          type="button"
          className="secondary-button"
          onClick={onReset}
        >
          <RotateCcw size={18} />
          Convert another
        </button>

      </div>

    </div>
  );
}