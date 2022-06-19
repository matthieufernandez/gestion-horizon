import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";

import { AuthContext } from "../../../../contexts/AuthContext";

import { COLORS } from "../../../../constants";
import { Loader } from "../../Loader";

import plusSign from "../../../../assets/SVGs/plus-blue.svg";

export const RemoveLeaseeModal = ({ modal, setModal }) => {
  const { projectData } = useContext(AuthContext);

  const [loading, setLoading] = useState("idle");
  const [allOccUnits, setAllOccUnits] = useState(null);
  const [userSelect, setUserSelect] = useState(null);

  console.log(allOccUnits);

  // POPULATE STATE WITH OCCUPIED UNITS
  const getOccupiedUnits = () => {
    return setAllOccUnits(projectData.filter((p) => p?.tenant));
  };

  // GET OCCUPIED UNITS FROM CONTEXT WHEN MODAL OPENS
  useEffect(() => {
    if (allOccUnits === null) {
      setLoading("loading");
      getOccupiedUnits();
    }
  }, [allOccUnits]);

  // RELOAD PAGE AFTER PROCESS CONCLUDES
  useEffect(() => {
    if (loading === "complete" || loading === "error")
      setTimeout(window.location.reload(), 1000);
  }, [loading]);

  return (
    <Wrapper>
      <FormContainer>
        <button
          className="exit"
          onClick={() => {
            setModal({
              isActive: false,
              type: null,
            });
          }}
        >
          <img src={plusSign} alt="close the frame" />
        </button>
        <h1 className="modal-title">{`Relocaliser un Locataire`}</h1>

        {allOccUnits !== null ? (
          <>
            {loading === "idle" && (
              <div className="buttons">
                <input
                  type="submit"
                  className="modal-yes"
                  value="Confirmer"
                  disabled={true}
                />

                <button
                  className="modal-no"
                  onClick={() => {
                    setModal({ ...modal, isActive: false, type: null });
                  }}
                >
                  Retourner
                </button>
              </div>
            )}
            {loading === "sending" && (
              <div className="bottom-update">
                <Loader height="30px" width="30px" />
              </div>
            )}
            {loading === "complete" && (
              <div className="bottom-update">
                <p>Complete!</p>
              </div>
            )}
            {loading === "error" && (
              <div className="bottom-update">
                <p>Something went wrong...</p>{" "}
              </div>
            )}
          </>
        ) : (
          <div className="first-loader-container">
            <Loader height="140px" width="140px" />
          </div>
        )}
      </FormContainer>
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

const FormContainer = styled.div`
  position: relative;
  margin: 0 auto;
  height: 320px;
  width: 530px;

  background-color: white;
  box-shadow: ${COLORS.crmBoxShadow};
  border-radius: 5px;

  text-align: center;

  display: flex;
  flex-direction: column;
  align-items: center;

  h1.modal-title {
    font-weight: 400;
    font-size: 16px;
    margin-top: 11px;
    margin-bottom: 7px;
    margin-bottom: 23px;
  }

  div.first-loader-container {
    margin-top: 42px;
  }

  div.bottom-update {
    width: 100%;
    margin-top: 11px;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  button.exit {
    position: absolute;
    top: 11px;
    right: 11px;
    border: none;
    background-color: transparent;

    img {
      height: 18px;
      width: 18px;
      transform: rotate(45deg);
    }
  }

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
