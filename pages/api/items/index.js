import { getAllChildren, createChild } from '@/lib/data';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET': {
      // Get all children
      try {
        const children = await getAllChildren();
        res.status(200).json(children);
      } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to fetch children records' });
      }
      break;
    }

    case 'POST': {
      // Create a new child record
      const { name, age, parent_name, contact_details, treatment, notes, image_url, op_number } = req.body;
      
      if (!name || !age || !contact_details) {
        return res.status(400).json({ error: 'Name, age, and contact details are required' });
      }

      try {
        const newChild = await createChild({ 
          name, 
          age: Number.parseInt(age), 
          parent_name: parent_name || null, 
          contact_details,
          treatment,
          notes,
          image_url,
          op_number: op_number || null,
        });
        res.status(201).json(newChild);
      } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to create child record' });
      }
      break;
    }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
