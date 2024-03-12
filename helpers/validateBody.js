import HttpError from './HttpError.js';

const validateBody = schema => {
  const func = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(HttpError(400, 'Body must have at least one field'));
    }
    const { error } = schema.validate(req.body);
    if (error) {
      return next(HttpError(400, error.message));
    }

    next();
  };

  return func;
};

export default validateBody;
