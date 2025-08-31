import React, { useState } from "react";
import ContactModal from "./ContactModal";
import AgenciesModal from "./AgenciesModal";

const LogoBar: React.FC = () => {
  const currentPath = window.location.pathname;
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAgenciesModalOpen, setIsAgenciesModalOpen] = useState(false);

  return (
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
        <a 
          href="/" 
          style={{ 
            color: currentPath === "/" ? "#ec0000" : "#222", 
            textDecoration: "none", 
            fontSize: "1rem", 
            fontWeight: currentPath === "/" ? 700 : 500 
          }}
        >
          Agent
        </a>
        <a 
          href="/dashboard" 
          style={{ 
            color: currentPath === "/dashboard" ? "#ec0000" : "#222", 
            textDecoration: "none", 
            fontSize: "1rem", 
            fontWeight: currentPath === "/dashboard" ? 700 : 500 
          }}
        >
          Dashboard
        </a>
        <button
          onClick={() => setIsAgenciesModalOpen(true)}
          style={{ color: "#222", textDecoration: "none", fontSize: "1rem", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}
        >
          Nos agences
        </button>
        <button
          onClick={() => setIsContactModalOpen(true)}
          style={{ color: "#222", textDecoration: "none", fontSize: "1rem", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}
        >
          Contact
        </button>
      </nav>
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
      <AgenciesModal isOpen={isAgenciesModalOpen} onClose={() => setIsAgenciesModalOpen(false)} />
    </div>
  );
};

export default LogoBar;