import React from "react";
import { useParams } from "react-router-dom";

export default function Category({ properties }) {
  const { category } = useParams(); // get category from URL
  const categoryKey = category.toLowerCase();

  const categoryProperties = properties[categoryKey] || [];

  return (
    <div style={{ padding: "60px 20px", textAlign: "center" }}>
      <h2 style={{ fontSize: "2.5rem", color: "#0066cc" }}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </h2>

      {categoryProperties.length === 0 ? (
        <p style={{ marginTop: "20px", fontSize: "1.2rem" }}>
          No properties available in this category yet.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          {categoryProperties.map((prop, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                overflow: "hidden",
                padding: "10px",
              }}
            >
              <img
                src={prop.image}
                alt={prop.name}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
              <h3 style={{ marginTop: "10px" }}>{prop.name}</h3>
              <p>{prop.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
