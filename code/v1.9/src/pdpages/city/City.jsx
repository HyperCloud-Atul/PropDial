import React, { useState } from 'react'
import "./City.scss"
import { MapPin, TrendingUp, Users, Shield, Search, Award, Bed, Bath, Square, Heart, Building, Star, CheckCircle, Clock, Headphones,GraduationCap, Hospital, ShoppingBag, Train, MessageCircle, Phone, Mail, ArrowRight} from 'lucide-react';

const CityHero=()=> {
  return (
    <section className="city-hero">
      <div className="city-hero-background" />
      <div className="city-hero-container">
        <div className="city-hero-content">
          <div className="city-location">
            <MapPin className="location-icon" />
            <span className="location-text">Mumbai, Maharashtra</span>
          </div>

          <h1 className="city-hero-title">
            Discover Your Dream Property in <span className="highlight">Mumbai</span>
          </h1>

          <p className="city-hero-description">
            Mumbai, the financial capital of India, offers unparalleled connectivity, world-class infrastructure, and
            exceptional investment opportunities. From luxury apartments to commercial spaces, find your perfect
            property with PropDial.
          </p>

          <div className="city-hero-buttons">
            <button className="btn-primary">
              Explore Properties
            </button>
            <button className="btn-outline">
              View Societies
            </button>
          </div>

          <div className="city-stats">
            <div className="stat-item">
              <div className="stat-icon">
                <TrendingUp className="icon" />
              </div>
              <div className="stat-number">15,000+</div>
              <div className="stat-label">Properties Listed</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <Users className="icon" />
              </div>
              <div className="stat-number">50,000+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <MapPin className="icon" />
              </div>
              <div className="stat-number">200+</div>
              <div className="stat-label">Societies Listed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const AboutPropDial=()=> {
  return (
    <section className="about-propdial">
      <div className="about-container">
        <div className="about-header">
          <h2 className="about-title">About PropDial in Mumbai</h2>
          <p className="about-description">
            PropDial has been Mumbai's trusted real estate partner for over a decade. We specialize in connecting
            property seekers with their ideal homes and investment opportunities across the city's most sought-after
            locations.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-content">
              <div className="feature-icon-container">
                <div className="icon-wrapper">
                  <Search className="feature-icon" />
                </div>
              </div>
              <h3 className="feature-title">Property Listing</h3>
              <p className="feature-description">
                Comprehensive property search with advanced filters and verified listings
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-content">
              <div className="feature-icon-container">
                <div className="icon-wrapper">
                  <Users className="feature-icon" />
                </div>
              </div>
              <h3 className="feature-title">Expert Consultation</h3>
              <p className="feature-description">
                Professional guidance from experienced real estate consultants
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-content">
              <div className="feature-icon-container">
                <div className="icon-wrapper">
                  <Shield className="feature-icon" />
                </div>
              </div>
              <h3 className="feature-title">Secure Transactions</h3>
              <p className="feature-description">
                Safe and transparent property transactions with legal assistance
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-content">
              <div className="feature-icon-container">
                <div className="icon-wrapper">
                  <Award className="feature-icon" />
                </div>
              </div>
              <h3 className="feature-title">Society Management</h3>
              <p className="feature-description">
                Complete society management solutions and community services
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const properties = [
  {
    id: 1,
    title: "Luxury 3BHK Apartment",
    location: "Bandra West, Mumbai",
    price: "₹2.5 Cr",
    type: "Sale",
    beds: 3,
    baths: 2,
    area: "1,200 sq ft",
    image: "/assets/img/society/layout2.jpg",
  },
  {
    id: 2,
    title: "Modern 2BHK Flat",
    location: "Andheri East, Mumbai",
    price: "₹45,000/month",
    type: "Rent",
    beds: 2,
    baths: 2,
    area: "950 sq ft",
    image: "/assets/img/society/layout3.jpg",
  },
  {
    id: 3,
    title: "Premium Villa",
    location: "Juhu, Mumbai",
    price: "₹8.5 Cr",
    type: "Sale",
    beds: 4,
    baths: 4,
    area: "2,800 sq ft",
    image: "/assets/img/society/layout4.jpg",
  },
  {
    id: 4,
    title: "Commercial Office Space",
    location: "Lower Parel, Mumbai",
    price: "₹1.2 Cr",
    type: "Sale",
    beds: 0,
    baths: 2,
    area: "800 sq ft",
    image: "/assets/img/society/layout5.jpg",
  },
]

const FeaturedProperties=()=> {
  return (
    <section className="featured-properties">
      <div className="properties-container">
        <div className="properties-header">
          <div className="header-content">
            <h2 className="properties-title">Featured Properties in Mumbai</h2>
            <p className="properties-subtitle">
              Discover handpicked properties that offer the best value and location
            </p>
          </div>
          <button className="view-all-btn desktop-only">View All Properties</button>
        </div>

        <div className="properties-grid">
          {properties.map((property) => (
            <div key={property.id} className="property-card">
              <div className="property-image-container">
                <img
                  src={property.image || "/placeholder.svg"}
                  alt={property.title}
                  className="property-image"
                />
                <div className="property-badge-container">
                  <span className={`property-badge ${property.type === "Sale" ? "sale-badge" : "rent-badge"}`}>
                    For {property.type}
                  </span>
                </div>
                <button className="favorite-btn">
                  <Heart className="favorite-icon" />
                </button>
              </div>

              <div className="property-content">
                <div className="property-header">
                  <h3 className="property-title">{property.title}</h3>
                  <div className="property-location">
                    <MapPin className="location-icon" />
                    <span className="location-text">{property.location}</span>
                  </div>
                </div>

                <div className="property-price">{property.price}</div>

                <div className="property-features">
                  {property.beds > 0 && (
                    <div className="feature-item">
                      <Bed className="feature-icon" />
                      <span>{property.beds}</span>
                    </div>
                  )}
                  <div className="feature-item">
                    <Bath className="feature-icon" />
                    <span>{property.baths}</span>
                  </div>
                  <div className="feature-item">
                    <Square className="feature-icon" />
                    <span>{property.area}</span>
                  </div>
                </div>

                <button className="details-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mobile-view-all">
          <button className="view-all-btn">View All Properties</button>
        </div>
      </div>
    </section>
  )
}

const readyToMoveIn = [
  {
    id: 1,
    name: "Oberoi Sky Heights",
    location: "Andheri East",
    description: "Premium residential complex with world-class amenities",
    units: "2-4 BHK",
    rating: 4.8,
    image: "/assets/img/society/hero1.jpg",
  },
  {
    id: 2,
    name: "Lodha Park",
    location: "Lower Parel",
    description: "Iconic towers offering panoramic city views",
    units: "1-3 BHK",
    rating: 4.6,
    image: "/assets/img/society/hero2.jpg",
  },
  {
    id: 3,
    name: "Hiranandani Gardens",
    location: "Powai",
    description: "Integrated township with complete lifestyle amenities",
    units: "2-4 BHK",
    rating: 4.7,
    image: "/assets/img/society/hero3.jpg",
  },
]

const underConstruction = [
  {
    id: 4,
    name: "Godrej Emerald",
    location: "Thane West",
    description: "Upcoming luxury project with modern architecture",
    units: "2-3 BHK",
    completion: "Dec 2025",
    image: "/assets/img/society/hero4.jpg",
  },
  {
    id: 5,
    name: "Mahindra Lifespaces",
    location: "Kandivali East",
    description: "Smart homes with sustainable living features",
    units: "1-2 BHK",
    completion: "Mar 2026",
    image: "/assets/img/society/hero5.jpg",
  },
  {
    id: 6,
    name: "Tata Housing Primanti",
    location: "Sector 72, Gurgaon",
    description: "Premium residential project with golf course views",
    units: "3-4 BHK",
    completion: "Jun 2025",
    image: "/assets/img/society/layout2.jpg",
  },
]

const SocietiesSection=()=> {
  const [activeTab, setActiveTab] = useState('ready');

  return (
    <section className="societies-section">
      <div className="societies-container">
        <div className="societies-header">
          <h2 className="societies-title">Societies in Mumbai</h2>
          <p className="societies-subtitle">
            Explore premium residential societies and upcoming projects across Mumbai's prime locations
          </p>
        </div>

        <div className="tabs-container">
          <div className="tabs-list">
            <button 
              className={`tab-trigger ${activeTab === 'ready' ? 'active' : ''}`}
              onClick={() => setActiveTab('ready')}
            >
              Ready to Move In
            </button>
            <button 
              className={`tab-trigger ${activeTab === 'construction' ? 'active' : ''}`}
              onClick={() => setActiveTab('construction')}
            >
              Under Construction
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'ready' && (
              <div className="societies-grid">
                {readyToMoveIn.map((society) => (
                  <div key={society.id} className="society-card">
                    <div className="society-image-container">
                      <img
                        src={society.image || "/placeholder.svg"}
                        alt={society.name}
                        className="society-image"
                      />
                      <div className="society-badge-container">
                        <span className="society-badge ready-badge">Ready to Move</span>
                      </div>
                      <div className="society-rating">
                        <Star className="star-icon" />
                        <span className="rating-text">{society.rating}</span>
                      </div>
                    </div>

                    <div className="society-content">
                      <h3 className="society-name">{society.name}</h3>
                      <div className="society-location">
                        <MapPin className="location-icon" />
                        <span className="location-text">{society.location}</span>
                      </div>

                      <p className="society-description">{society.description}</p>

                      <div className="society-details">
                        <div className="detail-item">
                          <Building className="detail-icon" />
                          <span className="detail-text">{society.units}</span>
                        </div>
                        <div className="detail-item">
                          <Users className="detail-icon" />
                          <span className="detail-text">500+ families</span>
                        </div>
                      </div>

                      <button className="society-btn">View Society Details</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'construction' && (
              <div className="societies-grid">
                {underConstruction.map((society) => (
                  <div key={society.id} className="society-card">
                    <div className="society-image-container">
                      <img
                        src={society.image || "/placeholder.svg"}
                        alt={society.name}
                        className="society-image"
                      />
                      <div className="society-badge-container">
                        <span className="society-badge construction-badge">Under Construction</span>
                      </div>
                      <div className="completion-date">
                        <span className="completion-text">{society.completion}</span>
                      </div>
                    </div>

                    <div className="society-content">
                      <h3 className="society-name">{society.name}</h3>
                      <div className="society-location">
                        <MapPin className="location-icon" />
                        <span className="location-text">{society.location}</span>
                      </div>

                      <p className="society-description">{society.description}</p>

                      <div className="society-details">
                        <div className="detail-item">
                          <Building className="detail-icon" />
                          <span className="detail-text">{society.units}</span>
                        </div>
                        <div className="completion-info">
                          Completion: {society.completion}
                        </div>
                      </div>

                      <button className="society-btn">Get Project Details</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="societies-footer">
          <button className="explore-btn">Explore All Societies</button>
        </div>
      </div>
    </section>
  )
}

const benefits = [
  {
    icon: CheckCircle,
    title: "Verified Listings",
    description: "All properties are thoroughly verified and authenticated before listing",
  },
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "End-to-end security with legal documentation and transparent processes",
  },
  {
    icon: Clock,
    title: "Quick Response",
    description: "Get instant responses and schedule property visits within 24 hours",
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Experienced real estate professionals to guide you through every step",
  },
  {
    icon: Award,
    title: "Best Deals",
    description: "Access to exclusive properties and the best market rates",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock customer support for all your real estate needs",
  },
]

const WhyChoosePropDial=()=> {
  return (
    <section className="why-choose-propdial">
      <div className="why-choose-container">
        <div className="why-choose-header">
          <h2 className="why-choose-title">
            Why Choose PropDial in Mumbai?
          </h2>
          <p className="why-choose-subtitle">
            We're committed to making your property journey smooth, secure, and successful with our comprehensive
            services and local expertise.
          </p>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="benefit-card">
                <div className="benefit-content">
                  <div className="benefit-icon-container">
                    <div className="icon-wrapper">
                      <Icon className="benefit-icon" />
                    </div>
                  </div>
                  <h3 className="benefit-title">{benefit.title}</h3>
                  <p className="benefit-description">{benefit.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="cta-section">
          <h3 className="cta-title">
            Ready to Find Your Dream Property?
          </h3>
          <p className="cta-description">
            Join thousands of satisfied customers who found their perfect home through PropDial. Let our experts help
            you make the right choice.
          </p>
          <div className="cta-buttons">
            <button className="cta-btn-primary">
              Start Property Search
            </button>
            <button className="cta-btn-secondary">
              Talk to Expert
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

const insights = [
  {
    icon: GraduationCap,
    title: "Education Hubs",
    description: "Top schools and colleges including IIT Bombay, TISS, and international schools",
    locations: ["Powai", "Bandra", "Juhu"],
  },
  {
    icon: Hospital,
    title: "Healthcare",
    description: "World-class hospitals and medical facilities for comprehensive healthcare",
    locations: ["Breach Candy", "Lilavati", "Kokilaben"],
  },
  {
    icon: ShoppingBag,
    title: "Shopping & Entertainment",
    description: "Premium malls, markets, and entertainment destinations",
    locations: ["Phoenix Mills", "Palladium", "Linking Road"],
  },
  {
    icon: Train,
    title: "Connectivity",
    description: "Excellent transport network with metro, local trains, and highways",
    locations: ["Western Line", "Central Line", "Metro Lines"],
  },
]

const LocalInsights=()=> {
  return (
    <section className="local-insights">
      <div className="local-insights-container">
        <div className="local-insights-header">
          <h2>Mumbai Local Insights</h2>
          <p>
            Discover what makes Mumbai the perfect place to live, work, and invest in real estate
          </p>
        </div>

        <div className="insights-grid">
          {insights.map((insight, index) => {
            const Icon = insight.icon
            return (
              <div key={index} className="insight-card">
                <div className="insight-card-header">
                  <div className="insight-card-title">
                    <div className="insight-icon-container">
                      <Icon className="insight-icon" />
                    </div>
                    <h3>{insight.title}</h3>
                  </div>
                </div>
                <div className="insight-card-content">
                  <p className="insight-description">{insight.description}</p>
                  <div className="locations-container">
                    {insight.locations.map((location, idx) => (
                      <div key={idx} className="location-tag">
                        <MapPin className="location-icon" />
                        <span>{location}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="connectivity-section">
          <div className="connectivity-content">
            <h3>Mumbai Connectivity Map</h3>
            <p>
              Mumbai offers unparalleled connectivity with its extensive network of local trains, metro lines, and
              major highways connecting all parts of the city and beyond.
            </p>
            <div className="connectivity-list">
              <div className="connectivity-item">
                <div className="connectivity-dot primary-dot"></div>
                <span>Western & Central Railway Lines</span>
              </div>
              <div className="connectivity-item">
                <div className="connectivity-dot secondary-dot"></div>
                <span>Mumbai Metro Network</span>
              </div>
              <div className="connectivity-item">
                <div className="connectivity-dot accent-dot"></div>
                <span>Major Highways & Expressways</span>
              </div>
            </div>
            <button className="view-map-button">View Detailed Map</button>
          </div>
          <div className="connectivity-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109980859376!3d19.08219780000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1719330000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: '0.5rem' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mumbai Connectivity Map"
              className="map-iframe"
            ></iframe>
            <div className="map-overlay"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

const CallToAction = ()=> {
  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-content">
          <h2>Ready to Start Your Property Journey?</h2>
          <p>
            Get in touch with our Mumbai property experts today. We're here to help you find the perfect property that
            matches your needs and budget.
          </p>

          <div className="cta-cards">
            <div className="cta-card">
              <div className="cta-card-content">
                <div className="cta-icon-container">
                  <Phone className="cta-icon" />
                </div>
                <h3>Call Us</h3>
                <p className="cta-card-description">Speak directly with our experts</p>
                <p className="cta-card-detail">+91 98765 43210</p>
              </div>
            </div>

            <div className="cta-card">
              <div className="cta-card-content">
                <div className="cta-icon-container">
                  <Mail className="cta-icon" />
                </div>
                <h3>Email Us</h3>
                <p className="cta-card-description">Get detailed information</p>
                <p className="cta-card-detail">mumbai@propdial.com</p>
              </div>
            </div>

            <div className="cta-card">
              <div className="cta-card-content">
                <div className="cta-icon-container">
                  <MessageCircle className="cta-icon" />
                </div>
                <h3>Live Chat</h3>
                <p className="cta-card-description">Instant support available</p>
                <p className="cta-card-detail">Chat Now</p>
              </div>
            </div>
          </div>

          <div className="cta-buttons">
            <button className="cta-button primary">
              View All Properties in Mumbai
              <ArrowRight className="cta-button-icon" />
            </button>
            <button className="cta-button outline">
              Schedule Site Visit
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

const City = () => {
  return (
    <div className='City-page-wrapper'>
        <CityHero />
        <AboutPropDial />
        <FeaturedProperties />
        <SocietiesSection />
        <WhyChoosePropDial />
        <LocalInsights />
        <CallToAction />
    </div>
  )
}

export default City