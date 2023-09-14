import { useState, useEffect, useRef } from "react";
import { projectFirestore } from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";
import Select from "react-select";
import Filters from "../../Components/Filters";
import { Link } from "react-router-dom";

const dataFilter = ["INDIA", "USA", "OTHERS", "INACTIVE"];

export default function MasterStateList() {
  const { addDocument, response } = useFirestore("m_states");
  const { updateDocument, response: responseUpdateDocument } =
    useFirestore("m_states");
  const { documents: masterState, error: masterStateerror } =
    useCollection("m_states");
  const { documents: masterCountry, error: masterCountryerror } =
    useCollection("m_countries");

  const [country, setCountry] = useState();
  const [state, setState] = useState("");
  const [formError, setFormError] = useState(null);
  const [formBtnText, setFormBtnText] = useState("");
  const [currentDocid, setCurrentDocid] = useState(null);

  const [filter, setFilter] = useState("INDIA");

  let countryOptions = useRef([]);
  let countryOptionsSorted = useRef([]);
  if (masterCountry) {
    countryOptions.current = masterCountry.map((countryData) => ({
      label: countryData.country,
      value: countryData.country,
    }));

    countryOptionsSorted.current = countryOptions.current.sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }
  useEffect(() => {
    console.log("in useeffect");
  }, []);

  let results = [];
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    let statename = state.trim().toUpperCase();
    if (currentDocid) {
      await updateDocument(currentDocid, {
        country: country.label,
        state: statename,
      });

      setFormError("Successfully updated");
    } else {
      let ref = projectFirestore
        .collection("m_states")
        .where("state", "==", statename);

      const unsubscribe = ref.onSnapshot(async (snapshot) => {
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });

        if (results.length === 0) {
          const dataSet = {
            country: country.label,
            state: statename,
            status: "active",
          };
          await addDocument(dataSet);
          setFormError("Successfully added");
        } else {
          setFormError("Already added");
        }
      });
    }
  };

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };
  const filteredData = masterState
    ? masterState.filter((document) => {
        let isfiltered = false;
        switch (filter) {
          case "INDIA":
            return document.country === "INDIA"
              ? (isfiltered = true)
              : isfiltered;

          case "USA":
            return document.country === "USA"
              ? (isfiltered = true)
              : isfiltered;

          case "OTHERS":
            if (document.country !== "INDIA" && document.country !== "USA") {
              isfiltered = true;
            }
            return isfiltered;
          case "INACTIVE":
            return isfiltered;
          default:
            return true;
        }
      })
    : null;

  const [handleMoreOptionsClick, setHandleMoreOptionsClick] = useState(false);

  const openMoreAddOptions = () => {
    setHandleMoreOptionsClick(true);
  };
  const closeMoreAddOptions = () => {
    setHandleMoreOptionsClick(false);
  };

  const [handleAddSectionFlag, sethandleAddSectionFlag] = useState(false);
  const handleAddSection = () => {
    setFormError(null);
    sethandleAddSectionFlag(true);
    setFormBtnText("Add State");
    setState("");
    setCurrentDocid(null);
  };

  // const [cityStatus, setCityStatus] = useState();
  const handleChangeStatus = async (docid, status) => {
    // console.log('docid:', docid)
    if (status === "active") status = "inactive";
    else status = "active";
    await updateDocument(docid, {
      status,
    });
  };

  const handleEditCard = (docid, doccountry, docstate) => {
    // console.log('docid in handleEditCard:', docid)
    setFormError(null);
    setCountry({ label: doccountry, value: doccountry });
    setState(docstate);
    sethandleAddSectionFlag(true);
    setFormBtnText("Update State");
    setCurrentDocid(docid);
  };

  return (
    <div>
      <div onClick={openMoreAddOptions} className="property-list-add-property">
        <span className="material-symbols-outlined">apps</span>
      </div>

      <div
        className={
          handleMoreOptionsClick
            ? "more-add-options-div open"
            : "more-add-options-div"
        }
        onClick={closeMoreAddOptions}
        id="moreAddOptions"
      >
        <div className="more-add-options-inner-div">
          <div className="more-add-options-icons">
            <h1>Close</h1>
            <span className="material-symbols-outlined">close</span>
          </div>

          <Link to="/countrylist" className="more-add-options-icons">
            <h1>Country List</h1>
            <span className="material-symbols-outlined">public</span>
          </Link>

          <div
            onClick={handleAddSection}
            className="more-add-options-icons active"
          >
            <h1>Add State</h1>
            <span className="material-symbols-outlined">add</span>
          </div>

          <Link to="/citylist" className="more-add-options-icons">
            <h1>City List</h1>
            <span className="material-symbols-outlined">location_city</span>
          </Link>

          <Link to="/localitylist" className="more-add-options-icons">
            <h1>Locality List</h1>
            <span className="material-symbols-outlined">holiday_village</span>
          </Link>

          <Link to="/societylist" className="more-add-options-icons">
            <h1>Society List</h1>
            <span className="material-symbols-outlined">home</span>
          </Link>
        </div>
      </div>

      <div className="page-title">
        <span className="material-symbols-outlined">flag</span>
        <h1>State List </h1>
      </div>

      <div
        style={{
          overflow: "hidden",
          transition: "2s",
          opacity: handleAddSectionFlag ? "1" : "0",
          maxHeight: handleAddSectionFlag ? "500px" : "0",
        }}
      >
        {/* <form onSubmit={handleSubmit} className="auth-form"> */}
        <form
          onSubmit={handleSubmit}
          className="auth-form"
          style={{ maxWidth: "350px" }}
        >
          <div className="row no-gutters">
            <div className="col-12">
              <div>
                <br />
                <h1 className="owner-heading">Country</h1>
                <Select
                  className=""
                  onChange={(option) => setCountry(option)}
                  options={countryOptionsSorted.current}
                  value={country}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      outline: "none",
                      background: "#eee",
                      borderBottom: " 1px solid var(--theme-blue)",
                    }),
                  }}
                />
                <div className="underline"></div>
              </div>
            </div>
            <div className="col-12">
              <div>
                <br />
                <h1 className="owner-heading">New State</h1>
                <input
                  required
                  type="text"
                  placeholder="Entry State Name"
                  onChange={(e) => setState(e.target.value)}
                  value={state}
                />
              </div>
            </div>
          </div>
          <br />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <button className="btn">{formBtnText}</button>
            <br />
            {formError && (
              <div style={{ margin: "0" }} className="error">
                {formError}
              </div>
            )}
          </div>
          <br />
        </form>
      </div>
      <hr></hr>
      {filteredData && (
        <Filters
          changeFilter={changeFilter}
          filterList={dataFilter}
          filterLength={filteredData.length}
        />
      )}
      <div className="row no-gutters">
        {masterState && masterState.length === 0 && <p>No State Yet!</p>}
        {filteredData &&
          filteredData.map((data) => (
            <>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="property-status-padding-div">
                  <div
                    className="profile-card-div"
                    style={{ position: "relative" }}
                  >
                    <div
                      className="address-div"
                      style={{ paddingBottom: "5px" }}
                    >
                      <div
                        className="icon"
                        style={{ position: "relative", top: "-1px" }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ color: "var(--darkgrey-color)" }}
                        >
                          flag
                        </span>
                      </div>
                      <div className="address-text">
                        <div
                          onClick={() =>
                            handleEditCard(data.id, data.country, data.state)
                          }
                          style={{
                            width: "80%",
                            height: "170%",
                            textAlign: "left",
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            transform: "translateY(-7px)",
                            cursor: "pointer",
                          }}
                        >
                          <h5
                            style={{
                              margin: "0",
                              transform: "translateY(5px)",
                            }}
                          >
                            {data.state}
                          </h5>
                          <small
                            style={{
                              margin: "0",
                              transform: "translateY(5px)",
                            }}
                          >
                            {data.country}
                          </small>
                        </div>
                        <div
                          className=""
                          onClick={() =>
                            handleChangeStatus(data.id, data.status)
                          }
                          style={{
                            width: "20%",
                            height: "calc(100% - -20px)",
                            position: "relative",
                            top: "-8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            cursor: "pointer",
                          }}
                        >
                          <small
                            style={{
                              margin: "0",
                              background:
                                data.status === "active" ? "green" : "red",
                              color: "#fff",
                              padding: "3px 10px 3px 10px",
                              borderRadius: "4px",
                            }}
                          >
                            {data.status}
                          </small>
                          {/* <span className="material-symbols-outlined">
                                                chevron_right
                                            </span> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ))}
      </div>
    </div>
  );
}
