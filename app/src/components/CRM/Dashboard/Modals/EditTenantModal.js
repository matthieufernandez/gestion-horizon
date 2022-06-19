import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { COLORS } from "../../../../constants";
import { Loader } from "../../Loader";

import plusSign from "../../../../assets/SVGs/plus-blue.svg";

export const EditTenantModal = ({ modal, setModal }) => {
  const [loading, setLoading] = useState("idle");
  const [allUsers, setAllUsers] = useState(null);
  const [userSelect, setUserSelect] = useState(null);

  const [userEdit, setUserEdit] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });

  const getAllUsers = async () => {
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

    setAllUsers(json.data);
    return setLoading("idle");
  };

  const submitEdit = async () => {
    setLoading("sending");

    // update user object and unit's user object in the db
    const res = await fetch("/api/users/editTenant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userEdit,
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

  // SET SELECTED ITEM TO STATE
  useEffect(() => {
    if (userSelect) {
      setUserEdit({ ...userSelect });
    }
  }, [userSelect]);

  // GET ALL USERS IN DB WHEN MODAL OPENS
  useEffect(() => {
    if (allUsers === null) {
      setLoading("loading");
      getAllUsers();
    }
  }, [allUsers]);

  // RELOAD PAGE AFTER PROCESS CONCLUDES
  useEffect(() => {
    if (loading === "complete" || loading === "error")
      setTimeout(window.location.reload(), 1000);
  }, [loading]);

  return (
    <Wrapper>
      <FormContainer
        onSubmit={(e) => {
          e.preventDefault();
          submitEdit();
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

        {allUsers !== null ? (
          <>
            <div className="input-row">
              <label className="form-label" htmlFor="unit">
                <span>Choisis une Personne: </span>
                <select
                  className="form-select user"
                  name="unit"
                  onChange={(e) => {
                    if (e.target.value === "") return setUserSelect(null);
                    setUserSelect({
                      ...allUsers.find((p) => p.id === e.target.value),
                    });
                  }}
                >
                  <option value="">Choisir</option>
                  {allUsers.map((p) => {
                    return (
                      <option key={p.email} value={p.id}>
                        {`${p.firstName} ${p.lastName}`}
                      </option>
                    );
                  })}
                </select>
              </label>
            </div>

            <div className="input-row">
              <label className="form-label" htmlFor="name">
                <span>Prénom</span>
                <input
                  className="street name"
                  type="input"
                  name="name"
                  value={userSelect === null ? "" : userEdit.firstName}
                  required
                  disabled={userSelect === null}
                  onChange={(e) =>
                    setUserEdit({
                      ...userEdit,
                      firstName: e.target.value,
                    })
                  }
                ></input>
              </label>

              <label className="form-label" htmlFor="name">
                <span>Nom de Famille</span>
                <input
                  className="street name"
                  type="input"
                  name="name"
                  value={userSelect === null ? "" : userEdit.lastName}
                  required
                  disabled={userSelect === null}
                  onChange={(e) =>
                    setUserEdit({
                      ...userEdit,
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
                  value={userSelect === null ? "" : userEdit.email}
                  required
                  disabled
                  onChange={(e) =>
                    setUserEdit({
                      ...userEdit,
                      email: e.target.value,
                    })
                  }
                ></input>
              </label>

              <label className="form-label" htmlFor="name">
                <span>Téléphone</span>
                <input
                  className="number phone"
                  type="text"
                  name="name"
                  value={userSelect === null ? "" : userEdit.phoneNumber}
                  required
                  disabled={userSelect === null}
                  onChange={(e) =>
                    setUserEdit({
                      ...userEdit,
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
                  disabled={Object.keys(userEdit).some(
                    (k) => userEdit[k] === ""
                  )}
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

const FormContainer = styled.form`
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
      width: 320px;

      &:hover {
        cursor: pointer;
      }
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
`;
