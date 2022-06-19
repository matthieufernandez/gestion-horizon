import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { Loader } from "../../Loader";

import { COLORS } from "../../../../constants";

export const IssueAndReductionModal = ({ modal, setModal }) => {
  const [loading, setLoading] = useState("idle");
  const [reduction, setReduction] = useState({
    isActive: false,
    amount: null,
  });

  // handle if no amount is entered
  // handle turning amount to null if active is turned off

  // send request to back end
  const resolveIssue = async () => {
    setLoading("sending");

    // intiate json variable
    let json;

    // handle amount entered -- resolve and adjust
    if (
      Number(reduction.amount) > 0 &&
      Number(reduction.amount) !== NaN &&
      reduction.amount !== null
    ) {
      const res = await fetch(`/api/projects/adjustAndResolve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unitId: modal.unitId,
          unixId: modal.unixId,
          amount: Number(reduction.amount),
        }),
      });
      json = await res.json();
    }

    // HANDLE NO AMOUNT ENTERED -- change issue to resolved
    // this also works if the input is just "."
    // this is because the numerical value (forced by input[type:number] tag) is null, despite turning it into a string
    // sending ".95" will work and apply the reduction of $0.95
    if (reduction.amount === null) {
      const res = await fetch(`/api/projects/updateIssue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unitId: modal.unitId,
          unixId: modal.unixId,
          status: "Resolved",
        }),
      });
      json = await res.json();
    }

    // if for whatever reason an input is given that is not null or a number, break out
    if (Number(reduction.amount) === NaN && reduction.amount !== null) {
      setLoading("error");
      return setTimeout(window.location.reload(), 1000);
    }

    // log error message from back end
    if (json.status.toString().charAt(0) === "4") {
      console.log({
        status: json?.status,
        message: json?.message,
        error: json?.error,
      });
      return setLoading("error");
    }

    // set loading state to complete to force refresh
    return setLoading("complete");
  };

  useEffect(() => {
    // render result message and refresh in 1 second
    if (loading === "complete" || loading === "error")
      setTimeout(window.location.reload(), 1000);
  }, [loading]);

  useEffect(() => {
    // set amount to null if they uncheck "amount" box
    if (reduction.isActive === false)
      setReduction({ ...reduction, amount: null });
  }, [reduction.isActive]);

  return (
    <Wrapper>
      <ConfirmationContainer>
        <p>{`Change to Resolved?`}</p>
        <div className="reduction-select">
          <label>
            Adjustment?
            <input
              id="check"
              type="checkbox"
              checked={reduction.isActive ? "checked" : ""}
              onChange={() => {
                setReduction({
                  ...reduction,
                  isActive: !reduction.isActive,
                });
              }}
            ></input>
          </label>
          {reduction?.isActive === true && (
            <label id="number-label">
              Amount:
              <input
                id="number-input"
                type="number"
                min="0"
                onChange={(e) =>
                  setReduction({
                    ...reduction,
                    amount: e.target.value.length === 0 ? null : e.target.value,
                  })
                }
              ></input>
            </label>
          )}
        </div>
        {loading === "idle" && (
          <div className="buttons">
            <button className="modal-yes" onClick={resolveIssue}>
              Yes
            </button>
            <button
              className="modal-no"
              onClick={() => setModal({ isActive: false, status: null })}
            >
              No
            </button>
          </div>
        )}
        {loading === "sending" && <Loader height="30px" width="30px" />}
        {loading === "complete" && <p>Complete!</p>}
        {loading === "error" && <p>Something went wrong...</p>}
      </ConfirmationContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
`;

const ConfirmationContainer = styled.div`
  background-color: ${COLORS.backgroundGrey};
  border: 7px solid ${COLORS.crmButtonGrey};
  color: ${COLORS.primary};
  padding: 13px 27px;
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;

  height: 240px;
  width: 380px;
  box-shadow: ${COLORS.crmBoxShadow};
  border-radius: 5px;

  p {
    font-size: calc(120% + 0.5vmin);
    margin-top: 11px;
    margin-bottom: 23px;
    font-weight: 600;
  }

  div.reduction-select {
    width: 80%;
    height: 80px;

    label {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: left;
      font-size: calc(80% + 0.8vmin);

      // script to remove inc/dec buttons
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      input[type="number"] {
        -moz-appearance: textfield;
      }

      #number-input {
        width: 72px;
        font-size: calc(60% + 0.5vmin);
        text-align: right;
      }
    }

    #number-label {
      margin-top: 13px;
    }
  }

  div.buttons {
    width: 200px;
    display: flex;
    justify-content: space-between;
    button {
      padding: 7px 17px;
      border-radius: 5px;
      background-color: ${COLORS.crmButtonGrey};
      color: white;
    }
  }
`;
