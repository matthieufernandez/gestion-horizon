import React, { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

import { AuthContext } from "../../../../contexts/AuthContext";
import { TenantIssueRow } from "./TenantIssueRow";
import { COLORS } from "../../../../constants";
import { addComma } from "../../utils/addComma";
import { french } from "../../utils/frenchTranslations";

import tempPic from "../../../../assets/misc/homeSplash.jpg";
import dlArrow from "../../../../assets/SVGs/Arrow-down.svg";
import filter from "../../../../assets/SVGs/filter-grey.svg";
import { getDateFromUnix } from "../../utils/unixConversions";

export const TenantBottomDash = ({ modal, setModal }) => {
  const { projectData } = useContext(AuthContext);

  const [itemList, setItemList] = useState(null);
  const [displayList, setDisplayList] = useState(null);
  const [issueCount, setIssueCount] = useState(0);

  const [dropdowns, setDropdowns] = useState({
    statusFilter: false,
  });
  const [filters, setFilters] = useState({
    statusFilter: {
      New: false,
      Rejected: false,
      Resolved: false,
      Unresolved: false,
    },
  });

  const issueData = projectData?.issueHistory;

  // Filter results
  const filterTheList = () => {
    // pull out selected filters for statuses
    const statusFilters = Object.keys(filters.statusFilter).filter(
      (s) => filters.statusFilter[s] === true
    );

    // copy full list to begin filtering
    let filteredList = itemList;

    // filter out the chosen statuses
    if (statusFilters.length > 0)
      filteredList = filteredList.filter((item) =>
        statusFilters.includes(item.status)
      );

    // set filtered list if any filters applied
    if (statusFilters.length > 0) return setDisplayList(filteredList);

    // rest display array if clearing filters
    if (statusFilters.length === 0) return setDisplayList(itemList);
  };

  useEffect(() => {
    if (issueData) {
      // create array with reverse chronological values
      const orderedTimestamps = Object.keys(issueData).sort((a, b) =>
        a > b ? -1 : 1
      );
      // map using the id array to ref and create display array
      const readableTimeData = orderedTimestamps.map((id) => {
        // change unixtime to human readable
        const fixedDate = new Date(issueData[id].modified._seconds * 1000)
          .toLocaleDateString()
          .replaceAll("/", "-");
        return {
          ...issueData[id],
          date: {
            created: getDateFromUnix(issueData[id].created._seconds),
            modified: issueData[id].modified
              ? getDateFromUnix(issueData[id].modified._seconds)
              : getDateFromUnix(issueData[id].created._seconds),
          },
          unixId: id,
          unitId: projectData.id,
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
      setIssueCount(currentIssues.length);
      // take unresolved array and concat it witht resolveds to push to bottom
      const displayData = currentIssues.concat(resolvedIssues);

      // populate state
      setDisplayList(displayData);
      setItemList(displayData);
    }
  }, [projectData]);

  return (
    <Wrapper>
      <div className="issues-dash">
        <div className="issues-header">
          <h2>Problèmes</h2>
          <NavLink id="issues-navlink" to="/dashboard/signal-an-issue">
            Signaler un problème
          </NavLink>
        </div>
        <div className="table">
          <div
            className="thead"
            style={{
              width: displayList?.length < 3 ? "100%" : "calc(100% - 16px)",
            }}
          >
            <div className="th">Locataire</div>

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
                              checked={filters.statusFilter[s] ? "checked" : ""}
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

            <div className="th">Modifié le</div>

            <div className="th">Options</div>
          </div>

          <div className="tbody">
            {displayList &&
              displayList.map((i, index) => {
                return (
                  <TenantIssueRow
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

      <div className="mini-dash">
        <img src={tempPic} alt="unit-picture" />
        <div className="info-bar">
          <div className="info-block">
            <h3>Loyer</h3>
            <p>${addComma(Number(projectData?.price))}</p>
          </div>
          <div className="info-block">
            <h3>Problemes</h3>
            <p
              style={{
                color:
                  issueCount > 0 ? `${COLORS.crmRed}` : `${COLORS.crmGreen}`,
              }}
            >
              {issueCount}
            </p>
          </div>
          <NavLink to="/dashboard" className="info-block">
            <h3>Details</h3>
            <img src={dlArrow} alt="go to details page" />
          </NavLink>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  margin: 32px 0;
  display: flex;
  justify-content: space-between;

  ///////// ISSUES SECTION /////////
  div.issues-dash {
    padding: 32px 32px 23px 32px;
    width: calc(66% + 13px);
    height: 300px;

    background-color: white;
    border-radius: 5px;
    box-shadow: ${COLORS.crmBoxShadow};
    border: none;
  }
  div.issues-header {
    display: flex;
    justify-content: space-between;
    height: 32px;
    width: 100%;

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

  ///////// ISSUES TABLE /////////
  div.table {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 200px;
    margin-top: 11px;
    border: none;

    div.thead {
      width: calc(100% - 16px);
      height: 32px;
      display: flex;
      border: none;

      div.th {
        width: calc(20%);
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

    div.option.action {
      cursor: pointer;
    }

    div.tbody {
      height: 100%;
      width: 100%;
      overflow: auto;
      border: none;
    }
  }
  ///////// SIDE DASH /////////
  div.mini-dash {
    width: 30%;
    background-color: white;
    box-shadow: ${COLORS.crmBoxShadow};
    padding: 23px;
    height: 300px;
    border-radius: 5px;

    img {
      width: 100%;
      height: 80%;
      border-radius: 5px;
    }

    div.info-bar {
      width: 100%;
      display: flex;
      justify-content: space-between;
      height: 18%;
      margin-top: 7px;
    }

    .info-block {
      text-decoration: none;
      border: none;
      border-radius: 5px;
      box-shadow: ${COLORS.crmBoxShadow};
      color: ${COLORS.secondary};
      padding: 17px 26px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      h3 {
        font-size: calc(50% + 0.8vmin);
      }

      p {
        font-size: calc(70% + 0.8vmin);
        color: black;
        text-align: center;
      }

      img {
        margin-top: 3px;
      }
    }
  }
`;
