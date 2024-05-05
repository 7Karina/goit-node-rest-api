import 'dotenv/config';
import nodemailer from 'nodemailer';

const UKR_PASSWORD = process.env.UKR_PASSWORD;

const nodeMailerConfig = {
  host: 'mail.ukr.net',
  port: '465',
  secure: true,
  auth: {
    user: 'karinakramarenko_@ukr.net',
    pass: UKR_PASSWORD,
  },
};

export const transport = nodemailer.createTransport(nodeMailerConfig);
