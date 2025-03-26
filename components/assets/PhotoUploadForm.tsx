'use client';

import { Button } from '@/components/ui/Button';
import { PhotoUpload } from '@/components/ui/PhotoUpload';
import { useState } from 'react';
import { validateFile } from '@/lib/supabase/storage';

interface PhotoUploadFormProps {
  assetId: string;
  onSubmit: (formData: FormData) => void;
}

export function PhotoUploadForm({ assetId, onSubmit }: PhotoUploadFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);
  const [isPrimary, setIsPrimary] = useState<boolean[]>([false, false, false]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoSelect = (file: File, index: number) => {
    const validation = validateFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      return;
    }
    setError(null);
    const newFiles = [...files];
    newFiles[index] = file;
    setFiles(newFiles);
  };

  const handleCaptionChange = (caption: string, index: number) => {
    const newCaptions = [...captions];
    newCaptions[index] = caption;
    setCaptions(newCaptions);
  };

  const handlePrimaryChange = (isPrimaryValue: boolean, index: number) => {
    const newIsPrimary = Array(3).fill(false);
    if (isPrimaryValue) {
      newIsPrimary[index] = true;
    }
    setIsPrimary(newIsPrimary);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('assetId', assetId);

      let hasValidFiles = false;
      files.forEach((file, index) => {
        if (file) {
          hasValidFiles = true;
          formData.append('photos', file);
          formData.append('photo_captions', captions[index] || '');
          formData.append('photo_is_primary', isPrimary[index] ? 'true' : 'false');
        }
      });

      if (!hasValidFiles) {
        setError('Please select at least one photo to upload');
        return;
      }

      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload photos');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Photos</h3>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {[1, 2, 3].map((index) => (
            <PhotoUpload
              key={index}
              onPhotoSelect={(file) => handlePhotoSelect(file, index - 1)}
              onCaptionChange={(caption) => handleCaptionChange(caption, index - 1)}
              onPrimaryChange={(isPrimary) => handlePrimaryChange(isPrimary, index - 1)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Uploading...' : 'Upload Photos'}
        </Button>
      </div>
    </form>
  );
} 