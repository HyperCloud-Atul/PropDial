import Modal from "react-bootstrap/Modal";
import { BarLoader, ClipLoader } from "react-spinners";
const SaveSuccessModal = ({ afterSaveModal, setAfterSaveModal }) => (
  <Modal show={afterSaveModal} onHide={() => setAfterSaveModal(false)} className="delete_modal inspection_modal" centered>
    <h5 className="done_div text-center">
      <img src="/assets/img/icons/check-mark.png" alt="" style={{ height: "65px", width: "auto" }} />
      <h5 className="text_green2 mb-0">Saved Successfully</h5>
    </h5>
    <div className="theme_btn btn_border w-100 no_icon text-center mb-4 mt-4" onClick={() => setAfterSaveModal(false)}>
      Okay
    </div>
  </Modal>
);
export default SaveSuccessModal;