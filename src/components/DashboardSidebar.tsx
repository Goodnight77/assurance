import React, { useState } from "react";
import { FaBuilding, FaUser, FaFileContract, FaExclamationTriangle, FaThList, FaHome, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const sections = [
  { key: "main", label: "Main", icon: <FaHome /> },
  { key: "personne_morale", label: "Personne Morale", icon: <FaBuilding /> },
  { key: "personne_physique", label: "Personne Physique", icon: <FaUser /> },
  { key: "Contrats", label: "Contrats", icon: <FaFileContract /> },
  { key: "sinistres", label: "Sinistres", icon: <FaExclamationTriangle /> },
  { key: "Mapping_Produits", label: "Mapping Produits", icon: <FaThList /> },
  { key: "GarantieContrat", label: "Garanties Contrats", icon: <FaFileContract /> },
];

export default function DashboardSidebar({ active, onSelect }: { active: string, onSelect: (key: string) => void }) {
  const [open, setOpen] = useState(true);
  return (
    <aside className={`bg-[#ec0000] text-white ${open ? 'w-64' : 'w-16'} min-h-screen flex flex-col py-8 px-2 shadow-lg transition-all duration-300 relative`}>
      <div className="flex items-center justify-between mb-8">
        {open && <h2 className="text-2xl font-bold text-center w-full">Dashboard</h2>}
        <button
          onClick={() => setOpen(o => !o)}
          className="bg-white text-[#ec0000] rounded-full shadow p-2 border border-[#ec0000] flex items-center justify-center ml-2"
          style={{ outline: 'none', height: 40 }}
        >
          {open ? <FaChevronLeft size={24} /> : <FaChevronRight size={24} />}
        </button>
      </div>
      <nav className="flex flex-col gap-4 items-center">
        {sections.map(section => (
          <button
            key={section.key}
            className={`flex items-center gap-2 text-lg font-semibold py-2 px-2 w-full rounded transition-all ${active === section.key ? 'bg-white text-[#ec0000]' : 'hover:bg-[#e5e7eb] hover:text-[#ec0000]'} ${open ? '' : 'text-xs px-0 justify-center'}`}
            onClick={() => onSelect(section.key)}
            style={{ whiteSpace: 'nowrap' }}
          >
            {section.icon}
            {open ? section.label : ''}
          </button>
        ))}
      </nav>
    </aside>
  );
}
