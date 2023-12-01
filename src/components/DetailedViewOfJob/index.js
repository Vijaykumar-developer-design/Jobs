import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import Cookies from "js-cookie";
import { BsFillBagFill } from "react-icons/bs";
import { AiFillStar } from "react-icons/ai";
import { GoLocation, GoLinkExternal } from "react-icons/go";
import Skill from "../Skills";
import SimilarJobs from "../SimilarJobs";
import Header from "../Header";
import "./index.css";

const DetailedStatus = {
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const DetailedView = ({ match }) => {
  const [presentJob, setPresentJob] = useState({});
  const [skills, setSkills] = useState([]);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [companyLife, setCompanyLife] = useState({});
  const [apiStatus, setApiStatus] = useState(DetailedStatus.inProgress);
  const history = useHistory();
  const getDetails = useCallback(async () => {
    setApiStatus(DetailedStatus.inProgress);
    const { id } = match.params;
    const jwtToken = Cookies.get("jwt_token");
    const url = `https://apis.ccbp.in/jobs/${id}`;
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: "GET",
    };

    try {
      const response = await fetch(url, options);

      if (response.ok) {
        const data = await response.json();

        const updatedDetails = {
          companyLogo: data.job_details.company_logo_url,
          companyWebUrl: data.job_details.company_website_url,
          employmentType: data.job_details.employment_type,
          id: data.job_details.id,
          jobDescription: data.job_details.job_description,
          location: data.job_details.location,
          packageLpa: data.job_details.package_per_annum,
          rating: data.job_details.rating,
          title: data.job_details.title,
        };

        const updatedSkills = data.job_details.skills.map((each) => ({
          skillImgUrl: each.image_url,
          skillName: each.name,
        }));

        const similarJobs = data.similar_jobs.map((each) => ({
          companyLogo: each.company_logo_url,
          employmentType: each.employment_type,
          id: each.id,
          jobDescription: each.job_description,
          location: data.job_details.location,
          rating: data.job_details.rating,
          title: data.job_details.title,
        }));

        const companyDetails = {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        };

        setPresentJob(updatedDetails);
        setSkills(updatedSkills);
        setSimilarJobs(similarJobs);
        setCompanyLife(companyDetails);
        setApiStatus(DetailedStatus.success);
      } else {
        setApiStatus(DetailedStatus.failure);
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
      setApiStatus(DetailedStatus.failure);
    }
  }, [match.params]);

  useEffect(() => {
    getDetails();
  }, [getDetails]);

  const renderLifeAtCompany = () => {
    // const { companyLife } = this.state;
    const { imageUrl, description } = companyLife;
    return (
      <div>
        <h1>Life at Company</h1>
        <div className="life-div">
          <p>{description}</p>
          <img className="life-img" src={imageUrl} alt="life at company" />
        </div>
      </div>
    );
  };

  const renderSuccessView = () => {
    const {
      employmentType,
      companyLogo,
      companyWebUrl,
      jobDescription,
      location,
      packageLpa,
      rating,
      title,
    } = presentJob;
    return (
      <div className="job-card-detailed">
        <div>
          <div className="logo-container">
            <img
              className="logo-cm"
              src={companyLogo}
              alt="job details company logo"
            />
            <div>
              <h1>{title}</h1>
              <div className="rating-container">
                <AiFillStar className="fill" />
                <p>{rating}</p>
              </div>
            </div>
          </div>

          <div className="location-lpa-d">
            <div className="icons-flex">
              <GoLocation className="icons" />
              <p>{location}</p>
            </div>
            <div className="icons-flex">
              <BsFillBagFill className="icons" />
              <p>{employmentType}</p>
            </div>
            <p>{packageLpa} </p>
          </div>

          <hr />
          <div className="web-link">
            <h1>Description</h1>
            <a
              className="anchor"
              href={companyWebUrl}
              rel="noreferrer"
              target="_blank"
            >
              <div className="link-div">
                Visit
                <GoLinkExternal />
              </div>
            </a>
          </div>
          <p>{jobDescription}</p>
          <h1>Skills</h1>

          <ul className="skills-lists">
            {skills.map((each) => (
              <Skill skillList={each} key={each.skillName} />
            ))}
          </ul>

          {renderLifeAtCompany()}
        </div>
      </div>
    );
  };

  const renderSuccessList = () => (
    <div>
      {renderSuccessView()} {renderSimilar()}
    </div>
  );

  const renderSimilar = () => {
    return (
      <>
        <h1 className="similar-head">Similar Jobs</h1>
        <ul className="similar-list">
          {similarJobs.map((each) => (
            <SimilarJobs similarJob={each} key={each.id} />
          ))}
        </ul>
      </>
    );
  };

  const onClickReloadList = () => {
    getDetails();
  };

  const renderFailureView = () => (
    <div className="failure-div-similar">
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

  const renderLoadindView = () => (
    <div className="loader-container">
      <TailSpin type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  );

  const renderResult = () => {
    switch (apiStatus) {
      case DetailedStatus.success:
        return renderSuccessList();
      case DetailedStatus.failure:
        return renderFailureView();
      case DetailedStatus.inProgress:
        return renderLoadindView();
      default:
        return null;
    }
  };

  return (
    <div className="similar-bg">
      <Header history={history} />
      {renderResult()}
    </div>
  );
};

export default DetailedView;
