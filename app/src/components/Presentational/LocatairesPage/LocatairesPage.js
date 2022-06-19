import React from "react";
import styled from "styled-components";

import { COLORS } from "../../../constants";
import splash from "../../../assets/misc/locatairesSplash.jpg";

export const LocatairesPage = () => {
  return (
    <Wrapper>
      <TopDiv>
        <div className="container">
          <h1>VOUS PENSEZ REJOINDRE GESTOIN HORIZON?</h1>
          <p>
            {
              "Gestion Horizon assure la prise en charge d'appartements locatifs residentiels, de condo"
            }
          </p>
          <p>{"& de residences unifamiliales."}</p>
          <img src={splash} alt="picture of martin" />
          <button>Joindre/Se connecter</button>
        </div>
      </TopDiv>
      <MidDiv>
        <div className="container">
          <h1>{"POURQUOI REJOINDRE GESTION HORIZON?"}</h1>
          <p>
            Pour acceder a votre compte et <strong>payer vos factures</strong>,
            voir <strong>votre balance</strong> ou pour{" "}
            <strong>prendre contacte</strong>,
          </p>
          <p>nous vous invitons a vous joindre a nous.</p>
          <p>
            Vous aurez acces a une <strong>plate-forme de gestion</strong>{" "}
            immobiliere <strong>simple</strong> et <strong>intuitive</strong>{" "}
            qui vous offrira
          </p>
          <p>une experience de location des plus agreables.</p>
          <div className="card-container">
            <div className="card">
              <img src="" alt="" />
              <h2>Inscriptions</h2>
              <p>
                Cliquez sur le lien suivant pour creer et activer votre compte.
              </p>

              <button>Joindre/Se Connecter</button>
            </div>
            <div className="card">
              <img src="" alt="" />
              <h2>Payments</h2>
              <p>Payez votre loyez en toute securite sur notre plateforme.</p>
              <button>Joindre/Se Connecter</button>
            </div>
            <div className="card">
              <img src="" alt="" />
              <h2>Contactez</h2>
              <p>
                Contactez-nous en temps reel pour toute question relative a
                votre logement.
              </p>
              <button>Joindre/Se Connecter</button>
            </div>
          </div>
        </div>
      </MidDiv>
      <BottomDiv>
        <div className="container">
          <h1>VOUS PENSEZ REJOINDRE GESTOIN HORIZON?</h1>
          <p>
            Pour acceder a votre compte et <strong>payer vos factures</strong>,
            voir <strong>votre balance</strong> ou pour{" "}
            <strong>prendre contacte</strong>,
          </p>
          <p>nous vous invitons a vous joindre a nous.</p>
          <p>
            Vous aurez acces a une <strong>plate-forme de gestion</strong>{" "}
            immobiliere <strong>simple</strong> et <strong>intuitive</strong>{" "}
            qui vous offrira
          </p>
          <p>une experience de location des plus agreables.</p>
          <img src={splash} alt="picture of martin" />
        </div>
      </BottomDiv>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  color: ${COLORS.primary};

  h1 {
    font-size: calc(120% + 0.8vmin);
  }
`;

const TopDiv = styled.div`
  width: 100%;
  max-height: 100%;
  margin: 40px auto;

  div.container {
    display: flex;
    flex-direction: column;
    width: 900px;
    margin: 0 auto;
    text-align: center;
  }

  h1 {
    margin-bottom: 17px;
  }

  p {
    font-size: calc(60% + 0.8vmin);
    font-weight: 200;
    line-height: 130%;
  }

  img {
    height: 370px;
    width: 900px;
    margin-top: 21px;
    margin-bottom: 21px;
    border-radius: 5px;
  }

  button {
    background-color: ${COLORS.primary};
    color: white;
    font-size: calc(60% + 0.8vmin);
    border-radius: 5px;
    padding: 13px 19px;
    border: none;
    margin: 0 auto;
  }
`;

const MidDiv = styled.div`
  width: 100%;
  max-height: 100%;
  background-color: ${COLORS.backgroundGrey};
  padding: 40px 0;
  margin: 0 auto;

  div.container {
    margin: 0 auto;
    text-align: center;
    display: flex;
    flex-direction: column;
  }

  h1 {
    margin-bottom: 13px;
  }

  p {
    line-height: 125%;
  }

  div.card-container {
    display: flex;
    justify-content: center;
    margin: 46px 42px;
  }

  div.card {
    margin: 0 13px;
    padding: 23px 13px;
    border: 1px solid black;
    width: 32%;
    height: 300px;

    img {
      height: 50px;
      width: 50px;
      border-radius: 1px solid black;
      margin: 13px auto;
    }

    h2 {
      font-size: calc(100% + 0.8vmin);
      margin: 13px 0;
    }

    p {
      margin-bottom: 13px;
    }

    button {
      background-color: ${COLORS.primary};
      color: white;
      font-size: calc(60% + 0.8vmin);
      border-radius: 5px;
      padding: 13px 19px;
      border: none;
      margin: 0 auto;
    }
  }
`;

const BottomDiv = styled.div`
  width: 100%;
  max-height: 100%;
  margin: 0 auto;
  padding: 40px 0;
  background-color: ${COLORS.primary};
  color: white;

  div.container {
    display: flex;
    flex-direction: column;
    width: 900px;
    margin: 0 auto;
    text-align: center;
  }

  h1 {
    margin-bottom: 17px;
  }

  p {
    font-size: calc(60% + 0.8vmin);
    font-weight: 200;
    line-height: 130%;
  }

  img {
    height: 370px;
    width: 900px;
    margin-top: 21px;
    margin-bottom: 21px;
    border-radius: 5px;
  }
`;
