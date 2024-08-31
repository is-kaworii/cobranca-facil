import express from "express";
import MercadoPagoConfig, { Payment } from "mercadopago";
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
  console.log("POST /callback");
  console.log(req.body);

  if (!req.body.data) return;
  payment
    .get({ id: req.body.data.id })
    .then(async (data) => {
      console.log(data);
      await paymentTemp(data.id!);
    })
    .catch(console.error);
});

const port = 9005;
app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
