import React, { useRef, useState, useEffect } from "react";
import { AuthContext, useAuth } from "../../contexts/AuthContext";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";

export const AdminAddUser = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const emailRef = useRef();
  const passwordRef = useRef();
  const fNameRef = useRef();
  const lNameRef = useRef();
  const phoneRef = useRef();
  const adminRef = useRef();

  const { adminAddUser, error, setError, loading, data } = useAuth();

  useEffect(() => {
    if (error) {
      setError();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError();

    try {
      await adminAddUser(
        emailRef.current.value,
        passwordRef.current.value,
        fNameRef.current.value,
        lNameRef.current.value,
        phoneRef.current.value,
        adminRef.current.value
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {data ? (
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
                    Add Tenant Account
                  </h2>
                  {error && <Alert variant="danger"> {error} </Alert>}
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
                  <Form.Group
                    id="first-name"
                    style={{ padding: "10px", marginBottom: "10px" }}
                  >
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="name" ref={fNameRef} required />
                  </Form.Group>
                  <Form.Group
                    id="last-name"
                    style={{ padding: "10px", marginBottom: "10px" }}
                  >
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="name" ref={lNameRef} required />
                  </Form.Group>
                  <Form.Group
                    id="phone-number"
                    style={{ padding: "10px", marginBottom: "10px" }}
                  >
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="phone" ref={phoneRef} required />
                  </Form.Group>
                  <Form.Group id="isAdmin" class="form-check">
                    <input
                      className="form-check-input"
                      disabled={data.isOwner !== true}
                      type="checkbox"
                      value={isAdmin}
                      onChange={() => {
                        setIsAdmin(!isAdmin);
                      }}
                      id="flexCheckDefault"
                      ref={adminRef}
                    />
                    <label
                      className="form-check-label"
                      for="flexCheckDefault"
                      style={{ marginTop: "4px", marginLeft: "5px" }}
                    >
                      Click here if you are adding an admin
                    </label>
                  </Form.Group>
                  <Button
                    disabled={loading}
                    onClick={(e) => handleSubmit(e)}
                    className="w-100"
                    style={{ marginBottom: "10px" }}
                  >
                    Add User
                  </Button>
                </Form>
              </Card>
            </div>
          </Container>
        </>
      ) : (
        <>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontWeight: "bold", fontSize: "22px" }}>
              You are not authorized to add a user
            </h1>
            <p>You have been signed out of your account.</p>
            <p>Please sign back in and try again</p>
          </div>
        </>
      )}
    </>
  );
};
