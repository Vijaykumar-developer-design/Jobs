import React, { useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import Cookies from "js-cookie";
import "./index.css";

const profileStatus = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const Profile = () => {
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [profileStatusState, setProfileStatusState] = useState(
    profileStatus.initial
  );

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    setProfileStatusState(profileStatus.inProgress);
    const jwtToken = Cookies.get("jwt_token");
    const url = "https://apis.ccbp.in/profile";
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
        const profileDetails = data.profile_details;
        const updatedProfile = {
          name: profileDetails.name,
          profileImageUrl: profileDetails.profile_image_url,
          shortBio: profileDetails.short_bio,
        };

        setUpdatedProfile(updatedProfile);
        setProfileStatusState(profileStatus.success);
      } else {
        setProfileStatusState(profileStatus.failure);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfileStatusState(profileStatus.failure);
    }
  };

  const onClickRetry = () => {
    getProfile();
  };

  const renderProfileDetails = () => {
    const { profileImageUrl, name, shortBio } = updatedProfile;

    return (
      <div className="profile-bg">
        <img src={profileImageUrl} alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p>{shortBio}</p>
      </div>
    );
  };

  const renderLoadingView = () => (
    <div className="profile-loader">
      <TailSpin type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  );

  const renderFailure = () => (
    <div className="retry-div">
      <button onClick={onClickRetry} className="retry" type="button">
        Retry
      </button>
    </div>
  );

  const renderProfile = () => {
    switch (profileStatusState) {
      case profileStatus.inProgress:
        return renderLoadingView();
      case profileStatus.success:
        return renderProfileDetails();
      case profileStatus.failure:
        return renderFailure();
      default:
        return null;
    }
  };

  return <div className="profile-render-container">{renderProfile()}</div>;
};

export default Profile;
