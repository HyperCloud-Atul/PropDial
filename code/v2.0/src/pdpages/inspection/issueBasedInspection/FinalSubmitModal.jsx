import Modal from "react-bootstrap/Modal";
import { BarLoader, ClipLoader } from "react-spinners";

const FinalSubmitModal = ({ finalSubmit, setFinalSubmit, handleFinalSubmit, finalSubmiting }) => (
  <Modal show={finalSubmit} onHide={() => setFinalSubmit(false)} centered>
    <Modal.Header className="justify-content-center" style={{ paddingBottom: "0px", border: "none" }}>
      <h5>Final Submission</h5>
    </Modal.Header>
    <Modal.Body className="text-center" style={{ color: "#FA6262", fontSize: "18px", border: "none" }}>
      After final submission, you won't be able to edit this inspection. Are you sure you want to proceed?
    </Modal.Body>
    <Modal.Footer className="d-flex justify-content-between" style={{ border: "none", gap: "15px" }}>
      <button 
        className="theme_btn no_icon btn_border" 
        onClick={() => setFinalSubmit(false)}
        disabled={finalSubmiting}
      >
        Cancel
      </button>
      <button 
        className="theme_btn no_icon btn_fill" 
        onClick={handleFinalSubmit}
        disabled={finalSubmiting}
      >
        {finalSubmiting ? "Processing..." : "Final Submit"}
      </button>
    </Modal.Footer>
  </Modal>
);

export default FinalSubmitModal;