import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";

import { TenantBottomDash } from "./TenantBottomDash";
import { TenantTopDash } from "./TenantTopDash";
import { IssueModal } from "../Modals/IssueModal";

import { AuthContext } from "../../../../contexts/AuthContext";

export const TenantDashboard = () => {
  const { data } = useContext(AuthContext);
  const [modal, setModal] = useState({
    isActive: false,
    status: null,
  });

  return (
    <Wrapper>
      {modal.isActive && <IssueModal modal={modal} setModal={setModal} />}
      <h1>{`Bienvenue ${data?.firstName} !`}</h1>
      <TenantTopDash />
      <TenantBottomDash modal={modal} setModal={setModal} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;
