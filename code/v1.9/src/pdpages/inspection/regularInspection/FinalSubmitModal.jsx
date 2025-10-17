import Modal from "react-bootstrap/Modal";
import { BarLoader, ClipLoader } from "react-spinners";

const FinalSubmitModal = ({ finalSubmit, setFinalSubmit, handleFinalSubmit, finalSubmiting }) => (
  <Modal show={finalSubmit} onHide={() => setFinalSubmit(false)} centered>
    <Modal.Header className="justify-content-center" style={{ paddingBottom: "0px", border: "none" }}>
      <h5>Alert</h5>
    </Modal.Header>
    <Modal.Body className="text-center" style={{ color: "#FA6262", fontSize: "20px", border: "none" }}>
      After final submission, you won't be able to edit this inspection.
    </Modal.Body>
    <Modal.Footer className="d-flex justify-content-between" style={{ border: "none", gap: "15px" }}>
      <div className="cancel_btn" onClick={() => setFinalSubmit(false)}>Cancel</div>
      <div className="done_btn" onClick={handleFinalSubmit}>
        {finalSubmiting ? "Processing..." : "Proceed"}
      </div>
    </Modal.Footer>
  </Modal>
);

export default FinalSubmitModal;