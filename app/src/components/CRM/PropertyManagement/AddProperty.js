import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { ConfirmationModal } from "./ConfirmationModal";
import { provinces } from "../../../data/provinces";

export const AddProperty = () => {
  const [newProperty, setNewProperty] = useState({
    projectName: null,
    fullAddress: null,
    streetNumber: null,
    streetName: null,
    streetPrefix: null,
    apt: null,
    city: null,
    province: null,
    country: "Canada",
    postalCode: null,
    size: null,
    price: null,
    // admin
    // tenant
  });

  const [warnings, setWarnings] = useState({
    price: null,
    general: null,
  });

  const [modal, setModal] = useState({
    active: false,
    accepted: false,
  });

  const handleSubmit = () => {
    if (Object.keys(warnings).every((warning) => warning !== true))
      return fetch("/api/projects/createProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newProperty,
        }),
      });
    setWarnings({ ...warnings, general: true });
    return;
  };

  const setFullAddress = () => {
    return setNewProperty({
      ...newProperty,
      fullAddress: `${newProperty.streetNumber} ${newProperty.streetPrefix} ${
        newProperty.streetName
      }, ${newProperty.apt ? `apt. ${newProperty.apt},` : ``} ${
        newProperty.city
      }, ${newProperty.postalCode}`,
    });
  };

  ////useEffects

  useEffect(() => {
    if (newProperty.price) {
      isNaN(newProperty.price)
        ? setWarnings({ ...warnings, price: true })
        : setWarnings({ ...warnings, price: false });
    }
    if (modal.accepted === true) setModal({ ...modal, accepted: false });
  }, [newProperty]);

  ///logs///
  useEffect(() => {
    console.log(newProperty);
    console.log(warnings.price);
  }, [newProperty]);

  useEffect(() => {
    console.log(modal);
  }, [modal]);

  return (
    <Wrapper>
      <ConfirmationModal
        object={newProperty}
        modal={modal}
        setModal={setModal}
      />
      <form>
        <label>
          Project Name:
          <input
            type="text"
            onChange={(e) => {
              setNewProperty({
                ...newProperty,
                projectName: e.target.value,
              });
            }}
          />
        </label>

        <label>
          Street Number:
          <input
            type="text"
            onChange={(e) => {
              setNewProperty({
                ...newProperty,
                streetNumber: e.target.value,
              });
            }}
          />
        </label>

        <label>
          Street Name:
          <input
            type="text"
            onChange={(e) => {
              setNewProperty({
                ...newProperty,
                streetName: e.target.value,
              });
            }}
          />
        </label>

        <label>
          Street Prefix:
          <select
            type="text"
            onChange={(e) => {
              setNewProperty({
                ...newProperty,
                streetPrefix: e.target.value,
              });
            }}
          >
            <option value="">Select</option>
            <option>Rue</option>
            <option>Avenue</option>
            <option>Boulevard</option>
            <option>Chemin</option>
          </select>
        </label>
        <label>
          Apartment:
          <input
            type="text"
            onChange={(e) => {
              setNewProperty({
                ...newProperty,
                apt: e.target.value,
              });
            }}
          />
        </label>

        <label>
          City:
          <input
            type="text"
            onChange={(e) => {
              setNewProperty({
                ...newProperty,
                city: e.target.value,
              });
            }}
          />
        </label>
        <label>
          Province:
          <select
            onChange={(e) =>
              setNewProperty({ ...newProperty, province: e.target.value })
            }
          >
            <option value="">Select</option>
            {Object.keys(provinces).map((prov) => {
              console.log(provinces[prov]);
              return (
                <option key={prov} value={prov}>
                  {provinces[prov]}
                </option>
              );
            })}
          </select>
        </label>
        <label>
          Postal Code:
          <input
            type="text"
            onChange={(e) => {
              setNewProperty({
                ...newProperty,
                postalCode: e.target.value.toUpperCase(),
              });
            }}
          />
        </label>

        <label>
          Size:
          <input
            type="text"
            onChange={(e) => {
              setNewProperty({
                ...newProperty,
                size: e.target.value,
              });
            }}
          />
        </label>

        <label>
          Monthly Rent:
          <input
            type="text"
            onChange={(e) => {
              setNewProperty({
                ...newProperty,
                price: e.target.value,
              });
            }}
          />
          {warnings.price === true && <div>Please only use numbers</div>}
        </label>

        {/* Tenant(s), Pictures, + All other info that will be displayed
        <label>Tenant:</label>
        <input
          type="text"
          placeholder="Confirm your password"
          onChange={(e) => {
            setPasswordConfirmation({
              ...passwordConfirmation,
              input: e.target.value,
            });
          }}
        /> */}

        <button
          onClick={(e) => {
            e.preventDefault();
            setFullAddress();
            if (modal.accepted === false) {
              setModal({ ...modal, active: true });
            }
            if (modal.accepted === true) handleSubmit();
          }}
        >
          {modal.accepted ? "Submit" : "Confirm"}
        </button>
      </form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 700px;
  display: flex;
  justify-content: center;
  align-items: center;

  form {
    display: flex;
    flex-direction: column;
  }
  label {
    margin-top: 7px;
  }
  input {
    margin-left: 11px;
  }

  select {
    margin-left: 11px;
  }

  button {
    margin-top: 11px;
  }
`;
