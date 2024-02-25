
import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[0-9]{3}-[0-9]{2}-[0-9]{2}$/)
    .required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[0-9]{3}-[0-9]{2}-[0-9]{2}$/),
}).min(1);







