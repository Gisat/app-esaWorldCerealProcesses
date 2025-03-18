"use client";

import {string, func} from "prop-types";
import logoData from "../logo";
import Link from "next/link";
import { pages } from "@features/(processes)/_constants/app";
import "./style.css";

const Title = () => {
  const title = "Processes";
  return (
    <Link className="worldCereal-Title" href={`/${pages.home.url}`}>
      <div>
        <img src={`data:image/jpeg;base64,${logoData}`} alt="Celeals Logo" />
      </div>
      <h1>
        <span>WorldCereal</span>
        <span>{title}</span>
      </h1>
    </Link>
  );
};

Title.propTypes = {
  className: string,
  openOverlay: func,
  title: string,
};

export default Title;
