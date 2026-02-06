import { supabase } from './supabase';

// Upload image to Supabase Storage
export async function uploadImage(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage
    .from('patient-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading image:', error);
    throw error;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('patient-images')
    .getPublicUrl(filePath);

  return publicUrl;
}

// Delete image from Supabase Storage
export async function deleteImage(imageUrl) {
  if (!imageUrl) return;

  // Extract file path from URL
  const urlParts = imageUrl.split('/patient-images/');
  if (urlParts.length < 2) return;
  
  const filePath = urlParts[1];

  const { error } = await supabase.storage
    .from('patient-images')
    .remove([filePath]);

  if (error) {
    console.error('Error deleting image:', error);
  }
}
