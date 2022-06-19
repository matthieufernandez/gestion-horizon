import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentForm } from "./PaymentForm";
import { DebitPaymentForm } from "./DebitPaymentForm";
import { useAuth } from "../../../contexts/AuthContext";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";

//////////////LOADING STRIPE//////////////////
require("dotenv").config();
const payKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

const stripePromise = loadStripe(payKey);
//////////////////////////////////////////////

export const StripeContainer = () => {
  const { error, setError, loading, data, projectData } = useAuth();

  const [cardName, setCardName] = useState(null);
  const [cardAmount, setCardAmount] = useState(null);
  const [payment, setPayment] = useState(null);

  //THESE FUNCTIONS PULL DATA FROM CHILDREN FOR PROCESSING ERRORS / DISPLAY
  const pullChildError = (childData) => {
    setError(childData);
  };
  const pullChildType = (childData) => {
    setPayment(childData);
  };

  return (
    <Elements stripe={stripePromise}>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "65vh", marginBottom: "-35px" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Card>
            <Card.Body>
              <h2
                className="text-center mb-4"
                style={{ fontSize: "28px", fontWeight: "bold" }}
              >
                Formulaire de Paiement
              </h2>
              {error && <Alert variant="danger">{error}</Alert>}
            </Card.Body>
            <Form
              style={{
                marginLeft: "20px",
                marginRight: "20px",
              }}
            >
              <Form.Group
                id="name"
                style={{ padding: "10px", marginBottom: "10px" }}
              >
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  placeholder={
                    `e.g.: ${data.firstName}` + " " + `${data.lastName}`
                  }
                  type="name"
                  onChange={(e) => setCardName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group
                id="amount"
                style={{ padding: "10px", marginBottom: "10px" }}
              >
                <Form.Label>Montant</Form.Label>
                <Form.Control
                  type="number"
                  placeholder={`e.g.: ${projectData.rentOwed}`}
                  onChange={(e) => setCardAmount(e.target.value)}
                  required
                />
              </Form.Group>
            </Form>
          </Card>
        </div>
      </Container>
      <div
        style={{
          display: "flex",
          gap: "50px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {payment !== "debit" && (
          <PaymentForm
            pullChildError={pullChildError}
            pullChildType={pullChildType}
            cardName={cardName}
            cardAmount={cardAmount}
          />
        )}

        {payment !== "credit" && (
          <DebitPaymentForm
            pullChildError={pullChildError}
            pullChildType={pullChildType}
            cardName={cardName}
            cardAmount={cardAmount}
          />
        )}
      </div>
    </Elements>
  );
};
