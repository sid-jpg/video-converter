export function formatBytes(
  bytes,
  decimals = 1
) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }

  const units = [
    'B',
    'KB',
    'MB',
    'GB',
    'TB',
  ];

  const exponent = Math.min(
    Math.floor(
      Math.log(bytes) / Math.log(1024)
    ),
    units.length - 1
  );

  const value =
    bytes /
    Math.pow(1024, exponent);

  return `${parseFloat(
    value.toFixed(
      exponent === 0
        ? 0
        : decimals
    )
  )} ${units[exponent]}`;
}

export function formatTime(seconds) {
  if (
    !Number.isFinite(seconds) ||
    seconds <= 0
  ) {
    return '0:00';
  }

  const totalSeconds =
    Math.floor(seconds);

  const hours =
    Math.floor(
      totalSeconds / 3600
    );

  const minutes =
    Math.floor(
      (totalSeconds % 3600) / 60
    );

  const secs =
    totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(
      minutes
    ).padStart(2, '0')}:${String(
      secs
    ).padStart(2, '0')}`;
  }

  return `${minutes}:${String(
    secs
  ).padStart(2, '0')}`;
}

export function calculateEstimatedSize(
  originalSize,
  sourceHeight,
  targetHeight
) {
  if (
    !originalSize ||
    !sourceHeight ||
    !targetHeight
  ) {
    return 0;
  }

  /*
   * Don't pretend that resolution alone
   * predicts exact encoded size.
   *
   * This is only a UI estimate.
   */
  if (targetHeight >= sourceHeight) {
    return Math.round(
      originalSize * 0.95
    );
  }

  const scaleRatio =
    targetHeight /
    sourceHeight;

  const estimatedRatio =
    Math.max(
      0.08,
      Math.pow(
        scaleRatio,
        1.35
      )
    );

  return Math.round(
    originalSize *
      estimatedRatio
  );
}