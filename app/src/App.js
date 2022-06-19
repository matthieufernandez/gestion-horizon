import React, { useEffect, useContext } from "react";
import { Route, Switch } from "react-router-dom";

//////// GLOBAL ////////
import { GlobalStyle } from "./GlobalStyles";
import { Header } from "./components/NavBars/Header";
import { Footer } from "./components/NavBars/Footer";
//////// GLOBAL ////////

//////// PRESENTATIONAL ////////
import { HomePage } from "./components/Presentational/HomePage/Homepage";
import { LocatairesPage } from "./components/Presentational/LocatairesPage/LocatairesPage";
import { ContactPage } from "./components/Presentational/ContactPage/ContactPage";
//////// PRESENTATIONAL ////////

//////// CRM ////////
import { WelcomePage } from "./components/CRM/Dashboard/WelcomePage";
import { CreateAccount } from "./components/AuthComponents/CreateAccount";
import { AddProperty } from "./components/CRM/PropertyManagement/AddProperty";
import { EditProperty } from "./components/CRM/PropertyManagement/EditProperty";
import { LogIn } from "./components/AuthComponents/LogIn";
import { AdminAddUser } from "./components/AuthComponents/AdminAddUser";
import { AssignProperty } from "./components/CRM/PropertyManagement/AssignProperty";
//////// CRM ////////

//////// CONTEXT ////////
import { ProjectsContext } from "./contexts/ProjectsContext";
import { AllUsersContext } from "./contexts/AllUsersContext";
//////// CONTEXT ////////

import { Profile } from "./components/AuthComponents/Profile";
import { PasswordReset } from "./components/AuthComponents/PasswordReset";
import { SignalAnIssue } from "./components/CRM/PropertyManagement/SignalAnIssue";

//////// PAYMENT ////////
import { PaymentForm } from "./components/CRM/Payment/PaymentForm";
import { StripeContainer } from "./components/CRM/Payment/StripeContainer";
import { Loader } from "./components/CRM/Loader";
//////// PAYMENT ////////

const App = () => {
  const { projects, setProjects } = useContext(ProjectsContext);
  const { allUsers, setAllUsers } = useContext(AllUsersContext);

  useEffect(async () => {
    if (projects.length === 0) {
      const res = await fetch("/api/projects/getProjects");
      const data = await res.json();
      setProjects([...data.data]);
    }
  }, []);

  useEffect(async () => {
    if (allUsers.length === 0) {
      const res = await fetch("/api/users/getAllUsers");
      const data = await res.json();
      setAllUsers([...data.data]);
    }
  }, []);

  return (
    <>
      <GlobalStyle />

      <Header />

      <Switch>
        <Route path="/LogIn">
          <LogIn />
        </Route>
        <Route path="/AdminAddUser">
          <AdminAddUser />
        </Route>
        <Route path="/Acceuil">
          <HomePage />
        </Route>
        <Route path="/Properties">
          <div>Under Construction</div>
        </Route>
        <Route path="/profile/:id">
          <Profile />
        </Route>
        <Route path="/password-reset">
          <PasswordReset />
        </Route>
        <Route path="/dashboard/signal-an-issue">
          <SignalAnIssue />
        </Route>
        <Route path="/locataires">
          <LocatairesPage />
        </Route>
        <Route path="/dashboard">
          <WelcomePage />
        </Route>
        <Route path="/contact">
          <ContactPage />
        </Route>
        <Route path="/Register">
          <CreateAccount />
        </Route>
        <Route path="/CreateProperty">
          <AddProperty />
        </Route>
        <Route path="/EditProperty">
          <EditProperty />
        </Route>
        <Route path="/AssignProperty">
          <AssignProperty />
        </Route>
        <Route path="/payment">
          <StripeContainer />
        </Route>
        <Route path="/loadertest">
          <Loader />
        </Route>
        <Route>
          <HomePage />
        </Route>
      </Switch>

      <Footer />
    </>
  );
};

export default App;
