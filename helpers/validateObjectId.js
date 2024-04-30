import { isValidObjectId } from 'mongoose';

export const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    const error = new HttpError(400, {
      message:
        "Bad request. Mongoose can't cast the given value to an ObjectId",
    });
    return next(error);
  }
  next();
};
