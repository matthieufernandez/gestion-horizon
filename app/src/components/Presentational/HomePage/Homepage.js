import React from "react";

import { useHistory } from "react-router-dom";

import styled from "styled-components";
import { COLORS } from "../../../constants";

import homeSplash from "../../../assets/misc/homeSplash.jpg";

export const HomePage = () => {
  let history = useHistory();

  return (
    <Wrapper>
      <TopSection>
        <div className="blue-filter"></div>
        <div className="question-block-container">
          <div
            className="question-block"
            style={{ cursor: "pointer" }}
            onClick={() => history.push("/properties")}
          >
            <span>
              VOUS ÊTES <strong>INVESTISSEUR</strong> IMMOBILIER
            </span>
          </div>
          <div
            className="question-block"
            style={{ cursor: "pointer" }}
            onClick={() => history.push("/locataires")}
          >
            <span>
              VOUS ÊTES <strong>LOCATAIRE</strong>
            </span>
          </div>
          <div
            className="question-block"
            style={{ cursor: "pointer" }}
            onClick={() => history.push("/contact")}
          >
            <span>
              VOUS RECHERCHEZ UN UNITÉ À <strong>LOUER</strong>
            </span>
          </div>
          {/* <div className="book-call">Planifier un appel</div> */}
        </div>
      </TopSection>

      {/* COMMENTING OUT SECTIONS FOR DEPLOYMENT */}

      {/* <SearchSection>
        <div className="search-container">
          <div className="search-criteria">Agents</div>
          <div className="search-criteria">Ville</div>
          <div className="search-criteria">Type de Proprietes</div>
          <div className="search-criteria">Budget</div>
          <button>Rechercher</button>
        </div>
      </SearchSection> */}

      {/* <MidSection>
        <div className="mid-container">
          <div className="section-one">
            <h1>Gestion Horizobn</h1>
            <p>
              AU SERVICES DES INVESTISSEURS ET PROPRIETAIRES DE BIENS
              IMMOBILIERS
            </p>
          </div>
          <div className="section-two">
            <h2>
              {" "}
              AU SERVICES DES INVESTISSEURS ET PROPRIETAIRES DE BIENS
              IMMOBILIERS
            </h2>
            <ul>
              <li>Collect des loyers et depot direct a votre compte</li>
              <li>Location et publicite</li>
              <li>Ligne d'urgence directe 24/7</li>
              <li>Service professionel aux locataires</li>
              <li>Gestion des travaux (license RBQ) et entretien</li>
              <li>Tribunal administratic du logement</li>
              <li>Renouvellement des baux et releve 31</li>
              <li>Et bien plus encore!</li>
            </ul>
          </div>
        </div>
      </MidSection> */}
      {/* <BottomSection>
        <div className="title-container">
          <h1>Type de Proprietes</h1>
          <p>Decouvrez les dernieres proprietes a louer!</p>
        </div>
        <div className="cards-container">
          <div className="project-card"></div>
          <div className="project-card"></div>
          <div className="project-card"></div>
        </div>
      </BottomSection> */}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;

const TopSection = styled.div`
  width: 100%;
  height: 640px;
  position: relative;
  background: url(${homeSplash}) no-repeat center center;
  background-size: cover;
  /* display: flex;
  justify-content: center;
  flex-direction: column; */

  div.blue-filter {
    background-color: ${COLORS.primary}4D;
    z-index: 1;
    height: 100%;
    width: 100%;
    position: absolute;
  }

  div.question-block-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80%;
    width: 70%;
    margin: 0 auto;
  }

  div.question-block {
    height: 200px;
    width: 250px;
    border: 2px solid white;
    border-radius: 5px;
    color: white;
    background-color: ${COLORS.backgroundGrey}26;

    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    padding: 32px 23px;

    font-size: 23px;
    line-height: 30px;

    position: relative;
    z-index: 2;

    span {
      color: white;
    }
  }
`;

//idea for styling it in place:
//put it in the top div
// top div relative, search absolute
// or try translateX on search div, see if things hold

const SearchSection = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;

  margin-top: -80px;
  position: relative;
  z-index: 2;
  div.search-container {
    width: 80%;
    display: flex;
    justify-content: space-between;
    border: 1px solid ${COLORS.secondary};
    border-radius: 5px 5px 0 5px;

    div.search-criteria {
      height: 100%;
      width: 20%;
      border: 1px solid ${COLORS.secondary};
      background-color: white;
    }

    button {
      height: 100%;
      width: 20%;
      color: white;
      background-color: ${COLORS.secondary};
      border: none;
    }
  }
`;

const MidSection = styled.div`
  width: 100%;
  height: 640px;
  padding: 63px 54px;

  border: 1px solid black;

  div.mid-container {
    background-color: ${COLORS.backgroundGrey};
    height: 100%;

    display: flex;
    justify-content: space-between;

    div.section-one {
    }

    div.section-two {
    }
  }
`;

const BottomSection = styled.div`
  width: 100%;

  padding: 11px 0 32px 0;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;

  border: 1px solid black;

  div.title-container {
    text-align: center;
    margin-bottom: 36px;
  }

  div.cards-container {
    width: 77%;
    height: 300px;

    display: flex;
    justify-content: space-between;

    border: 1px solid black;

    div.project-card {
      width: 30%;
      border: 1px solid black;
      height: 100%;
    }
  }
`;
