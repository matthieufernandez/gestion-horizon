import React, { useRef, useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useStripe } from "@stripe/react-stripe-js";
import styled from "styled-components";
import { COLORS } from "../../../constants";

export const DebitPaymentForm = ({
  pullChildError,
  pullChildType,
  cardName,
  cardAmount,
}) => {
  // const nameRef = useRef();

  const stripe = useStripe();
  const { data, projectData, loading } = useAuth();

  const name = cardName;
  let email = data.email;
  const rentalId = projectData.id;

  const [showPage, setShowPage] = useState(false);
  const [cardError, setCardError] = useState(null);
  const [paymentType, setPaymentType] = useState(null);

  useEffect(() => {
    pullChildError(cardError);
    pullChildType(paymentType);
  }, [cardError, paymentType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe) {
      return;
    }

    // CREATE PAYMENT INTENT ON THE SERVER //
    const { clientSecret, error: backendError } = await fetch(
      "/api/payments/debit-payment",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: cardAmount,
          name: cardName,
          email,
          rentalId,
        }),
      }
    ).then((res) => res.json());

    if (backendError) {
      console.error(backendError.message);
      setCardError("Veuillez confirmer le nom et montant");
      return;
    }

    // CONFIRM PAYMENT INTENT ON THE CLIENT / OBTAIN PAYLOAD//
    const { error, paymentIntent } = await stripe.confirmAcssDebitPayment(
      clientSecret,
      {
        payment_method: {
          billing_details: {
            name,
            email,
          },
        },
      }
    );
    if (error) {
      console.error(error.message);
      setCardError("Veuillez confirmer le nom et montant");
      return;
    }
    console.log(`Payment intent: ${paymentIntent.id}: ${paymentIntent.status}`);
  };

  return (
    <>
      {showPage ? (
        <Wrapper>
          <AlignmentDiv>
            <Main>
              <form onSubmit={handleSubmit}>
                <PayButton disabled={loading || !cardAmount || !cardName}>
                  Confirmer le paiement
                </PayButton>
              </form>
            </Main>
            <ClearButton
              onClick={() => {
                setPaymentType(null);
                setShowPage(!showPage);
              }}
            >
              Retour
            </ClearButton>
          </AlignmentDiv>
        </Wrapper>
      ) : (
        <Wrapper>
          <AlignmentDiv>
            <ShowDebitBtn
              onClick={() => {
                setShowPage(!showPage);
                setPaymentType("debit");
                console.log(cardAmount, cardName);
              }}
            >
              Débit pré-authorizé
            </ShowDebitBtn>
          </AlignmentDiv>
        </Wrapper>
      )}
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  /* border: green solid 3px; */
  height: 46px;
  justify-content: center;
  margin-bottom: 50px;
`;
const Main = styled.div`
  display: flex;
  flex-direction: column;
  /* border: red solid 3px; */
  justify-content: center;
  min-width: 600px;
`;
const AlignmentDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const ShowDebitBtn = styled.button`
  background-color: ${COLORS.crmButtonGrey};
  color: ${COLORS.primary};
  border: none;
  padding: 15px;
  border-radius: 3px;
  margin-top: 36px;
`;
const PayButton = styled.button`
  background-color: ${COLORS.secondary};
  color: white;
  border: none;
  padding: 15px;
  min-width: 350px;
  margin-top: 65px;
  margin-left: 125px;
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
  margin-bottom: 50px;
`;
