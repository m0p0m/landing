import { Router } from 'express';
import StripeWebhookController from '../controllers/stripe.webhook.controller';
import express from 'express';

const router = Router();

router.post('/', express.raw({ type: 'application/json' }), StripeWebhookController.handleWebhook);

export default router;
