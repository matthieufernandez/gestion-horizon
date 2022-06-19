import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";

import { ConfirmationModal } from "./ConfirmationModal";
import { provinces } from "../../../data/provinces";
import { ProjectsContext } from "../../../contexts/ProjectsContext";

export const EditProperty = () => {
  const { projects } = useContext(ProjectsContext);

  const [selection, setSelection] = useState(null);
  const [currentProperty, setCurrentProperty] = useState({
    projectName: "",
    fullAddress: "",
    streetNumber: "",
    streetName: "",
    streetPrefix: "",
    apt: "",
    city: "",
    province: "",
    country: "Canada",
    postalCode: "",
    size: "",
    price: "",
    // admin
    // tenant
  });

  const [modal, setModal] = useState({
    active: false,
    accepted: false,
  });

  const [warnings, setWarnings] = useState({
    price: null,
    general: null,
  });

  const handleSubmit = () => {
    if (Object.keys(warnings).every((warning) => warning !== true))
      return fetch("/api/projects/editProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...currentProperty,
        }),
      });

    return setWarnings({ ...warnings, general: true });
  };

  const setFullAddress = () => {
    return setCurrentProperty({
      ...currentProperty,
      fullAddress: `${currentProperty.streetNumber} ${
        currentProperty.streetPrefix
      } ${currentProperty.streetName}, ${
        currentProperty.apt ? `apt. ${currentProperty.apt},` : ``
      } ${currentProperty.city}, ${currentProperty.postalCode} `,
    });
  };

  useEffect(() => {
    const selectionData = projects.find((p) => p.id === selection);
    setCurrentProperty({ ...selectionData });
  }, [selection]);

  return (
    <Wrapper>
      {projects.length === 0 ? (
        <span>Loading up properties...</span>
      ) : (
        <>
          <ConfirmationModal
            object={currentProperty}
            modal={modal}
            setModal={setModal}
          />
          <select
            className="property-select"
            onChange={(e) => setSelection(e.target.value)}
          >
            <option value={null}>Select</option>
            {projects.map((property) => {
              return (
                <option key={property.id} value={property.id}>
                  {property.fullAddress}
                </option>
              );
            })}
          </select>
        </>
      )}
      {selection && (
        <form>
          <label>
            Project Name:
            <input
              type="text"
              value={currentProperty.projectName}
              onChange={(e) => {
                setCurrentProperty({
                  ...currentProperty,
                  projectName: e.target.value,
                });
              }}
            />
          </label>

          <label>
            Street Number:
            <input
              type="text"
              value={currentProperty.streetNumber}
              onChange={(e) => {
                setCurrentProperty({
                  ...currentProperty,
                  streetNumber: e.target.value,
                });
              }}
            />
          </label>

          <label>
            Street Name:
            <input
              type="text"
              value={currentProperty.streetName}
              onChange={(e) => {
                setCurrentProperty({
                  ...currentProperty,
                  streetName: e.target.value,
                });
              }}
            />
          </label>

          <label>
            Street Prefix:
            <select
              type="text"
              value={currentProperty.streetPrefix}
              onChange={(e) => {
                setCurrentProperty({
                  ...currentProperty,
                  streetPrefix: e.target.value,
                });
              }}
            >
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
              value={currentProperty.apt}
              onChange={(e) => {
                setCurrentProperty({
                  ...currentProperty,
                  apt: e.target.value,
                });
              }}
            />
          </label>

          <label>
            City:
            <input
              type="text"
              value={currentProperty.city}
              onChange={(e) => {
                setCurrentProperty({
                  ...currentProperty,
                  city: e.target.value,
                });
              }}
            />
          </label>
          <label>
            Province:
            <select
              value={currentProperty.province}
              onChange={(e) =>
                setCurrentProperty({
                  ...currentProperty,
                  province: e.target.value,
                })
              }
            >
              {Object.keys(provinces).map((prov) => {
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
              value={currentProperty.postalCode}
              onChange={(e) => {
                setCurrentProperty({
                  ...currentProperty,
                  postalCode: e.target.value,
                });
              }}
            />
          </label>

          <label>
            Size:
            <input
              type="text"
              value={currentProperty.size}
              onChange={(e) => {
                setCurrentProperty({
                  ...currentProperty,
                  size: e.target.value,
                });
              }}
            />
          </label>

          <label>
            Monthly Rent:
            <input
              type="text"
              value={currentProperty.price}
              onChange={(e) => {
                setCurrentProperty({
                  ...currentProperty,
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
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 700px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  select.property-select {
    margin-bottom: 13px;
  }

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
