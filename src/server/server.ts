import express from "express";
import MercadoPagoConfig, { Payment } from "mercadopago";
import { paymentTemp } from "../buttons/payment/paymentTemp";

export const app = express();
const clientConfig = new MercadoPagoConfig({
  accessToken: process.env.accessToken!,
});

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true });
});

app.post("/callback", (req, res) => {
  const payment = new Payment(clientConfig);
  console.log("a");

  if (!req.body.data) return;

  payment
    .get({ id: req.body.id })
    .then(async (data) => {
      await paymentTemp(data.id!);
    })
    .catch(console.error);
});

const port = 9005
app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
