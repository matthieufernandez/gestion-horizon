import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { COLORS } from "../../../../constants";
import { Loader } from "../../Loader";

import plusSign from "../../../../assets/SVGs/plus-blue.svg";

export const AddTenantModal = ({ modal, setModal }) => {
  const [loading, setLoading] = useState("idle");

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });

  // ADD NEW USER TO DB
  const addTenantToBackEnd = async () => {
    setLoading("sending");
    try {
      //////////////////////////////////////////////////////
      // ADD USER TO DB/ CHECK IF EXISTING
      const resDB = await fetch(`/api/auth/createUser/${newUser.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          ...newUser,
          isAdmin: false,
        }),
      });
      const jsonDB = await resDB.json();

      // break if existing
      if (jsonDB.status.toString().charAt(0) === "4") {
        console.log({
          status: jsonDB?.status,
          error: jsonDB?.error,
        });
        return setLoading("exists");
      }

      //////////////////////////////////////////////////////
      // ADD USER TO AUTH
      const resAuth = await fetch(`/api/users/addAuthUser`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          email: newUser.email,
        }),
      });
      const jsonAuth = await resAuth.json();

      // break if 400 code
      if (jsonDB.status.toString().charAt(0) === "4") {
        console.log(jsonAuth);
        return setLoading("error");
      }

      //////////////////////////////////////////////////////
      // RESET USER'S PASSWORD
      const resPW = await fetch(`/api/users/password-reset/${newUser.email}`);
      const jsonPW = await resPW.json();

      // break if 400 code
      if (jsonPW.status.toString().charAt(0) === "4") {
        console.log(jsonPW);
        return setLoading("error");
      }

      //////////////////////////////////////////////////////
      // ADVISE IS COMPLETED AND REFRESH
      setLoading("complete");
    } catch (e) {
      console.log(e);
      setLoading("error");
    }
  };

  useEffect(() => {
    if (loading === "exists") setTimeout(() => setLoading("idle"), 1000);
    if (loading === "complete" || loading === "error")
      setTimeout(() => window.location.reload(), 1000);
  }, [loading]);

  return (
    <Wrapper>
      <FormContainer
        onSubmit={(e) => {
          e.preventDefault();
          addTenantToBackEnd();
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
          <label className="form-label" htmlFor="firstName">
            <span>Prénom</span>
            <input
              className="street name"
              type="input"
              name="firstName"
              required
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  firstName: e.target.value,
                })
              }
            ></input>
          </label>

          <label className="form-label" htmlFor="lastName">
            <span>Nom de Famille</span>
            <input
              className="street name"
              type="input"
              name="lastName"
              required
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  lastName: e.target.value,
                })
              }
            ></input>
          </label>
        </div>

        <div className="input-row">
          <label className="form-label" htmlFor="name">
            <span>Courriel</span>
            <input
              className="street email"
              type="input"
              name="name"
              required
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  email: e.target.value,
                })
              }
            ></input>
          </label>

          <label className="form-label" htmlFor="name">
            <span>Téléphone</span>
            <input
              className="number phone"
              type="number"
              name="name"
              required
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  phoneNumber: e.target.value,
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
              disabled={!Object.keys(newUser).every((k) => newUser[k] !== "")}
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
        {loading === "exists" && (
          <div className="bottom-update">
            <p>This user already exists.</p>{" "}
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

const FormContainer = styled.form`
  position: relative;
  margin: 0 auto;
  height: 250px;
  width: 530px;

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

    input.phone {
      width: 120px;
    }

    input.name {
      width: 200px;
    }

    input.email {
      width: 260px;
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

  div.bottom-update {
    width: 100%;
    margin-top: 11px;

    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
