import React from 'react';

import {
  Loader2,
  X,
  Zap,
} from 'lucide-react';

import {
  formatBytes,
  formatTime,
} from '../utils/formatters';

export function ConversionProgress({
  progress,
  processedTime,
  duration,
  file,
  preset,
  onCancel,
}) {
  const percent = Math.min(
    100,
    Math.max(0, Math.round(progress * 100))
  );

  const remaining =
    duration > 0 && progress > 0
      ? Math.max(
          0,
          duration - processedTime
        )
      : 0;

  return (
    <div>

      <div className="progress-header">
        <div>
          <span className="eyebrow">
            STEP 3
          </span>

          <h2>
            Converting your video
          </h2>

          <p>
            Keep this tab open while processing.
          </p>
        </div>

        <div className="progress-percent">
          {percent}%
        </div>
      </div>

      <div className="progress-card">

        <div className="progress-icon">
          <Loader2
            size={30}
            className="spin"
          />
        </div>

        <div className="progress-info">
          <strong>
            {file?.name}
          </strong>

          <span>
            Converting to {preset?.id || 'selected quality'}
          </span>
        </div>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${percent}%`,
          }}
        />
      </div>

      <div className="progress-stats">

        <div>
          <span>Progress</span>
          <strong>
            {percent}%
          </strong>
        </div>

        <div>
          <span>Processed</span>
          <strong>
            {formatTime(processedTime)}
          </strong>
        </div>

        <div>
          <span>Remaining</span>
          <strong>
            {formatTime(remaining)}
          </strong>
        </div>

        <div>
          <span>Original</span>
          <strong>
            {file
              ? formatBytes(file.size)
              : '--'}
          </strong>
        </div>

      </div>

      <div className="speed-note">
        <Zap size={16} />

        <span>
          Speed varies depending on your CPU/GPU,
          video codec, resolution and browser.
        </span>
      </div>

      <button
        className="cancel-button"
        onClick={onCancel}
      >
        <X size={17} />
        Cancel conversion
      </button>

    </div>
  );
}