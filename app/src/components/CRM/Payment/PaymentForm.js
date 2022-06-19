import React, { useState, useEffect } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import styled from "styled-components";
import { useAuth } from "../../../contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { COLORS } from "../../../constants";

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "black",
      backgroundColor: "gray",
      fontWeight: "500",
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "18px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": {
        color: "#fce883",
      },
      "::placeholder": {
        color: "#87BBFD",
      },
    },
    invalid: {
      iconColor: "#ff584d",
      color: "#ff584d",
    },
  },
};

export const PaymentForm = ({
  pullChildError,
  pullChildType,
  cardName,
  cardAmount,
}) => {
  const { data, projectData, loading } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  const [success, setSuccess] = useState(false);
  const [showPage, setShowPage] = useState(false);
  const [cardError, setCardError] = useState(null);
  const [paymentType, setPaymentType] = useState(null);

  const email = data.email;
  const rentalId = projectData.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    //CONFIRM PAYMENT INTENT ON SERVER
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      try {
        const { id } = paymentMethod;
        await fetch("/api/payments/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: cardAmount,
            name: cardName,
            id,
            rentalId,
            email,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.success) {
              console.log("payment successful");
              setSuccess(true);
            } else if (!res.success) {
              console.log(res.message);
              setCardError(res.message);
            } else {
              console.error("there was an error with the payment");
            }
          });
      } catch (e) {
        console.error("error", e.message);
      }
    } else {
      setCardError("Carte inconnue");
      console.log(cardError);
    }
  };

  //THIS HOOK LISTENS FOR CHANGES IN STATE AND SENDS THE DATA TO STRIPE CONTAINER
  useEffect(() => {
    pullChildError(cardError);
    pullChildType(paymentType);
  }, [cardError, paymentType]);

  return (
    <>
      {!showPage && (
        <Wrapper id="page-wrapper">
          <div>
            <ShowCreditBtn
              id="show-credit-section-button"
              onClick={() => {
                setShowPage(!showPage);
                setPaymentType("credit");
              }}
              disabled={loading}
            >
              Carte de crédit
            </ShowCreditBtn>
          </div>
        </Wrapper>
      )}
      {showPage && (
        <Wrapper>
          {!success ? (
            <form id="credit-card-form" onSubmit={handleSubmit}>
              <AlignmentDiv id="alignment-div">
                <Main
                  id="main-payment-div"
                  className="CardElement"
                  style={{ width: "100%" }}
                >
                  <CardElement
                    className="credit-card-input"
                    id="credit-card-input"
                    options={CARD_OPTIONS}
                  />
                </Main>
                <PayButton
                  disabled={(loading, !cardAmount, !cardName)}
                  display={paymentType ? "" : "none"}
                  id="pay-button"
                >
                  Confirmer le paiement
                </PayButton>
                <ClearButton
                  onClick={() => {
                    setShowPage(!showPage);
                    setPaymentType(null);
                  }}
                >
                  Retour
                </ClearButton>
              </AlignmentDiv>
            </form>
          ) : (
            <div>nice, you paid your rent!</div>
          )}
        </Wrapper>
      )}
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  /* border: green solid 3px; */
  height: 150px;
  justify-content: center;
  align-items: center;
`;
const Main = styled.div`
  display: flex;
  flex-direction: column;
  /* border: red solid 3px; */
  justify-content: center;
  min-width: 600px;
`;
const ShowCreditBtn = styled.button`
  background-color: ${COLORS.crmButtonGrey};
  color: ${COLORS.primary};
  border: none;
  padding: 15px;
  border-radius: 3px;
  margin-top: -40px;
`;

const AlignmentDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const PayButton = styled.button`
  background-color: ${COLORS.secondary};
  color: white;
  border: none;
  padding: 15px;
  min-width: 350px;
  margin-top: 15px;
`;
const ClearButton = styled.button`
  background-color: ${COLORS.secondary};
  color: white;
  border: none;
  padding: 15px;
  max-width: 175px;
  max-height: 50px;
  margin-top: 15px;
  margin-left: 215px;
`;
