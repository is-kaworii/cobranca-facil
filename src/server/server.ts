import express from "express";
import MercadoPagoConfig, { Payment } from "mercadopago";

export const app = express();
const clientConfig = new MercadoPagoConfig({
  accessToken: process.env.accessToken!,
});

app.use(express.json());

app.post("/callback", (req, res) => {
  const payment = new Payment(clientConfig);
  console.log('a')

  if (!req.body.data) return;

  payment
    .get({ id: req.body.id })
    .then((data) => {
      console.log(data);
    })
    .catch(console.error);
});

app.listen(9005, () => {
  console.log("listening on http://localhost:9005");
});
