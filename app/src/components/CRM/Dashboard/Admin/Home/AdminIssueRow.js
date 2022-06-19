import React, { useState } from "react";
import styled from "styled-components";

import { COLORS } from "../../../../../constants";
import { french } from "../../../utils/frenchTranslations";

import userDefault from "../../../../../assets/SVGs/user-profile-default.svg";
import closeArrow from "../../../../../assets/SVGs/Arrow-right-grey1.svg";

export const AdminIssueRow = ({ i, mapIndex, setModal }) => {
  const [dropdown, setDropdown] = useState(false);
  const statuses = ["Resolved", "Unresolved", "Rejected"];

  return (
    <Row className="notification-block" key={mapIndex}>
      <div
        className="row-container"
        style={{ borderBottom: dropdown && "none" }}
      >
        <div className="td">
          <div className="td_user">
            <img id="avatar" src={userDefault} alt="user-icon" />
            <p>{i.tenantName}</p>
          </div>
        </div>

        <div className="td td-subject">{i.subject}</div>

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
          <div className="td-date-time">
            <h1>{i.created.day}</h1>
            <p>{i.created.time}</p>
          </div>
        </div>

        <div className="td">
          <div className="td-date-time">
            <h1>{i.modified.day}</h1>
            <p>{i.modified.time}</p>
          </div>
        </div>

        <div className="td">
          <div className="td-menu" onClick={() => setDropdown(!dropdown)}>
            {dropdown === false ? (
              <span>● ● ●</span>
            ) : (
              <img id="menu-close" src={closeArrow} alt="close the menu" />
            )}
          </div>
        </div>
      </div>

      {dropdown && (
        <div className="expansion-container">
          <div className="expansion-details">
            {/* <p>{i.details}</p> */}

            <p>{i.details}</p>
          </div>
          <div className="expansion-options">
            {statuses.map((s) => {
              return (
                <button
                  key={s}
                  className="expansion-option-item"
                  onClick={() => {
                    setModal({
                      isActive: true,
                      type: "Issue",
                      newStatus: s,
                      ...i,
                    });
                  }}
                >
                  <span>{french[s]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </Row>
  );
};

const Row = styled.div`
  width: 100%;
  display: flex;
  color: ${COLORS.primary};
  position: relative;
  flex-direction: column;

  div.row-container {
    display: flex;
    height: 72px;
    width: 100%;
    border-bottom: 1px solid ${COLORS.grey1};
    padding: 0;
  }

  div.td {
    width: calc(100% / 6);
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

  div.td-date-time {
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

  div.td-subject {
    font-weight: 300;
    font-size: calc(90% + 0.8vmin);
    color: ${COLORS.bluegrey};
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

    img#menu-close {
      width: 23px;
      height: 31.9px;
      transform: rotate(270deg);
      font-weight: 600;
    }

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

  div.expansion-container {
    display: static;
    width: 100%;
    display: flex;
    flex-direction: row;
    padding: 0;
    border-bottom: 1px solid ${COLORS.grey1};
    padding: 5px 0 11px 0;

    div.expansion-details {
      width: calc((100% / 6 * 5));
      color: ${COLORS.bluegrey};
      font-weight: 300;
      padding-left: 17%;
      padding-right: 17px;
    }

    div.expansion-options {
      width: calc(100% / 6);
      display: flex;
      flex-direction: column;
      align-items: center;
      color: ${COLORS.bluegrey};
      justify-content: flex-start;

      button.expansion-option-item {
        font-size: calc(60% + 0.8vmin);
        color: ${COLORS.bluegrey};
        border: none;
        background-color: white;
        width: 112px;

        display: flex;
        justify-content: center;
        align-items: center;

        margin-bottom: 7px;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;
