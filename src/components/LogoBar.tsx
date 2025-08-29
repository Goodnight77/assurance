import React from "react";

const LogoBar: React.FC = () => (
  <div style={{
    width: "100%",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.7rem 2rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    zIndex: 40,
    position: "relative",
  }}>
    <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: 'none' }}>
      <img 
        src="/bh-assurance-logo.png" 
        alt="BH Assurance Logo" 
        style={{ height: "32px", marginLeft: "0" }} 
      />
      <span style={{ fontWeight: 700, fontSize: "1.5rem", marginLeft: "1rem", color: "#222" }}>
        ASSURANCE
      </span>
    </a>
    <nav style={{ display: "flex", gap: "1.5rem" }}>
      <a href="/dashboard" style={{ color: "#ec0000", textDecoration: "none", fontSize: "1rem", fontWeight: 700 }}>
        Dashboard
      </a>
      <a href="#about" style={{ color: "#222", textDecoration: "none", fontSize: "1rem", fontWeight: 500 }}>
        A propos de nous
      </a>
      <a href="#agencies" style={{ color: "#222", textDecoration: "none", fontSize: "1rem", fontWeight: 500 }}>
        Nos agences
      </a>
      <a href="#news" style={{ color: "#222", textDecoration: "none", fontSize: "1rem", fontWeight: 500 }}>
        Actualités
      </a>
      <a href="#contact" style={{ color: "#222", textDecoration: "none", fontSize: "1rem", fontWeight: 500 }}>
        Contact
      </a>
    </nav>
  </div>
);

export default LogoBar;