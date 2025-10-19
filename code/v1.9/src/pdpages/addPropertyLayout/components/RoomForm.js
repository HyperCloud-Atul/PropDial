import React from "react";
import Select from "react-select";
import { FaPlus, FaTrash } from "react-icons/fa";
import RoomFormFields from "./RoomFormFields";
import { defaultFixtures } from "../hooks/useFixtureOptions"; // ✅ Import defaultFixtures

const RoomForm = ({
  roomKey,
  layouts,
  fixtureOptions,
  onFieldChange,
  onMultiSelectChange,
  onFlooringChange,
  onImageUpload,
  onDeleteImage,
  onSave,
  isSaving
}) => {
  const flooringOptions = [
    { value: "Vitrified tiles", label: "Vitrified tiles" },
    { value: "Concrete", label: "Concrete" },
    { value: "Marble", label: "Marble" },
    { value: "Vinyl", label: "Vinyl" },
    { value: "Wooden Floor", label: "Wooden Floor" },
    { value: "Granite", label: "Granite" },
    { value: "Bamboo", label: "Bamboo" },
    { value: "Laminate", label: "Laminate" },
    { value: "Linoleum", label: "Linoleum" },
    { value: "Terrazzo", label: "Terrazzo" },
    { value: "Red Oxide", label: "Red Oxide" },
    { value: "Brick", label: "Brick" },
  ].sort((a, b) => a.label.localeCompare(b.label));

  return (
    <form className="add_inspection_form">
      <div className="aai_form">
        <div className="row row_gap_20">
          <RoomFormFields
            roomKey={roomKey}
            layouts={layouts}
            onFieldChange={onFieldChange}
          />
          
          <div className="col-md-6">
            <div className="form_field w-100 aai_form_field">
              <h6 className="aaiff_title">Flooring Type</h6>
              <div className="field_box w-100">
                <Select
                  options={flooringOptions}
                  value={
                    layouts[roomKey]?.flooringType
                      ? {
                          value: layouts[roomKey]?.flooringType,
                          label: layouts[roomKey]?.flooringType,
                        }
                      : null
                  }
                  onChange={(selectedOption) => onFlooringChange(roomKey, selectedOption)}
                  placeholder="Select flooring type"
                />
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="form_field w-100 aai_form_field">
              <h6 className="aaiff_title">Fixtures</h6>
              <div className="field_box w-100">
                <Select
                  isMulti
                  options={fixtureOptions}
                  value={fixtureOptions.filter((option) =>
                    (layouts[roomKey]?.fixtureBySelect || defaultFixtures).includes(option.value)
                  )}
                  onChange={(selectedOptions) => onMultiSelectChange(roomKey, selectedOptions)}
                />
              </div>
            </div>
          </div>

          <ImageUploadSection
            roomKey={roomKey}
            layouts={layouts}
            onImageUpload={onImageUpload}
            onDeleteImage={onDeleteImage}
          />

          <div className="col-12">
            <button
              className="theme_btn no_icon btn_fill full_width"
              onClick={onSave}
              disabled={isSaving}
              style={{ opacity: isSaving ? "0.5" : "1" }}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

const ImageUploadSection = ({ roomKey, layouts, onImageUpload, onDeleteImage }) => (
  <div className="col-12">
    <div className="form_field w-100 aai_form_field">
      <h6 className="aaiff_title">
        Upload images <span>(Maximum 5)</span>
      </h6>
      <div className="add_and_images">
        {layouts[roomKey]?.images?.map((image, index) => (
          <div key={index} className="uploaded_images relative">
            <img src={image.url} alt={`Uploaded ${index}`} />
            <div className="trash_icon">
              <FaTrash
                size={14}
                color="red"
                onClick={() => onDeleteImage(roomKey, index)}
              />
            </div>
          </div>
        ))}

        {(!layouts[roomKey]?.images || layouts[roomKey].images.length < 5) && (
          <>
            <div
              onClick={() =>
                document.getElementById(`file-input-${roomKey}`).click()
              }
              className="add_icon"
            >
              <FaPlus size={24} color="#555" />
            </div>
            <input
              type="file"
              id={`file-input-${roomKey}`}
              style={{ display: "none" }}
              onChange={(e) => onImageUpload(e, roomKey)}
            />
          </>
        )}
      </div>
    </div>
  </div>
);

export default RoomForm;