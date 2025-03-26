import { createClient } from '@/lib/supabase/server';
import { AssetForm } from '@/components/assets/AssetForm';
import { redirect } from 'next/navigation';
import { Asset, NewAssetPhoto } from '@/types/database';
import { cookies } from 'next/headers';

export default function NewAssetPage() {
  async function handleSubmit(formData: FormData) {
    'use server';

    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error checking session:', sessionError);
      throw new Error('Authentication error');
    }

    if (!session) {
      console.error('No active session found');
      throw new Error('You must be logged in to create an asset');
    }

    console.log('User authenticated:', session.user.email);

    // Extract asset data from form
    const assetData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string || null,
      category: formData.get('category') as Asset['category'],
      status: formData.get('status') as Asset['status'],
      shop: formData.get('shop') as Asset['shop'],
      serial_number: formData.get('serial_number') as string || null,
      model_number: formData.get('model_number') as string || null,
      manufacturer: formData.get('manufacturer') as string || null,
      purchase_date: formData.get('purchase_date') as string || null,
      purchase_price: formData.get('purchase_price') ? parseFloat(formData.get('purchase_price') as string) : null,
      warranty_expiry: formData.get('warranty_expiry') as string || null,
      location: formData.get('location') as string || null,
      notes: formData.get('notes') as string || null,
      last_maintenance_date: formData.get('last_maintenance_date') as string || null,
      next_maintenance_date: formData.get('next_maintenance_date') as string || null,
      maintenance_notes: formData.get('maintenance_notes') as string || null,
      battery_compatibility: formData.get('battery_compatibility') ? 
        (formData.get('battery_compatibility') as string).split(',').map(s => s.trim()) : 
        null,
    };

    console.log('Attempting to insert asset:', assetData);

    const { data: insertData, error } = await supabase
      .from('assets')
      .insert(assetData)
      .select()
      .single();

    if (error) {
      console.error('Error creating asset:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      
      if (error.code === '42501') {
        throw new Error('You do not have permission to create assets. Please contact an administrator.');
      }
      throw new Error(error.message);
    }

    // Handle photo uploads
    const photos = formData.getAll('photos') as File[];
    const captions = formData.getAll('photo_captions') as string[];
    const isPrimary = formData.getAll('photo_is_primary') as string[];

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      if (!photo) continue;

      // Upload photo to Supabase Storage
      const fileExt = photo.name.split('.').pop();
      const fileName = `${insertData.id}/${Math.random()}.${fileExt}`;
      const filePath = `assets/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, photo);

      if (uploadError) {
        console.error('Error uploading photo:', uploadError);
        continue;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      // Create photo record
      const photoData: NewAssetPhoto = {
        asset_id: insertData.id,
        photo_url: publicUrl,
        caption: captions[i] || null,
        is_primary: isPrimary[i] === 'true',
        created_by: session.user.id,
      };

      const { error: photoError } = await supabase
        .from('asset_photos')
        .insert(photoData);

      if (photoError) {
        console.error('Error creating photo record:', photoError);
      }
    }

    console.log('Asset created successfully:', insertData);
    redirect('/assets');
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Asset</h1>
        <p className="mt-2 text-gray-600">
          Fill out the form below to add a new asset to the makerspace inventory.
        </p>
      </div>
      <AssetForm onSubmit={handleSubmit} />
    </div>
  );
} 