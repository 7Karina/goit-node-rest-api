import { isValidObjectId } from 'mongoose';

export const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    res.status(400).json({
      message:
        "Bad request. Mongoose can't cast the given value to an ObjectId",
    });
  }
  next();
};
