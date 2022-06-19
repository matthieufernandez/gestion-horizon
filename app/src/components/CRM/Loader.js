import React from "react";
import styled from "styled-components";

import { COLORS } from "../../constants";

export const Loader = ({ height, width }) => {
  return (
    <Wrapper>
      <div className="loader" style={{ width: width, height: height }}>
        <svg
          viewBox="0 0 120 120"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle className="load one" cx="60" cy="60" r="40" />
          <circle className="load two" cx="60" cy="60" r="40" />
          <circle className="load three" cx="60" cy="60" r="40" />
        </svg>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  body {
    background-color: #eee;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  svg {
    width: 90%;
    fill: none;
  }

  .load {
    transform-origin: 50% 50%;
    stroke-dasharray: 570;
    stroke-width: 20px;
    &.one {
      stroke: ${COLORS.primary};
      animation: load 1.5s infinite;
    }
    &.two {
      stroke: ${COLORS.crmButtonGrey};
      animation: load 1.5s infinite;
      animation-delay: 0.1s;
    }
    &.three {
      stroke: ${COLORS.primary};
      animation: load 1.5s infinite;
      animation-delay: 0.2s;
    }
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
  @keyframes load {
    0% {
      stroke-dashoffset: 570;
    }
    50% {
      stroke-dashoffset: 530;
    }
    100% {
      stroke-dashoffset: 570;
      transform: rotate(360deg);
    }
  }
`;
