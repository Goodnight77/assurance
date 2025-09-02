import React, { useState } from "react";
import ContactModal from "./ContactModal";
import AgenciesModal from "./AgenciesModal";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const LogoBar: React.FC = () => {
  const currentPath = window.location.pathname;
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAgenciesModalOpen, setIsAgenciesModalOpen] = useState(false);
  const { toast } = useToast();

  const handleLogout = () => {
    // Remove authentication data from localStorage
    localStorage.removeItem("authData");
    
    // Show success message
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    
    // Redirect to login page after a short delay
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

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
      <a href="/agent" style={{ display: "flex", alignItems: "center", textDecoration: 'none' }}>
        <img 
          src="/bh-assurance-logo.png" 
          alt="BH Assurance Logo" 
          style={{ height: "32px", marginLeft: "0" }} 
        />
      </a>
      
      <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <a 
          href="/agent" 
          style={{ 
            color: currentPath === "/agent" ? "#ec0000" : "#222", 
            textDecoration: "none", 
            fontSize: "1rem", 
            fontWeight: currentPath === "/agent" ? 700 : 500 
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
        
        {/* Logout Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2 ml-4"
          style={{ 
            borderColor: "#DF271C", 
            color: "#DF271C",
            padding: "0.4rem 0.8rem"
          }}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </nav>
      
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
      <AgenciesModal isOpen={isAgenciesModalOpen} onClose={() => setIsAgenciesModalOpen(false)} />
    </div>
  );
};

export default LogoBar;