'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { NewAssetPhoto } from '@/types/database';
import { STORAGE_CONFIG, getAssetPhotoPath, validateFile } from '@/lib/supabase/storage';

export async function handlePhotoUpload(formData: FormData) {
  const supabase = await createClient();

  // Get assetId from form data
  const assetId = formData.get('assetId') as string;
  if (!assetId) {
    throw new Error('Asset ID is required');
  }

  // Check if user is authenticated
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    redirect('/login');
  }

  // Handle photo uploads
  const photos = formData.getAll('photos') as File[];
  const captions = formData.getAll('photo_captions') as string[];
  const isPrimary = formData.getAll('photo_is_primary') as string[];

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    if (!photo) continue;

    // Validate file
    const validation = validateFile(photo);
    if (!validation.isValid) {
      console.error('Invalid file:', validation.error);
      continue;
    }

    // Upload photo to Supabase Storage
    const fileExt = photo.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = getAssetPhotoPath(assetId, fileName);

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_CONFIG.BUCKETS.ASSET_PHOTOS)
      .upload(filePath, photo);

    if (uploadError) {
      console.error('Error uploading photo:', uploadError);
      continue;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_CONFIG.BUCKETS.ASSET_PHOTOS)
      .getPublicUrl(filePath);

    // Create photo record
    const photoData: NewAssetPhoto = {
      asset_id: assetId,
      photo_url: publicUrl,
      caption: captions[i] || null,
      is_primary: isPrimary[i] === 'true',
      created_by: session.user.id,
    };

    const { error: photoError } = await supabase
      .from('asset_photos')
      // @ts-expect-error - Supabase's type system doesn't correctly infer the insert type for asset_photos
      .insert(photoData)
      .select()
      .single();

    if (photoError) {
      console.error('Error creating photo record:', photoError);
    }
  }

  redirect(`/assets/${assetId}`);
} 