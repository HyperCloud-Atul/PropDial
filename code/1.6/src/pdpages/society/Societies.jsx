import React from "react";
import { useCollection } from "../../hooks/useCollection";
const Societies = () => {
  const { documents: societyDoc, errors: societyDocError } =
    useCollection("m_societies");
  console.log(societyDoc, "societyDoc");
  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      {societyDoc && societyDoc.map((doc, index) => 
      <div>
        {doc.society}
      </div>
      )}
      <div>societies</div>
    </>
  );
};

export default Societies;
