import React from "react";
import AddPropertyForm from "../components/AddPropertyForm"; // your form component
import "./AddProperty.css";

export default function AddProperty() {
  return (
    <div className="add-property-page">
      <h2>Add Your Property</h2>
      <div className="property-form-container">
        <AddPropertyForm />
      </div>
    </div>
  );
}
