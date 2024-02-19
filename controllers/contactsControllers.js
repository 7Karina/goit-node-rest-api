
const express = require('express');
const HttpError = require('../helpers/HttpError.js');
const contactsService = require('../services/contactsServices.js');
const updateContactSchema = require('../schemas/contactsSchemas.js');

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactsService.listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error getting all contacts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getOneContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const contact = await contactsService.getContactById(contactId);
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
  const deleteContact = await contactsService.removeContact(contactId);
  if (deleteContact) {
    res.status(200).json(deleteContact);
  } else {
    res.status(404).json({ message: 'Not found' });
  }
};

export const createContact = async (req, res) => {
  try {
    const { error } = contactsSchemas.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { name, email, phone } = req.body;
    const newContact = await contactsService.addContact(name, email, phone);

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

    const updatedContact = await contactsService.updateContact(
      contactId,
      updateFields
    );
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

import contactsService from '../services/contactsServices.js';

export const getAllContacts = (req, res) => {};

export const getOneContact = (req, res) => {};

export const deleteContact = (req, res) => {};

export const createContact = (req, res) => {};

export const updateContact = (req, res) => {};

