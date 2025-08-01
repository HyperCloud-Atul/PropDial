import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { projectFirestore } from "../../firebase/config";
import "./Oldpg-society-page.scss";

export default function PGSocietyPage() {
  const { id } = useParams();
  const [society, setSociety] = useState(null);
  const [error, setError] = useState(null);

  // State for all editable sections
  const [editingSection, setEditingSection] = useState(null);

  // Property Management Section
  const [propertyForm, setPropertyForm] = useState({
    societyType: "",
    state: "",
    locality: "",
    societyName: "",
    societyAddress: "",
    googleMapCode: "",
    societySlug: "",
    societyDescription: "",
    builderName: "",
    isActive: true,
  });

  // Hero Section
  const [heroForm, setHeroForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    backgroundImage: "",
  });

  // About Section
  const [aboutForm, setAboutForm] = useState({
    description: "",
    stats: [],
  });

  // Other Sections
  const [facilitiesForm, setFacilitiesForm] = useState([]);
  const [nearbyForm, setNearbyForm] = useState([]);
  const [testimonialsForm, setTestimonialsForm] = useState([]);

  // Animation effects
  useEffect(() => {
    const counters = document.querySelectorAll(".stat-number");
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counter = entry.target;
            const target = +counter.dataset.target;
            const update = () => {
              const current = +counter.innerText.replace("+", "");
              const increment = Math.ceil(target / 100);
              if (current < target) {
                counter.innerText = `${Math.min(current + increment, target)}+`;
                setTimeout(update, 20);
              }
            };
            update();
            observerInstance.unobserve(counter);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));

    // Fade-in animation
    const fadeElements = document.querySelectorAll(".fade-in");
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.1 }
    );
    fadeElements.forEach((el) => fadeObserver.observe(el));
  }, []);

  // Load society data
  useEffect(() => {
    const unsub = projectFirestore
      .collection("m_societies")
      .doc(id)
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            const data = doc.data();
            setSociety({ id: doc.id, ...data });

            // Initialize Property Management form
            setPropertyForm({
              societyType: data.societyType || "",
              state: data.state || "",
              locality: data.locality || "",
              societyName: data.society || "",
              societyAddress: data.address || "",
              googleMapCode: data.googleMapCode || "",
              societySlug: data.slug || "",
              societyDescription: data.description || "",
              builderName: data.builderName || "",
              isActive: data.isActive !== false,
            });

            // Initialize Hero form
            setHeroForm({
              title: data.society || "",
              subtitle: data.subtitle || "A community built for life",
              description:
                data.heroDescription ||
                "Modern living spaces with comfort and luxury.",
              backgroundImage:
                data.backgroundImage ||
                "https://cdn.pixabay.com/photo/2020/03/03/12/03/buildings-4898536_1280.jpg",
            });

            // Initialize About form
            setAboutForm({
              description:
                data.aboutDescription ||
                "Nestled in the heart of the city, Darshan Residency offers a blend of comfort, luxury, and convenience.",
              stats: data.stats || [
                { value: "500", label: "Residences" },
                { value: "24/7", label: "Security" },
                { value: "100", label: "Amenities" },
                { value: "", label: "Friendly infrastructure" },
              ],
            });

            // Initialize other forms
            setFacilitiesForm(
              data.facilities || [
                "Swimming Pool",
                "Gymnasium",
                "Community Hall",
                "Jogging Track",
                "Play Area",
                "Amphitheatre",
                "Smart Parking",
                "Library",
              ]
            );

            setNearbyForm(
              data.nearbyEssentials || [
                {
                  title: "Schools",
                  places: [
                    "Sunrise Public School (0.5 km)",
                    "Greenfield Academy (1.2 km)",
                  ],
                },
                {
                  title: "Clubs",
                  places: [
                    "Elite Sports Club (0.8 km)",
                    "Art & Culture Hub (1.5 km)",
                  ],
                },
                {
                  title: "Hospitals",
                  places: [
                    "City Care Hospital (1.1 km)",
                    "Wellness Clinic (0.7 km)",
                  ],
                },
                {
                  title: "Shopping",
                  places: ["Metro Mall (2.0 km)", "The Food Street (1.4 km)"],
                },
              ]
            );

            setTestimonialsForm(
              data.testimonials || [
                "Living here has been a wonderful experience. It's safe, green, and vibrant!",
                "Facilities are top-notch, and my kids love the play area and library.",
              ]
            );
          } else {
            setError("Society not found");
          }
        },
        (err) => setError(err.message)
      );

    return () => unsub();
  }, [id]);

  // Handle input changes for Property Management
  const handlePropertyInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPropertyForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle input changes for other sections
  const handleInputChange = (section, e) => {
    const { name, value } = e.target;
    switch (section) {
      case "hero":
        setHeroForm((prev) => ({ ...prev, [name]: value }));
        break;
      case "about":
        setAboutForm((prev) => ({ ...prev, [name]: value }));
        break;
    }
  };

  // Handle array input changes
  const handleArrayInputChange = (section, index, field, value) => {
    switch (section) {
      case "facilities":
        const newFacilities = [...facilitiesForm];
        newFacilities[index] = value;
        setFacilitiesForm(newFacilities);
        break;
      case "testimonials":
        const newTestimonials = [...testimonialsForm];
        newTestimonials[index] = value;
        setTestimonialsForm(newTestimonials);
        break;
      case "nearby":
        const newNearby = [...nearbyForm];
        newNearby[index] = { ...newNearby[index], [field]: value };
        setNearbyForm(newNearby);
        break;
      case "aboutStats":
        const newStats = [...aboutForm.stats];
        newStats[index] = { ...newStats[index], [field]: value };
        setAboutForm({ ...aboutForm, stats: newStats });
        break;
    }
  };

  // Add new items to arrays
  const addArrayItem = (section) => {
    switch (section) {
      case "facilities":
        setFacilitiesForm([...facilitiesForm, ""]);
        break;
      case "testimonials":
        setTestimonialsForm([...testimonialsForm, ""]);
        break;
      case "nearby":
        setNearbyForm([...nearbyForm, { title: "", places: [""] }]);
        break;
      case "aboutStats":
        setAboutForm({
          ...aboutForm,
          stats: [...aboutForm.stats, { value: "", label: "" }],
        });
        break;
    }
  };

  // Remove items from arrays
  const removeArrayItem = (section, index) => {
    switch (section) {
      case "facilities":
        setFacilitiesForm(facilitiesForm.filter((_, i) => i !== index));
        break;
      case "testimonials":
        setTestimonialsForm(testimonialsForm.filter((_, i) => i !== index));
        break;
      case "nearby":
        setNearbyForm(nearbyForm.filter((_, i) => i !== index));
        break;
      case "aboutStats":
        setAboutForm({
          ...aboutForm,
          stats: aboutForm.stats.filter((_, i) => i !== index),
        });
        break;
    }
  };

  // Save section data to Firebase
  const saveSection = async (section) => {
    try {
      const updates = {};

      switch (section) {
        case "property":
          updates.societyType = propertyForm.societyType;
          updates.state = propertyForm.state;
          updates.locality = propertyForm.locality;
          updates.society = propertyForm.societyName;
          updates.address = propertyForm.societyAddress;
          updates.googleMapCode = propertyForm.googleMapCode;
          updates.slug = propertyForm.societySlug;
          updates.description = propertyForm.societyDescription;
          updates.builderName = propertyForm.builderName;
          updates.isActive = propertyForm.isActive;
          break;
        case "hero":
          updates.society = heroForm.title;
          updates.subtitle = heroForm.subtitle;
          updates.heroDescription = heroForm.description;
          updates.backgroundImage = heroForm.backgroundImage;
          break;
        case "about":
          updates.aboutDescription = aboutForm.description;
          updates.stats = aboutForm.stats;
          break;
        case "facilities":
          updates.facilities = facilitiesForm;
          break;
        case "nearby":
          updates.nearbyEssentials = nearbyForm;
          break;
        case "testimonials":
          updates.testimonials = testimonialsForm;
          break;
      }

      await projectFirestore
        .collection("m_societies")
        .doc(id)
        .set(updates, { merge: true });
      setEditingSection(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!society) return <p>Loading...</p>;
  console.log(society);
  return (
    <>
      <div className="pg-page">
        {/* Hero Section */}
        <section
          className="hero-section fade-in"
          style={{
            backgroundImage: `url(${heroForm.backgroundImage})`,
          }}
        >
          <div className="overlay"></div>
          <div className="hero-content">
            {editingSection === "hero" ? (
              <div className="edit-form">
                <input
                  type="text"
                  name="title"
                  value={heroForm.title}
                  onChange={(e) => handleInputChange("hero", e)}
                  placeholder="Society Name"
                />
                <input
                  type="text"
                  name="subtitle"
                  value={heroForm.subtitle}
                  onChange={(e) => handleInputChange("hero", e)}
                  placeholder="Subtitle"
                />
                <textarea
                  name="description"
                  value={heroForm.description}
                  onChange={(e) => handleInputChange("hero", e)}
                  placeholder="Description"
                />
                <input
                  type="text"
                  name="backgroundImage"
                  value={heroForm.backgroundImage}
                  onChange={(e) => handleInputChange("hero", e)}
                  placeholder="Background Image URL"
                />
                <div className="form-actions">
                  <button onClick={() => setEditingSection(null)}>
                    Cancel
                  </button>
                  <button onClick={() => saveSection("hero")}>Save</button>
                </div>
              </div>
            ) : (
              <>
                <h1>{heroForm.title}</h1>
                <h2>{heroForm.subtitle}</h2>
                <p>{heroForm.description}</p>
                <button
                  className="edit-button"
                  onClick={() => setEditingSection("hero")}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </section>

        {/* About Section */}
        <section className="section about-section fade-in">
          <div className="container text-center">
            {editingSection === "about" ? (
              <div className="edit-form">
                <h2>About The Society</h2>
                <textarea
                  name="description"
                  value={aboutForm.description}
                  onChange={(e) => handleInputChange("about", e)}
                  placeholder="Description"
                />
                <div className="stats-grid">
                  {aboutForm.stats.map((stat, index) => (
                    <div key={index} className="stat-box">
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) =>
                          handleArrayInputChange(
                            "aboutStats",
                            index,
                            "value",
                            e.target.value
                          )
                        }
                        placeholder="Value"
                      />
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) =>
                          handleArrayInputChange(
                            "aboutStats",
                            index,
                            "label",
                            e.target.value
                          )
                        }
                        placeholder="Label"
                      />
                      <button
                        onClick={() => removeArrayItem("aboutStats", index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addArrayItem("aboutStats")}>
                    Add Stat
                  </button>
                </div>
                <div className="form-actions">
                  <button onClick={() => setEditingSection(null)}>
                    Cancel
                  </button>
                  <button onClick={() => saveSection("about")}>Save</button>
                </div>
              </div>
            ) : (
              <>
 <h2>About The Society</h2>
              <p className="description">{aboutForm.description}</p>
              
              <div className="stats-grid">
                {aboutForm.stats.map(({ value, label }, index) => (
                  <div key={index} className="stat-box">
                    <h3 
                      className={value && !isNaN(value) ? "stat-number" : ""}
                      data-target={value && !isNaN(value) ? value : null}
                    >
                      {value || "Eco-"}
                    </h3>
                    <p>{label}</p>
                  </div>
                ))}
              </div>

  <button 
    className="edit-button"
    onClick={() => setEditingSection('about')}
  >
    Edit
  </button>
</>

            )}
          </div>
        </section>

        {/* Facilities Section */}
        <section className="section facilities-section fade-in">
          <div className="container text-center">
            {editingSection === "facilities" ? (
              <div className="edit-form">
                <h2>Facilities</h2>
                <div className="grid">
                  {facilitiesForm.map((facility, index) => (
                    <div key={index} className="facility-box">
                      <input
                        type="text"
                        value={facility}
                        onChange={(e) =>
                          handleArrayInputChange(
                            "facilities",
                            index,
                            null,
                            e.target.value
                          )
                        }
                      />
                      <button
                        onClick={() => removeArrayItem("facilities", index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addArrayItem("facilities")}>
                    Add Facility
                  </button>
                </div>
                <div className="form-actions">
                  <button onClick={() => setEditingSection(null)}>
                    Cancel
                  </button>
                  <button onClick={() => saveSection("facilities")}>
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2>Facilities</h2>
                <div className="grid">
                  {facilitiesForm.map((facility, idx) => (
                    <div key={idx} className="facility-box">
                      {facility}
                    </div>
                  ))}
                </div>
                <button
                  className="edit-button"
                  onClick={() => setEditingSection("facilities")}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </section>

        {/* Property Management Section */}
        <section className="section management-section fade-in">
          <div className="container">
            <div className="management-header">
              <h2>PROPERTY MANAGEMENT</h2>
              <button
                onClick={() =>
                  setEditingSection(
                    editingSection === "property" ? null : "property"
                  )
                }
                className="edit-button"
              >
                {editingSection === "property" ? "Cancel" : "Edit"}
              </button>
            </div>

            {editingSection === "property" ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveSection("property");
                }}
                className="society-form"
              >
                <div className="form-group">
                  <label>Select Society Type</label>
                  <select
                    name="societyType"
                    value={propertyForm.societyType}
                    onChange={handlePropertyInputChange}
                  >
                    <option value="">Select Type</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Society Name</label>
                  <input
                    type="text"
                    name="societyName"
                    value={propertyForm.societyName}
                    onChange={handlePropertyInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Society Address</label>
                  <textarea
                    name="societyAddress"
                    value={propertyForm.societyAddress}
                    onChange={handlePropertyInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Google Map Code</label>
                  <input
                    type="text"
                    name="googleMapCode"
                    value={propertyForm.googleMapCode}
                    onChange={handlePropertyInputChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Society Slug</label>
                    <input
                      type="text"
                      name="societySlug"
                      value={propertyForm.societySlug}
                      onChange={handlePropertyInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Builder Name</label>
                    <input
                      type="text"
                      name="builderName"
                      value={propertyForm.builderName}
                      onChange={handlePropertyInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Society Description</label>
                  <textarea
                    name="societyDescription"
                    value={propertyForm.societyDescription}
                    onChange={handlePropertyInputChange}
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={propertyForm.isActive}
                      onChange={handlePropertyInputChange}
                    />
                    Society Active
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="submit-button">
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="society-details">
                <div className="detail-row">
                  <span className="detail-label">Society Type:</span>
                  <span>{propertyForm.societyType || "Not specified"}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">State:</span>
                  <span>{propertyForm.state || "Not specified"}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Locality:</span>
                  <span>{propertyForm.locality || "Not specified"}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Society Name:</span>
                  <span>{propertyForm.societyName || "Not specified"}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Address:</span>
                  <span>{propertyForm.societyAddress || "Not specified"}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Google Map Code:</span>
                  <span>{propertyForm.googleMapCode || "Not specified"}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Society Slug:</span>
                  <span>{propertyForm.societySlug || "Not specified"}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Builder Name:</span>
                  <span>{propertyForm.builderName || "Not specified"}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Description:</span>
                  <span>
                    {propertyForm.societyDescription || "Not specified"}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span>{propertyForm.isActive ? "Active" : "Inactive"}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Nearby Essentials Section */}
        <section className="section nearby-section fade-in">
          <div className="container text-center">
            {editingSection === "nearby" ? (
              <div className="edit-form">
                <h2>Nearby Essentials</h2>
                <div className="nearby-grid">
                  {nearbyForm.map((item, index) => (
                    <div key={index} className="nearby-box">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          handleArrayInputChange(
                            "nearby",
                            index,
                            "title",
                            e.target.value
                          )
                        }
                        placeholder="Category Title"
                      />
                      <ul>
                        {item.places.map((place, placeIndex) => (
                          <li key={placeIndex}>
                            <input
                              type="text"
                              value={place}
                              onChange={(e) => {
                                const newPlaces = [...item.places];
                                newPlaces[placeIndex] = e.target.value;
                                handleArrayInputChange(
                                  "nearby",
                                  index,
                                  "places",
                                  newPlaces
                                );
                              }}
                              placeholder="Place name"
                            />
                            <button
                              onClick={() => {
                                const newPlaces = item.places.filter(
                                  (_, i) => i !== placeIndex
                                );
                                handleArrayInputChange(
                                  "nearby",
                                  index,
                                  "places",
                                  newPlaces
                                );
                              }}
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                        <button
                          onClick={() => {
                            const newPlaces = [...item.places, ""];
                            handleArrayInputChange(
                              "nearby",
                              index,
                              "places",
                              newPlaces
                            );
                          }}
                        >
                          Add Place
                        </button>
                      </ul>
                      <button onClick={() => removeArrayItem("nearby", index)}>
                        Remove Category
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addArrayItem("nearby")}>
                    Add Category
                  </button>
                </div>
                <div className="form-actions">
                  <button onClick={() => setEditingSection(null)}>
                    Cancel
                  </button>
                  <button onClick={() => saveSection("nearby")}>Save</button>
                </div>
              </div>
            ) : (
              <>
                <h2>Nearby Essentials</h2>
                <div className="nearby-grid">
                  {nearbyForm.map(({ title, places }) => (
                    <div key={title} className="nearby-box">
                      <h3>{title}</h3>
                      <ul>
                        {places.map((place, i) => (
                          <li key={i}>{place}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <button
                  className="edit-button"
                  onClick={() => setEditingSection("nearby")}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </section>

        {/* Gallery Section */}
        {/* <section className="section gallery-section fade-in">
          <div className="container text-center">
            <h2>Gallery</h2>
            <div className="gallery-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="gallery-item">
                  <img
                    src={`https://source.unsplash.com/400x300/?residence,building&sig=${i}`}
                    alt="Gallery"
                  />
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Testimonials Section */}
        <section className="section testimonials-section fade-in">
          <div className="container text-center">
            {editingSection === "testimonials" ? (
              <div className="edit-form">
                <h2>What Residents Say</h2>
                <div className="testimonials">
                  {testimonialsForm.map((testimonial, index) => (
                    <div key={index} className="testimonial-box">
                      <textarea
                        value={testimonial}
                        onChange={(e) =>
                          handleArrayInputChange(
                            "testimonials",
                            index,
                            null,
                            e.target.value
                          )
                        }
                        placeholder="Testimonial"
                      />
                      <button
                        onClick={() => removeArrayItem("testimonials", index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addArrayItem("testimonials")}>
                    Add Testimonial
                  </button>
                </div>
                <div className="form-actions">
                  <button onClick={() => setEditingSection(null)}>
                    Cancel
                  </button>
                  <button onClick={() => saveSection("testimonials")}>
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2>What Residents Say</h2>
                <div className="testimonials">
                  {testimonialsForm.map((quote, idx) => (
                    <blockquote key={idx} className="testimonial-quote">
                      “{quote}”
                    </blockquote>
                  ))}
                </div>
                <button
                  className="edit-button"
                  onClick={() => setEditingSection("testimonials")}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </section>

        {/* Map Section */}
        <section className="section map-section fade-in">
          <div className="container text-center">
            <h2>Location</h2>
            <div className="map-container">
              <iframe
                title="Location Map"
                className="map-frame"
                loading="lazy"
                allowFullScreen
                src={society.googleMapCode}
              ></iframe>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
