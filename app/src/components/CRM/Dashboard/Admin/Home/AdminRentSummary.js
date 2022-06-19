import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";

import { AuthContext } from "../../../../../contexts/AuthContext";
import { AdminRentRow } from "./AdminRentRow";

import { addComma } from "../../../utils/addComma";
import {
  getTimeFromUnix,
  getDateFromUnix,
} from "../../../utils/unixConversions";

import { COLORS } from "../../../../../constants";

export const AdminRentSummary = () => {
  const { projectData } = useContext(AuthContext);

  const [itemList, setItemList] = useState(null);
  const [displayList, setDisplayList] = useState(null);

  // get the dash data ready
  useEffect(() => {
    if (projectData?.length > 0) {
      // PREPARE RENT SUMMARY LAYOUT
      // filter out units with no tenants
      let filteredData = projectData.filter((d) => d?.tenant?.id);

      // map out list with necessary data
      const mappedData = filteredData.map((d) => {
        // find last payment : invert history, then find
        let lastPayment;
        if (d?.balanceHistory) {
          lastPayment =
            d?.balanceHistory[
              Object.keys(d?.balanceHistory)
                .sort((a, b) => (a > b ? -1 : 1))
                .find((key) => d?.balanceHistory[key].type === "Payment")
            ];
        }
        return {
          name: d.tenant.name,
          date: {
            day: lastPayment
              ? getDateFromUnix(lastPayment.created._seconds)
              : "---",
            time: lastPayment
              ? getTimeFromUnix(lastPayment.created._seconds)
              : "---",
          },
          rent: addComma(Number(d.price)),
          balance: addComma(Number(d.rentOwed)),
          paid: d.rentOwed > 0 ? false : true,
        };
      });

      // sort unpaid to top
      const displayData = mappedData.sort((a, b) => (b.paid === true ? -1 : 1));

      setItemList(displayData);
      setDisplayList(displayData);
    }
  }, [projectData]);

  return (
    <Wrapper>
      <SummaryDash>
        <div
          className="thead"
          style={{
            width: displayList?.length < 3 ? "100%" : "calc(100% - 16px)",
          }}
        >
          <div className="th tenant">
            <span>Locataire</span>
          </div>
          <div className="th date">
            <span>Date</span>
          </div>
          <div className="th rent">
            <span>Loyer</span>
          </div>
          <div className="th rent">
            <span>Solde</span>
          </div>
          <div className="th status">
            <span>État</span>
          </div>
          <div className="th options">
            <span>Options</span>
          </div>
        </div>
        <div className="tbody">
          {displayList &&
            displayList.map((i, index) => {
              return <AdminRentRow i={i} key={index} />;
            })}
        </div>
      </SummaryDash>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  margin: 32px 0;
`;

const SummaryDash = styled.div`
  position: relative;
  padding: 32px;
  height: 300px;
  width: 100%;
  background-color: white;
  border-radius: 5px;
  display: flex;
  flex-direction: column;

  box-shadow: ${COLORS.crmBoxShadow};

  div.thead {
    width: calc(100% - 16px);
    height: 32px;
    display: flex;

    div.th {
      width: calc(100% / 6);
      display: flex;
      justify-content: center;
      align-items: flex-end;
      padding-bottom: 11px;
      color: ${COLORS.bluegrey};
      font-weight: 600;
      font-size: calc(60% + 0.8vmin);
    }
  }

  div.tbody {
    height: 100%;
    max-height: 100%;
    width: 100%;
    overflow: auto;
  }
`;
