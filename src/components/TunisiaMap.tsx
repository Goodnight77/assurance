import React, { useState } from 'react';

interface TunisiaMapProps {
  geoData: Array<{ name: string; value: number }>;
}

const TunisiaMap: React.FC<TunisiaMapProps> = ({ geoData }) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  
  // Get max value for color scaling
  const maxValue = Math.max(...geoData.map(d => d.value));
  
  // Get color intensity based on value
  const getColorIntensity = (governorat: string) => {
    const data = geoData.find(d => d.name === governorat);
    if (!data) return '#f3f4f6';
    const intensity = data.value / maxValue;
    // Scale from light red to dark red
    if (intensity > 0.8) return '#dc2626';
    if (intensity > 0.6) return '#ef4444';
    if (intensity > 0.4) return '#f87171';
    if (intensity > 0.2) return '#fca5a5';
    return '#fed7d7';
  };

  // Tunisia governorates with approximate positions
  const governorates = [
    { name: 'ARIANA', x: 470, y: 150, label: 'Ariana' },
    { name: 'BEJA', x: 350, y: 180, label: 'Béja' },
    { name: 'BEN AROUS', x: 480, y: 180, label: 'Ben Arous' },
    { name: 'BIZERTE', x: 380, y: 120, label: 'Bizerte' },
    { name: 'GABES', x: 480, y: 450, label: 'Gabès' },
    { name: 'GAFSA', x: 380, y: 420, label: 'Gafsa' },
    { name: 'JENDOUBA', x: 280, y: 180, label: 'Jendouba' },
    { name: 'KAIROUAN', x: 420, y: 300, label: 'Kairouan' },
    { name: 'KASSERINE', x: 340, y: 350, label: 'Kasserine' },
    { name: 'KEBILI', x: 420, y: 500, label: 'Kébili' },
    { name: 'LA MANOUBA', x: 450, y: 160, label: 'La Manouba' },
    { name: 'LE KEF', x: 320, y: 250, label: 'Le Kef' },
    { name: 'MAHDIA', x: 480, y: 350, label: 'Mahdia' },
    { name: 'MEDENINE', x: 520, y: 480, label: 'Médenine' },
    { name: 'MONASTIR', x: 480, y: 320, label: 'Monastir' },
    { name: 'NABEUL', x: 520, y: 180, label: 'Nabeul' },
    { name: 'SFAX', x: 480, y: 380, label: 'Sfax' },
    { name: 'SIDI BOUZID', x: 420, y: 380, label: 'Sidi Bouzid' },
    { name: 'SILIANA', x: 380, y: 250, label: 'Siliana' },
    { name: 'SOUSSE', x: 480, y: 300, label: 'Sousse' },
    { name: 'TATAOUINE', x: 480, y: 520, label: 'Tataouine' },
    { name: 'TOZEUR', x: 350, y: 480, label: 'Tozeur' },
    { name: 'TUNIS', x: 460, y: 170, label: 'Tunis' },
    { name: 'ZAGHOUAN', x: 450, y: 250, label: 'Zaghouan' }
  ];

  return (
    <div className="relative">
      <svg viewBox="0 0 600 600" className="w-full h-96 border rounded-lg bg-blue-50">
        {/* Tunisia outline (simplified) */}
        <path
          d="M200,150 L500,100 L550,150 L580,200 L550,300 L580,400 L550,500 L500,550 L400,580 L300,550 L250,500 L200,400 L180,300 L200,200 Z"
          fill="#e5e7eb"
          stroke="#6b7280"
          strokeWidth="2"
        />
        
        {/* Mediterranean Sea label */}
        <text x="400" y="80" textAnchor="middle" className="text-xs fill-blue-600 font-semibold">
          Mer Méditerranée
        </text>
        
        {/* Governorate circles */}
        {governorates.map((gov) => {
          const data = geoData.find(d => d.name === gov.name);
          const value = data?.value || 0;
          const radius = value > 0 ? Math.max(8, Math.min(25, Math.sqrt(value) * 2)) : 6;
          const color = getColorIntensity(gov.name);
          
          return (
            <g key={gov.name}>
              <circle
                cx={gov.x}
                cy={gov.y}
                r={radius}
                fill={color}
                stroke="#fff"
                strokeWidth="2"
                className="cursor-pointer transition-all duration-200 hover:stroke-[#ec0000] hover:stroke-4"
                onMouseEnter={() => setHoveredRegion(gov.name)}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              <text
                x={gov.x}
                y={gov.y + radius + 15}
                textAnchor="middle"
                className="text-xs fill-gray-700 font-medium"
              >
                {gov.label}
              </text>
              {value > 0 && (
                <text
                  x={gov.x}
                  y={gov.y + 4}
                  textAnchor="middle"
                  className="text-xs fill-white font-bold"
                >
                  {value}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#fed7d7' }}></div>
          <span>Faible</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#f87171' }}></div>
          <span>Moyen</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#dc2626' }}></div>
          <span>Élevé</span>
        </div>
      </div>
      
      {/* Tooltip */}
      {hoveredRegion && (
        <div className="absolute top-2 left-2 bg-white p-3 rounded-lg shadow-lg border">
          <h4 className="font-semibold text-[#ec0000]">{hoveredRegion}</h4>
          <p className="text-sm text-gray-600">
            {geoData.find(d => d.name === hoveredRegion)?.value || 0} clients
          </p>
        </div>
      )}
    </div>
  );
};

export default TunisiaMap;