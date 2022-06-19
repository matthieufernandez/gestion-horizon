import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

import { AuthContext } from "../../../../../contexts/AuthContext";

import { COLORS } from "../../../../../constants";
import { addComma } from "../../../utils/addComma";
import {
  getDateFromUnix,
  getTimeFromUnix,
} from "../../../utils/unixConversions";
import { french } from "../../../utils/frenchTranslations";

import userDefault from "../../../../../assets/SVGs/user-profile-default.svg";
import userBot from "../../../../../assets/SVGs/user-bot.svg";
import goArrow from "../../../../../assets/SVGs/Arrow-down-white.svg";
import filter from "../../../../../assets/SVGs/filter-blue.svg";
import tenantArrow from "../../../../../assets/SVGs/Arrow-right-grey.svg";

export const AdminTopDash = ({ setModal }) => {
  const { projectData, data } = useContext(AuthContext);

  const [itemList, setItemList] = useState(null);
  const [displayList, setDisplayList] = useState(null);
  const [balance, setBalance] = useState(null);
  const [dropdowns, setDropdowns] = useState({
    typeFilter: false,
    userFilter: false,
    tenantFilter: false,
  });
  const [filters, setFilters] = useState({
    typeFilter: {
      Payment: false,
      "Rent Renewal": false,
      "Rent Adjustment": false,
      Pending: false,
      Failed: false,
    },
    userFilter: {
      System: false,
      Admin: false,
      Tenants: false,
    },
  });
  const [tenantFilter, setTenantFilter] = useState({
    tenants: null,
    input: "",
    matches: [],
    selected: [],
  });

  /////////////////////////
  // FILTER THE LIST
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

    // filter for selected tenants
    if (
      tenantFilter.selected?.length > 0 &&
      tenantFilter.selected.length !== tenantFilter.tenants.length
    ) {
      filteredList = filteredList.filter((item) =>
        tenantFilter.selected.includes(item.tenantName)
      );
    }

    // filter for source
    if (userFilters.length > 0) {
      // if no tenants are selected, and admin or system are selected, pull those items
      if (
        userFilters.includes("Tenants") === false &&
        tenantFilter.selected?.length === 0
      )
        filteredList = filteredList.filter((item) =>
          userFilters.includes(item.source)
        );

      // if no tenants are selected, filter out tenant items
      if (
        userFilters.includes("Tenants") === false &&
        tenantFilter.selected?.length > 0
      ) {
        filteredList = filteredList.filter((item) => {
          if (
            userFilters.includes(item.source) === false &&
            tenantFilter.selected.every(
              (select) => select.split(" ")[0] !== item.source
            ) === true
          )
            return false;
          if (
            userFilters.includes(item.source) === true ||
            tenantFilter.selected.includes(item.tenantName) === true
          )
            return true;
        });
      }

      // if all tenants checked, filter others
      if (userFilters.includes("Tenants") === true) {
        filteredList = filteredList.filter(
          (item) =>
            userFilters.includes(item.source) ||
            (item.source !== "System" && item.source !== "Admin")
        );
      }
    }

    // filter out system and admin if not selected
    if (
      tenantFilter.selected?.length > 0 &&
      tenantFilter.selected.length !== tenantFilter.tenants.length &&
      userFilters.length === 0
    )
      filteredList = filteredList.filter(
        (item) => item.source !== "Admin" && item.source !== "System"
      );

    // set filtered list if any filters were applied
    if (
      typeFilters.length > 0 ||
      userFilters.length > 0 ||
      tenantFilter.selected?.length > 0
    )
      return setDisplayList(filteredList);

    // reset displayed array if filters are being cleared
    if (typeFilters.length === 0 && userFilters.length === 0)
      return setDisplayList(itemList);
  };

  ////////////////////////////////
  /// GET DASH DATA READY
  useEffect(() => {
    if (projectData?.length > 0) {
      // PREPARE ALL BALANCE HISTORIES:
      // filter out units with no history - returns object to objects
      const filteredData = projectData.filter((d) => d.balanceHistory);
      // pull the historical data only - returns object of all balance objects

      // store tenant data to add to array later
      let tenants = [];
      const clusteredData = filteredData.map((d) => {
        tenants.push(d?.tenant);
        return { ...d.balanceHistory };
      });

      // set tenants in tenant filter
      setTenantFilter({
        ...tenantFilter,
        tenants: tenants.map((t) => t.name),
      });

      // sorts those objects into an array holding one unit's balance history per element
      const balanceHistObjArray = clusteredData.map((d, index) => {
        const currentIndex = index;
        return [
          ...Object.keys(d).map((key) => {
            return {
              ...clusteredData[currentIndex][key],
              tenantId: tenants[currentIndex].id,
              tenantName: tenants[currentIndex].name,
            };
          }),
        ];
      });

      // dynamic merge of array elements
      const unsortedHistoryArr = balanceHistObjArray.reduce((acc, obj) => {
        return [...acc, ...obj];
      }, []);

      // sort array by reverse chronology
      const orderedData = unsortedHistoryArr.sort((a, b) =>
        a.unixId > b.unixId ? -1 : 1
      );

      // finshing touches: convert timestamps and add name
      const displayData = orderedData.map((d) => {
        return {
          ...d,
          created: {
            day: getDateFromUnix(d.created._seconds),
            time: getTimeFromUnix(d.created._seconds),
          },
          source:
            d.source === "Admin"
              ? "Admin"
              : d.source === "System"
              ? "System"
              : d.tenantName.split(" ")[0],
        };
      });
      setItemList(displayData);
      setDisplayList(displayData);

      // GET TOTAL BALANCE OWED
      const relativeData = projectData.filter((d) => d.rentOwed);

      // Send balance to state
      if (relativeData.length === 0) setBalance(0);
      if (relativeData.length > 0)
        setBalance(
          relativeData.reduce((acc, data) => {
            return acc + data.rentOwed;
          }, 0)
        );
    }
  }, [projectData]);

  /////////////////////////////////////////////
  // UPDATE TENANT FILTER INPUT STATE
  useEffect(() => {
    // filter matches using user input
    if (tenantFilter.input && tenantFilter.tenants)
      setTenantFilter({
        ...tenantFilter,
        matches: tenantFilter.tenants.filter((name) =>
          name.toUpperCase().includes(tenantFilter.input.toUpperCase())
        ),
      });
  }, [tenantFilter.input]);

  ///////////////////////////////////////////////
  // RENDER THE COMPONENT
  return (
    <Wrapper>
      <h2>Notifications</h2>
      <div className="notifications-container">
        <div id="table-wrapper">
          <div className="table">
            <div
              className="thead"
              style={{
                width: displayList?.length < 5 ? "100%" : "calc(100% - 16px)",
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
                        tenantFilter: false,
                      })
                    }
                    src={filter}
                    alt="filter button"
                  />
                  {dropdowns?.userFilter && (
                    <div className="dropdown-container">
                      <div className="option tenant-filter">
                        <span>Locataires</span>
                        <img
                          src={tenantArrow}
                          alt="expand"
                          id="pointer-right"
                          onClick={() => {
                            setDropdowns({
                              ...dropdowns,
                              tenantFilter: !dropdowns.tenantFilter,
                            });
                          }}
                          style={{
                            transform:
                              dropdowns.tenantFilter === false &&
                              "rotate(90deg)",
                            marginRight:
                              dropdowns.tenantFilter === false && "2px",
                          }}
                        />
                        {dropdowns.tenantFilter && (
                          <div className="tenant-filter-dropdown">
                            <div className="tenant-option-container">
                              <div className="option">
                                <label>
                                  <span id="nom">Nom</span>
                                  <input
                                    type="input"
                                    value={tenantFilter.input}
                                    onChange={(e) => {
                                      console.log(e.target.value);
                                      setTenantFilter({
                                        ...tenantFilter,
                                        input:
                                          e.target.value !== ""
                                            ? e.target.value
                                            : "",
                                        matches: e.target.value === "" && [],
                                      });
                                    }}
                                  ></input>
                                </label>
                              </div>
                              <div className="option">
                                <label>
                                  <span>Tous</span>
                                  <input
                                    type="checkbox"
                                    checked={
                                      filters.userFilter.Tenants
                                        ? "checked"
                                        : ""
                                    }
                                    onChange={() => {
                                      filters.userFilter.Tenants
                                        ? setTenantFilter({
                                            ...tenantFilter,
                                            selected: [],
                                          })
                                        : setTenantFilter({
                                            ...tenantFilter,
                                            selected: tenantFilter.tenants,
                                          });
                                      setFilters({
                                        ...filters,
                                        userFilter: {
                                          ...filters.userFilter,
                                          Tenants: !filters.userFilter.Tenants,
                                        },
                                      });
                                    }}
                                  ></input>
                                </label>
                              </div>
                              {tenantFilter?.matches.length > 0 &&
                                tenantFilter.matches.map((match) => {
                                  return (
                                    <div key={match} className="option">
                                      <label>
                                        <span>{match}</span>
                                        <input
                                          type="checkbox"
                                          checked={
                                            filters.userFilter.Tenants ||
                                            tenantFilter.selected.includes(
                                              match
                                            )
                                              ? "checked"
                                              : ""
                                          }
                                          onChange={() => {
                                            setTenantFilter({
                                              ...tenantFilter,
                                              selected:
                                                tenantFilter.selected.includes(
                                                  match
                                                )
                                                  ? tenantFilter.selected.filter(
                                                      (selection) =>
                                                        selection !== match
                                                    )
                                                  : [match].concat(
                                                      tenantFilter.selected
                                                    ),
                                            });
                                          }}
                                        ></input>
                                      </label>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      </div>
                      {Object.keys(filters.userFilter).map((u, index) => {
                        if (index < 2)
                          return (
                            <div key={index} className="option">
                              <label>
                                {french[u] || u}
                                <input
                                  type="checkbox"
                                  id={u}
                                  checked={
                                    filters.userFilter[u] ? "checked" : ""
                                  }
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
                          setTenantFilter({
                            ...tenantFilter,
                            selected: [],
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
                          <img id="go-arrow" src={goArrow} alt="go-to-page" />
                        </NavLink>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <div className="side-container">
          <div className="balance-container">
            <span
              className="balance"
              style={{
                color:
                  projectData?.rentOwed > projectData?.price ? "red" : "black",
              }}
            >{`Solde: $${
              typeof balance === "number" ? addComma(balance) : "  -"
            }`}</span>
            <button className="pay-rent">Envoyer un Rappel</button>
          </div>
          <div className="side-menu-container">
            <div className="menu-row">
              <button
                className="menu-left"
                onClick={() => {
                  setModal({
                    isActive: true,
                    type: "Add_Property",
                  });
                }}
              >
                Ajouter une Propriété
              </button>
              <button
                onClick={() =>
                  setModal({
                    isActive: true,
                    type: "Edit_Property",
                  })
                }
              >
                Modifier une Propriété
              </button>
            </div>
            {/* LOCATAIRE */}
            <div className="menu-row">
              <button
                className="menu-left"
                onClick={() => {
                  setModal({
                    isActive: true,
                    type: "Add_Tenant",
                  });
                }}
              >
                Ajouter un Locataire
              </button>
              <button
                onClick={() => {
                  setModal({
                    isActive: true,
                    type: "Edit_Tenant",
                  });
                }}
              >
                Modifier un Locataire
              </button>
            </div>
            {/* OCCUPATION */}
            <div className="menu-row">
              <button
                className="menu-left"
                onClick={() => {
                  setModal({
                    isActive: true,
                    type: "Assign_Leasee",
                  });
                }}
              >
                Affecter un Locataire
              </button>
              <button
                onClick={() => {
                  setModal({
                    isActive: true,
                    type: "Remove_Leasee",
                  });
                }}
              >
                Relocaliser un Locataire
              </button>
            </div>
            {/* OTHER */}
            <div className="menu-row">
              {/* CHANGER LOYER MENSUEL */}
              <button className="menu-left">Ajouter des Détails</button>
              {data?.isOwner ? (
                <button
                  onClick={() => {
                    setModal({
                      isActive: true,
                      type: "Add_Admin",
                    });
                  }}
                >
                  Ajouter un Admin
                </button>
              ) : (
                <span>{` `}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: white;
  width: 100%;
  height: 400px;
  padding: 17px;
  margin-top: 23px;
  border-radius: 5px;

  box-shadow: ${COLORS.crmBoxShadow};

  div.notifications-container {
    display: flex;
    width: 100%;
    height: 94%;
    padding-right: 0;
  }

  // NOTIFICATIONS TABLE

  #table-wrapper {
    position: relative;
    width: 66%;
    padding-right: 11px;
  }

  div.table {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 320px;
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
          border: 1px solid ${COLORS.crmButtonGrey};
          height: 37px;
          background-color: white;
          font-size: 14px;
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

          span#nom {
            margin-top: 3px;
          }

          input[type="input"] {
            width: 72px;
            padding: 1px 3px;
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

    div.tenant-filter {
      position: relative;
      justify-content: space-between;

      cursor: default;
      img#pointer-right {
        margin: 0 2px 0 0;
      }
    }

    div.tenant-filter-dropdown {
      position: absolute;
      top: -1px;
      width: 220px;
      left: 219px;

      span {
        font-size: 14px;
      }
    }

    div.tenant-option-container {
      position: relative;
      width: 100%;
      height: 100%;
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

  // SIDE CONTAINER
  div.side-container {
    height: 100%;
    width: 34%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding-left: 17px;
    border-left: 1px solid ${COLORS.backgroundGrey};

    div.balance-container {
      height: 40%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      padding-top: 23px;
      padding-bottom: 23px;
      border-bottom: 1px solid ${COLORS.backgroundGrey};

      span {
        font-size: calc(120% + 0.8vmin);
        margin-bottom: 9px;
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

    div.side-menu-container {
      max-height: 58%;
      width: 100%;
      margin-bottom: 11px;
      margin-top: 11px;

      display: flex;
      flex-direction: column;
      padding: 7px;
      padding-left: 17px;

      div.menu-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 19px;
        button {
          width: 44%;

          border: none;
          background-color: white;

          display: flex;
          justify-content: flex-start;
          align-items: center;

          font-size: 16px;
          color: ${COLORS.bluegrey};
          text-align: left;
          font-weight: 500;

          &:hover {
            text-decoration: underline;
          }
        }

        button.menu-left {
          margin-right: 23px;
        }
      }
    }
  }
`;
