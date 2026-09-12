import React from 'react';

import {
  Check,
  ArrowRight,
  Video,
} from 'lucide-react';

import {
  formatBytes,
  calculateEstimatedSize,
  formatTime,
} from '../utils/formatters';

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

export function ResolutionPicker({
  sourceMeta,
  sourceFile,
  selectedPreset,
  onSelectPreset,
  format,
  onFormatChange,
  onConvert,
}) {
  const sourceHeight = sourceMeta.height;

  const actualTargetHeight = Math.min(
    selectedPreset.height,
    sourceHeight
  );

  const estimatedSize =
    sourceFile && sourceMeta
      ? calculateEstimatedSize(
          sourceFile.size,
          sourceHeight,
          actualTargetHeight
        )
      : null;

  const targetWidth = Math.max(
    2,
    Math.round(
      actualTargetHeight *
        sourceMeta.aspectRatio
    )
  );

  return (
    <div>

      <div className="section-heading">
        <span className="eyebrow">
          STEP 2
        </span>

        <h2>
          Choose output quality
        </h2>

        <p>
          Select the resolution and output format.
        </p>
      </div>

      <div className="source-summary">
        <Video size={18} />

        <div>
          <strong>
            {sourceFile.name}
          </strong>

          <span>
            {sourceMeta.width} × {sourceMeta.height}
            {' • '}
            {formatTime(sourceMeta.duration)}
            {' • '}
            {formatBytes(sourceFile.size)}
          </span>
        </div>
      </div>

      <div className="preset-grid">
        {PRESETS.map((preset) => {
          const isSelected =
            selectedPreset.id === preset.id;

          const isUpscale =
            preset.height > sourceHeight;

          const targetHeight = Math.min(
            preset.height,
            sourceHeight
          );

          const estimated =
            sourceFile && sourceMeta
              ? calculateEstimatedSize(
                  sourceFile.size,
                  sourceHeight,
                  targetHeight
                )
              : null;

          return (
            <button
              key={preset.id}
              className={`preset-card ${
                isSelected ? 'selected' : ''
              } ${isUpscale ? 'disabled' : ''}`}
              onClick={() =>
                !isUpscale && onSelectPreset(preset)
              }
              disabled={isUpscale}
            >
              <div className="preset-top">
                <div>
                  <strong>
                    {preset.label}
                  </strong>

                  <span className="preset-resolution">
                    {preset.id}
                  </span>
                </div>

                {isSelected && (
                  <Check
                    size={19}
                    className="selected-check"
                  />
                )}
              </div>

              <span className="preset-description">
                {preset.sublabel}
              </span>

              {isUpscale ? (
                <span className="preset-warning">
                  Source is lower than this
                </span>
              ) : (
                estimated && (
                  <span className="estimated-size">
                    Est. {formatBytes(estimated)}
                  </span>
                )
              )}
            </button>
          );
        })}
      </div>

      <div className="format-section">
        <label>
          Output format
        </label>

        <div className="format-buttons">
          {['mp4', 'webm'].map((item) => (
            <button
              key={item}
              className={
                format === item
                  ? 'format-button selected'
                  : 'format-button'
              }
              onClick={() =>
                onFormatChange(item)
              }
            >
              .{item.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="conversion-summary">
        <div>
          <span>Output resolution</span>
          <strong>
            {targetWidth} × {actualTargetHeight}
          </strong>
        </div>

        <div>
          <span>Estimated size</span>
          <strong>
            {estimatedSize
              ? formatBytes(estimatedSize)
              : 'Calculating...'}
          </strong>
        </div>

        <div>
          <span>Processing</span>
          <strong>On this device</strong>
        </div>
      </div>

      <button
        className="primary-button convert-button"
        onClick={onConvert}
      >
        Convert video
        <ArrowRight size={18} />
      </button>
    </div>
  );
}