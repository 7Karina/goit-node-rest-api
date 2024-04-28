import mongoose from 'mongoose';
import { Contact } from '../DBModels/contactModel.js';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import HttpError from '../helpers/HttpError.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const getAllContacts = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const contacts = await Contact.find({ owner: userId });
    if (!contacts) {
      throw new HttpError(404, { message: 'Not found' });
    }
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const userId = req.user._id;
  const { id } = req.params;
  try {
    const contact = await Contact.findOne({ owner: userId, _id: id });

    if (!contact) {
      throw new HttpError(404, { message: 'Not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const deleteContact = await Contact.findByIdAndDelete({
      owner: userId,
      _id: id,
    });
    if (!deleteContact) {
      throw new HttpError(404, { message: 'Not found' });
    }
    res.status(200).json(deleteContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const createContact = await Contact.create({ ...req.body, owner: userId });
    res.status(201).json(createContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const userId = req.user._id;
  const { id } = req.params;
  const body = req.body;
  if (Object.keys(body).length === 0) {
    throw new HttpError(400, { message: 'Body must have at least one field' });
  }
  try {
    const updateContact = await Contact.findOneAndUpdate(
      {
        owner: userId,
        _id: id,
      },
      body,
      {
        new: true,
      }
    );
    if (!updateContact) {
      throw new HttpError(404, { message: 'Not found' });
    }
    return res.status(200).json(updateContact);
  } catch (e) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  const userId = req.user._id;
  const { id } = req.params;
  try {
    const result = await Contact.findOneAndUpdate(
      { _id: id, owner: userId },
      req.body,
      { new: true }
    );
    if (!result) {
      throw new HttpError(404, { message: 'Not found' });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
