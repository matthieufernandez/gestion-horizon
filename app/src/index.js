import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";

import { LanguageContextProvider } from "./contexts/LanguageContext";
import { AllUsersContextProvider } from "./contexts/AllUsersContext";
import { AuthContextProvider } from "./contexts/AuthContext";
import { ProjectsContextProvider } from "./contexts/ProjectsContext";

ReactDOM.render(
  <Router>
    <LanguageContextProvider>
      <AllUsersContextProvider>
        <AuthContextProvider>
          <ProjectsContextProvider>
            <App />
          </ProjectsContextProvider>
        </AuthContextProvider>
      </AllUsersContextProvider>
    </LanguageContextProvider>
  </Router>,
  document.getElementById("root")
);
