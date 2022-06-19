import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { COLORS } from "../../../../constants";
import { Loader } from "../../Loader";

export const IssueModal = ({ modal, setModal }) => {
  const [loading, setLoading] = useState("idle");

  const editIssue = async () => {
    setLoading("sending");
    const res = await fetch(`/api/projects/updateIssue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        unitId: modal.unitId,
        unixId: modal.unixId,
        status: modal.newStatus,
      }),
    });
    const json = await res.json();

    if (json.status.toString().charAt(0) === "4") {
      console.log({
        status: json?.status,
        message: json?.message,
        error: json?.error,
      });
      return setLoading("error");
    }
    return setLoading("complete");
  };

  useEffect(() => {
    if (loading === "complete" || loading === "error")
      setTimeout(window.location.reload(), 1000);
  }, [loading]);

  return (
    <Wrapper>
      <ConfirmationContainer>
        <p>{`Change to ${modal.newStatus}?`}</p>
        {loading === "idle" && (
          <div className="buttons">
            <button className="modal-yes" onClick={editIssue}>
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
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.6);
`;

const ConfirmationContainer = styled.div`
  background-color: ${COLORS.backgroundGrey};
  border: 7px solid ${COLORS.crmButtonGrey};
  color: ${COLORS.primary};
  padding: 24px 63px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  height: 240px;
  width: 380px;
  box-shadow: ${COLORS.crmBoxShadow};
  border-radius: 5px;

  p {
    font-size: 24px;
    margin-top: 11px;
    margin-bottom: 23px;
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
