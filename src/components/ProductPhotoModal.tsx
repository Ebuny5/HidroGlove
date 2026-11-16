import React, { useState } from 'react';
import { Camera, Download, X } from 'lucide-react';
import { STUDIO_PRODUCT_IMAGE } from '../data/buildSteps';
import { downloadAsJpeg } from '../utils/downloadJpeg';

interface ProductPhotoModalProps {
  open: boolean;
  onClose: () => void;
}

export const ProductPhotoModal: React.FC<ProductPhotoModalProps> = ({
  open,
  onClose,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!open) return null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadAsJpeg(
        STUDIO_PRODUCT_IMAGE,
        'hydroglove-studio-product-render.jpg',
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-photo-title"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-teal-700" />
            <h2
              id="product-photo-title"
              className="text-sm font-semibold text-slate-900"
            >
              HydroGlove Studio Product Render
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product photo modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 bg-slate-50">
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-[#eef2f5] aspect-[4/3] flex items-center justify-center">
            {imgError ? (
              <div className="text-center p-6">
                <Camera className="w-8 h-8 text-teal-700 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-700">
                  HydroGlove Commercial Studio Render
                </p>
              </div>
            ) : (
              <img
                src={STUDIO_PRODUCT_IMAGE}
                alt="Standalone commercial studio render of the finished HydroGlove portable iontophoresis smart glove"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
            Standalone commercial studio render showing the charcoal compression shell,
            aqua-cyan hydrogel palm &amp; fingertip pads, silver traces, teal wrist cuff,
            and dorsal OLED controller housing.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-slate-200 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            disabled={downloading}
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>
              {downloading ? 'Preparing .JPG…' : 'Download Product Photo (.JPG)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
