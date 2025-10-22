import { z } from 'zod';
import { getDB } from '../../config/db.js';
import { ObjectId } from 'mongodb';

const col = () => getDB().collection('products');
const CreateDTO = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  description: z.string().optional()
});
const UpdateDTO = CreateDTO.partial();

export const list = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    

    const ownerId = new ObjectId(req.user.uid);
    
  
    let filter = { ownerId }; 

    if (q) {
      filter = { 
          ...filter, // Pertahankan filter ownerId
          name: { $regex: q, $options: 'i' } 
      };
    }
    
    const list = await col()
      .find(filter)
      .limit(Number(limit))
      .skip((Number(page) - 1) * limit)
      .toArray();
    res.json(list);
  } catch (e) { next(e); }
};

export const create = async (req, res, next) => {
  try {
    const doc = CreateDTO.parse(req.body);
    doc.ownerId = req.user.uid;
    const { insertedId } = await col().insertOne(doc);
    res.status(201).json({ ...doc, _id: insertedId });
  } catch (e) { next(e); }
};

export const getById = async (req, res, next) => {
  try {
    const item = await col().findOne({ _id: new ObjectId(req.params.id) });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (e) { next(e); }
};

export const update = async (req, res, next) => {
  try {
    const data = UpdateDTO.parse(req.body);
    const { matchedCount } = await col().updateOne(
      { _id: new ObjectId(req.params.id), ownerId: req.user.uid },
      { $set: data }
    );
    if (!matchedCount) return res.status(404).json({ message: 'Not found / Forbidden' });
    res.json({ message: 'Updated' });
  } catch (e) { next(e); }
};

export const remove = async (req, res, next) => {
  try {
    const { deletedCount } = await col().deleteOne({
      _id: new ObjectId(req.params.id),
      ownerId: req.user.uid
    });
    if (!deletedCount) return res.status(404).json({ message: 'Not found / Forbidden' });
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
};