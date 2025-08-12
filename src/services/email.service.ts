import nodemailer from 'nodemailer';
import { env } from '../../config/env.config';

const transporter = nodemailer.createTransport({
  host: env.email.host,
  port: env.email.port,
  auth: {
    user: env.email.user,
    pass: env.email.pass,
  },
});

export const sendPasswordResetEmail = async (to: string, token: string) => {
  const resetUrl = `${env.clientUrl}/password-reset/${token}`;
  await transporter.sendMail({
    from: env.email.from,
    to,
    subject: 'Password Reset Request',
    html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
  });
};
