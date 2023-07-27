import React from "react";

const PopupMessage = () => {
  return (
    <div>
      {setInterval(() => {
        document.write("Naman Gaur");
      }, 3000)}
    </div>
  );
};

export default PopupMessage;
