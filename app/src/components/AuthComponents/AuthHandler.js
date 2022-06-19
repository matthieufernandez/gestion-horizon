import React, { useState } from "react";
import styled from "styled-components";
// import { initializeApp } from "firebase/app";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import { firebaseConfig } from "../firebaseConfig";

export const AuthHandler = (props) => {
  return props.trigger ? (
    <Popup className="popup">
      <PopupInner className="popup-inner">
        <Btn className="popup-close-btn">close</Btn>
        {props.childrens}
      </PopupInner>
    </Popup>
  ) : (
    ""
  );
};

const Popup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);

  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopupInner = styled.div`
  position: relative;
  padding: 32px;
  width: 100%;
  max-width: 640px;
  background-color: white;
`;

const Btn = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
`;

export default AuthHandler;
