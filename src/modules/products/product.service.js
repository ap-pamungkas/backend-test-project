import { z } from "zod";
import { getDB } from "../../config/db.js";
import { ObjectId } from "mongodb";

const col = () => getDB().collection("products");
const CreateDTO = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  description: z.string().optional(),
});
const UpdateDTO = CreateDTO.partial();

// get all products
export const list = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

   const ownerId = new ObjectId(req.user.id || req.user.uid);
    let filter = { ownerId };



    if (q) {
      filter = {
        ...filter,
        name: { $regex: q, $options: "i" },
      };
    }

    const list = await col()
      .find(filter)
      .limit(Number(limit))
      .skip((Number(page) - 1) * limit)
      .toArray();
    res.json(list);
  } catch (e) {
    next(e);
  }
};


// create product
export const create = async (req, res, next) => {
  try {
    const { name, price, description } = req.body;

    const product = {
      name,
      price,
      description,
      ownerId: new ObjectId(req.user.uid),
      createdAt: new Date()
    };

    const result = await col("products").insertOne(product);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};


// get product by id
export const getById = async (req, res, next) => {
  try {
    const item = await col().findOne({ _id: new ObjectId(req.params.id) });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
};


// update product
export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = new ObjectId(req.user.uid);

    const result = await col("products").updateOne(
      { _id: new ObjectId(id), ownerId },
      { $set: req.body }
    );

    if (result.matchedCount === 0) {
      return res.status(403).json({ message: "Forbidden or Not Found" });
    }

    res.json({ message: "Product updated" });
  } catch (e) {
    next(e);
  }
};



// delete product
export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = new ObjectId(req.user.uid);

    const result = await col("products").deleteOne({
      _id: new ObjectId(id),
      ownerId
    });

    if (result.deletedCount === 0) {
      return res.status(403).json({ message: "Forbidden or Not Found" });
    }

    res.json({ message: "Product deleted" });
  } catch (e) {
    next(e);
  }
};

