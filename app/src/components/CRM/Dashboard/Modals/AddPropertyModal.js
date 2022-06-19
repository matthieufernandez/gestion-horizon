import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { COLORS } from "../../../../constants";
import { Loader } from "../../Loader";

import { validatePostalCode } from "../../utils/validatePostalCode";

import plusSign from "../../../../assets/SVGs/plus.svg";

export const AddPropertyModal = ({ modal, setModal }) => {
  const [loading, setLoading] = useState("idle");

  const [newProperty, setNewProperty] = useState({
    streetNumber: null,
    streetName: null,
    streetPrefix: null,
    // apt: null,
    city: null,
    province: null,
    country: "Canada",
    postalCode: null,
    price: null,
    projectName: null,
  });

  const roadTypes = ["Rue", "Boulevard", "Avenue", "Promenade"];
  const provinces = [
    "Québec",
    "Ontario",
    "Nouveau-Brunswick",
    "Colombie-Britanique",
    "Alberta",
    "Saskatchewan",
    "Manitoba",
    "Nouvelle-Écosse",
    "Î-P-E",
  ];

  const addProperty = async () => {
    // guard clause checking for bad postal code
    if (!validatePostalCode(newProperty.postalCode.split(" ").join("")))
      return setLoading("postalCode");

    setLoading("sending");

    const res = await fetch("/api/projects/createProject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...newProperty,
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

  // HANDLE LOADING STAUSES
  useEffect(() => {
    if (loading === "complete" || loading === "error")
      setTimeout(() => window.location.reload(), 1000);
    if (loading === "postalCode") setTimeout(() => setLoading("idle"), 2000);
  }, [loading]);

  // KEEP FULL ADDRESS UP TO DATE
  useEffect(() => {
    setNewProperty({
      ...newProperty,
      fullAddress: `${newProperty.streetNumber} ${newProperty.streetPrefix} ${
        newProperty.streetName
      }${newProperty.apt ? ` #${newProperty.apt}` : ``}, ${
        newProperty.city
      } ${"QC"} ${newProperty.postalCode}`,
    });
  }, [
    newProperty.streetName,
    newProperty.streetNumber,
    newProperty.streetPrefix,
    newProperty.city,
    newProperty.province,
    newProperty.postalCode,
  ]);

  return (
    <Wrapper>
      <FormContainer
        onSubmit={(e) => {
          e.preventDefault();
          addProperty();
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
        <h1 className="modal-title">{`Ajouter`}</h1>

        <div className="input-row">
          <label className="form-label" htmlFor="number">
            <span>Numéro</span>
            <input
              className="number"
              type="input"
              name="number"
              required
              tabIndex={0}
              onChange={(e) =>
                setNewProperty({
                  ...newProperty,
                  streetNumber: e.target.value,
                })
              }
            ></input>
          </label>

          <label className="form-label" htmlFor="type">
            <span>Type</span>
            <select
              className="form-select"
              name="type"
              required
              onChange={(e) =>
                setNewProperty({
                  ...newProperty,
                  streetPrefix: e.target.value !== "" ? e.target.value : null,
                })
              }
            >
              <option value="">Choisir</option>
              {roadTypes.map((t) => {
                return (
                  <option key={t} value={t}>
                    {t}
                  </option>
                );
              })}
            </select>
          </label>

          <label className="form-label" htmlFor="name">
            <span>Rue</span>
            <input
              className="street"
              type="input"
              name="name"
              required
              onChange={(e) =>
                setNewProperty({
                  ...newProperty,
                  streetName: e.target.value,
                })
              }
            ></input>
          </label>

          <label className="form-label" htmlFor="apt">
            <span>Apt.</span>
            <input
              className="number"
              type="input"
              name="apt"
              onChange={(e) => {
                if (e.target.value)
                  return setNewProperty({
                    ...newProperty,
                    apt: e.target.value.toUpperCase(),
                  });
                let tempObj = newProperty;
                delete tempObj?.apt;
                setNewProperty({
                  ...tempObj,
                });
              }}
            ></input>
          </label>
        </div>

        <div className="input-row">
          <label className="form-label" htmlFor="city">
            <span>Ville</span>
            <input
              className="street"
              type="input"
              name="city"
              required
              onChange={(e) =>
                setNewProperty({
                  ...newProperty,
                  city: e.target.value,
                })
              }
            ></input>
          </label>

          <label className="form-label" htmlFor="province">
            <span>Province</span>
            <select
              className="form-select"
              name="province"
              required
              onChange={(e) =>
                setNewProperty({
                  ...newProperty,
                  province: e.target.value,
                })
              }
            >
              <option value="">Choisir</option>
              {provinces.map((t) => {
                return (
                  <option key={t} value={t}>
                    {t}
                  </option>
                );
              })}
            </select>
          </label>

          <label className="form-label" htmlFor="postalCode">
            <span>Code Postal</span>
            <input
              className="number"
              type="input"
              name="postalCode"
              required
              onChange={(e) =>
                setNewProperty({
                  ...newProperty,
                  postalCode: e.target.value.toUpperCase(),
                })
              }
            ></input>
          </label>
        </div>

        <div className="input-row">
          <label className="form-label" htmlFor="projectName">
            <span>Nom du Project</span>
            <input
              className="street"
              type="text"
              name="projectName"
              required
              onChange={(e) =>
                setNewProperty({
                  ...newProperty,
                  projectName: e.target.value,
                })
              }
            ></input>
          </label>
          <label className="form-label" htmlFor="price">
            <span>Prix</span>
            <input
              className="number"
              type="number"
              name="price"
              required
              onChange={(e) =>
                setNewProperty({
                  ...newProperty,
                  price: e.target.value,
                })
              }
            ></input>
          </label>
        </div>

        {loading === "idle" && (
          <div className="buttons">
            <input type="submit" className="modal-yes" value="Confirmer" />

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
        {loading === "postalCode" && (
          <p className="modal-message">Code Postal Invalid - Format: A1A 1A1</p>
        )}
        {loading === "sending" && <Loader height="30px" width="30px" />}
        {loading === "complete" && <p className="modal-message">Terminé!</p>}
        {loading === "error" && (
          <p className="modal-message">Something went wrong...</p>
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

const FormContainer = styled.form`
  position: relative;
  margin: 0 auto;
  height: 320px;
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
    }

    input.number {
      width: 63px;
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
      border: none;
      color: white;
      border: 1px solid white;

      &:hover {
        background-color: white;
        color: ${COLORS.bluegrey};
        border: 1px solid ${COLORS.bluegrey};
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
      }
    }
  }
`;
