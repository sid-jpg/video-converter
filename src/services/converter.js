import {
  Input,
  Output,
  Conversion,
  ALL_FORMATS,
  BlobSource,
  Mp4OutputFormat,
  WebMOutputFormat,
  BufferTarget,
} from 'mediabunny';

export async function getVideoMetadata(file) {
  const input = new Input({
    source: new BlobSource(file),
    formats: ALL_FORMATS,
  });

  const duration = await input.computeDuration();

  const videoTrack =
    await input.getPrimaryVideoTrack();

  if (!videoTrack) {
    throw new Error('No video track found.');
  }

  const width =
    await videoTrack.getDisplayWidth();

  const height =
    await videoTrack.getDisplayHeight();

  input.dispose();

  return {
    width,
    height,
    duration,
    aspectRatio: width / height,
  };
}

export async function convertVideo({
  file,
  preset,
  format,
  onProgress,
  onCancelReady,
}) {
  const input = new Input({
    source: new BlobSource(file),
    formats: ALL_FORMATS,
  });

  const target = new BufferTarget();

  const outputFormat =
    format === 'webm'
      ? new WebMOutputFormat()
      : new Mp4OutputFormat({
          fastStart: 'in-memory',
        });

  const output = new Output({
    format: outputFormat,
    target,
  });

  const meta = await getVideoMetadata(file);

  const targetHeight = Math.min(
    preset.height,
    meta.height
  );

  let targetWidth = Math.round(
    targetHeight * meta.aspectRatio
  );

  // Video encoders generally prefer even dimensions.
  targetWidth -= targetWidth % 2;

  const finalHeight =
    targetHeight - (targetHeight % 2);

  const conversion =
    await Conversion.init({
      input,
      output,

      // Only primary video + audio.
      tracks: 'primary',

      video: {
        width: targetWidth,
        height: finalHeight,
        fit: 'contain',
      },
    });

  if (!conversion.isValid) {
    throw new Error(
      'This video cannot be converted in this browser.'
    );
  }

  conversion.onProgress = (
    progress,
    processedTime
  ) => {
    onProgress?.(
      progress,
      processedTime
    );
  };

  onCancelReady?.(
    () => conversion.cancel()
  );

  await conversion.execute();

  const buffer = target.buffer;

  if (!buffer) {
    throw new Error(
      'Conversion produced no output.'
    );
  }

  const mimeType =
    format === 'webm'
      ? 'video/webm'
      : 'video/mp4';

  const blob = new Blob(
    [buffer],
    { type: mimeType }
  );

  const url =
    URL.createObjectURL(blob);

  return {
    url,
    blob,
    size: blob.size,
    width: targetWidth,
    height: finalHeight,
  };
}