"use client";

import {string, func} from "prop-types";
import logoData from "../Header/logo";
import "./style.css";

const Title = () => {
  const title = "Processes";
  const openOverlay = () => {
    console.log("open overlay");
  };
  return (
    <div className="worldCereal-Title" onClick={openOverlay}>
      <div>
        <img src={`data:image/jpeg;base64,${logoData}`} alt="Celeals Logo" />
      </div>
      <h1>
        <span>WorldCereal</span>
        <span>{title}</span>
      </h1>
    </div>
  );
};

Title.propTypes = {
  className: string,
  openOverlay: func,
  title: string,
};

export default Title;
