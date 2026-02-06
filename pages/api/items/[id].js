import { getChildById, updateChild, deleteChild } from '@/lib/data';
import { deleteImage } from '@/lib/storage';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET': {
      // Get a single child record
      try {
        const child = await getChildById(id);
        if (child) {
          res.status(200).json(child);
        } else {
          res.status(404).json({ error: 'Child record not found' });
        }
      } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to fetch child record' });
      }
      break;
    }

    case 'PUT': {
      // Update a child record
      const { name, age, parent_name, contact_details, treatment, notes, image_url, old_image_url } = req.body;
      
      if (!name || !age || !parent_name || !contact_details) {
        return res.status(400).json({ error: 'Name, age, parent name, and contact details are required' });
      }

      try {
        // Delete old image if a new one is being uploaded
        if (old_image_url && image_url && old_image_url !== image_url) {
          await deleteImage(old_image_url);
        }

        const updatedChild = await updateChild(id, { 
          name, 
          age: Number.parseInt(age), 
          parent_name, 
          contact_details,
          treatment,
          notes,
          image_url 
        });
        
        if (updatedChild) {
          res.status(200).json(updatedChild);
        } else {
          res.status(404).json({ error: 'Child record not found' });
        }
      } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to update child record' });
      }
      break;
    }

    case 'DELETE': {
      // Delete a child record
      try {
        // Get the child record first to delete the image
        const child = await getChildById(id);
        
        if (child?.image_url) {
          await deleteImage(child.image_url);
        }

        const deletedChild = await deleteChild(id);
        if (deletedChild) {
          res.status(200).json(deletedChild);
        } else {
          res.status(404).json({ error: 'Child record not found' });
        }
      } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to delete child record' });
      }
      break;
    }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
