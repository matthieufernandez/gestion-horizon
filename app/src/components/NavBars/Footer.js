import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { COLORS } from "../../constants";

import logo from "../../assets/IconsAndLogos/Horizon-Logo-white.png";
import fbLogo from "../../assets/IconsAndLogos/facebook-white.png";
import instaLogo from "../../assets/IconsAndLogos/instagram-white.png";
import linkedinLogo from "../../assets/IconsAndLogos/linkedin-white.png";

export const Footer = () => {
  const history = useHistory();

  return (
    <FootBar>
      <Main>
        <Logo src={logo} onClick={() => history.push("/")} />
        <div className="links-container">
          <FootTitles>Liens rapides </FootTitles>
          <Foot>
            <LinkList>
              <Link onClick={() => history.push("/")}>FAQ </Link>
            </LinkList>
            <LinkList>
              <Link onClick={() => history.push("/")}>Investissuers </Link>
            </LinkList>
            <LinkList>
              <Link onClick={() => history.push("/")}>Locataires </Link>
            </LinkList>
          </Foot>
        </div>
        <div className="links-container">
          <FootTitles>Services</FootTitles>
          <Foot>
            <LinkList>
              <Link onClick={() => history.push("/")}>Propriétés </Link>
            </LinkList>
            <LinkList>
              <Link onClick={() => history.push("/")}>Notre Equipe </Link>
            </LinkList>
            <LinkList>
              <Link onClick={() => history.push("/contact")}>Contact</Link>
            </LinkList>
          </Foot>
        </div>
        <div className="links-container">
          <FootTitles>Contact</FootTitles>
          <Foot>
            <LinkList>
              <Link>1600 Chemin du Tremblay,</Link>
            </LinkList>
            <LinkList>
              <Link>Longueuil, QC J4N 1E1</Link>
            </LinkList>
            <SocialMediaIconSection>
              <SocialMediaIcon src={fbLogo} />
              <SocialMediaIcon src={instaLogo} />
              <SocialMediaIcon src={linkedinLogo} />
            </SocialMediaIconSection>
          </Foot>
        </div>
        <div className="links-container">
          <FootTitles>Langues</FootTitles>
          <Foot>
            <LinkList>
              <LangLink
                onClick={() => {
                  window.scrollTo(0, 0);
                }}
              >
                Francais
              </LangLink>
            </LinkList>
            <LinkList>
              <LangLink
                onClick={() => {
                  window.scrollTo(0, 0);
                }}
              >
                English
              </LangLink>
            </LinkList>
          </Foot>
        </div>
      </Main>
      <Copyright>
        <p>© 2021 , Tous droits réservés à Investissements Wings Inc.</p>
      </Copyright>
    </FootBar>
  );
};

//component styling
const FootBar = styled.div`
  position: relative;
  width: 100%;
  background-color: ${COLORS.primary};
`;

const Main = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px ${COLORS.secondary} solid;
  width: 100%;
  height: 170px;
  padding: 0 190px 0 41px;

  @media only screen and (max-width: 1080px) {
    padding: 0 93px 0 32px;
  }

  @media only screen and (max-width: 480px) {
    padding: 0 7px;
  }

  div.links-container {
    display: flex;
    flex-direction: column;
    margin-top: 30px;
  }
`;
const Logo = styled.img`
  margin-top: 32px;
  width: 180px;
  margin-right: 73px;

  @media only screen and (max-width: 780px) {
    display: none;
  }

  &:hover {
    cursor: pointer;
  }
`;
const Foot = styled.ul`
  list-style: none;
`;

const FootTitles = styled.p`
  font-size: 18px;
  color: white;
  margin-bottom: 30px;
  text-decoration: underline;
  text-underline-offset: 0.3em;

  @media only screen and (max-width: 1080px) {
    font-size: 16px;
  }

  @media only screen and (max-width: 840px) {
    font-size: 14px;
  }

  @media only screen and (max-width: 780px) {
    margin-bottom: 21px;
  }

  @media only screen and (max-width: 480px) {
    margin-bottom: 7px;
    text-underline-offset: 0;
    font-size: 12px;
  }

  @media only screen and (max-width: 380px) {
    margin-bottom: 5px;
    text-underline-offset: 0;
    font-size: 11px;
  }
`;

const LinkList = styled.li`
  padding: 0.2em 0;
  font-weight: 100;
  @media only screen and (max-width: 480px) {
    padding: 0.1em 0;
  }
`;

const Link = styled.a`
  font-size: 18px;
  color: ${COLORS.secondary};

  &:hover {
    cursor: pointer;
  }

  @media only screen and (max-width: 1080px) {
    font-size: 16px;
  }

  @media only screen and (max-width: 840px) {
    font-size: 14px;
  }

  @media only screen and (max-width: 480px) {
    font-size: 11px;
  }
`;
const SocialMediaIconSection = styled.div`
  display: flex;
  gap: 20px;
  margin-left: 5px;
  margin-top: 5px;

  @media only screen and (max-width: 780px) {
    justify-content: flex-start;
    margin-left: 0;
    gap: 0;
  }
`;
const SocialMediaIcon = styled.img`
  width: 25px;

  @media only screen and (max-width: 780px) {
    margin-right: 11px;
  }
`;
const LangLink = styled.p`
  color: ${COLORS.secondary};
  &:hover {
    cursor: pointer;
  }

  @media only screen and (max-width: 480px) {
    font-size: 11px;
  }
`;

const Copyright = styled.div`
  margin-top: 23px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 31px;
  font-size: 8px;
  color: ${COLORS.secondary};
  border-top: 1px ${COLORS.secondary} solid;

  p {
    text-align: center;
  }
`;
