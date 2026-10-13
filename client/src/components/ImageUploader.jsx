import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Camera, 
  Image as ImageIcon, 
  X, 
  Sparkles, 
  Check, 
  AlertCircle 
} from 'lucide-react';

// Curated high-res agriculture sample specimens for 1-click testing
const SAMPLE_SPECIMENS = [
  {
    name: 'Tomato Blight',
    crop: 'Tomato',
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=600&q=80',
    description: 'Concentric necrotic leaf spots',
  },
  {
    name: 'Corn Rust',
    crop: 'Sweet Corn',
    url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
    description: 'Oxidized pustules on leaf lamina',
  },
  {
    name: 'Citrus Canker',
    crop: 'Citrus Lemon',
    url: 'https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?auto=format&fit=crop&w=600&q=80',
    description: 'Haloed corky lesions on citrus leaves',
  },
];

export const ImageUploader = ({ onImageSelected, isAnalyzing = false }) => {
  const [preview, setPreview] = useState(null);
  const [cropContext, setCropContext] = useState('General Plant');
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState(null);
  const fileInputRef = useRef(null);

  // Compress and convert to base64
  const processImageFile = (file) => {
    setFileError(null);

    if (!file.type.match(/^image\/(jpeg|png|webp|jpg)$/i)) {
      setFileError('Unsupported file type. Please upload a JPEG, PNG, or WebP image.');
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      setFileError('File exceeds 12MB limit. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Compress using canvas to ensure fast Gemini multimodal processing
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        setPreview(compressedBase64);
        onImageSelected({
          base64: compressedBase64,
          mimeType: 'image/jpeg',
          cropContext,
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSampleClick = async (sample) => {
    setCropContext(sample.crop);
    setPreview(sample.url);

    try {
      // Fetch image from URL and convert to base64
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelected({
          base64: reader.result,
          mimeType: blob.type || 'image/jpeg',
          cropContext: sample.crop,
        });
      };
      reader.readAsDataURL(blob);
    } catch {
      // Fallback
      onImageSelected({
        base64: sample.url,
        mimeType: 'image/jpeg',
        cropContext: sample.crop,
      });
    }
  };

  const clearSelection = () => {
    setPreview(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onImageSelected(null);
  };

  return (
    <div className="space-y-4">
      
      {/* Upload Dropzone Container */}
      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
              : 'border-slate-800 hover:border-emerald-500/50 bg-slate-900/40 hover:bg-slate-900/70'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                processImageFile(e.target.files[0]);
              }
            }}
          />

          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h4 className="text-base font-bold text-slate-100 mb-1 font-['Outfit']">
            Upload Diseased Crop Photo
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Drag & drop or click to upload leaf photos, stem lesions, or fruit spots. Supported formats: JPG, PNG, WebP (up to 12MB).
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-300">
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span>Select File or Capture Photo</span>
          </div>

          {fileError && (
            <div className="mt-4 p-2.5 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>{fileError}</span>
            </div>
          )}
        </div>
      ) : (
        /* Image Preview Box */
        <div className="glass-card p-4 rounded-2xl border border-emerald-500/30 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            
            <div className="w-full sm:w-48 h-48 rounded-xl overflow-hidden border border-slate-700 flex-shrink-0 relative group">
              <img
                src={preview}
                alt="Selected plant specimen"
                className="w-full h-full object-cover"
              />
              <button
                onClick={clearSelection}
                disabled={isAnalyzing}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-950/80 hover:bg-rose-950/90 text-slate-300 hover:text-rose-300 border border-slate-700 transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full space-y-3">
              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  Specimen Ready for Analysis
                </span>
                <h4 className="text-sm font-semibold text-slate-100">
                  Target Crop Context:
                </h4>
              </div>

              <div>
                <input
                  type="text"
                  value={cropContext}
                  disabled={isAnalyzing}
                  onChange={(e) => {
                    setCropContext(e.target.value);
                    onImageSelected({
                      base64: preview,
                      mimeType: 'image/jpeg',
                      cropContext: e.target.value,
                    });
                  }}
                  placeholder="e.g., Tomato, Golden Corn, Bell Pepper..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Specifying the crop type helps Gemini 2.5 provide higher diagnostic accuracy.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={clearSelection}
                  disabled={isAnalyzing}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
                >
                  Choose Different Photo
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 1-Click Sample Specimen Gallery */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Or Test Instantly With Sample Specimens:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SAMPLE_SPECIMENS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isAnalyzing}
              onClick={() => handleSampleClick(sample)}
              className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-left transition-all duration-150 flex items-center gap-3 group"
            >
              <img
                src={sample.url}
                alt={sample.name}
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-slate-700 group-hover:scale-105 transition-transform"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-200 truncate group-hover:text-emerald-400">
                  {sample.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{sample.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ImageUploader;
