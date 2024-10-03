"use client";

import PropTypes from "prop-types";
import logoData from "../Header/logo";
import "./style.scss";

const Title = () => {
  const title = "Processes";
  const openOverlay = () => {
    console.log("open overlay");
  };
  return (
    <div className="worldCereal-Title" onClick={openOverlay}>
      <div>
        <img src={`data:image/jpeg;base64,${logoData}`} />
      </div>
      <h1>
        <span>WorldCereal</span>
        <span>{title}</span>
      </h1>
    </div>
  );
};

Title.propTypes = {
  className: PropTypes.string,
  openOverlay: PropTypes.func,
  title: PropTypes.string,
};

export default Title;
