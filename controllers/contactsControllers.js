import HttpError from '../helpers/HttpError';
import { validate } from 'joi';
import {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContactSer,
} from '../services/contactsServices.js';
import { updateContactSchema } from '../schemas/contactsSchemas.js';

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error getting all contacts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getOneContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const contact = await getContactById(contactId);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    console.error('Error getting contact by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteContact = async (req, res) => {
  const contactId = req.params.id;
  const deleteContact = await removeContact(contactId);
  if (deleteContact) {
    res.status(200).json(deleteContact);
  } else {
    res.status(404).json({ message: 'Not found' });
  }
};

export const createContact = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { name, email, phone } = req.body;
    const newContact = await addContact(name, email, phone);

    res.status(201).json(newContact);
  } catch (error) {
    console.error('Error adding contact:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const updateFields = req.body;

    if (Object.keys(updateFields).length === 0) {
      throw new HttpError(400, 'Body must have at least one field');
    }

    const { error } = updateContactSchema.validate(updateFields);
    if (error) {
      throw new HttpError(400, error.message);
    }

    const updatedContact = await updateContactSer(contactId, updateFields);
    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      throw new HttpError(404, 'Not found');
    }
  } catch (error) {
    console.error('Error updating contact:', error);
    const status = error.status || 500;
    const message = error.message || 'Internal Server Error';
    res.status(status).json({ message });
  }
};
