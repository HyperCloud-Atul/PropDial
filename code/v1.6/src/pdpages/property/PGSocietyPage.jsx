import React, { useEffect } from 'react';
import './PGSocietyPage.scss';

function PGSocietyPage() {
  useEffect(() => {
    // Counter animation logic
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const counter = entry.target;
            const target = +counter.dataset.target;
            const update = () => {
              const current = +counter.innerText.replace('+', '');
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
    counters.forEach(counter => observer.observe(counter));

    // Fade-in animation
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }
        });
      },
      { threshold: 0.1 }
    );
    fadeElements.forEach(el => fadeObserver.observe(el));
  }, []);

  return (
    <div className="pg-page">
      {/* Hero Section */}
      <section
        className="hero-section fade-in"
        style={{
          backgroundImage:
            'url(https://cdn.pixabay.com/photo/2020/03/03/12/03/buildings-4898536_1280.jpg)',
        }}
      >
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>A community built for life</h1>
          <p>Modern living spaces with comfort and luxury.</p>
        </div>
      </section>

      {/* About Section */}
      <section className="section about-section fade-in">
        <div className="container text-center">
          <h2>About The Society</h2>
          <p className="description">
            Nestled in the heart of the city, Darshan Residency offers a blend of comfort, luxury, and convenience.
          </p>
          <div className="stats-grid">
            {[
               ['500', 'Residences'],
               ['24/7', 'Security'], // Changed from '24' to '24/7'
               ['100', 'Amenities'],
               ['', 'Friendly infrastructure'], // 'Eco' and this label will render as required
              ].map(([value, label], idx) => (
              <div key={idx} className="stat-box">
                {value ? (
                  <h3 className={value === '24/7' ? '' : 'stat-number'} data-target={value}>
                  {value === '24/7' ? value : '0+'}
                  </h3>
                ) : (
                  <h3>Eco-</h3>
                 )}
                   {label && <p>{label}</p>}
              </div>
                  ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="section facilities-section fade-in">
        <div className="container text-center">
          <h2>Facilities</h2>
          <div className="grid">
            {[
              "Swimming Pool", "Gymnasium", "Community Hall", "Jogging Track",
              "Play Area", "Amphitheatre", "Smart Parking", "Library",
            ].map((facility, idx) => (
              <div key={idx} className="facility-box">
                {facility}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Essentials Section */}
      <section className="section nearby-section fade-in">
        <div className="container text-center">
          <h2>Nearby Essentials</h2>
          <div className="nearby-grid">
            {[
              {
                title: "Schools",
                places: ["Sunrise Public School (0.5 km)", "Greenfield Academy (1.2 km)"]
              },
              {
                title: "Clubs",
                places: ["Elite Sports Club (0.8 km)", "Art & Culture Hub (1.5 km)"]
              },
              {
                title: "Hospitals",
                places: ["City Care Hospital (1.1 km)", "Wellness Clinic (0.7 km)"]
              },
              {
                title: "Shopping",
                places: ["Metro Mall (2.0 km)", "The Food Street (1.4 km)"]
              },
            ].map(({ title, places }) => (
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
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section gallery-section fade-in">
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
      </section>

      {/* Testimonials */}
      <section className="section testimonials-section fade-in">
        <div className="container text-center">
          <h2>What Residents Say</h2>
          <div className="testimonials">
            {[
              "Living here has been a wonderful experience. It's safe, green, and vibrant!",
              "Facilities are top-notch, and my kids love the play area and library.",
            ].map((quote, idx) => (
              <blockquote key={idx} className="testimonial-quote">
                “{quote}”
              </blockquote>
            ))}
          </div>
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0198042387456!2d-122.41941508468153!3d37.774929779758794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064abefb9e7%3A0x8ff7a0c245c9a62e!2sDarshan%20Residency!5e0!3m2!1sen!2sus!4v1634381716490!5m2!1sen!2sus"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PGSocietyPage;
