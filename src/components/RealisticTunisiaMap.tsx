import React, { useState } from 'react';

interface RealisticTunisiaMapProps {
  geoData: Array<{ name: string; value: number }>;
}

const RealisticTunisiaMap: React.FC<RealisticTunisiaMapProps> = ({ geoData }) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  
  // Get max value for color scaling
  const maxValue = Math.max(...geoData.map(d => d.value));
  
  // Get color intensity based on value
  const getColorIntensity = (governorat: string) => {
    const data = geoData.find(d => d.name === governorat);
    if (!data || data.value === 0) return '#f9fafb';
    const intensity = data.value / maxValue;
    
    if (intensity > 0.8) return '#991b1b'; // Very dark red
    if (intensity > 0.6) return '#dc2626'; // Dark red
    if (intensity > 0.4) return '#ef4444'; // Red
    if (intensity > 0.2) return '#f87171'; // Light red
    return '#fca5a5'; // Very light red
  };

  // More accurate Tunisia SVG paths
  const tunisianGovernorates = [
    // Northern Tunisia
    { 
      name: 'TUNIS', 
      path: 'M445,155 L470,150 L475,165 L465,175 L450,180 L440,170 L440,160 Z', 
      label: 'Tunis',
      region: 'Nord',
      center: { x: 457, y: 165 }
    },
    { 
      name: 'ARIANA', 
      path: 'M470,135 L495,130 L505,145 L490,160 L475,165 L470,150 L465,140 Z', 
      label: 'Ariana',
      region: 'Nord',
      center: { x: 485, y: 147 }
    },
    { 
      name: 'BEN AROUS', 
      path: 'M475,165 L500,160 L510,180 L495,195 L480,200 L465,185 L470,170 Z', 
      label: 'Ben Arous',
      region: 'Nord',
      center: { x: 487, y: 180 }
    },
    { 
      name: 'LA MANOUBA', 
      path: 'M430,145 L465,140 L470,155 L455,170 L435,175 L425,160 L425,150 Z', 
      label: 'Manouba',
      region: 'Nord',
      center: { x: 447, y: 157 }
    },
    { 
      name: 'NABEUL', 
      path: 'M510,180 L545,175 L560,195 L545,220 L520,225 L505,205 L505,185 Z', 
      label: 'Nabeul',
      region: 'Nord-Est',
      center: { x: 532, y: 200 }
    },
    { 
      name: 'ZAGHOUAN', 
      path: 'M465,200 L495,195 L505,215 L485,235 L460,240 L450,220 L455,205 Z', 
      label: 'Zaghouan',
      region: 'Centre-Est',
      center: { x: 477, y: 217 }
    },
    { 
      name: 'BIZERTE', 
      path: 'M375,105 L420,100 L435,120 L420,140 L385,145 L365,125 L370,110 Z', 
      label: 'Bizerte',
      region: 'Nord',
      center: { x: 400, y: 122 }
    },
    { 
      name: 'BEJA', 
      path: 'M335,155 L375,150 L385,170 L370,190 L340,195 L325,175 L330,160 Z', 
      label: 'Béja',
      region: 'Nord-Ouest',
      center: { x: 355, y: 172 }
    },
    { 
      name: 'JENDOUBA', 
      path: 'M275,160 L315,155 L325,175 L310,195 L280,200 L265,180 L270,165 Z', 
      label: 'Jendouba',
      region: 'Nord-Ouest',
      center: { x: 295, y: 177 }
    },
    { 
      name: 'LE KEF', 
      path: 'M310,215 L350,210 L360,230 L345,250 L315,255 L300,235 L305,220 Z', 
      label: 'Le Kef',
      region: 'Nord-Ouest',
      center: { x: 330, y: 232 }
    },
    { 
      name: 'SILIANA', 
      path: 'M360,230 L400,225 L410,245 L395,265 L365,270 L350,250 L355,235 Z', 
      label: 'Siliana',
      region: 'Centre-Ouest',
      center: { x: 380, y: 247 }
    },

    // Central Tunisia
    { 
      name: 'KAIROUAN', 
      path: 'M410,265 L450,260 L465,280 L450,300 L420,305 L400,285 L405,270 Z', 
      label: 'Kairouan',
      region: 'Centre',
      center: { x: 432, y: 282 }
    },
    { 
      name: 'SOUSSE', 
      path: 'M465,280 L495,275 L505,295 L490,315 L470,320 L455,300 L460,285 Z', 
      label: 'Sousse',
      region: 'Centre-Est',
      center: { x: 480, y: 297 }
    },
    { 
      name: 'MONASTIR', 
      path: 'M490,315 L515,310 L525,330 L510,345 L490,350 L475,330 L480,320 Z', 
      label: 'Monastir',
      region: 'Centre-Est',
      center: { x: 500, y: 332 }
    },
    { 
      name: 'MAHDIA', 
      path: 'M510,345 L535,340 L545,360 L530,380 L510,385 L495,365 L500,350 Z', 
      label: 'Mahdia',
      region: 'Centre-Est',
      center: { x: 520, y: 362 }
    },
    { 
      name: 'KASSERINE', 
      path: 'M345,325 L385,320 L400,340 L385,360 L355,365 L335,345 L340,330 Z', 
      label: 'Kasserine',
      region: 'Centre-Ouest',
      center: { x: 367, y: 342 }
    },
    { 
      name: 'SIDI BOUZID', 
      path: 'M400,340 L440,335 L455,355 L440,375 L410,380 L390,360 L395,345 Z', 
      label: 'Sidi Bouzid',
      region: 'Centre',
      center: { x: 422, y: 357 }
    },

    // Southern Tunisia
    { 
      name: 'SFAX', 
      path: 'M455,375 L495,370 L510,390 L495,410 L465,415 L445,395 L450,380 Z', 
      label: 'Sfax',
      region: 'Sud-Est',
      center: { x: 477, y: 392 }
    },
    { 
      name: 'GAFSA', 
      path: 'M355,390 L395,385 L410,405 L395,425 L365,430 L345,410 L350,395 Z', 
      label: 'Gafsa',
      region: 'Sud-Ouest',
      center: { x: 377, y: 407 }
    },
    { 
      name: 'TOZEUR', 
      path: 'M315,435 L355,430 L370,450 L355,470 L325,475 L305,455 L310,440 Z', 
      label: 'Tozeur',
      region: 'Sud-Ouest',
      center: { x: 337, y: 452 }
    },
    { 
      name: 'KEBILI', 
      path: 'M395,450 L435,445 L450,465 L435,485 L405,490 L385,470 L390,455 Z', 
      label: 'Kébili',
      region: 'Sud',
      center: { x: 417, y: 467 }
    },
    { 
      name: 'GABES', 
      path: 'M465,415 L500,410 L515,430 L500,450 L475,455 L455,435 L460,420 Z', 
      label: 'Gabès',
      region: 'Sud-Est',
      center: { x: 485, y: 432 }
    },
    { 
      name: 'MEDENINE', 
      path: 'M500,450 L535,445 L550,465 L535,485 L510,490 L490,470 L495,455 Z', 
      label: 'Médenine',
      region: 'Sud-Est',
      center: { x: 520, y: 467 }
    },
    { 
      name: 'TATAOUINE', 
      path: 'M475,485 L510,480 L525,500 L510,520 L485,525 L465,505 L470,490 Z', 
      label: 'Tataouine',
      region: 'Sud-Est',
      center: { x: 495, y: 502 }
    }
  ];

  // Get region color
  const getRegionColor = (region: string) => {
    const colors = {
      'Nord': '#3b82f6',
      'Nord-Est': '#06b6d4',
      'Nord-Ouest': '#8b5cf6',
      'Centre': '#10b981',
      'Centre-Est': '#06b6d4',
      'Centre-Ouest': '#f59e0b',
      'Sud': '#ef4444',
      'Sud-Est': '#ec4899',
      'Sud-Ouest': '#f97316'
    };
    return colors[region as keyof typeof colors] || '#6b7280';
  };

  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-white rounded-xl p-4">
      {/* Title */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center justify-center gap-2">
          🇹🇳 République Tunisienne - Distribution des Clients
        </h3>
        <p className="text-sm text-gray-600">Répartition géographique par gouvernorat</p>
      </div>

      <svg viewBox="0 0 600 600" className="w-full h-96">
        {/* Background sea */}
        <defs>
          <pattern id="waterPattern" patternUnits="userSpaceOnUse" width="30" height="30">
            <rect width="30" height="30" fill="#dbeafe"/>
            <circle cx="8" cy="8" r="1" fill="#3b82f6" opacity="0.3"/>
            <circle cx="22" cy="22" r="1" fill="#3b82f6" opacity="0.3"/>
          </pattern>
          <linearGradient id="seaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe"/>
            <stop offset="100%" stopColor="#bae6fd"/>
          </linearGradient>
        </defs>
        
        {/* Mediterranean Sea */}
        <rect x="0" y="0" width="600" height="140" fill="url(#seaGradient)"/>
        <text x="300" y="70" textAnchor="middle" className="text-xl fill-blue-700 font-bold">
          🌊 Méditerranée
        </text>

        {/* Country borders indication */}
        <text x="180" y="300" className="text-sm fill-gray-500 font-semibold" transform="rotate(-90 180 300)">
          🇩🇿 ALGÉRIE
        </text>
        <text x="580" y="350" className="text-sm fill-gray-500 font-semibold" transform="rotate(90 580 350)">
          🇱🇾 LIBYE
        </text>

        {/* Governorates */}
        {tunisianGovernorates.map((gov) => {
          const data = geoData.find(d => d.name === gov.name);
          const value = data?.value || 0;
          const color = getColorIntensity(gov.name);
          
          return (
            <g key={gov.name}>
              <path
                d={gov.path}
                fill={color}
                stroke="#ffffff"
                strokeWidth="2"
                className="cursor-pointer transition-all duration-300 hover:stroke-[#ec0000] hover:stroke-4 hover:drop-shadow-lg hover:brightness-110"
                onMouseEnter={() => setHoveredRegion(gov.name)}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              
              {/* Governorate label */}
              <text
                x={gov.center.x}
                y={gov.center.y + 3}
                textAnchor="middle"
                className="text-xs fill-gray-800 font-bold pointer-events-none"
                style={{ 
                  filter: 'drop-shadow(1px 1px 2px rgba(255,255,255,0.8))',
                  fontSize: '11px'
                }}
              >
                {gov.label}
              </text>
              
              {/* Client count circle */}
              {value > 0 && (
                <>
                  <circle
                    cx={gov.center.x}
                    cy={gov.center.y - 15}
                    r={Math.max(8, Math.min(20, Math.sqrt(value) * 1.5))}
                    fill="rgba(239, 68, 68, 0.9)"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="pointer-events-none"
                  />
                  <text
                    x={gov.center.x}
                    y={gov.center.y - 11}
                    textAnchor="middle"
                    className="text-xs fill-white font-bold pointer-events-none"
                  >
                    {value}
                  </text>
                </>
              )}
              
              {/* Region indicator */}
              <circle
                cx={gov.center.x + 15}
                cy={gov.center.y + 15}
                r="4"
                fill={getRegionColor(gov.region)}
                className="pointer-events-none opacity-70"
              />
            </g>
          );
        })}

        {/* Major cities icons */}
        <g className="pointer-events-none">
          <text x="457" y="155" className="text-lg">🏛️</text> {/* Tunis */}
          <text x="477" y="392" className="text-lg">🏭</text> {/* Sfax */}
          <text x="480" y="297" className="text-lg">🏖️</text> {/* Sousse */}
          <text x="400" y="122" className="text-lg">⚓</text> {/* Bizerte */}
        </g>
      </svg>
      
      {/* Enhanced Legend */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Client Density Legend */}
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="text-sm font-bold mb-3 text-gray-800 flex items-center gap-2">
            📊 Densité de Clients
          </h4>
          <div className="space-y-2 text-xs">
            {[
              { range: `1-${Math.ceil(maxValue * 0.2)}`, color: '#fca5a5', label: 'Faible' },
              { range: `${Math.ceil(maxValue * 0.2)}-${Math.ceil(maxValue * 0.4)}`, color: '#f87171', label: 'Modérée' },
              { range: `${Math.ceil(maxValue * 0.4)}-${Math.ceil(maxValue * 0.6)}`, color: '#ef4444', label: 'Élevée' },
              { range: `${Math.ceil(maxValue * 0.6)}-${Math.ceil(maxValue * 0.8)}`, color: '#dc2626', label: 'Très élevée' },
              { range: `${Math.ceil(maxValue * 0.8)}+`, color: '#991b1b', label: 'Maximale' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                <span className="flex-1">{item.label}</span>
                <span className="text-gray-600 font-mono">{item.range}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Legend */}
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="text-sm font-bold mb-3 text-gray-800 flex items-center gap-2">
            🗺️ Régions Tunisiennes
          </h4>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {[
              { region: 'Nord', color: '#3b82f6', count: tunisianGovernorates.filter(g => g.region === 'Nord').length },
              { region: 'Centre', color: '#10b981', count: tunisianGovernorates.filter(g => g.region.includes('Centre')).length },
              { region: 'Sud', color: '#ef4444', count: tunisianGovernorates.filter(g => g.region.includes('Sud')).length }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span>{item.region} ({item.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Enhanced Tooltip */}
      {hoveredRegion && (
        <div className="absolute top-16 right-4 bg-white p-4 rounded-xl shadow-2xl border-2 border-red-500 z-20 min-w-48">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: getColorIntensity(hoveredRegion) }}></div>
            <h4 className="font-bold text-red-600">{hoveredRegion}</h4>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Clients:</span>
              <span className="font-bold">{geoData.find(d => d.name === hoveredRegion)?.value || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>% du total:</span>
              <span className="font-bold text-red-600">
                {((geoData.find(d => d.name === hoveredRegion)?.value || 0) / geoData.reduce((sum, d) => sum + d.value, 0) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="mt-2 pt-2 border-t">
              <span className="text-xs text-gray-500">
                Région: {tunisianGovernorates.find(g => g.name === hoveredRegion)?.region}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealisticTunisiaMap;