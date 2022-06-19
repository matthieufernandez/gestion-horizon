import React, { useState, useContext } from "react";
import styled from "styled-components";

import { AdminIssueDash } from "./AdminIssueDash";
import { AdminTopDash } from "./AdminTopDash";
import { AdminRentSummary } from "./AdminRentSummary";
import { AuthContext } from "../../../../../contexts/AuthContext";

import { IssueModal } from "../../Modals/IssueModal";
import { IssueAndReductionModal } from "../../Modals/IssueAndReductionModal";
import { AddPropertyModal } from "../../Modals/AddPropertyModal";
import { EditPropertyModal } from "../../Modals/EditPropertyModal";
import { AddTenantModal } from "../../Modals/AddTenantModal";
import { EditTenantModal } from "../../Modals/EditTenantModal";
import { AssignLeaseeModal } from "../../Modals/AssignLeaseeModal";
import { RemoveLeaseeModal } from "../../Modals/RemoveLeaseeModal";
import { AddAdminModal } from "../../Modals/AddAdminModal";

export const AdminDashboard = () => {
  const { data } = useContext(AuthContext);

  const [modal, setModal] = useState({
    isActive: false,
    status: null,
    newStatus: null,
    type: null,
  });

  // EDIT LEASEE WILL ONLY BE FOR THE SAKE OF REMOVAL
  // USER WILL THEN ADD ANOTHER LEASEE

  return (
    <Wrapper>
      {/*//////////// MENU MODALS /////////////*/}
      {modal.isActive && modal.type === "Add_Property" && (
        <AddPropertyModal modal={modal} setModal={setModal} />
      )}
      {modal.isActive && modal.type === "Edit_Property" && (
        <EditPropertyModal modal={modal} setModal={setModal} />
      )}
      {modal.isActive && modal.type === "Add_Tenant" && (
        <AddTenantModal modal={modal} setModal={setModal} />
      )}
      {modal.isActive && modal.type === "Edit_Tenant" && (
        <EditTenantModal modal={modal} setModal={setModal} />
      )}
      {modal.isActive && modal.type === "Assign_Leasee" && (
        <AssignLeaseeModal modal={modal} setModal={setModal} />
      )}
      {modal.isActive && modal.type === "Remove_Leasee" && (
        <RemoveLeaseeModal modal={modal} setModal={setModal} />
      )}
      {modal.isActive && modal.type === "Add_Admin" && (
        <AddAdminModal modal={modal} setModal={setModal} />
      )}
      {/*//////////// MENU MODALS /////////////*/}

      {/*//////////// ISSUE CHANGING /////////////*/}
      {modal.isActive &&
        data.isAdmin === true &&
        modal.newStatus === "Resolved" && (
          <IssueAndReductionModal modal={modal} setModal={setModal} />
        )}
      {modal.isActive &&
        modal.type === "Issue" &&
        modal.newStatus !== "Resolved" && (
          <IssueModal modal={modal} setModal={setModal} />
        )}
      {/*//////////// ISSUE CHANGING /////////////*/}

      {/*//////////// DISPLAY /////////////*/}
      <h1>{`Bienvenue Admin !`}</h1>
      <AdminTopDash setModal={setModal} />
      <AdminIssueDash modal={modal} setModal={setModal} />
      <AdminRentSummary />
      {/*//////////// DISPLAY /////////////*/}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;
