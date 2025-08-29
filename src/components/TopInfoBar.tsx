import React from "react";
import SocialBar from "./SocialBar";

const TopInfoBar: React.FC = () => (
  <div style={{
    background: "#ec0000",
    color: "#fff",
    width: "100%",
    fontSize: "0.95rem",
    padding: "0.5rem 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: 500,
    letterSpacing: "0.5px",
    zIndex: 50,
    position: "relative",
  }}>
    <div style={{marginLeft: "2rem"}}>
      <span style={{marginRight: "2rem"}}>Immeuble BH Assurance, Centre Urbain Nord - Tunis</span>
      <span style={{marginRight: "2rem"}}>commercial@bh-assurance.com</span>
      <span>+216 71 184 200</span>
    </div>
    <div style={{marginRight: "2rem"}}>
      <SocialBar />
    </div>
  </div>
);

export default TopInfoBar;
