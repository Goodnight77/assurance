import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Agency {
  lat: number;
  lng: number;
  name: string;
  address: string;
  phone: string;
  fax?: string;
  email: string;
  hours: string;
}

interface AgenciesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AgenciesModal: React.FC<AgenciesModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const agencies: Agency[] = [
    {
      lat: 36.768004798669615,
      lng: 9.244119917093178,
      name: "Agence Beja - Bader Ben Moussa",
      address: "1er étage - Avenue de France, Centre Aouni | Béja",
      phone: "29 99 61 10 / 78453023",
      fax: "78453023",
      email: "Badr.BenMoussa@bh-assurance.com",
      hours:
        "Lun-Vendredi: 08:00 - 17:00\nSamedi: 08:00 - 12:00\nDimanche: Fermé",
    },
    {
      lat: 37.367993580443844,
      lng: 9.854513529448683,
      name: "Agence Bizerte - Chekib Ben Othmen",
      address:
        "(En face du dispensaire Aziza Othmena) - 40 Avenue Habib Bourguiba | Bizerte",
      phone: "29 996 090 / 72 42 01 46",
      fax: "72 420 146",
      email: "Chakib.BenOthmen@bh-assurance.com",
      hours:
        "Lun-Vendredi: 08:00-12:00 | 14:00-17:00\nSamedi: 08:00 - 13:00\nDimanche: Fermé",
    },
    {
      lat: 37.035466511972636,
      lng: 10.173117038565575,
      name: "Agence Borj El Baccouch - Laaroussi El Wardi",
      address:
        "Résidence Mériem Bureau N° 18 bloc A - 29 avenue de l'indépendance | Ariana",
      phone: "29 99 60 92 / 20 20 98 09",
      fax: "71331513",
      email: "ElWardi.Laaroussi@bh-assurance.com",
      hours:
        "Lun-Vendredi: 08:30 - 17:00\nSamedi: 08:00 - 12:00\nDimanche: Fermé",
    },
    {
      lat: 36.40105838669539,
      lng: 10.611529011639943,
      name: "Agence Hammamet - Amani Jabnoun",
      address: "Immeuble Mami - 2ème étage - Avenue Habib Bourguiba | Nabeul",
      phone: "29 99 61 04 / 72 26 44 70",
      fax: "72264470",
      email: "amani.jabnoun@bh-assurance.com",
      hours:
        "Lun-Vendredi: 08:00-12:00 | 13:00-17:00\nSamedi: 08:00 - 12:00\nDimanche: Fermé",
    },
    {
      lat: 35.783141,
      lng: 10.825391,
      name: "Agence Monastir - Salwa Habazi",
      address:
        "3ème étage B12 - Avenue de la République, Borj Khefacha | Monastir",
      phone: "29 99 60 91 / 73 50 05 55",
      fax: undefined,
      email: "Salwa.Hbazi@bh-assurance.com",
      hours:
        "Lun-Vendredi: 08:00 - 17:00\nSamedi: 08:00 - 12:00\nDimanche: Fermé",
    },
    {
      lat: 33.16383088188235,
      lng: 11.205139658108813,
      name: "Agence Benguerdene - Farah Selmi",
      address: "Rue des Martyrs, Benguerdennes | Médenine",
      phone: "29 99 61 01 / 75713240",
      fax: "75713151",
      email: "Farah.Selmi@bh-assurance.com",
      hours:
        "Lun-Vendredi: 08:00-12:00 | 13:00-17:00\nSamedi: 08:00 - 12:00\nDimanche: Fermé",
    },
  ];

  useEffect(() => {
    if (!isOpen) return;

    const map = L.map("map").setView([36.8065, 10.1815], 7);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    agencies.forEach((agency) => {
      L.marker([agency.lat, agency.lng])
        .addTo(map)
        .bindPopup(`<b>${agency.name}</b><br>${agency.address}`);
    });

    return () => {
      map.remove();
    };
  }, [isOpen]);

  const filteredAgencies = agencies.filter(
    (agency) =>
      agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Nos agences</h2>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel */}
          <div className="w-1/3 bg-gray-50 border-r flex flex-col">
            <div className="p-4">
              <input
                type="text"
                placeholder="🔍 Rechercher une agence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {filteredAgencies.map((agency, index) => (
                <div
                  key={index}
                  className="mb-4 p-3 bg-white rounded-lg shadow hover:shadow-md transition border"
                >
                  <h3 className="font-bold text-red-600">{agency.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{agency.address}</p>
                  <p className="text-sm mt-1">
                    <strong>Tél:</strong> {agency.phone}
                  </p>
                  {agency.fax && (
                    <p className="text-sm">
                      <strong>Fax:</strong> {agency.fax}
                    </p>
                  )}
                  <p className="text-sm">
                    <strong>Mail:</strong> {agency.email}
                  </p>
                  <p className="text-sm whitespace-pre-line text-gray-700 mt-1">
                    <strong>Horaires:</strong> {agency.hours}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-2/3 h-full">
            <div id="map" className="w-full h-full rounded-r-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgenciesModal;
