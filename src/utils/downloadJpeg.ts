/**
 * Downloads an image asset as a guaranteed binary `image/jpeg` Blob,
 * falling back to offscreen Canvas JPEG encoding if the source response
 * is not already `image/jpeg` or needs re-encoding for mobile Safari/Chrome.
 */
export async function downloadAsJpeg(imageUrl: string, filename: string): Promise<void> {
  const safeName = filename.toLowerCase().endsWith('.jpg') || filename.toLowerCase().endsWith('.jpeg')
    ? filename
    : `${filename}.jpg`;

  const triggerDownload = (blob: Blob) => {
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = safeName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
  };

  try {
    const res = await fetch(imageUrl);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const rawBlob = await res.blob();
    if (rawBlob.type === 'image/jpeg' && rawBlob.size > 0) {
      triggerDownload(rawBlob);
      return;
    }

    // Re-encode through an offscreen canvas as binary image/jpeg
    const jpegBlob = await encodeImageUrlToJpegBlob(URL.createObjectURL(rawBlob));
    triggerDownload(jpegBlob);
  } catch {
    // Canvas fallback directly from image URL
    const jpegBlob = await encodeImageUrlToJpegBlob(imageUrl);
    triggerDownload(jpegBlob);
  }
}

function encodeImageUrlToJpegBlob(src: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 1200;
      canvas.height = img.naturalHeight || 900;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context unavailable'));
        return;
      }
      ctx.fillStyle = '#eef2f5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas toBlob failed'));
        },
        'image/jpeg',
        0.92,
      );
    };
    img.onerror = () => reject(new Error('Image load failed for JPEG export'));
    img.src = src;
  });
}
