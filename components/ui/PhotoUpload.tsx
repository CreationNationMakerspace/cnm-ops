'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from './Button';

interface PhotoUploadProps {
  onPhotoSelect: (file: File) => void;
  onCaptionChange: (caption: string) => void;
  onPrimaryChange: (isPrimary: boolean) => void;
}

export function PhotoUpload({ onPhotoSelect, onCaptionChange, onPrimaryChange }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    };
    setIsMobile(checkMobile());
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onPhotoSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCaption = e.target.value;
    setCaption(newCaption);
    onCaptionChange(newCaption);
  };

  const handlePrimaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIsPrimary = e.target.checked;
    setIsPrimary(newIsPrimary);
    onPrimaryChange(newIsPrimary);
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">No image selected</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <input
          type="file"
          accept={isMobile ? "image/*;capture=camera" : "image/*"}
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-600"
        />
        <p className="text-xs text-gray-500">
          {isMobile ? 'Take a photo or choose from gallery' : 'Choose an image'}
        </p>
        <input
          type="text"
          placeholder="Add a caption..."
          value={caption}
          onChange={handleCaptionChange}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isPrimary}
            onChange={handlePrimaryChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Set as primary photo</span>
        </label>
      </div>
    </div>
  );
} 