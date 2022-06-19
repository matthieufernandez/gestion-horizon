const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const bodyParser = require("body-parser");
const app = require("express");
const axios = require("axios");

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_jrnLwmryXFSPUUO1ahFWSF2PfwfaXSdU";

const webhookListener = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.log(err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  // Handle the event
  switch (event.type) {
    case "payment_intent.payment_failed":
      // PROCESS FAILED PAYMENT BY UPDATING DB AND NOTIFYING ADMIN
      const paymentIntent = event.data.object;

      const failAmount = paymentIntent.metadata.amount;
      const failTenantId = paymentIntent.metadata.email;
      const failId = paymentIntent.metadata.id;
      const failRentalId = paymentIntent.metadata.rentalId;

      axios.post("http://localhost:4000/api/projects/processRentPayment", {
        unitId: failRentalId,
        tenantId: failTenantId,
        amount: failAmount,
        type: "Failed",
        id: failId,
      });

      console.log("the payment failed successfully!");
      res
        .status(200)
        .json({ status: 200, message: "payment failed succesfully" });
      break;
    case "payment_intent.succeeded":
      const paymentIntent2 = event.data.object;
      const { amount, email, id, rentalId } = paymentIntent2.metadata;

      axios
        .post("http://localhost:4000/api/projects/processRentPayment", {
          unitId: rentalId,
          tenantId: email,
          amount: amount,
          type: "Payment",
          id: id,
        })
        .then((response) => {
          response.status === 200
            ? console.log("payment successfully processed")
            : console.error("there was an issue processing the payment");
        });
      break;
    case "payment_intent.processing":
      const paymentIntent3 = event.data.object;

      const pendingAmount = paymentIntent3.metadata.amount;
      const pendingTenantId = paymentIntent3.metadata.email;
      const pendingId = paymentIntent3.metadata.id;
      const pendingRentalId = paymentIntent3.metadata.rentalId;

      axios
        .post("http://localhost:4000/api/projects/processRentPayment", {
          unitId: pendingRentalId,
          tenantId: pendingTenantId,
          amount: pendingAmount,
          type: "Pending",
          id: pendingId,
        })
        .then((response) => {
          response.status === 200
            ? console.log("payment is being processed...")
            : console.error("error processing payment");
        });
      break;

    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  // Return a 200 response to acknowledge receipt of the event
  res.send();
};

// fetch("/api/projects/processRentPayment", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     unitId: rentalId,
//     tenantId: email,
//     amount: amount,
//     type: "debit payment",
//     id: id,
//   }),
// }).then((res) => res.json());

module.exports = { webhookListener };
