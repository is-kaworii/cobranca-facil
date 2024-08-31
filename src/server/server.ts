import express from "express";
import MercadoPagoConfig, { Payment } from "mercadopago";
import { logger } from "..";
import { paymentTemp } from "../buttons/payment/paymentTemp";

export const app = express();
const clientConfig = new MercadoPagoConfig({
  accessToken: process.env.accessToken!,
});
const payment = new Payment(clientConfig);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true });
});

app.post("/callback", (req, res) => {
  logger.info("POST callback called");

  if (!req.body.data) return;
  logger.info(`Payment ID: ${req.body.data.id}`);
  logger.info("Getting payment information");
  payment
    .get({ id: req.body.data.id })
    .then(async (data) => {
      await paymentTemp(data);
    })
    .catch(console.error);
});

const port = process.env.port;
app.listen(port, () => {
  logger.info(`listening on http://localhost:${port}`);
});
