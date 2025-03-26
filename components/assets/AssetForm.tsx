'use client';

import { Asset } from '@/types/database';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { PhotoUpload } from '@/components/ui/PhotoUpload';
import { useState } from 'react';

// Define the enum values as constants
const ASSET_CATEGORIES = [
  'hand_tool',
  'power_tool',
  'machine',
  'safety_equipment',
  'storage',
  'other',
] as const;

const ASSET_STATUSES = [
  'available',
  'in_use',
  'maintenance',
  'retired',
  'broken',
] as const;

const MAKERSPACE_SHOPS = [
  'general',
  'woodshop',
  'metalshop',
  'electronics',
  'textiles',
  'ceramics',
  'laser_cutting',
  '3d_printing',
  'cnc',
  'other',
] as const;

interface AssetFormProps {
  initialData?: Partial<Asset>;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

interface PhotoState {
  file: File | null;
  caption: string;
  isPrimary: boolean;
}

export function AssetForm({ initialData, onSubmit, isLoading }: AssetFormProps) {
  const [formData, setFormData] = useState<Omit<Asset, 'id' | 'created_at' | 'updated_at'>>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || 'hand_tool',
    status: initialData?.status || 'available',
    shop: initialData?.shop || 'general',
    serial_number: initialData?.serial_number || '',
    model_number: initialData?.model_number || '',
    manufacturer: initialData?.manufacturer || '',
    purchase_date: initialData?.purchase_date || '',
    purchase_price: initialData?.purchase_price || null,
    warranty_expiry: initialData?.warranty_expiry || '',
    location: initialData?.location || '',
    notes: initialData?.notes || '',
    last_maintenance_date: initialData?.last_maintenance_date || '',
    next_maintenance_date: initialData?.next_maintenance_date || '',
    maintenance_notes: initialData?.maintenance_notes || '',
    battery_compatibility: initialData?.battery_compatibility || [],
  });

  const [photos, setPhotos] = useState<PhotoState[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create FormData object
    const formDataObj = new FormData();
    
    // Add asset data
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        if (Array.isArray(value)) {
          formDataObj.append(key, value.join(','));
        } else {
          formDataObj.append(key, value.toString());
        }
      }
    });

    // Add photos
    photos.forEach((photo, index) => {
      if (photo.file) {
        formDataObj.append('photos', photo.file);
        formDataObj.append('photo_captions', photo.caption);
        formDataObj.append('photo_is_primary', photo.isPrimary.toString());
      }
    });

    await onSubmit(formDataObj);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || null,
    }));
  };

  const handlePhotoSelect = (file: File, index: number) => {
    setPhotos(prev => {
      const newPhotos = [...prev];
      newPhotos[index] = { ...newPhotos[index], file };
      return newPhotos;
    });
  };

  const handleCaptionChange = (caption: string, index: number) => {
    setPhotos(prev => {
      const newPhotos = [...prev];
      newPhotos[index] = { ...newPhotos[index], caption };
      return newPhotos;
    });
  };

  const handlePrimaryChange = (isPrimary: boolean, index: number) => {
    setPhotos(prev => {
      const newPhotos = prev.map((photo, i) => ({
        ...photo,
        isPrimary: i === index ? isPrimary : false,
      }));
      return newPhotos;
    });
  };

  const addPhoto = () => {
    setPhotos(prev => [...prev, { file: null, caption: '', isPrimary: false }]);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold text-gray-900">
          {initialData ? 'Edit Asset' : 'Add New Asset'}
        </h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-900">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {ASSET_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-900">
                Status *
              </label>
              <select
                id="status"
                name="status"
                required
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {ASSET_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="shop" className="block text-sm font-medium text-gray-900">
                Shop *
              </label>
              <select
                id="shop"
                name="shop"
                required
                value={formData.shop}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {MAKERSPACE_SHOPS.map((shop) => (
                  <option key={shop} value={shop}>
                    {shop.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="serial_number" className="block text-sm font-medium text-gray-900">
                Serial Number
              </label>
              <input
                type="text"
                id="serial_number"
                name="serial_number"
                value={formData.serial_number || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="model_number" className="block text-sm font-medium text-gray-900">
                Model Number
              </label>
              <input
                type="text"
                id="model_number"
                name="model_number"
                value={formData.model_number || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-900">
                Manufacturer
              </label>
              <input
                type="text"
                id="manufacturer"
                name="manufacturer"
                value={formData.manufacturer || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-900">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="purchase_date" className="block text-sm font-medium text-gray-900">
                Purchase Date
              </label>
              <input
                type="date"
                id="purchase_date"
                name="purchase_date"
                value={formData.purchase_date || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="purchase_price" className="block text-sm font-medium text-gray-900">
                Purchase Price
              </label>
              <input
                type="number"
                id="purchase_price"
                name="purchase_price"
                step="0.01"
                value={formData.purchase_price || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseFloat(e.target.value) : null;
                  setFormData((prev) => ({ ...prev, purchase_price: value }));
                }}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="warranty_expiry" className="block text-sm font-medium text-gray-900">
                Warranty Expiry
              </label>
              <input
                type="date"
                id="warranty_expiry"
                name="warranty_expiry"
                value={formData.warranty_expiry || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="last_maintenance_date" className="block text-sm font-medium text-gray-900">
                Last Maintenance Date
              </label>
              <input
                type="date"
                id="last_maintenance_date"
                name="last_maintenance_date"
                value={formData.last_maintenance_date || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="next_maintenance_date" className="block text-sm font-medium text-gray-900">
                Next Maintenance Date
              </label>
              <input
                type="date"
                id="next_maintenance_date"
                name="next_maintenance_date"
                value={formData.next_maintenance_date || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-900">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="maintenance_notes" className="block text-sm font-medium text-gray-900">
              Maintenance Notes
            </label>
            <textarea
              id="maintenance_notes"
              name="maintenance_notes"
              rows={3}
              value={formData.maintenance_notes || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-900">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Photos</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPhoto}
              >
                Add Photo
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <PhotoUpload
                    onPhotoSelect={(file) => handlePhotoSelect(file, index)}
                    caption={photo.caption}
                    onCaptionChange={(caption) => handleCaptionChange(caption, index)}
                    isPrimary={photo.isPrimary}
                    onPrimaryChange={(isPrimary) => handlePrimaryChange(isPrimary, index)}
                  />
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    className="absolute -top-2 -right-2"
                    onClick={() => removePhoto(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : initialData ? 'Update Asset' : 'Create Asset'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 