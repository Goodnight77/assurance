import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import RealisticTunisiaMap from './RealisticTunisiaMap';

const COLORS = ['#ec0000', '#222', '#f3f4f6', '#e5e7eb', '#6b7280', '#9ca3af', '#d1d5db'];

interface AnalyticsProps {
  dashboardData: Record<string, any[]>;
}

export const Analytics: React.FC<AnalyticsProps> = ({ dashboardData }) => {
  const personnesPhysiques = dashboardData['personne_physique'] || [];
  const sinistres = dashboardData['sinistres'] || [];
  const mappingProduits = dashboardData['Mapping_Produits'] || [];

  // Gender Distribution
  const genderDistribution = personnesPhysiques.reduce((acc: any, person: any) => {
    const gender = person.CODE_SEXE === 'M' ? 'Homme' : person.CODE_SEXE === 'F' ? 'Femme' : 'Non spécifié';
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {});
  const genderData = Object.entries(genderDistribution).map(([name, value]) => ({ name, value }));

  // Geographical Distribution
  const geoDistribution = personnesPhysiques.reduce((acc: any, person: any) => {
    const gouvernorat = person.LIB_GOUVERNORAT === 'NULL' || !person.LIB_GOUVERNORAT ? 'Non spécifié' : person.LIB_GOUVERNORAT;
    acc[gouvernorat] = (acc[gouvernorat] || 0) + 1;
    return acc;
  }, {});
  const geoData = Object.entries(geoDistribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => (b.value as number) - (a.value as number))
    .slice(0, 10); // Top 10 gouvernorats

  // Age Distribution
  const currentYear = new Date().getFullYear();
  const ageGroups = personnesPhysiques.reduce((acc: any, person: any) => {
    if (person.DATE_NAISSANCE) {
      const birthYear = new Date(person.DATE_NAISSANCE).getFullYear();
      const age = currentYear - birthYear;
      let ageGroup = 'Non défini';
      if (age < 25) ageGroup = '< 25 ans';
      else if (age < 35) ageGroup = '25-34 ans';
      else if (age < 45) ageGroup = '35-44 ans';
      else if (age < 55) ageGroup = '45-54 ans';
      else if (age < 65) ageGroup = '55-64 ans';
      else ageGroup = '65+ ans';
      
      acc[ageGroup] = (acc[ageGroup] || 0) + 1;
    }
    return acc;
  }, {});
  const ageData = Object.entries(ageGroups).map(([name, value]) => ({ name, value }));

  // Sinistres Distribution by Status
  const sinistresByStatus = sinistres.reduce((acc: any, sinistre: any) => {
    const status = sinistre.LIB_ETAT_SINISTRE || 'Non défini';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  const sinistresStatusData = Object.entries(sinistresByStatus).map(([name, value]) => ({ name, value }));

  // Sinistres by Month
  const sinistresByMonth = sinistres.reduce((acc: any, sinistre: any) => {
    if (sinistre.DATE_SURVENANCE) {
      const month = new Date(sinistre.DATE_SURVENANCE).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + 1;
    }
    return acc;
  }, {});
  const sinistresMonthData = Object.entries(sinistresByMonth)
    .map(([name, value]) => ({ name, value }))
    .slice(-12); // Last 12 months

  // Products Distribution from Mapping_Produits
  const productsDistribution = mappingProduits.reduce((acc: any, produit: any) => {
    const product = produit.LIB_PRODUIT || 'Non défini';
    acc[product] = (acc[product] || 0) + 1;
    return acc;
  }, {});
  const productsData = Object.entries(productsDistribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => (b.value as number) - (a.value as number))
    .slice(0, 10); // Top 10 products

  // Profession Distribution
  const professionDistribution = personnesPhysiques.reduce((acc: any, person: any) => {
    const profession = person.LIB_PROFESSION === 'NON DEFINIE' || !person.LIB_PROFESSION ? 'Non définie' : person.LIB_PROFESSION;
    acc[profession] = (acc[profession] || 0) + 1;
    return acc;
  }, {});
  const professionData = Object.entries(professionDistribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => (b.value as number) - (a.value as number))
    .slice(0, 8); // Top 8 professions

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold text-[#ec0000] mb-6">Analytics Dashboard</h2>
      
      {/* Row 1: Gender & Age Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-[#ec0000]">Distribution par Genre</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-[#ec0000]">Distribution par Tranche d'Âge</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#ec0000" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Enhanced Geographical Distribution with Map */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-[#ec0000]">Distribution Géographique par Gouvernorat</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Interactive Tunisia Map */}
          <div>
            <RealisticTunisiaMap geoData={geoData} />
          </div>
          
          {/* Enhanced Top 10 Gouvernorats */}
          <div>
            <h4 className="text-md font-medium mb-4 text-gray-700">🏆 Top 10 Gouvernorats par Nombre de Clients</h4>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {geoData.slice(0, 10).map((region, index) => {
                const totalClients = geoData.reduce((sum, r) => sum + (r.value as number), 0);
                const percentage = ((region.value as number) / totalClients * 100).toFixed(1);
                
                // Get regional emoji and description
                const getRegionInfo = (name: string) => {
                  const regionInfo: { [key: string]: { emoji: string; description: string; type: string } } = {
                    'TUNIS': { emoji: '🏛️', description: 'Capitale et centre économique', type: 'Métropole' },
                    'SFAX': { emoji: '🏭', description: 'Centre industriel du Sud', type: 'Ville industrielle' },
                    'SOUSSE': { emoji: '🏖️', description: 'Perle du Sahel, tourisme', type: 'Ville touristique' },
                    'ARIANA': { emoji: '🏘️', description: 'Banlieue résidentielle de Tunis', type: 'Zone résidentielle' },
                    'NABEUL': { emoji: '🎨', description: 'Artisanat et poterie', type: 'Région artisanale' },
                    'BEN AROUS': { emoji: '🏢', description: 'Zone industrielle de la capitale', type: 'Zone industrielle' },
                    'MONASTIR': { emoji: '✈️', description: 'Aéroport international', type: 'Hub transport' },
                    'GABES': { emoji: '🌴', description: 'Oasis et industries', type: 'Région oasienne' },
                    'KAIROUAN': { emoji: '🕌', description: 'Ville sainte et historique', type: 'Ville historique' },
                    'BIZERTE': { emoji: '⚓', description: 'Port du Nord', type: 'Ville portuaire' }
                  };
                  return regionInfo[name] || { emoji: '📍', description: 'Gouvernorat de Tunisie', type: 'Région' };
                };

                const regionInfo = getRegionInfo(region.name);
                
                return (
                  <div key={index} className="bg-gradient-to-r from-white to-gray-50 border rounded-xl p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-red-500">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                          index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' : 
                          index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600' : 
                          'bg-gradient-to-r from-red-400 to-red-600'
                        }`}>
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-lg">{regionInfo.emoji}</span>
                            <h5 className="font-bold text-gray-800">{region.name}</h5>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {regionInfo.type}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">{regionInfo.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-600">{region.value}</div>
                        <div className="text-xs text-gray-600">clients</div>
                      </div>
                    </div>
                    
                    {/* Visual progress bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Distribution</span>
                        <span className="font-semibold text-red-600">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ${
                            index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                            index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' : 
                            index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600' : 
                            'bg-gradient-to-r from-red-400 to-red-600'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Client density indicator */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span>👥 Densité:</span>
                        <span className={`px-2 py-1 rounded-full font-medium ${
                          region.value > 50 ? 'bg-red-100 text-red-700' :
                          region.value > 20 ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {region.value > 50 ? 'Très élevée' : 
                           region.value > 20 ? 'Élevée' : 
                           'Modérée'}
                        </span>
                      </div>
                      {index < 3 && (
                        <div className="flex items-center space-x-1">
                          {index === 0 && <span>🥇</span>}
                          {index === 1 && <span>🥈</span>}
                          {index === 2 && <span>🥉</span>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Summary for Top 10 */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-700">
                    {geoData.slice(0, 10).reduce((sum, r) => sum + (r.value as number), 0)}
                  </div>
                  <div className="text-xs text-blue-600">Clients Top 10</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-700">
                    {((geoData.slice(0, 10).reduce((sum, r) => sum + (r.value as number), 0) / geoData.reduce((sum, r) => sum + (r.value as number), 0)) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-blue-600">Du total national</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Statistics Cards */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-[#ec0000]">{geoData.length}</div>
            <div className="text-sm text-gray-600">Gouvernorats actifs</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-[#ec0000]">{geoData[0]?.name || 'N/A'}</div>
            <div className="text-sm text-gray-600">Plus forte concentration</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-[#ec0000]">{geoData[0]?.value || 0}</div>
            <div className="text-sm text-gray-600">Max clients/région</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-[#ec0000]">
              {Math.round(geoData.reduce((sum, d) => sum + (d.value as number), 0) / geoData.length)}
            </div>
            <div className="text-sm text-gray-600">Moyenne/région</div>
          </div>
        </div>
      </div>

      {/* Row 3: Professions Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-[#ec0000]">Top Professions</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={professionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#222" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Row 4: Sinistres Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-[#ec0000]">Sinistres par État</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sinistresStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sinistresStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-[#ec0000]">Évolution des Sinistres</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sinistresMonthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#ec0000" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 5: Top Produits d'Assurance - Table Format */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-6 text-[#ec0000]">🏆 Top Produits d'Assurance</h3>
        <div className="overflow-hidden">
          <div className="space-y-4">
            {productsData.map((product, index) => {
              const totalContracts = productsData.reduce((sum, p) => sum + (p.value as number), 0);
              const percentage = ((product.value as number) / totalContracts * 100).toFixed(1);
              
              // Convert technical names to user-friendly names
              const getUserFriendlyName = (name: string) => {
                const friendlyNames: { [key: string]: string } = {
                  'CARTES BANCAIRES': '💳 Assurance Cartes Bancaires',
                  'TEMPORAIRE DECES': '🛡️ Assurance Décès Temporaire',
                  'TEMPORAIRE DECES A CAPITAL DECROISSANT LINEAIREMENT': '📉 Assurance Décès Capital Décroissant',
                  'TEMPORAIRE DECES A CAPITAL DECROISSANT LINEAIREMENT (BH)': '📉 Assurance Décès Capital Décroissant BH',
                  'MULTIRISQUE HABITATION': '🏠 Assurance Multirisque Habitation',
                  'ASSURANCE GROUPE MALADIE': '🏥 Assurance Santé Groupe',
                  'AUTO TOUS RISQUES': '🚗 Assurance Auto Tous Risques',
                  'RESPONSABILITE CIVILE AUTO': '🚙 Responsabilité Civile Auto',
                  'VOYAGE COURT SEJOUR': '✈️ Assurance Voyage Court Séjour',
                  'INDIVIDUELLE ACCIDENT': '⚠️ Assurance Accident Individuelle'
                };
                return friendlyNames[name] || `📋 ${name}`;
              };

              const getProductDescription = (name: string) => {
                const descriptions: { [key: string]: string } = {
                  'CARTES BANCAIRES': 'Protection contre la fraude et vol de cartes bancaires',
                  'TEMPORAIRE DECES': 'Protection financière en cas de décès pendant la période du contrat',
                  'TEMPORAIRE DECES A CAPITAL DECROISSANT LINEAIREMENT': 'Assurance décès avec capital qui diminue progressivement',
                  'TEMPORAIRE DECES A CAPITAL DECROISSANT LINEAIREMENT (BH)': 'Version BH de l\'assurance décès à capital décroissant',
                  'MULTIRISQUE HABITATION': 'Protection complète de votre domicile et biens personnels',
                  'ASSURANCE GROUPE MALADIE': 'Couverture santé collective pour employés',
                  'AUTO TOUS RISQUES': 'Protection complète de votre véhicule',
                  'RESPONSABILITE CIVILE AUTO': 'Couverture obligatoire des dommages causés aux tiers',
                  'VOYAGE COURT SEJOUR': 'Protection médicale et assistance pendant vos voyages',
                  'INDIVIDUELLE ACCIDENT': 'Indemnisation en cas d\'accident corporel'
                };
                return descriptions[name] || 'Produit d\'assurance spécialisé';
              };

              return (
                <div key={index} className="bg-gradient-to-r from-gray-50 to-white border-l-4 border-[#ec0000] rounded-r-lg p-4 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-orange-600' : 'bg-[#ec0000]'
                        }`}>
                          #{index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm mb-1">
                          {getUserFriendlyName(product.name)}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {getProductDescription(product.name)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#ec0000]">{product.value}</div>
                      <div className="text-xs text-gray-600">contrats</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 mr-4">
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#ec0000] to-red-400"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-[#ec0000]">{percentage}% du total</span>
                    </div>
                  </div>
                  
                  {index === 0 && (
                    <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      👑 Produit le plus populaire
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Summary */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-blue-800">📊 Résumé des Produits</h4>
                <p className="text-sm text-blue-600">
                  {productsData.length} produits différents • {productsData.reduce((sum, p) => sum + (p.value as number), 0)} contrats au total
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-800">
                  {productsData.slice(0, 3).reduce((sum, p) => sum + (p.value as number), 0)}
                </div>
                <div className="text-xs text-blue-600">Top 3 produits</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-[#ec0000]">{personnesPhysiques.length}</div>
          <div className="text-gray-600">Personnes Physiques</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-[#ec0000]">{sinistres.length}</div>
          <div className="text-gray-600">Total Sinistres</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-[#ec0000]">{Object.keys(geoDistribution).length}</div>
          <div className="text-gray-600">Gouvernorats</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-[#ec0000]">{mappingProduits.length}</div>
          <div className="text-gray-600">Produits Mappés</div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;