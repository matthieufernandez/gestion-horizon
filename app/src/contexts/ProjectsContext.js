import React, { createContext, useState } from "react";

///// CONTEXT TO HOLD PROJECTS FOR PRESENTATION PART /////
export const ProjectsContext = createContext(null);

export const ProjectsContextProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  return (
    <ProjectsContext.Provider value={{ projects, setProjects }}>
      {children}
    </ProjectsContext.Provider>
  );
};
