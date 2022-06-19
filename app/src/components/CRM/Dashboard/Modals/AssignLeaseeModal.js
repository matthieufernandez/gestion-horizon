import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";

import { AuthContext } from "../../../../contexts/AuthContext";
import { Loader } from "../../Loader";

import { COLORS } from "../../../../constants";

import plusSign from "../../../../assets/SVGs/plus-blue.svg";

export const AssignLeaseeModal = ({ modal, setModal }) => {
  const { projectData } = useContext(AuthContext);

  const [loading, setLoading] = useState("idle");

  const [vacantUnits, setVacantUnits] = useState(null);
  const [unassignedTenants, setUnassignedTenants] = useState(null);

  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedTenant, setSelectedTenant] = useState(null);

  console.log({
    vacantUnits,
    unassignedTenants,
    selectedUnit,
    selectedTenant,
  });

  const getVacantUnits = () => {
    // FILTER UNITS WITH NO TENANTS
    return setVacantUnits(() => projectData.filter((p) => !p?.tenant));
  };

  const getUnassignedTenants = async () => {
    // FIND DB USERS WITHOUT A UNIT AND NOT ADMIN
    const res = await fetch("/api/users/getAllUsers");
    const json = await res.json();

    if (json.status.toString().charAt(0) === "4") {
      console.log({
        status: json?.status,
        message: json?.message,
        error: json?.error,
      });
      return setLoading("error");
    }

    const filteredData = json.data.filter((u) => !u?.unit?.id && !u?.isAdmin);

    setUnassignedTenants(filteredData);
    return setLoading("idle");
  };

  const assignTenantSubmit = async () => {
    // ***** NEEDS TESTING ****** AND ENDPOINT FOR REMOVING
    // UPDATE BOTH THE UNIT AND USER IN DB
    const res = await fetch("/api/projects/assignTenant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        unit: { ...selectedUnit },
        tenant: {
          id: selectedTenant.id,
          name: `${selectedTenant.firstName} ${selectedTenant.lastName}`,
        },
      }),
    });
    const json = await res.json();

    // log error message from back end if needed
    if (json.status.toString().charAt(0) === "4") {
      console.log({
        status: json?.status,
        message: json?.message,
        error: json?.error,
      });
      return setLoading("error");
    }

    // set loading state to complete
    return setTimeout(() => setLoading("complete"), 2000);
  };

  useEffect(() => {
    // RELOAD PAGE WHEN PROCESS HAS ENDED
    if (loading === "complete" || loading === "error")
      setTimeout(window.location.reload(), 1000);
  }, [loading]);

  useEffect(() => {
    // GET DATA FOR DROPDOWNS
    if (vacantUnits === null) {
      setLoading("loading");
      getVacantUnits();
      getUnassignedTenants();
    }
  }, [vacantUnits]);

  return (
    <Wrapper>
      <FormContainer
        onSubmit={(e) => {
          e.preventDefault();
          assignTenantSubmit();
        }}
      >
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
        <h1 className="modal-title">{`Affecter un Locataire`}</h1>

        <div className="input-row">
          <label className="form-label" htmlFor="unit">
            <span>Choisis un Project: </span>
            <select
              className="form-select unit"
              name="unit"
              onChange={(e) => {
                if (e.target.value === "") {
                  setSelectedTenant(null);
                  return setSelectedUnit(null);
                }
                setSelectedUnit({
                  ...projectData.find((p) => p.id === e.target.value),
                });
              }}
            >
              <option value="">Choisir</option>

              {vacantUnits &&
                vacantUnits.map((p) => {
                  return (
                    <option key={p.id} value={p.id}>
                      {p.fullAddress}
                    </option>
                  );
                })}
            </select>
          </label>
        </div>

        <div className="input-row">
          <label className="form-label" htmlFor="province">
            <span>Locataire</span>
            <select
              className="form-select name"
              name="province"
              value={selectedTenant === null ? "" : selectedTenant.id}
              required
              disabled={selectedUnit === null}
              onChange={(e) => {
                if (e.target.value === "") return setSelectedTenant(null);
                setSelectedTenant({
                  ...unassignedTenants.find((t) => t.id === e.target.value),
                });
              }}
            >
              <option value="">{selectedUnit ? "Choisir" : ""}</option>
              {unassignedTenants &&
                unassignedTenants.map((t) => {
                  return (
                    <option key={t.id} value={t.id}>
                      {`${t.firstName} ${t.lastName}`}
                    </option>
                  );
                })}
            </select>
          </label>
        </div>

        {loading === "idle" && (
          <div className="buttons">
            <input
              type="submit"
              className="modal-yes"
              value="Confirmer"
              disabled={selectedUnit === null}
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
        {loading === "sending" && <Loader height="30px" width="30px" />}
        {loading === "complete" && <p>Complete!</p>}
        {loading === "error" && <p>Something went wrong...</p>}
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

const FormContainer = styled.form`
  position: relative;
  margin: 0 auto;
  height: 260px;
  width: 720px;

  background-color: white;
  box-shadow: ${COLORS.crmBoxShadow};
  border-radius: 5px;

  text-align: center;

  display: flex;
  flex-direction: column;
  align-items: center;

  div.input-row {
    width: 80%;
    display: flex;
    justify-content: flex-start;

    margin-bottom: 9px;
  }

  h1.modal-title {
    font-weight: 400;
    font-size: 16px;
    margin-top: 11px;
    margin-bottom: 7px;
    margin-bottom: 23px;
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

  label.form-label {
    display: flex;
    flex-direction: column;

    margin-right: 27px;

    span {
      text-align: left;
      margin-bottom: 7px;
      color: ${COLORS.bluegrey};
      font-size: 13px;
      font-weight: 500;
      padding-left: 4px;
    }

    input {
      background-color: ${COLORS.formInputGrey};
      border: none;
      border-radius: 5px;
      padding: 5px;
      font-size: 14px;
      color: ${COLORS.primary};
      font-weight: 300;

      &:focus {
        outline: none;
      }

      &:disabled {
        cursor: not-allowed;
        background-color: ${COLORS.grey2};
      }
    }

    input.number {
      width: 68px;
    }

    input.fullAddress {
      width: 530px;
    }

    select {
      background-color: ${COLORS.formInputGrey};
      border: none;
      border-radius: 5px;
      padding: 5px;
      font-size: 14px;
      color: ${COLORS.primary};
      font-weight: 300;
      width: 110px;

      &:disabled {
        cursor: not-allowed;
        background-color: ${COLORS.grey2};
      }
    }

    select.unit {
      width: 530px;
    }

    select.name {
      width: 300px;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    input[type="number"] {
      -moz-appearance: textfield;
    }
  }

  p.modal-message {
    margin-top: 17px;
    color: ${COLORS.bluegrey};
    font-weight: 500;
  }

  div.buttons {
    width: 280px;
    display: flex;
    justify-content: space-between;
    margin-top: 7px;

    input[type="submit"] {
      padding: 9px 23px;
      border-radius: 5px;
      background-color: ${COLORS.bluegrey};
      color: white;
      border: 1px solid white;

      &:hover {
        background-color: white;
        color: ${COLORS.bluegrey};
        border: 1px solid ${COLORS.bluegrey};
      }

      &:disabled {
        cursor: not-allowed;

        &:hover {
          background-color: ${COLORS.bluegrey};
          color: white;
          border: 1px solid white;
        }
      }
    }

    button {
      padding: 9px 23px;
      border-radius: 5px;
      background-color: ${COLORS.bluegrey};
      border: none;
      color: white;
      border: 1px solid white;

      &:hover {
        background-color: white;
        color: ${COLORS.bluegrey};
        border: 1px solid ${COLORS.bluegrey};
        cursor: pointer;
      }
    }
  }
`;
