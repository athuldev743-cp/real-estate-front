import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddPropertyForm from "../components/AddPropertyForm"; 
import "./AddProperty.css";

export default function AddProperty({ user }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.fullName) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="add-property-page">
      {user && (
        <>
          <h2 className="user-heading">{user.fullName}</h2>
          <p>Add a new property below:</p>
        </>
      )}

      {/* ✅ Our new form with search + add location */}
      <AddPropertyForm />

      <div className="notifications-placeholder">
        {/* Later we will fetch unread messages for this user */}
      </div>
    </div>
  );
}
