import React from "react";
import styled from "styled-components";

import { COLORS } from "../../../constants";

export const ConfirmationModal = ({ object, modal, setModal }) => {
  return (
    <Wrapper style={{ display: modal.active ? "block" : "none" }}>
      <ConfirmationContainer>
        {Object.keys(object).map((input) => {
          return <p key={input}>{`${input}: ${object[input]}`}</p>;
        })}
        <div className="buttons">
          <button
            onClick={() =>
              setModal({
                active: false,
                accepted: true,
              })
            }
          >
            Accept
          </button>
          <button
            onClick={() =>
              setModal({
                ...modal,
                active: false,
              })
            }
          >
            Decline
          </button>
        </div>
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
  z-index: 9999999999;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 120px 46px 320px 46px;
`;

const ConfirmationContainer = styled.div`
  background-color: ${COLORS.primary};
  border: 2px solid black;
  padding: 24px 63px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  color: white;

  p {
    font-size: 24px;
    margin-top: 11px;
  }

  div.buttons {
    width: 200px;
    margin-top: 23px;
    button {
      margin: 7px;
    }
  }
`;
