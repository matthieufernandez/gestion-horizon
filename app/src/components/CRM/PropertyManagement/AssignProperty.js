import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";

import { ProjectsContext } from "../../../contexts/ProjectsContext";
import { AllUsersContext } from "../../../contexts/AllUsersContext";
import { ConfirmationModalAssign } from "./ConfirmationModalAssign";
import { COLORS } from "../../../constants";

export const AssignProperty = () => {
  const { projects } = useContext(ProjectsContext);
  const { allUsers } = useContext(AllUsersContext);

  const [unit, setUnit] = useState(null);
  const [tenant, setTenant] = useState(null);

  const [serverResponse, setServerResponse] = useState(null);

  const [body, setBody] = useState({
    unit: null,
    tenant: null,
  });

  const [modal, setModal] = useState({
    active: false,
    accepted: false,
  });

  const findUnit = (id) => {
    if (id) return setUnit(projects.find((p) => p.id === id));
    return setUnit(null);
  };

  const findTenant = (id) => {
    if (id) return setTenant(allUsers.find((u) => u.id === id));
    return setTenant(null);
  };

  const handleSubmit = async () => {
    if (modal.accepted) {
      const res = await fetch(`/api/projects/assignTenant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...body,
        }),
      });
      const json = await res.json();
      console.log(json);
      return setServerResponse(json);
    }
  };

  useEffect(() => {
    setBody({
      tenant: {
        id: tenant?.id,
        name: `${tenant?.firstName} ${tenant?.lastName}`,
      },
      unit: { id: unit?.id, fullAddress: unit?.fullAddress },
    });
  }, [tenant, unit]);

  return (
    <Wrapper>
      <div className="container">
        {body.tenant && body.unit && (
          <ConfirmationModalAssign
            modal={modal}
            setModal={setModal}
            tenant={body.tenant}
            unit={body.unit}
          />
        )}
        <UnitSelectDiv>
          <h1>Select a Property</h1>
          <select
            className="property-select"
            onChange={(e) => {
              findUnit(e.target.value);
            }}
          >
            <option value={null}>Select</option>
            {projects.map((project) => {
              return (
                <option key={project.id} value={project.id}>
                  {project.fullAddress}
                </option>
              );
            })}
          </select>
        </UnitSelectDiv>
        <InfoDiv>
          <h1>Unit Info:</h1>
          {unit ? (
            <div>
              <h2>unit info</h2>
              <ul>
                {Object.keys(unit).map((key) => {
                  return <li key={key}>{`${key}: ${unit[key]}`}</li>;
                })}
                <li>
                  <span>
                    {`Tenant: ${unit?.tenant ? unit?.tenant : "none"}`}{" "}
                  </span>
                </li>
                {!unit?.tenant && (
                  <>
                    <h2>Assign a Tenant</h2>
                    <select
                      className="tenant-select"
                      onChange={(e) => {
                        findTenant(e.target.value);
                      }}
                    >
                      <option value={null}>Select</option>
                      {allUsers.map((user) => {
                        return (
                          <option key={user.email} value={user.id}>
                            {`${user.firstName} ${user.lastName}: ${user.email}`}
                          </option>
                        );
                      })}
                    </select>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (modal.accepted === false) {
                          setModal({ ...modal, active: true });
                        }
                        if (modal.accepted === true) handleSubmit();
                      }}
                    >
                      {modal.accepted ? "Submit" : "Confirm"}
                    </button>
                  </>
                )}
              </ul>
              {serverResponse && (
                <div
                  className="response"
                  style={{
                    backgroundColor:
                      serverResponse.status.toString().charAt(0) === "2"
                        ? `${COLORS.primary}`
                        : "red",
                  }}
                >
                  <p>{serverResponse.message}</p>
                </div>
              )}
            </div>
          ) : (
            <p>Select a unit</p>
          )}
        </InfoDiv>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  max-height: 100vh;

  div.container {
    width: 80%;
    margin: 0 auto;
    border: 1px solid black;
    height: 900px;
    display: flex;
  }
`;

const UnitSelectDiv = styled.div`
  width: 50%;
`;

const InfoDiv = styled.div`
  width: 50%;

  ul {
    margin-bottom: 13px;
  }

  li {
    margin-bottom: 11px;
    font-size: 18px;
  }

  div.response {
    padding: 13px 13px;
    font-size: 18px;
    height: 100px;
    width: 400px;
    color: white;
  }
`;
