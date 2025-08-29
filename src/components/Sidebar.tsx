import React from "react";

const Sidebar: React.FC = () => (
  <aside style={{
    position: "fixed",
    left: 0,
    top: 0,
    height: "100vh",
    width: "80px",
    background: "#ec0000",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: "120px",
    zIndex: 100,
    boxShadow: "2px 0 8px rgba(0,0,0,0.07)",
  }}>
    <a href="/" style={{marginBottom: "2.5rem"}}>
      <img src="/bh-assurance-logo.png" alt="BH Assurance Logo" style={{height: "40px"}} />
    </a>
    <nav style={{display: "flex", flexDirection: "column", gap: "2rem"}}>
      <a href="/" title="Accueil" style={{color: "#fff", textDecoration: "none", fontSize: "1.2rem"}}>🏠</a>
      <a href="#agences" title="Nos Agences" style={{color: "#fff", textDecoration: "none", fontSize: "1.2rem"}}>🏢</a>
      <a href="#devis" title="Devis Rapide" style={{color: "#fff", textDecoration: "none", fontSize: "1.2rem"}}>⚡</a>
      <a href="#assistance" title="Assistance" style={{color: "#fff", textDecoration: "none", fontSize: "1.2rem"}}>🛟</a>
    </nav>
  </aside>
);

export default Sidebar;
