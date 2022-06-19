require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const paymentHandler = async (req, res) => {
  try {
    let { amount, id, name, rentalId, email } = req.body;
    let payId = uuidv4();

    const payment = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "CAD",
      description: `${name} : rent payment`,
      payment_method: id,
      confirm: true,
      metadata: {
        name: name,
        amount: amount,
        email: email,
        id: payId,
        rentalId: rentalId,
      },
    });

    // console.log("Payment", payment);
    res.json({
      message: "Payment successful",
      status: 200,
      success: true,
    });
  } catch (e) {
    console.error(e);
    res.json({
      message: "Échec de paiement, veuillez confirmer le nom et le montant",
      status: 400,
      success: false,
    });
  }
};

module.exports = { paymentHandler };
