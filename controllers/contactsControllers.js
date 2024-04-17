import mongoose from 'mongoose';
import { Contact } from '../DBModels/model.js';

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    if (!contacts) {
      res.status(404).json({ message: 'Nor found' });
    }
    res.status(200).json(contacts);
  } catch (error) {
    console.log(error.message);
  }
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await Contact.findById(id);
    console.log(contact);
    if (!contact) {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteContact = await Contact.findByIdAndDelete(id);
    if (!deleteContact) {
      res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json(deleteContact);
  } catch (error) {
    console.log(error.message);
  }
};

export const createContact = async (req, res) => {
  try {
    const createContact = await Contact.create(req.body);
    res.status(201).json(createContact);
  } catch (error) {
    console.log(error.message);
  }
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  if (Object.keys(body).length === 0) {
    res.status(400).json({ message: 'Body must have at least one field' });
  }
  try {
    const updateContact = await Contact.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updateContact) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    return res.status(200).json(updateContact);
  } catch (e) {
    console.log(e.message);
  }
};

export const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Contact.findByIdAndUpdate(id, req.body);
    if (!result) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    const contact = await Contact.findById(id);
    res.status(200).json(contact);
  } catch (error) {}
};
