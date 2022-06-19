const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const debitPaymentHandler = async (req, res) => {
  const { email, amount, name, rentalId } = req.body;
  const id = uuidv4();
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "cad",
      description: `${name} : rent payment`,
      metadata: {
        name: name,
        amount: amount,
        email: email,
        id: id,
        rentalId: rentalId,
      },
      payment_method_types: ["acss_debit"],
      payment_method_options: {
        acss_debit: {
          mandate_options: {
            payment_schedule: "sporadic",
            transaction_type: "personal",
          },
        },
      },
    });

    paymentIntent
      ? res.json({
          status: 200,
          clientSecret: paymentIntent.client_secret,
          message: "payment processing",
        })
      : console.log("error");
  } catch (e) {
    console.error(e);
    res.json({
      error: { message: e.message },
      message: "testing",
      status: 400,
      success: false,
    });
  }
};

module.exports = { debitPaymentHandler };
