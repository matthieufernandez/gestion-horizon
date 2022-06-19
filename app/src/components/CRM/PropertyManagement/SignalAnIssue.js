import React, { useRef } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { COLORS } from "../../../constants";

export const SignalAnIssue = () => {
  const subjectRef = useRef();
  const issueRef = useRef();

  const { error, setError, loading, setLoading, data } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError();
    setLoading(true);

    try {
      await fetch(`/api/projects/createIssue/${data.unit.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subjectRef.current.value,
          body: issueRef.current.value,
          status: "New",
          unitId: data.unit.id,
        }),
      })
        .then((res) => res.json())
        .then((res) => console.log(res));
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <Wrapper>
      <BackButton to="/dashboard">{`< BACK TO DASHBOARD`}</BackButton>
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
                Signalez un problème
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
                id="subject"
                style={{ padding: "10px", marginBottom: "10px" }}
              >
                <Form.Label>Sujet</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="example: 'laveuse' - limite 20 caractères"
                  maxLength="20"
                  ref={subjectRef}
                  required
                />
              </Form.Group>
              <Form.Group
                id="issue"
                style={{
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <Form.Label>Détails</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  type="text"
                  maxLength="500"
                  style={{ minHeight: "100px" }}
                  placeholder="description: limite 500 caractères"
                  ref={issueRef}
                  required
                />
              </Form.Group>
              <Button
                disabled={loading}
                onClick={(e) => handleSubmit(e)}
                className="w-100"
                style={{ marginBottom: "10px" }}
              >
                Envoyer au propriétaire
              </Button>
            </Form>
          </Card>
          <div className="w-100 text-center mt-2">Admin? Log in as Admin</div>
        </div>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const BackButton = styled(NavLink)`
  position: absolute;
  top: 23px;
  left: 23px;
  text-decoration: none;
  font-size: calc(120% + 0.8vmin);
  color: ${COLORS.primary};
`;
