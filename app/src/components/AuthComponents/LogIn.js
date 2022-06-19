import React, { useRef, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";

export const LogIn = () => {
  const emailRef = useRef();
  const passwordRef = useRef();

  const { authLogin, error, setError, loading, currentUser } = useAuth();

  //on first render this ensures that an error message from a different component does not load
  // useEffect(() => {
  //   setError(error);
  // }, [error]);

  let history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError();

    try {
      //send form data
      await authLogin(emailRef.current.value, passwordRef.current.value);
    } catch (e) {
      console.error(e);
    }
  };

  //waits for user info to return and routes user to homepage
  useEffect(() => {
    if (currentUser) {
      history.push("/dashboard");
    }
  }, [currentUser]);

  return (
    <>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Card>
            <Card.Body>
              <h2
                className="text-center mb-4"
                style={{ fontSize: "28px", fontWeight: "bold" }}
              >
                Log In
              </h2>
              {error && <Alert variant="danger">{error}</Alert>}
            </Card.Body>
            <Form
              style={{
                marginLeft: "20px",
                marginRight: "20px",
              }}
            >
              <Form.Group
                id="email"
                style={{ padding: "10px", marginBottom: "10px" }}
              >
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group
                id="password"
                style={{ padding: "10px", marginBottom: "10px" }}
              >
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <Button
                disabled={loading}
                onClick={(e) => handleSubmit(e)}
                className="w-100"
                style={{ marginBottom: "10px" }}
              >
                Log In
              </Button>
            </Form>
          </Card>
          <div className="w-100 text-center mt-2">
            <Link to="/password-reset" style={{ textDecoration: "none" }}>
              Forgot your password?
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
};
