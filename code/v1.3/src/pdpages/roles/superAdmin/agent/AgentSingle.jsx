import React from "react";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { Link } from "react-router-dom";

const AgentSingle = ({ agentDoc }) => {
  const { user } = useAuthContext();
  return (
    <div className="agent_cards ">
      {agentDoc &&
        agentDoc.map((doc) => (
          <div className={`pu_single`}>
            {doc.agentName}
            {user && user.role === "superAdmin" && (
              <Link to={`/edit-agent/${doc.id}`} className="enq_edit">
                <span className="material-symbols-outlined">edit_square</span>
              </Link>
            )}
          </div>
        ))}
    </div>
  );
};

export default AgentSingle;
