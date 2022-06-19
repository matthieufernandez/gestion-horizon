import React, { useState } from "react";
import styled from "styled-components";

import { COLORS } from "../../../../../constants";

import userDefault from "../../../../../assets/SVGs/user-profile-default.svg";

export const AdminRentRow = ({ i }) => {
  const [dropdown, setDropdown] = useState(false);

  return (
    <Row>
      <div className="td">
        <div className="td-user">
          <img src={userDefault} alt="user-icon" />
          <p>{i.name}</p>
        </div>
      </div>

      <div className="td">
        <div className="td-date-rent">
          <h1>{i.date.day}</h1>
          <p>{i.date.time}</p>
        </div>
      </div>

      <div className="td">
        <div className="td-date-rent">
          <h1>{i.rent}</h1>
          <p>Mensuel</p>
        </div>
      </div>

      <div className="td">
        <div className="td-date-rent">
          <h1>{i.balance}</h1>
          <p>À payer</p>
        </div>
      </div>

      <div className="td">
        <div
          className="status"
          style={{ backgroundColor: i.paid ? COLORS.crmGreen : COLORS.crmRed }}
        >
          <span>{i.paid ? `Payé` : `Non Payé`}</span>
        </div>
      </div>

      <div className="td">
        <div className="td-menu" onClick={() => setDropdown(!dropdown)}>
          <span>● ● ●</span>
          {dropdown && (
            <div className="dropdown-container">
              <div className="option" onClick={() => setDropdown(false)}>
                Envoyer un rappel
              </div>
              <div className="option" onClick={() => setDropdown(false)}>
                Voir détails
              </div>
              <div className="option" onClick={() => setDropdown(false)}>
                Contacter
              </div>
            </div>
          )}
        </div>
      </div>
    </Row>
  );
};

const Row = styled.div`
  width: 100%;
  height: 72px;
  display: flex;
  border-bottom: 1px solid ${COLORS.grey1};
  color: ${COLORS.primary};

  div.td {
    width: calc(100% / 6);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  div.td-user {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-weight: 300;

    img {
      height: 31px;
      width: 31px;
      margin-bottom: 3px;
    }

    p {
      font-size: 11px;
      color: ${COLORS.primary};
    }
  }

  div.td-date-rent {
    text-align: center;

    h1 {
      font-size: calc(70% + 0.8vmin);
      font-weight: 600;
    }

    p {
      color: ${COLORS.bluegrey};
      font-size: calc(40% + 0.8vmin);
      font-weight: 300;
      margin-top: 3px;
    }
  }

  div.status {
    height: 32px;
    width: 132px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${COLORS.crmRed};
    border-radius: 5px;
    margin: 0 auto;
    font-size: calc(50% + 0.8vmin);
    font-weight: 300;
    color: white;
  }

  div.td-menu {
    color: ${COLORS.grey1};
    cursor: pointer;

    div.dropdown-container {
      position: absolute;
      z-index: 2;
      div.option {
        width: 120px;
        font-size: calc(80%+0.8vmin);
        border: 1px solid ${COLORS.crmButtonGrey};
        height: 37px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: white;
        cursor: pointer;
        font-size: calc(40% + 0.8vmin);
        color: ${COLORS.primary};

        &:hover {
          background-color: ${COLORS.crmButtonGrey};
        }

        &:active {
          background-color: ${COLORS.crmButtonGrey};
        }
      }
    }
  }
`;
