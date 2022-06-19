import React, { useContext } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { AuthContext, useAuth } from "../../contexts/AuthContext";
import { Logout } from "./Logout";
import { LogIn } from "./LogIn";

export const Profile = () => {
  const { currentUser, data, projectData } = useAuth();
  let history = useHistory();

  return (
    <>
      {currentUser && data ? (
        <>
          <Card>
            <p>{currentUser.email}</p>
            <p>
              {data.firstName} {data.lastName}
            </p>
            <Logout />
            <Button onClick={() => history.push("/dashboard")}>
              Dashboard
            </Button>
            <Button onClick={() => history.push("/payment")}>
              Make a payment
            </Button>
            <Button onClick={() => history.push("/dashboard/signal-an-issue")}>
              Signal an issue
            </Button>
            <Button onClick={() => history.push("/password-reset")}>
              Changez votre mot de passe
            </Button>
            {data.isAdmin === true && (
              <>
                <Button onClick={() => history.push("/AdminAddUser")}>
                  Admin Add User
                </Button>
              </>
            )}
          </Card>
        </>
      ) : (
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="w-100" style={{ maxWidth: "400px" }}>
            <LogIn />
          </div>
        </Container>
      )}
    </>
  );
};
