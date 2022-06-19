import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { COLORS } from "../../constants";
import { AuthContext, useAuth } from "../../contexts/AuthContext";

import logo from "../../assets/IconsAndLogos/Horizon-Logo-white.png";

import AuthHandler from "../AuthComponents/AuthHandler";

export const Header = () => {
  const { currentUser, data } = useContext(AuthContext);

  let history = useHistory();

  return (
    <Wrapper>
      <HomeNav to="/acceuil">Gestion Horizon</HomeNav>
      <NavOptionsContainer>
        <NavLinks to="/acceuil">Acceuil</NavLinks>
        <NavLinks to="/locataires">Locataires</NavLinks>
        {/* <NavLinks to="/proprietes">Proprietes</NavLinks> */}
        {/* <NavLinks to="/equipe">Notre Équipe</NavLinks> */}
        <NavLinks to="/contact">Contact</NavLinks>
      </NavOptionsContainer>
      <LoginContainer>
        {currentUser && data ? (
          <NavLinks to={`/profile/${currentUser.uid}`}>
            {data.firstName} {data.lastName}
          </NavLinks>
        ) : (
          <NavLinks to="Login">
            <button>Connect</button>
          </NavLinks>
        )}

        <AuthHandler trigger={false} />
      </LoginContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 90px;
  width: 100%;
  background-color: ${COLORS.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 47px;
`;

const HomeNav = styled(NavLink)`
  color: white;
  font-size: 32px;
  text-decoration: none;
`;

const NavOptionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 53%;
  margin-top: 3px;
`;

const NavLinks = styled(NavLink)`
  text-decoration: none;
  color: white;
  height: 20px;
  font-size: 22px;

  :hover {
    text-decoration: underline;
    color: white;
  }

  /* &.active {
    text-decoration: none;
    border-bottom: 1px solid white;
  } */
`;

const LoginContainer = styled.div`
  button {
    border-radius: 5px;
    background-color: white;
    color: ${COLORS.primary};
    border: none;
    padding: 11px 32px;
    font-weight: 600;
  }
`;
