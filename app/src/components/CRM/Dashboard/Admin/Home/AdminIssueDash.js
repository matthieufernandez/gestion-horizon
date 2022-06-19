import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

import { AuthContext } from "../../../../../contexts/AuthContext";
import { AdminIssueRow } from "./AdminIssueRow";

import { COLORS } from "../../../../../constants";
import { french } from "../../../utils/frenchTranslations";
import {
  getDateFromUnix,
  getTimeFromUnix,
} from "../../../utils/unixConversions";

import filter from "../../../../../assets/SVGs/filter-blue.svg";
import tenantArrow from "../../../../../assets/SVGs/Arrow-right-grey.svg";

export const AdminIssueDash = ({ modal, setModal }) => {
  const { projectData } = useContext(AuthContext);
  const [itemList, setItemList] = useState(null);
  const [displayList, setDisplayList] = useState(null);
  const [unresolvedCount, setUnresolvedCount] = useState(null);

  const [dropdowns, setDropdowns] = useState({
    tenantFilter: false,
    statusFilter: false,
    nameFilter: false,
  });
  const [filters, setFilters] = useState({
    tenantFilter: {
      tenants: null,
      input: "",
      matches: [],
      selected: [],
    },
    statusFilter: {
      Resolved: false,
      Unresolved: false,
      Rejected: false,
      New: false,
    },
  });

  // Filter results
  const filterTheList = () => {
    // pull out selected filters for statuses
    const statusFilters = Object.keys(filters.statusFilter).filter(
      (status) => filters.statusFilter[status] === true
    );

    // set a temp array from itemlist and start filtering
    let filteredList = itemList;

    // filter for selected tenant(s)
    if (filters.tenantFilter.selected.length > 0)
      filteredList = filteredList.filter((item) =>
        filters.tenantFilter.selected.includes(item.tenantName)
      );

    // filter for statuses
    if (statusFilters.length > 0)
      filteredList = filteredList.filter((item) =>
        statusFilters.includes(item.status)
      );

    // set filtered list if any filters required
    if (filters.tenantFilter.selected.length > 0 || statusFilters.length > 0)
      return setDisplayList(filteredList);

    // reset displayed array if clearing all filters
    if (
      filters.tenantFilter.selected.length === 0 &&
      statusFilters.length === 0
    )
      return setDisplayList(itemList);
  };

  useEffect(() => {
    if (projectData?.length > 0) {
      // PREPARE ISSUE HISTORY"
      // filter out units with no history
      const filteredData = projectData.filter((d) => d.issueHistory);

      const unitInfo = [];
      const clusteredData = filteredData.map((d) => {
        unitInfo.push({ ...d?.tenant, unitId: d.id });
        return { ...d.issueHistory };
      });

      // set array of tenants in filter
      setFilters({
        ...filters,
        tenantFilter: {
          ...filters.tenantFilter,
          tenants: unitInfo.map((u) => u.name),
        },
      });

      // sort those objects into an array holding one unit's issue history per element
      const issueHistObjArray = clusteredData.map((d, index) => {
        const currentIndex = index;
        return [
          ...Object.keys(d).map((key) => {
            return {
              ...clusteredData[currentIndex][key],
              tenantId: unitInfo[currentIndex].id,
              tenantName: unitInfo[currentIndex].name,
              unitId: unitInfo[currentIndex].unitId,
              unixId: key,
            };
          }),
        ];
      });

      // dynamic merge of array elements
      const unsortedHistoryArr = issueHistObjArray.reduce(
        (acc, obj) => [...acc, ...obj],
        []
      );

      // sort array by reverse chronology
      const orderedData = unsortedHistoryArr.sort((a, b) => {
        // convert last modified timestamp to unix and compare
        return new Date(a.modified._seconds) > new Date(b.modified._seconds)
          ? -1
          : 1;
      });

      // fix dates
      const readableTimeData = orderedData.map((d) => {
        return {
          ...d,
          modified: {
            day: getDateFromUnix(d.modified._seconds),
            time: getTimeFromUnix(d.modified._seconds),
          },
          created: {
            day: getDateFromUnix(d.created._seconds),
            time: getTimeFromUnix(d.created._seconds),
          },
        };
      });

      // seperate resolveds, news, and unresolveds
      const resolvedIssues = readableTimeData.filter(
        (d) => d.status === "Resolved"
      );
      const unresolvedIssues = readableTimeData.filter(
        (d) => d.status !== "Resolved" && d.status !== "New"
      );
      const newIssues = readableTimeData.filter((d) => d.status === "New");

      // concat new and unresolved issues
      const currentIssues = newIssues.concat(unresolvedIssues);

      // take unresolveds count for display
      setUnresolvedCount(currentIssues.length);
      // take unresolved array and concat it witht resolveds to push to bottom
      const displayData = currentIssues.concat(resolvedIssues);

      // populate state
      setDisplayList(displayData);
      return setItemList(displayData);
    }
  }, [projectData]);

  /////////////////////////////////////////////
  // UPDATE TENANT FILTER INPUT STATE
  useEffect(() => {
    // filter matches using user input
    if (filters.tenantFilter.input && filters.tenantFilter.tenants)
      setFilters({
        ...filters,
        tenantFilter: {
          ...filters.tenantFilter,
          matches: filters.tenantFilter.tenants.filter((name) =>
            name
              .toUpperCase()
              .includes(filters.tenantFilter.input.toUpperCase())
          ),
        },
      });
  }, [filters.tenantFilter.input]);

  ///////////////////////////////////////////////
  // RENDER THE COMPONENT
  return (
    <>
      <Wrapper>
        <div className="issues-dash">
          <div className="issues-header">
            <h2>{`Problèmes :  ${unresolvedCount || "-"}`}</h2>
            <NavLink id="issues-navlink" to="/home">
              Ajouter un item
              {/* add option for admin to add pre-resolved item with  */}
            </NavLink>
          </div>
          <div className="table">
            <div
              className="thead"
              style={{
                width: displayList?.length < 5 ? "100%" : "calc(100% - 16px)",
              }}
            >
              <div className="th th_with_filter">
                Locataire
                <div className="filter-icon-container">
                  <img
                    onClick={() =>
                      setDropdowns({
                        ...dropdowns,
                        tenantFilter: !dropdowns.tenantFilter,
                      })
                    }
                    src={filter}
                    alt="filter button"
                  />
                  {dropdowns?.tenantFilter && (
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
                              nameFilter: !dropdowns.nameFilter,
                            });
                          }}
                          style={{
                            transform:
                              dropdowns.nameFilter === false && "rotate(90deg)",
                            marginRight:
                              dropdowns.nameFilter === false && "2px",
                          }}
                        />
                        {dropdowns.nameFilter && (
                          <div className="tenant-filter-dropdown">
                            <div className="tenant-option-container">
                              <div className="option">
                                <label>
                                  <span id="nom">Nom</span>
                                  <input
                                    type="input"
                                    value={filters.tenantFilter.input}
                                    onChange={(e) => {
                                      setFilters({
                                        ...filters,
                                        tenantFilter: {
                                          ...filters.tenantFilter,
                                          input:
                                            e.target.value !== ""
                                              ? e.target.value
                                              : "",
                                          matches: e.target.value === "" && [],
                                        },
                                      });
                                    }}
                                  ></input>
                                </label>
                              </div>
                              {filters.tenantFilter?.matches.length > 0 &&
                                filters.tenantFilter.matches.map((match) => {
                                  return (
                                    <div key={match} className="option">
                                      <label>
                                        <span>{match}</span>
                                        <input
                                          type="checkbox"
                                          checked={
                                            filters.tenantFilter.selected.includes(
                                              match
                                            )
                                              ? "checked"
                                              : ""
                                          }
                                          onChange={() => {
                                            setFilters({
                                              ...filters,
                                              tenantFilter: {
                                                ...filters.tenantFilter,
                                                selected:
                                                  filters.tenantFilter.selected.includes(
                                                    match
                                                  )
                                                    ? filters.tenantFilter.selected.filter(
                                                        (selection) =>
                                                          selection !== match
                                                      )
                                                    : [match].concat(
                                                        filters.tenantFilter
                                                          .selected
                                                      ),
                                              },
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

                      <div
                        className="option action"
                        onClick={() => {
                          setFilters({
                            ...filters,
                            tenantFilter: {
                              ...filters.tenantFilter,
                              selected: [],
                            },
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
                            tenantFilter: false,
                          });
                        }}
                      >
                        Save
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="th">Sujet</div>

              <div className="th th_with_filter">
                État
                <div className="filter-icon-container">
                  <img
                    onClick={() =>
                      setDropdowns({
                        ...dropdowns,
                        statusFilter: !dropdowns.statusFilter,
                      })
                    }
                    src={filter}
                    alt="filter button"
                  />
                  {dropdowns?.statusFilter && (
                    <div className="dropdown-container">
                      {Object.keys(filters.statusFilter).map((s, index) => {
                        return (
                          <div key={index} className="option">
                            <label>
                              {french[s] || s}
                              <input
                                type="checkbox"
                                id={s}
                                checked={
                                  filters.statusFilter[s] ? "checked" : ""
                                }
                                onChange={() => {
                                  setFilters({
                                    ...filters,
                                    statusFilter: {
                                      ...filters.statusFilter,
                                      [s]: !filters.statusFilter[s],
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
                          const tempStatuses = Object.keys(
                            filters.statusFilter
                          ).reduce((acc, key) => {
                            return { ...acc, [key]: false };
                          }, {});
                          setFilters({
                            ...filters,
                            statusFilter: { ...tempStatuses },
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
                            statusFilter: false,
                          });
                        }}
                      >
                        Save
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="th">Créé le</div>
              <div className="th">Modifié le</div>
              <div className="th">Options</div>
            </div>

            <div className="tbody">
              {displayList &&
                displayList.map((i, index) => {
                  return (
                    <AdminIssueRow
                      i={i}
                      mapIndex={index}
                      key={index}
                      modal={modal}
                      setModal={setModal}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  width: 100%;
  margin: 32px 0;

  ///////// ISSUES SECTION /////////
  div.issues-dash {
    padding: 17px 32px 23px 32px;
    width: 100%;
    background-color: white;
    border-radius: 5px;

    box-shadow: ${COLORS.crmBoxShadow};
    border: none;
  }
  div.issues-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 32px;
    border: none;

    #issues-navlink {
      height: 32px;
      text-decoration: none;
      background-color: ${COLORS.crmButtonGrey};
      color: white;
      padding: 7px 17px;
      border: none;
      border-radius: 5px;
      font-size: calc(80% + 0.8vmin);
      margin-right: 16px;
    }
  }

  div.table {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 330px;
    margin-top: 11px;
    border: none;

    div.thead {
      width: calc(100% - 16px);
      height: 32px;
      display: flex;
      border: none;

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
        /* margin: 5px 5px 0 0; */
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

    div.option.action {
      cursor: pointer;
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
  }
`;
