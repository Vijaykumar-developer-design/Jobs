import React, { useState, useEffect, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import Cookies from "js-cookie";
import { BsSearch, BsFillBagFill } from "react-icons/bs";
import { GoLocation } from "react-icons/go";
import { AiFillStar } from "react-icons/ai";
import "./index.css";
import Employment from "../EmploymentOptions";
import Header from "../Header";
import Profile from "../Profile";

const employmentTypesList = [
  {
    label: "Full Time",
    employmentTypeId: "FULLTIME",
  },
  {
    label: "Part Time",
    employmentTypeId: "PARTTIME",
  },
  {
    label: "Freelance",
    employmentTypeId: "FREELANCE",
  },
  {
    label: "Internship",
    employmentTypeId: "INTERNSHIP",
  },
];

const salaryRangesList = [
  {
    salaryRangeId: "1000000",
    label: "10 LPA and above",
  },
  {
    salaryRangeId: "2000000",
    label: "20 LPA and above",
  },
  {
    salaryRangeId: "3000000",
    label: "30 LPA and above",
  },
  {
    salaryRangeId: "4000000",
    label: "40 LPA and above",
  },
];

const ListStatus = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const ActiveJobList = () => {
  const history = useHistory();
  const [activeJobs, setActiveJobs] = useState([]);
  const [requestStatus, setRequestStatus] = useState(ListStatus.initial);
  const [searchInput, setSearchInput] = useState("");
  const [employmentType, setEmploymentType] = useState([]);
  const [salaryRange, setSalaryRange] = useState(0);

  const getAllJobs = useCallback(async () => {
    const types = employmentType.join("");

    setRequestStatus(ListStatus.inProgress);
    const jwtToken = Cookies.get("jwt_token");
    const url = `https://apis.ccbp.in/jobs?employment_type=${types}&minimum_package=${salaryRange}&search=${searchInput}`;
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (response.ok) {
        const updatedData = data.jobs.map((each) => ({
          companyLogoUrl: each.company_logo_url,
          employmentType: each.employment_type,
          id: each.id,
          jobDescription: each.job_description,
          location: each.location,
          package: each.package_per_annum,
          rating: each.rating,
          title: each.title,
        }));
        // console.log(updatedData);
        setActiveJobs(updatedData);
        setRequestStatus(ListStatus.success);
      } else {
        setRequestStatus(ListStatus.failure);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }, [employmentType, salaryRange, searchInput]);

  useEffect(() => {
    getAllJobs();
  }, [getAllJobs]);

  const changeSearchInput = (event) => {
    setSearchInput(event.target.value);
  };

  const onEnterKey = (event) => {
    if (event.key === "Enter") {
      getAllJobs();
    }
  };

  const OnClickSearchJob = () => {
    getAllJobs();
  };

  const renderSuccessView = () => {
    return (
      <div>
        <ul className="active-list">
          {activeJobs.map((each) => (
            <Link key={each.id} className="link-card" to={`/jobs/${each.id}`}>
              <li className="job-card">
                <div>
                  <div className="logo-container">
                    <img
                      className="logo"
                      src={each.companyLogoUrl}
                      alt="company logo"
                    />
                    <div>
                      <h1 className="job-card-heading">{each.title}</h1>
                      <div className="rating-container">
                        <AiFillStar className="fill" />
                        <p>{each.rating}</p>
                      </div>
                    </div>
                  </div>
                  <div className="location-lpa">
                    <div className="icons-flex">
                      <GoLocation className="icons" />
                      <p>{each.location}</p>
                    </div>
                    <div className="icons-flex">
                      <BsFillBagFill className="icons" />
                      <p>{each.employmentType}</p>
                    </div>
                    <p>{each.package} </p>
                  </div>
                  <hr />
                  <h1>Description</h1>
                  <p>{each.jobDescription}</p>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    );
  };

  const onClickReloadList = () => {
    getAllJobs();
  };

  const renderNoJobsFound = () => (
    <div className="no-jobs">
      <img
        className="no-job-img"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1 className="no-jobs-text">No Jobs Found</h1>
      <p className="no-jobs-text">
        We could not find any jobs. Try other filters
      </p>
    </div>
  );

  const showJobs = () => {
    return activeJobs.length > 0 ? renderSuccessView() : renderNoJobsFound();
  };

  const renderFailureView = () => (
    <div className="failure-div">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        onClick={onClickReloadList}
        className="failure-retry"
        type="button"
      >
        Retry
      </button>
    </div>
  );

  const renderLoadingView = () => (
    <div className="loader-container">
      <TailSpin color="#ffffff" height="50" width="50" />
    </div>
  );

  const renderJobsList = () => {
    switch (requestStatus) {
      case ListStatus.success:
        return showJobs();
      case ListStatus.failure:
        return renderFailureView();
      case ListStatus.inProgress:
        return renderLoadingView();
      default:
        return null;
    }
  };

  const changeEmploymentType = (value) => {
    const { values, checkStatus } = value;
    if (checkStatus === true) {
      setEmploymentType((prevState) => [...prevState, values]);
    } else {
      setEmploymentType((prevEmploymentType) =>
        prevEmploymentType.filter((type) => type !== values)
      );
    }
  };

  const changeSalaryRange = (salary) => {
    setSalaryRange(salary);
  };

  return (
    <div className="active-bg-container">
      <Header history={history} />
      <div className="flex-dives">
        <div className="first-flex-container">
          <Profile />
          <Employment
            employmentTypesList={employmentTypesList}
            salaryRangesList={salaryRangesList}
            changeEmploymentType={changeEmploymentType}
            changeSalaryRange={changeSalaryRange}
          />
        </div>
        <div className="top-search-container">
          <div className="search-div">
            <input
              value={searchInput}
              onChange={changeSearchInput}
              onKeyDown={onEnterKey}
              placeholder="Search"
              className="search-input"
              type="search"
            />
            <button
              onClick={OnClickSearchJob}
              className="search-btn"
              type="button"
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div className="all-containers">{renderJobsList()}</div>
        </div>
      </div>
    </div>
  );
};

export default ActiveJobList;
