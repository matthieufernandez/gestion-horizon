import React, { useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext, useAuth } from "../../contexts/AuthContext";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";

export const PasswordReset = () => {
  const emailRef = useRef();

  const { error, setError, loading, authPasswordReset, message, setMessage } =
    useAuth();

  let history = useHistory();

  useEffect(() => {
    if (error) {
      setError();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError();
    setMessage();

    try {
      authPasswordReset(emailRef.current.value);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "50vh" }}
      >
        <Card style={{ minWidth: "30vw" }}>
          <Card.Body>
            <h2
              className="text-center mb-4"
              style={{ fontSize: "28px", fontWeight: "bold" }}
            >
              Password Reset
            </h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
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
            <Button
              disabled={loading}
              onClick={(e) => handleSubmit(e)}
              className="w-100"
              style={{ marginBottom: "10px" }}
            >
              Send password reset email
            </Button>
          </Form>
        </Card>
      </Container>
    </>
  );
};
