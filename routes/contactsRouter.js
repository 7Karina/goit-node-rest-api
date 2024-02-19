<<<<<<< Updated upstream

const express = require('express');

import express from 'express';

=======
import express from 'express';
>>>>>>> Stashed changes
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from '../controllers/contactsControllers.js';

const contactsRouter = express.Router();

contactsRouter.get('/api/contacts', getAllContacts);

contactsRouter.get('/api/contacts/:id', getOneContact);

contactsRouter.delete('/api/contacts/:id', deleteContact);

contactsRouter.post(' /api/contacts', createContact);

contactsRouter.put('/api/contacts/:id', updateContact);

contactsRouter.get('/', getAllContacts);

contactsRouter.get('/:id', getOneContact);

contactsRouter.delete('/:id', deleteContact);

contactsRouter.post('/', createContact);

contactsRouter.put('/:id', updateContact);

export default contactsRouter;
