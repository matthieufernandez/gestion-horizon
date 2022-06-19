import React, { useState, useEffect } from "react";
import emailjs, { init } from "emailjs-com";
import styled from "styled-components";

import { COLORS } from "../../../constants";

import fbLogo from "../../../assets/IconsAndLogos/facebook-dark-blue.svg";
import linkedinLogo from "../../../assets/IconsAndLogos/linkedin-dark-blue.svg";
import instaLogo from "../../../assets/IconsAndLogos/instagram-dark-blue.svg";
import ghLogo from "../../../assets/IconsAndLogos/Horizon-Logo-dark-blue.png";

export const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    comment: "",
  });
  const [formStatus, setFormStatus] = useState(null);

  const updateForm = (key, value) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  const isFormFilled = () => {
    return Object.keys(form).every((section) => form[section]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormFilled()) return setFormStatus("incomplete");
    setFormStatus("sending");

    /////EMAIL SECTION/////
    require("dotenv").config();

    const emailService = process.env.REACT_APP_EMAIL_SERVICE;
    const template = process.env.REACT_APP_EMAIL_TEMPLATE;

    init(process.env.REACT_APP_SERVICE_ID);

    const templateParams = {
      subject: "Gestion-Horizon - Contact",
      name: form.name,
      number: form.phone,
      reply_to: form.email,
      message: form.comment,
    };

    // COMMENTED OUT EMAIL SEND FUNCTION
    // await emailjs.send(emailService, template, templateParams).then(
    //   (res) => {
    //     console.log("SUCCESS", res.status, res.text);
    //   },
    //   (err) => {
    //     console.log("FAILED", err);
    //     return setFormStatus("error");
    //   }
    // );

    setFormStatus("complete");
    setForm({ name: "", email: "", phone: "", comment: "" });
    document.getElementsByTagName("INPUT").value = "";
    document.getElementsByTagName("TEXTAREA").value = "";
    /////EMAIL SECTION END/////
  };

  useEffect(() => {
    console.log(form);
  }, [form]);

  return (
    <Wrapper>
      <div className="background-grey"></div>
      <ContactContainer>
        <LeftSection>
          <h1>Contactez Nous</h1>
          <input
            type="text"
            placeholder="Nom et Prenom"
            value={form.name}
            onChange={(e) => updateForm("name", e.target.value)}
          ></input>
          <input
            type="email"
            placeholder="Courriel"
            value={form.email}
            onChange={(e) => updateForm("email", e.target.value)}
          ></input>
          <input
            type="text"
            placeholder="Telephone"
            value={form.phone}
            onChange={(e) => updateForm("phone", e.target.value)}
          ></input>
          <textarea
            type="text"
            placeholder="Commentaire..."
            value={form.comment}
            onChange={(e) => updateForm("comment", e.target.value)}
          ></textarea>
          {formStatus === "complete" && (
            <div className="success-message">
              <p> Thank you!</p>{" "}
              <p> We will get in contact with you shortly!</p>
            </div>
          )}
          {formStatus === "incomplete" && (
            <div className="fail-message">
              Please complete the form before submitting!
            </div>
          )}
          {formStatus === "sending" && (
            <div className="fail-message">Sending...</div>
          )}
          {formStatus === "error" && (
            <div className="fail-message">Oops! Something went wrong!</div>
          )}
          <button onClick={(e) => handleSubmit(e)}>Envoyer</button>
        </LeftSection>
        <div className="divider"></div>
        <RightSection>
          <div className="polygon"></div>
          <div className="empty-div"></div>
          <div className="info-section">
            <div className="details-container">
              <p>GestionHorizon@gmail.com</p>
              <p>+1 234 567 8901</p>
              <div className="icons-container">
                <img
                  src={fbLogo}
                  alt="facebook-link"
                  onClick={() => window.open("url", "_blank")}
                />
                <img
                  src={linkedinLogo}
                  alt=""
                  onClick={() => window.open("url", "_blank")}
                />
                <img
                  src={instaLogo}
                  alt=""
                  onClick={() => window.open("url", "_blank")}
                />
              </div>
            </div>
            <div className="logo-container">
              <img id="gh-logo" src={ghLogo} alt="gestion-horizon-logo" />
            </div>
          </div>
        </RightSection>
      </ContactContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  background-color: ${COLORS.primary};
  padding: 32px 0;

  div.background-grey {
    position: absolute;
    height: 58%;
    width: 100%;
    background-color: ${COLORS.backgroundGrey};
    bottom: 0;
  }
`;

// header + footer = 260px + 31copywrite + borders

const ContactContainer = styled.div`
  margin: 0px auto;
  width: 800px;
  height: 530px;
  border-radius: 3px;
  background-color: white;
  position: relative;
  display: flex;
  align-items: center;

  @media only screen and (max-width: 1024px) {
    width: 80%;
  }

  div.divider {
    height: 60%;
    width: 0px;
    border: 1px solid ${COLORS.backgroundGrey};
  }
`;

const LeftSection = styled.div`
  height: 100%;
  width: 55%;
  padding: 38px 32px 24px 32px;
  text-align: center;
  display: flex;
  flex-direction: column;

  input:focus,
  textarea:focus {
    outline: none;
  }

  h1 {
    font-size: calc(130% + 0.8vmin);
    color: ${COLORS.primary};
    font-weight: 600;
    margin-bottom: 11px;
  }

  input {
    border: 1px ${COLORS.contactPageGrey} solid;
    width: 100%;
    margin-bottom: 11px;
    padding: 8px 13px;
    color: ${COLORS.buttonGrey};
    font-size: calc(60% + 0.8vmin);
    border-radius: 3px;
    color: ${COLORS.buttonGrey};

    ::placeholder {
      color: ${COLORS.backgroundGrey};
    }
  }

  textarea {
    min-width: 100%;
    max-width: 100%;
    height: 100%;
    padding: 8px 13px;
    margin-bottom: 20px;
    background-color: transparent;
    color: white;
    border: 1px solid ${COLORS.contactPageGrey};
    font-size: calc(60% + 0.8vmin);
    line-height: calc(100% + 0.8vmin);
    resize: none;
    color: ${COLORS.buttonGrey};
    border-radius: 3px;

    ::placeholder {
      color: ${COLORS.backgroundGrey};
    }
  }

  button {
    border: none;
    color: white;
    background-color: ${COLORS.buttonGrey};
    padding: 17px 0;
    border-radius: 3px;
  }

  div {
    width: 100%;
    font-size: calc(90% * 0.8vmin);
    line-height: 120%;
    background-color: ${COLORS.primary};
    color: ${COLORS.backgroundGrey};
    text-align: center;
    margin-bottom: 20px;
    padding: 7px 0;
    border-radius: 3px;
  }
`;

const RightSection = styled.div`
  height: 100%;
  margin: 0 auto;
  width: 45%;
  position: relative;
  overflow: hidden;
  border-radius: 0 3px 0 0;

  div.polygon {
    position: absolute;
    background-color: ${COLORS.buttonGrey};
    width: 350px;
    height: 150px;
    z-index: 99;
    clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0% 25%);
    transform: rotate(180deg);
    overflow: hidden;
    top: -25px;
    right: -139px;
    z-index: 2;
  }

  div.empty-div {
    height: 37%;
    width: 100%;
    border-radius: 0 3px 0 0;
  }

  div.info-section {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    width: 100%;
    height: 63%;
  }

  p {
    margin: 0 auto;
    margin-bottom: 13px;
    color: ${COLORS.primary};
    font-size: calc(50% + 0.8vmin);
  }

  div.details-container {
    margin: 0 auto;
  }

  div.icons-container {
    width: 100%;
    display: flex;
    justify-content: space-evenly;

    img {
      height: 23px;
      width: 23px;
      cursor: pointer;
    }
  }

  div.logo-container {
    margin: 0 auto;
    img#gh-logo {
      height: 140px;
      width: 180px;
      margin: 0 auto;

      @media only screen and (max-width: 780px) {
        height: 110px;
        width: 140px;
      }
    }
  }
`;
