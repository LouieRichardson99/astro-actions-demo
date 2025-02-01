import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import nodemailer from 'nodemailer';
import nodemailerSendgrid from 'nodemailer-sendgrid';

const { SENDGRID_API_KEY, SENDGRID_SENDER_EMAIL } = import.meta.env;

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: SENDGRID_API_KEY || ''
  })
);

export const server = {
  submitForm: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string(),
      email: z.string().email(),
      message: z.string()
    }),
    handler: async (input) => {
      const { name, email, message } = input;

      try {
        await transport.sendMail({
          from: SENDGRID_SENDER_EMAIL || '',
          to: SENDGRID_SENDER_EMAIL || '',
          subject: 'New Contact Form Submission',
          html: `
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Message: ${message}</p>
          `
        });

        return {
          message: 'Form submitted successfully!'
        };
      } catch {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong, please try again.'
        });
      }
    }
  })
};
