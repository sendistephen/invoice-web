import 'dotenv/config';
import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import transporter from '../helpers/emailTransport.js';
import { systemLogs } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @function sendEmail
 * @description This function sends an email to the user using the email template
 * @param {string} email - The email address of the user who is to receive the email
 * @param {string} subject - The subject of the email
 * @param {object} payload - The payload for the email template
 * @param {string} template - The path to the email template
 * @returns {Promise<void>}
 */
const sendEmail = async (email, subject, payload, template) => {
  try {
    // Read the email template file content
    const sourceDirectory = fs.readFileSync(
      path.join(__dirname, template),
      'utf8'
    );

    // Compile the template using Handlebars
    const compiledTemplate = handlebars.compile(sourceDirectory);

    // Set up the email options including recipient, subject, and compiled HTML
    const emailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: subject,
      html: compiledTemplate(payload),
    };

    // Send the email using the transporter
    await transporter.sendMail(emailOptions);
  } catch (error) {
    // Log an error message if email sending fails
    systemLogs.error(`email not sent: ${error}`);
  }
};

export default sendEmail;

