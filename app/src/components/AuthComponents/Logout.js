import React from "react";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const Logout = () => {
  const { authLogout } = useAuth();
  let history = useHistory();

  const handleLogout = () => {
    authLogout();
    setTimeout(() => history.push("/login"), 2000);
  };

  return (
    <Button className="w-100" onClick={handleLogout}>
      Log Out
    </Button>
  );
};
