import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

import { AuthContext } from "../../../../contexts/AuthContext";

import { useHistory } from "react-router-dom";

import { COLORS } from "../../../../constants";
import { addComma } from "../../utils/addComma";
import { getDateFromUnix, getTimeFromUnix } from "../../utils/unixConversions";
import { french } from "../../utils/frenchTranslations";

import userDefault from "../../../../assets/SVGs/user-profile-default.svg";
import userBot from "../../../../assets/SVGs/user-bot.svg";
import downloadArrow from "../../../../assets/SVGs/Arrow-down-white.svg";
import filter from "../../../../assets/SVGs/filter-blue.svg";

export const TenantTopDash = () => {
  const { projectData, currentUser, data } = useContext(AuthContext);

  const [itemList, setItemList] = useState(null);
  const [displayList, setDisplayList] = useState(null);

  const [dropdowns, setDropdowns] = useState({
    typeFilter: false,
    userFilter: false,
  });
  const [filters, setFilters] = useState({
    typeFilter: {
      Payment: false,
      "Rent Renewal": false,
      "Rent Adjustment": false,
      Pending: false,
    },
    userFilter: {
      System: false,
      Admin: false,
      [data.firstName]: false,
    },
  });

  let history = useHistory();

  // Filter results
  const filterTheList = () => {
    // pull out selected filters for types
    const typeFilters = Object.keys(filters.typeFilter).filter(
      (type) => filters.typeFilter[type] === true
    );

    // pull out selected filters for users
    const userFilters = Object.keys(filters.userFilter).filter(
      (type) => filters.userFilter[type] === true
    );

    // set a temp array from itemlist and start filtering
    let filteredList = itemList;

    // filter for types
    if (typeFilters.length > 0) {
      filteredList = filteredList.filter((item) =>
        typeFilters.includes(item.type)
      );
    }

    // filter for users
    if (userFilters.length > 0) {
      filteredList = filteredList.filter((item) =>
        userFilters.includes(item.source)
      );
    }

    // set filtered list if any filters required
    if (typeFilters.length > 0 || userFilters.length > 0)
      return setDisplayList(filteredList);

    // reset displayed array if clearing filters
    if (typeFilters.length === 0 && userFilters.length === 0)
      return setDisplayList(itemList);
  };

  const balanceData = projectData?.balanceHistory;

  useEffect(() => {
    if (balanceData) {
      // get balance data
      // create array with reverse chronological values
      const orderedTimestamps = Object.keys(balanceData).sort((a, b) =>
        a > b ? -1 : 1
      );
      // map using the id array to ref and create display array
      const orderedData = orderedTimestamps.map((id) => {
        // change unixtime to human readable
        const fixedDate = new Date(balanceData[id].created._seconds * 1000)
          .toLocaleDateString()
          .replaceAll("/", "-");
        return {
          // spread item object, add date and name for cell display
          ...balanceData[id],
          created: {
            day: getDateFromUnix(balanceData[id].created._seconds),
            time: getTimeFromUnix(balanceData[id].created._seconds),
          },
          source:
            balanceData[id].source === currentUser.email ||
            balanceData[id].source === currentUser
              ? projectData.tenant.name.split(" ")[0]
              : balanceData[id].source,
        };
      });
      setItemList(orderedData);
      setDisplayList(orderedData);
    }
  }, [projectData]);

  return (
    <Wrapper>
      <h2>Notifications</h2>
      <div className="notifications-container">
        <div id="table-wrapper">
          <div className="table">
            <div
              className="thead"
              style={{
                width: displayList?.length < 3 ? "100%" : "calc(100% - 16px)",
              }}
            >
              <div className="th th_with_filter">
                Source
                <div className="filter-icon-container">
                  <img
                    onClick={() =>
                      setDropdowns({
                        ...dropdowns,
                        userFilter: !dropdowns.userFilter,
                      })
                    }
                    src={filter}
                    alt="filter button"
                  />
                  {dropdowns?.userFilter && (
                    <div className="dropdown-container">
                      {Object.keys(filters.userFilter).map((u, index) => {
                        return (
                          <div key={index} className="option">
                            <label>
                              {french[u] || u}
                              <input
                                type="checkbox"
                                id={u}
                                checked={filters.userFilter[u] ? "checked" : ""}
                                onChange={() => {
                                  setFilters({
                                    ...filters,
                                    userFilter: {
                                      ...filters.userFilter,
                                      [u]: !filters.userFilter[u],
                                    },
                                  });
                                }}
                              ></input>
                            </label>
                          </div>
                        );
                      })}
                      <div
                        className="option action"
                        onClick={() => {
                          const tempUsers = Object.keys(
                            filters.userFilter
                          ).reduce((acc, key) => {
                            return { ...acc, [key]: false };
                          }, {});
                          setFilters({
                            ...filters,
                            userFilter: { ...tempUsers },
                          });
                        }}
                      >
                        Clear
                      </div>
                      <div
                        className="option action"
                        onClick={() => {
                          filterTheList();
                          setDropdowns({
                            ...dropdowns,
                            userFilter: false,
                          });
                        }}
                      >
                        Save
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="th">Date</div>

              <div className="th">Montant</div>

              <div className="th th_with_filter">
                Type
                <div className="filter-icon-container">
                  <img
                    onClick={() =>
                      setDropdowns({
                        ...dropdowns,
                        typeFilter: !dropdowns.typeFilter,
                      })
                    }
                    src={filter}
                    alt="filter button"
                  />
                  {dropdowns?.typeFilter && (
                    <div className="dropdown-container">
                      {Object.keys(filters.typeFilter).map((t, index) => {
                        return (
                          <div
                            key={index}
                            className="option"
                            style={{ top: `${index * 37}px` }}
                          >
                            <label>
                              {french[t] || t}
                              <input
                                type="checkbox"
                                id={t}
                                checked={filters.typeFilter[t] ? "checked" : ""}
                                onChange={() => {
                                  setFilters({
                                    ...filters,
                                    typeFilter: {
                                      ...filters.typeFilter,
                                      [t]: !filters.typeFilter[t],
                                    },
                                  });
                                }}
                              ></input>
                            </label>
                          </div>
                        );
                      })}
                      <div
                        className="option action"
                        onClick={() => {
                          const tempTypes = Object.keys(
                            filters.typeFilter
                          ).reduce((acc, key) => {
                            return { ...acc, [key]: false };
                          }, {});
                          setFilters({
                            ...filters,
                            typeFilter: { ...tempTypes },
                          });
                        }}
                      >
                        Clear
                      </div>
                      <div
                        className="option action"
                        onClick={() => {
                          filterTheList();
                          setDropdowns({
                            ...dropdowns,
                            typeFilter: false,
                          });
                        }}
                      >
                        Save
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="th">Détails</div>
            </div>

            <div className="tbody">
              {displayList &&
                displayList.map((i, index) => {
                  return (
                    <div className="tr" key={index}>
                      <div className="td td-user">
                        <img
                          src={i.source === "System" ? userBot : userDefault}
                          alt="avatar-icon"
                        />
                        <p>{french[i.source] || i.source}</p>
                      </div>

                      <div className="td">
                        <div className="td-date-time">
                          <h1>{i.created.day}</h1>
                          <p>{i.created.time}</p>
                        </div>
                      </div>

                      <div className="td">${addComma(Number(i.amount))}</div>

                      <div className="td">{french[i.type] || i.type}</div>

                      <div className="td">
                        <NavLink className="to-details" to="/dashboard">
                          <span>Go</span>
                          <img
                            id="go-arrow"
                            src={downloadArrow}
                            alt="go-to-page"
                          />
                        </NavLink>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        <div className="divider"></div>
        <div className="balance-container">
          <span
            className="balance"
            style={{
              color:
                projectData?.rentOwed > projectData?.price ? "red" : "black",
            }}
          >{`Solde: $${
            typeof projectData?.rentOwed === "number"
              ? addComma(projectData?.rentOwed)
              : "  -"
          }`}</span>
          <button
            className="pay-rent"
            onClick={() => {
              history.push("/payment");
            }}
          >
            Payer le loyer
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: white;
  width: 100%;
  height: 260px;
  padding: 17px;
  margin-top: 23px;
  border-radius: 5px;

  box-shadow: ${COLORS.crmBoxShadow};

  div.notifications-container {
    display: flex;
    position: relative;
    width: 100%;
    height: 100%;
  }

  // NOTIFICATIONS TABLE

  #table-wrapper {
    position: relative;
    width: 66%;
    margin-right: 13px;
  }

  div.table {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 180px;
    margin-top: 11px;
    border: none;

    div.thead {
      width: calc(100% - 16px);
      height: 32px;
      display: flex;
      border: none;

      div.th {
        width: calc(100% / 5);
        display: flex;
        justify-content: center;
        align-items: flex-end;
        padding-bottom: 11px;
        color: ${COLORS.bluegrey};
        font-weight: 600;
        font-size: calc(60% + 0.8vmin);
      }
    }

    div.th_with_filter {
      display: flex;
      justify-content: center;
      padding-left: 11px;

      div.filter-icon-container {
        padding: 0;
      }
      img {
        height: 11px;
        width: 11px;
        cursor: pointer;
        margin-bottom: 7px;
      }
      div.dropdown-container {
        position: absolute;
        z-index: 2;

        .option.action {
          cursor: pointer;
        }

        div.option {
          padding: 5px;
          width: 220px;
          font-size: calc(80%+0.8vmin);
          border: 1px solid ${COLORS.crmButtonGrey};
          height: 37px;
          background-color: white;
          font-size: calc(40% + 0.8vmin);
          color: ${COLORS.primary};
          text-align: left;
          display: flex;
          align-items: center;

          label {
            width: 100%;
            display: flex;
            justify-content: space-between;
            text-align: left;
          }

          input {
            align-self: flex-end;
            cursor: pointer;
          }

          &:hover {
            background-color: ${COLORS.crmButtonGrey};
          }
          &:active {
            background-color: ${COLORS.crmButtonGrey};
          }
        }
      }
    }

    div.tbody {
      height: 100%;
      width: 100%;
      overflow: auto;
      border: none;
    }

    div.tr {
      width: 100%;
      height: 72px;
      display: flex;
      border-bottom: 1px solid ${COLORS.grey1};
      color: ${COLORS.primary};
    }

    div.td {
      width: calc(100% / 5);
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      font-weight: 600;
    }

    div.td-user {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-weight: 300;

      img {
        height: 31px;
        width: 31px;
        margin-bottom: 3px;
      }

      p {
        font-size: 11px;
        color: ${COLORS.primary};
      }
    }

    div.td-date-time {
      text-align: center;

      h1 {
        font-size: calc(70% + 0.8vmin);
        font-weight: 600;
      }

      p {
        color: ${COLORS.bluegrey};
        font-size: calc(40% + 0.8vmin);
        font-weight: 300;
        margin-top: 3px;
      }
    }

    .to-details {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 31px;
      border-radius: 5px;
      align-items: center;
      color: white;
      font-size: calc(60% + 0.8vmin);
      background-color: ${COLORS.crmButtonGrey};
      cursor: pointer;
      text-decoration: none;
      font-weight: 400;
    }

    img#go-arrow {
      height: 11px;
      width: 11px;
      fill: white;
      transform: rotate(270deg);
      margin-left: 7px;
    }
  }

  // END OF NOTIFICATION TABLE

  div.divider {
    width: 0px;
    height: 90%;
    border: 1px solid ${COLORS.backgroundGrey};
  }

  div.balance-container {
    height: 100%;
    width: 30%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    padding-bottom: 33px;

    span {
      font-size: calc(150% + 0.8vmin);
    }

    button {
      background-color: ${COLORS.crmGreen};
      border: none;
      color: white;
      border-radius: 5px;
      font-weight: 600;
      width: 60%;
      padding: 23px 0;
    }
  }
`;
