import React, { useState, useEffect } from "react";

import styled from "styled-components";

export const CreateAccount = () => {
  const [form, setForm] = useState({
    firstName: null,
    lastName: null,
    phoneNumber: null,
    email: null,
    password: null,
  });

  const [passwordConfirmation, setPasswordConfirmation] = useState({
    isMatch: false,
    input: null,
  });

  const registerUser = async () => {
    console.log("Submitted");
    const res = await fetch(`/api/auth/createUser/${form.email}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
      }),
    });
    console.log(res);
  };

  useEffect(() => {
    if (passwordConfirmation.input)
      setPasswordConfirmation(
        form.password === passwordConfirmation.input ? true : false
      );
  }, [passwordConfirmation.input]);

  return (
    <Wrapper>
      <form>
        <label>First name:</label>
        <input
          type="text"
          onChange={(e) => {
            setForm({
              ...form,
              firstName: e.target.value,
            });
          }}
        />

        <label>Last name:</label>
        <input
          type="text"
          onChange={(e) => {
            setForm({
              ...form,
              lastName: e.target.value,
            });
          }}
        />
        <label>Phone number:</label>
        <input
          type="tel"
          onChange={(e) => {
            setForm({
              ...form,
              phoneNumber: e.target.value,
            });
          }}
        />
        <label>Email address:</label>
        <input
          type="email"
          onChange={(e) => {
            setForm({
              ...form,
              email: e.target.value,
            });
          }}
        />
        <label>Password:</label>
        <input
          type="text"
          onChange={(e) => {
            setForm({
              ...form,
              password: e.target.value,
            });
          }}
        />
        <label>Confirm Password:</label>
        <input
          type="text"
          placeholder="Confirm your password"
          onChange={(e) => {
            setPasswordConfirmation({
              ...passwordConfirmation,
              input: e.target.value,
            });
          }}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            registerUser();
          }}
        >
          Submit
        </button>
      </form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 700px;
  display: flex;
  justify-content: center;
  align-items: center;

  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  label {
    margin-bottom: 3px;
  }
  input {
    margin-bottom: 11px;
  }
`;
