import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddPropertyForm from "./AddPropertyForm"; // our form component
import "./AddProperty.css";

export default function AddProperty({ user }) {
  const navigate = useNavigate();

  // Redirect to login if user not logged in
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

      <AddPropertyForm />

      {/* Placeholder for chat notifications */}
      <div className="notifications-placeholder">
        {/* Later we will fetch unread messages for this user */}
      </div>
    </div>
  );
}
