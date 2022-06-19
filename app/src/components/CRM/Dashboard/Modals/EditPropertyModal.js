import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";

import { AuthContext } from "../../../../contexts/AuthContext";
import { COLORS } from "../../../../constants";
import { Loader } from "../../Loader";

import { validatePostalCode } from "../../utils/validatePostalCode";

import plusSign from "../../../../assets/SVGs/plus-blue.svg";

export const EditPropertyModal = ({ modal, setModal }) => {
  const { projectData } = useContext(AuthContext);

  const [loading, setLoading] = useState("idle");
  const [userSelect, setUserSelect] = useState(null);

  const [property, setProperty] = useState({
    fullAddress: "",
    streetNumber: "",
    streetName: "",
    streetPrefix: "",
    // apt: null,
    city: "",
    province: "",
    country: "Canada",
    postalCode: "",
    price: "",
    projectName: "",
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

  // EDIT PROPERTY IN THE DB
  const editProperty = async () => {
    // change this guard clause
    if (!validatePostalCode(property.postalCode.split(" ").join("")))
      return setLoading("postalCode");

    setLoading("sending");

    const res = await fetch("/api/projects/editProject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...property,
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

  // UPDATE PROPERTY STATE ON PROPERTY SELECT CHANGE
  useEffect(() => {
    if (userSelect === null)
      setProperty({
        ...Object.keys(property).reduce((acc, p) => {
          return { ...acc, [p]: "" };
        }, {}),
      });
    if (userSelect !== null)
      setProperty({
        ...userSelect,
      });
  }, [userSelect]);

  // KEEP FULL ADDRESS UP TO DATE
  useEffect(() => {
    setProperty({
      ...property,
      fullAddress: `${property.streetNumber} ${property.streetPrefix} ${
        property.streetName
      }${property?.apt?.length > 0 ? ` #${property.apt}` : ``}, ${
        property.city
      } ${"QC"} ${property.postalCode}`,
    });
  }, [
    property.streetName,
    property.streetNumber,
    property.streetPrefix,
    property.city,
    property.province,
    property.postalCode,
    property.apt,
  ]);

  return (
    <Wrapper>
      <FormContainer
        onSubmit={(e) => {
          e.preventDefault();
          editProperty();
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
        <h1 className="modal-title">{`Modifier`}</h1>

        <div className="input-row">
          <label className="form-label" htmlFor="unit">
            <span>Choisis un Project: </span>
            <select
              className="form-select unit"
              name="unit"
              onChange={(e) => {
                if (e.target.value === "") return setUserSelect(null);
                setUserSelect({
                  ...projectData.find((p) => p.id === e.target.value),
                });
              }}
            >
              <option value="">Choisir</option>
              {projectData.map((p) => {
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
          <label className="form-label" htmlFor="number">
            <span>Numéro</span>
            <input
              className="number"
              type="input"
              value={userSelect === null ? "" : property.streetNumber}
              name="number"
              tabIndex={0}
              required
              disabled={userSelect === null}
              onChange={(e) =>
                setProperty({
                  ...property,
                  streetNumber: e.target.value,
                })
              }
            ></input>
          </label>

          <label className="form-label" htmlFor="type">
            <span>Type</span>
            <select
              className="form-select"
              value={userSelect === null ? "" : property.streetPrefix}
              name="type"
              required
              disabled={userSelect === null}
              onChange={(e) =>
                setProperty({
                  ...property,
                  streetPrefix: e.target.value !== "" ? e.target.value : null,
                })
              }
            >
              <option value="">{userSelect ? "Choisir" : ""}</option>
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
              value={userSelect === null ? "" : property.streetName}
              name="name"
              required
              disabled={userSelect === null}
              onChange={(e) =>
                setProperty({
                  ...property,
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
              value={property?.apt ? property.apt : ""}
              disabled={userSelect === null}
              onChange={(e) => {
                if (e.target.value)
                  return setProperty({
                    ...property,
                    apt: e.target.value.toUpperCase(),
                  });
                let tempObj = property;
                delete tempObj?.apt;
                setProperty({
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
              value={userSelect === null ? "" : property.city}
              name="city"
              required
              disabled={userSelect === null}
              onChange={(e) =>
                setProperty({
                  ...property,
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
              value={userSelect === null ? "" : property.province}
              required
              disabled={userSelect === null}
              onChange={(e) =>
                setProperty({
                  ...property,
                  province: e.target.value,
                })
              }
            >
              <option value="">{userSelect ? "Choisir" : ""}</option>
              {provinces.map((t) => {
                return (
                  <option key={t} value={t}>
                    {t}
                  </option>
                );
              })}
            </select>
          </label>

          <label className="form-label" htmlFor="postalcode">
            <span>Code Postal</span>
            <input
              className="number"
              type="input"
              name="postalcode"
              value={userSelect === null ? "" : property.postalCode}
              required
              disabled={userSelect === null}
              onChange={(e) =>
                setProperty({
                  ...property,
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
              value={userSelect === null ? "" : property.projectName}
              required
              disabled={userSelect === null}
              onChange={(e) =>
                setProperty({
                  ...property,
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
              value={userSelect === null ? "" : property.price}
              required
              disabled={userSelect === null}
              onChange={(e) =>
                setProperty({
                  ...property,
                  price: e.target.value,
                })
              }
            ></input>
          </label>
        </div>

        <div className="input-row">
          <label className="form-label" htmlFor="fullAddress">
            <span>Adresse Complète</span>
            <input
              className="street fullAddress"
              type="input"
              value={userSelect === null ? "" : property.fullAddress}
              name="fullAddress"
              required
              disabled={userSelect === null}
              onChange={(e) =>
                setProperty({
                  ...property,
                  fullAddress: e.target.value,
                })
              }
            ></input>
          </label>
        </div>

        {loading === "idle" && (
          <div className="buttons">
            <input
              type="submit"
              className="modal-yes"
              value="Confirmer"
              disabled={userSelect === null}
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
        {loading === "postalCode" && (
          <p className="modal-message">Code Postal Invalid</p>
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
  height: 460px;
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
