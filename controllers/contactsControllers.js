import mongoose from 'mongoose';
import { Contact } from '../DBModels/contactModel.js';
import 'dotenv/config';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const getAllContacts = async (req, res) => {
  try {
    const userId = req.user._id;

    const contacts = await Contact.find({ owner: userId });
    if (!contacts) {
      res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json(contacts);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOneContact = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  try {
    const contact = await Contact.findOne({ owner: userId, _id: id });

    if (!contact) {
      res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const deleteContact = await Contact.findByIdAndDelete({
      owner: userId,
      _id: id,
    });
    if (!deleteContact) {
      res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json(deleteContact);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createContact = async (req, res) => {
  const userId = req.user._id;

  try {
    const createContact = await Contact.create({ ...req.body, owner: userId });
    res.status(201).json(createContact);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateContact = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  const body = req.body;
  if (Object.keys(body).length === 0) {
    res.status(400).json({ message: 'Body must have at least one field' });
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
      res.status(404).json({ message: 'Not found' });
      return;
    }
    return res.status(200).json(updateContact);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateStatusContact = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  try {
    const result = await Contact.findOneAndUpdate(
      { _id: id, owner: userId },
      req.body,
      { new: true }
    );
    if (!result) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
