import React from "react";
import { ClipLoader } from "react-spinners";

const LoadingState = () => (
  <div className="page_loader">
    <ClipLoader color="var(--theme-green2)" loading={true} />
  </div>
);

export default LoadingState;