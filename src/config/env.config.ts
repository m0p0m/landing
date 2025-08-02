import dotenv from 'dotenv';

dotenv.config();

export const env = {
  mongo: {
    uri: process.env.MONGO_URI as string,
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY as string,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET as string,
  },
  email: {
    host: process.env.EMAIL_HOST as string,
    port: Number(process.env.EMAIL_PORT),
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASS as string,
    from: process.env.EMAIL_FROM as string,
  },
  clientUrl: process.env.CLIENT_URL as string,
};
