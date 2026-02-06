import { supabase } from './supabase';

// Get all children from the database
export async function getAllChildren() {
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching children:', error);
    throw error;
  }

  return data;
}

// Get a single child by ID
export async function getChildById(id) {
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching child:', error);
    return null;
  }

  return data;
}

// Create a new child record
export async function createChild(childData) {
  const { data, error } = await supabase
    .from('children')
    .insert([
      {
        name: childData.name,
        age: childData.age,
        parent_name: childData.parent_name,
        op_number: childData.op_number || null,
        contact_details: childData.contact_details,
        treatment: childData.treatment || null,
        notes: childData.notes || null,
        image_url: childData.image_url || null,
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating child record:', error);
    throw error;
  }

  return data;
}

// Update an existing child record
export async function updateChild(id, childData) {
  const updateData = {
    name: childData.name,
    age: childData.age,
    parent_name: childData.parent_name,
    op_number: childData.op_number !== undefined ? childData.op_number : null,
    contact_details: childData.contact_details,
    treatment: childData.treatment || null,
    notes: childData.notes || null,
  };

  // Only update image_url if provided
  if (childData.image_url !== undefined) {
    updateData.image_url = childData.image_url;
  }

  const { data, error } = await supabase
    .from('children')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating child record:', error);
    return null;
  }

  return data;
}

// Delete a child record
export async function deleteChild(id) {
  const { data, error } = await supabase
    .from('children')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error deleting child record:', error);
    return null;
  }

  return data;
}
