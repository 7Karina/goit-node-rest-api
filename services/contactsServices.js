import fs from 'fs/promises';
import path from 'node:path';
import crypto from 'crypto';

const contactsPath = path.join(__dirname, 'db', 'contacts.json');
console.log(contactsPath);

async function readContacts() {
  try {
    const data = await fs.readFile(contactsPath, { encoding: 'utf-8' });
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading contacts:', error);
    throw error;
  }
}

async function writeContacts(contacts) {
  try {
    const data = JSON.stringify(contacts, null, 2);
    await fs.writeFile(contactsPath, data);
  } catch (error) {
    console.error('Error writing contacts:', error);
    throw error;
  }
}

async function listContacts() {
  try {
    const contacts = await readContacts();
    return contacts;
  } catch (error) {
    console.error('Error listing contacts:', error);
    throw error;
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await readContacts();
    const contact = contacts.find(contact => contact.id === contactId);
    return contact || null;
  } catch (error) {
    console.error('Error getting contact by ID:', error);
    throw error;
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await readContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);
    if (index !== -1) {
      const removedContact = contacts.splice(index, 1);
      await writeContacts(contacts);
      return removedContact[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error removing contact:', error);
    throw error;
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const newContact = {
      id: crypto.randomUUID(),
      name,
      email,
      phone,
    };
    contacts.push(newContact);
    await writeContacts(contacts);
    return newContact;
  } catch (error) {
    console.error('Error adding contact:', error);
    throw error;
  }
}

async function updateContactSer(contactId, updatedFields) {
  try {
    const contacts = await readContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);
    if (index !== -1) {
      contacts[index] = {
        ...contacts[index],
        ...updatedFields,
      };
      await writeContacts(contacts);
      return contacts[index];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
}
