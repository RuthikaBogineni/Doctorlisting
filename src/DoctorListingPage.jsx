import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DoctorListingPage.css"; // Import the CSS file

const API_URL = "https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json";

// List of specialties for filter
const allSpecialties = [
  "General Physician",
  "Dentist",
  "Dermatologist",
  "Paediatrician",
  "Gynaecologist",
  "ENT",
  "Diabetologist",
  "Cardiologist",
  "Physiotherapist",
  "Endocrinologist",
  "Orthopaedic",
  "Ophthalmologist",
  "Gastroenterologist",
  "Pulmonologist",
  "Psychiatrist",
  "Urologist",
  "Dietitian/Nutritionist",
  "Psychologist",
  "Sexologist",
  "Nephrologist",
  "Neurologist",
  "Oncologist",
  "Ayurveda",
  "Homeopath",
];

const DoctorListingPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [consultType, setConsultType] = useState(""); // No filter by default
  const [selectedSpecialties, setSelectedSpecialties] = useState([]); // No specialties selected by default
  const [sortOption, setSortOption] = useState(""); // No sort option by default
  const [loading, setLoading] = useState(true);

  // Fetch the doctor data from the mock API
  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        setDoctors(res.data);
        setFilteredDoctors(res.data); // Initially display all doctors
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data: ", err);
        setLoading(false);
      });
  }, []);

  // Apply filters and sort whenever the filters change
  useEffect(() => {
    const applyFiltersAndSort = () => {
      let result = [...doctors];

      // Apply search filter
      if (searchTerm) {
        result = result.filter((doc) =>
          doc.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply consult type filter (radio)
      if (consultType) {
        result = result.filter((doc) => doc.mode === consultType);
      }

      // Apply specialties filter (checkbox)
      if (selectedSpecialties.length > 0) {
        result = result.filter((doc) =>
          selectedSpecialties.some((spec) =>
            (doc.speciality || []).includes(spec)
          )
        );
      }

      // Apply sorting based on selected sort option
      if (sortOption === "fees") {
        result.sort((a, b) => a.fees - b.fees); // Sort by fees in ascending order
      } else if (sortOption === "experience") {
        result.sort((a, b) => b.experience - a.experience); // Sort by experience in descending order
      }

      return result;
    };

    setFilteredDoctors(applyFiltersAndSort());
  }, [searchTerm, consultType, selectedSpecialties, sortOption, doctors]);

  // Handle changes in the consultation type filter
  const handleConsultTypeChange = (type) => {
    setConsultType(type);
  };

  // Handle changes in the specialty filter
  const handleSpecialtyChange = (spec) => {
    setSelectedSpecialties((prevState) =>
      prevState.includes(spec)
        ? prevState.filter((s) => s !== spec)
        : [...prevState, spec]
    );
  };

  // Handle changes in the sort filter
  const handleSortChange = (sortBy) => {
    setSortOption(sortBy); // Update the sort option (either 'fees' or 'experience')
  };

  // Handle search term input
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (!val) return setSuggestions([]);
    const filtered = doctors
      .filter((doc) => doc.name.toLowerCase().includes(val.toLowerCase()))
      .slice(0, 3);
    setSuggestions(filtered);
  };

  // Handle clicking a suggestion
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name);
    setSuggestions([]);
  };

  return (
    <div className="doctor-listing">
      <h1>Doctor Listing</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={(e) => e.key === "Enter" && setSuggestions([])}
          placeholder="Search Doctor Name"
        />
        <div className="suggestions">
          {suggestions.map((s, i) => (
            <div key={i} onClick={() => handleSuggestionClick(s)}>
              {s.name}
            </div>
          ))}
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters">
        <h4>Consultation Mode</h4>
        <label>
          <input
            type="radio"
            name="mode"
            checked={consultType === "Video Consult"}
            onChange={() => handleConsultTypeChange("Video Consult")}
          />{" "}
          Video Consult
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            checked={consultType === "In Clinic"}
            onChange={() => handleConsultTypeChange("In Clinic")}
          />{" "}
          In Clinic
        </label>

        <h4>Speciality</h4>
        {allSpecialties.map((spec, i) => (
          <label key={i}>
            <input
              type="checkbox"
              checked={selectedSpecialties.includes(spec)}
              onChange={() => handleSpecialtyChange(spec)}
            />{" "}
            {spec}
          </label>
        ))}

        <h4>Sort</h4>
        <label>
          <input
            type="radio"
            name="sort"
            checked={sortOption === "fees"}
            onChange={() => handleSortChange("fees")}
          />{" "}
          Sort by Fees (Ascending)
        </label>
        <label>
          <input
            type="radio"
            name="sort"
            checked={sortOption === "experience"}
            onChange={() => handleSortChange("experience")}
          />{" "}
          Sort by Experience (Descending)
        </label>
      </div>

      {/* Loading State */}
      {loading ? (
        <p>Loading doctors...</p>
      ) : (
        // Doctors List
        <div className="doctor-cards">
          {filteredDoctors.length === 0 ? (
            <p>No doctors found with the selected filters.</p>
          ) : (
            filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="doctor-card">
                <h5>{doctor.name}</h5>
                <p>
                  <strong>Speciality:</strong>{" "}
                  {doctor.speciality?.join(", ") || "Not available"}
                </p>
                <p>
                  <strong>Consultation Mode:</strong>{" "}
                  {doctor.mode || "Not specified"}
                </p>
                <p>
                  <strong>Fees:</strong> ₹{doctor.fees}
                </p>
                <p>
                  <strong>Experience:</strong> {doctor.experience} years
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorListingPage;
