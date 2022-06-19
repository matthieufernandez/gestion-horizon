import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

import { AuthContext } from "../../../contexts/AuthContext";
import { AdminDashboard } from "./Admin/Home/AdminDashboard";
import { TenantDashboard } from "./Tenant/TenantDashboard";

import { COLORS } from "../../../constants";

export const WelcomePage = () => {
  const { data } = useContext(AuthContext);

  return (
    <Wrapper>
      {data ? (
        <>
          {data?.isAdmin && <AdminDashboard />}
          {!data?.isAdmin && <TenantDashboard />}
        </>
      ) : (
        <h1>Loading ...</h1>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  background-color: ${COLORS.backgroundGrey};
  padding: 32px;
  color: ${COLORS.primary};

  h1 {
    font-size: calc(120% + 0.8vmin);
  }

  h2 {
    font-size: calc(100% + 0.8vmin);
  }
`;
