import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";

import { AuthContext } from "../../../../contexts/AuthContext";

import { COLORS } from "../../../../constants";
import { french } from "../../utils/frenchTranslations";

import userDefault from "../../../../assets/SVGs/user-profile-default.svg";

export const TenantIssueRow = ({ i, mapIndex, modal, setModal }) => {
  const { data } = useContext(AuthContext);
  const [dropdown, setDropdown] = useState(false);
  const statuses = ["Resolved", "Unresolved", "Rejected"];

  return (
    <Row className="notification-block" key={mapIndex}>
      <div className="td">
        <div className="td_user">
          <img id="avatar" src={userDefault} alt="user-icon" />
          <p>{data.firstName}</p>
        </div>
      </div>

      <div className="td">{i.subject}</div>

      <div className="td">
        <div
          className="status"
          style={{
            backgroundColor:
              i.status === "Resolved"
                ? `${COLORS.crmGreen}`
                : `${COLORS.crmRed}`,
          }}
        >
          <span>{french[i.status]}</span>
        </div>
      </div>

      <div className="td">
        <div className="td-date">
          <h1>{i.date.modified}</h1>
          <p>{i.date.created}</p>
        </div>
      </div>

      <div className="td">
        <div className="td-menu" onClick={() => setDropdown(!dropdown)}>
          <span>● ● ●</span>
          {dropdown && (
            <div className="dropdown-container">
              {statuses.map((s, index) => {
                return (
                  <div
                    key={index}
                    className="option"
                    onMouseDown={() => {
                      setModal({ isActive: true, newStatus: s, ...i });
                      setDropdown(false);
                    }}
                  >
                    {french[s]}
                  </div>
                );
              })}
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
    width: calc(20%);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  div.td_user {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-weight: 300;

    img#avatar {
      height: 31px;
      width: 31px;
      margin-bottom: 3px;
    }

    p {
      font-size: 11px;
      color: ${COLORS.primary};
    }
  }

  div.td-date {
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
