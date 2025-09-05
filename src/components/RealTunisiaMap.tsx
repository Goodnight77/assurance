import React, { useState } from 'react';

interface RealTunisiaMapProps {
  geoData: Array<{ name: string; value: number }>;
}

const RealTunisiaMap: React.FC<RealTunisiaMapProps> = ({ geoData }) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  
  // Get max value for color scaling
  const maxValue = Math.max(...geoData.map(d => d.value));
  
  // Get color intensity based on value
  const getColorIntensity = (governorat: string) => {
    const data = geoData.find(d => d.name === governorat);
    if (!data || data.value === 0) return '#f3f4f6';
    const intensity = data.value / maxValue;
    
    if (intensity > 0.8) return '#7f1d1d'; // Very dark red
    if (intensity > 0.6) return '#b91c1c'; // Dark red
    if (intensity > 0.4) return '#dc2626'; // Red
    if (intensity > 0.2) return '#ef4444'; // Light red
    return '#fca5a5'; // Very light red
  };

  // Real Tunisia governorates SVG paths (simplified but accurate)
  const governoratesPaths = [
    { name: 'TUNIS', path: 'M460,165 L475,160 L485,175 L480,185 L470,190 L455,185 L450,175 Z', label: 'Tunis' },
    { name: 'ARIANA', path: 'M475,145 L495,140 L500,155 L485,165 L475,160 L470,150 Z', label: 'Ariana' },
    { name: 'BEN AROUS', path: 'M485,175 L505,170 L515,185 L505,200 L485,205 L475,190 L480,180 Z', label: 'Ben Arous' },
    { name: 'LA MANOUBA', path: 'M450,155 L470,150 L475,165 L465,175 L445,170 L440,160 Z', label: 'Manouba' },
    { name: 'NABEUL', path: 'M515,185 L540,180 L550,200 L535,220 L515,225 L505,205 L510,190 Z', label: 'Nabeul' },
    { name: 'ZAGHOUAN', path: 'M465,210 L485,205 L495,225 L480,240 L460,245 L450,225 L455,215 Z', label: 'Zaghouan' },
    { name: 'BIZERTE', path: 'M380,110 L420,105 L430,125 L415,145 L385,150 L370,130 L375,115 Z', label: 'Bizerte' },
    { name: 'BEJA', path: 'M340,160 L380,155 L390,175 L375,195 L345,200 L330,180 L335,165 Z', label: 'Béja' },
    { name: 'JENDOUBA', path: 'M280,165 L320,160 L330,180 L315,200 L285,205 L270,185 L275,170 Z', label: 'Jendouba' },
    { name: 'LE KEF', path: 'M315,220 L355,215 L365,235 L350,255 L320,260 L305,240 L310,225 Z', label: 'Le Kef' },
    { name: 'SILIANA', path: 'M365,235 L405,230 L415,250 L400,270 L370,275 L355,255 L360,240 Z', label: 'Siliana' },
    { name: 'KAIROUAN', path: 'M415,270 L455,265 L470,285 L455,305 L425,310 L405,290 L410,275 Z', label: 'Kairouan' },
    { name: 'SOUSSE', path: 'M470,285 L500,280 L510,300 L495,320 L475,325 L460,305 L465,290 Z', label: 'Sousse' },
    { name: 'MONASTIR', path: 'M495,320 L515,315 L525,335 L510,350 L490,355 L480,335 L485,325 Z', label: 'Monastir' },
    { name: 'MAHDIA', path: 'M510,350 L535,345 L545,365 L530,385 L510,390 L495,370 L500,355 Z', label: 'Mahdia' },
    { name: 'SFAX', path: 'M455,385 L495,380 L510,400 L495,420 L465,425 L445,405 L450,390 Z', label: 'Sfax' },
    { name: 'KASSERINE', path: 'M350,330 L390,325 L405,345 L390,365 L360,370 L340,350 L345,335 Z', label: 'Kasserine' },
    { name: 'SIDI BOUZID', path: 'M405,345 L445,340 L460,360 L445,380 L415,385 L395,365 L400,350 Z', label: 'Sidi Bouzid' },
    { name: 'GAFSA', path: 'M360,395 L400,390 L415,410 L400,430 L370,435 L350,415 L355,400 Z', label: 'Gafsa' },
    { name: 'TOZEUR', path: 'M320,440 L360,435 L375,455 L360,475 L330,480 L310,460 L315,445 Z', label: 'Tozeur' },
    { name: 'KEBILI', path: 'M400,455 L440,450 L455,470 L440,490 L410,495 L390,475 L395,460 Z', label: 'Kébili' },
    { name: 'GABES', path: 'M465,425 L500,420 L515,440 L500,460 L475,465 L455,445 L460,430 Z', label: 'Gabès' },
    { name: 'MEDENINE', path: 'M500,460 L535,455 L550,475 L535,495 L510,500 L490,480 L495,465 Z', label: 'Médenine' },
    { name: 'TATAOUINE', path: 'M475,495 L510,490 L525,510 L510,530 L485,535 L465,515 L470,500 Z', label: 'Tataouine' }
  ];

  return (
    <div className="relative">
      <svg viewBox="0 0 600 600" className="w-full h-96 border rounded-lg bg-gradient-to-b from-blue-100 to-blue-50">
        {/* Mediterranean Sea */}
        <defs>
          <pattern id="seaPattern" patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill="#bfdbfe"/>
            <circle cx="10" cy="10" r="1" fill="#3b82f6" opacity="0.3"/>
          </pattern>
        </defs>
        <rect x="0" y="0" width="600" height="120" fill="url(#seaPattern)"/>
        
        {/* Sea label */}
        <text x="300" y="60" textAnchor="middle" className="text-lg fill-blue-700 font-bold">
          🌊 Mer Méditerranée
        </text>
        
        {/* Tunisia borders */}
        <rect x="250" y="100" width="320" height="450" fill="none" stroke="#6b7280" strokeWidth="3" strokeDasharray="5,5" opacity="0.3"/>
        
        {/* Governorates */}
        {governoratesPaths.map((gov) => {
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
                className="cursor-pointer transition-all duration-200 hover:stroke-[#ec0000] hover:stroke-4 hover:drop-shadow-lg"
                onMouseEnter={() => setHoveredRegion(gov.name)}
                onMouseLeave={() => setHoveredRegion(null)}
              />
              {/* Governorate labels */}
              <text
                x={gov.path.split(' ')[1]?.split(',')[0] || '0'}
                y={gov.path.split(' ')[1]?.split(',')[1] ? (parseInt(gov.path.split(' ')[1].split(',')[1]) + 8) : 0}
                textAnchor="middle"
                className="text-xs fill-gray-700 font-semibold pointer-events-none"
                style={{ filter: 'drop-shadow(1px 1px 1px white)' }}
              >
                {gov.label}
              </text>
              {/* Value display */}
              {value > 0 && (
                <text
                  x={gov.path.split(' ')[1]?.split(',')[0] || '0'}
                  y={gov.path.split(' ')[1]?.split(',')[1] ? (parseInt(gov.path.split(' ')[1].split(',')[1]) - 5) : 0}
                  textAnchor="middle"
                  className="text-xs fill-white font-bold pointer-events-none"
                  style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.8))' }}
                >
                  {value}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Algeria border */}
        <text x="200" y="300" className="text-sm fill-gray-500 font-semibold" transform="rotate(-90 200 300)">
          🇩🇿 Algérie
        </text>
        
        {/* Libya border */}
        <text x="580" y="400" className="text-sm fill-gray-500 font-semibold" transform="rotate(90 580 400)">
          🇱🇾 Libye
        </text>
      </svg>
      
      {/* Enhanced Legend */}
      <div className="mt-4">
        <h4 className="text-sm font-semibold mb-3 text-gray-700">📈 Légende de Distribution</h4>
        <div className="flex items-center justify-center space-x-4 text-xs flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fca5a5' }}></div>
            <span>1-{Math.ceil(maxValue * 0.2)} clients</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
            <span>{Math.ceil(maxValue * 0.2)}-{Math.ceil(maxValue * 0.4)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#dc2626' }}></div>
            <span>{Math.ceil(maxValue * 0.4)}-{Math.ceil(maxValue * 0.6)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#b91c1c' }}></div>
            <span>{Math.ceil(maxValue * 0.6)}-{Math.ceil(maxValue * 0.8)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#7f1d1d' }}></div>
            <span>{Math.ceil(maxValue * 0.8)}+ clients</span>
          </div>
        </div>
      </div>
      
      {/* Enhanced Tooltip */}
      {hoveredRegion && (
        <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-xl border-2 border-[#ec0000] z-10">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColorIntensity(hoveredRegion) }}></div>
            <h4 className="font-bold text-[#ec0000]">{hoveredRegion}</h4>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">{geoData.find(d => d.name === hoveredRegion)?.value || 0}</span> clients
            </p>
            <p className="text-xs text-gray-500">
              {((geoData.find(d => d.name === hoveredRegion)?.value || 0) / geoData.reduce((sum, d) => sum + d.value, 0) * 100).toFixed(1)}% du total
            </p>
          </div>
        </div>
      )}
      
      {/* Map Statistics */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-lg font-bold text-blue-700">{geoData.length}</div>
          <div className="text-xs text-blue-600">Gouvernorats</div>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <div className="text-lg font-bold text-red-700">{geoData.reduce((sum, d) => sum + d.value, 0)}</div>
          <div className="text-xs text-red-600">Total Clients</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-lg font-bold text-green-700">{geoData[0]?.name || 'N/A'}</div>
          <div className="text-xs text-green-600">Top Région</div>
        </div>
      </div>
    </div>
  );
};

export default RealTunisiaMap;