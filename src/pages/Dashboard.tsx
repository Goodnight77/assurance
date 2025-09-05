import React, { useEffect, useState } from 'react';
import { parseExcelArrayBuffer } from '@/lib/excelParser';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardSidebar from '@/components/DashboardSidebar';
import LogoBar from '@/components/LogoBar';
import Analytics from '@/components/Analytics';

const palette = ['#ec0000', '#222', '#fff', '#e5e7eb', '#f3f4f6'];

function getPieData(data: any[], sheetName: string) {
  // Enhanced pie data based on sheet type
  switch (sheetName) {
    case 'personne_physique':
      const maleCount = data.filter(p => p.CODE_SEXE === 'M').length;
      const femaleCount = data.filter(p => p.CODE_SEXE === 'F').length;
      const unknownCount = data.length - maleCount - femaleCount;
      return [
        { name: 'Hommes', value: maleCount, color: '#ec0000' },
        { name: 'Femmes', value: femaleCount, color: '#222' },
        ...(unknownCount > 0 ? [{ name: 'Non défini', value: unknownCount, color: '#e5e7eb' }] : [])
      ];
      
    case 'personne_morale':
      const activeSectors = [...new Set(data.map(p => p.LIB_SECTEUR_ACTIVITE).filter(s => s && s !== 'NULL'))].length;
      return [
        { name: 'Secteurs actifs', value: activeSectors, color: '#ec0000' },
        { name: 'Entreprises', value: data.length, color: '#222' },
      ];
      
    case 'Contrats':
      const activeContracts = data.filter(c => c.LIB_ETAT_CONTRAT === 'Actif').length;
      const inactiveContracts = data.length - activeContracts;
      return [
        { name: 'Actifs', value: activeContracts, color: '#ec0000' },
        { name: 'Non-actifs', value: inactiveContracts, color: '#6b7280' },
      ];
      
    case 'sinistres':
      const resolvedClaims = data.filter(s => s.LIB_ETAT_SINISTRE === 'Règlé').length;
      const pendingClaims = data.length - resolvedClaims;
      return [
        { name: 'Réglés', value: resolvedClaims, color: '#22c55e' },
        { name: 'En cours', value: pendingClaims, color: '#ec0000' },
      ];
      
    case 'Mapping_Produits':
      const uniqueProducts = [...new Set(data.map(p => p.LIB_PRODUIT))].length;
      return [
        { name: 'Produits uniques', value: uniqueProducts, color: '#ec0000' },
        { name: 'Mappings totaux', value: data.length, color: '#222' },
      ];
      
    default:
      return [
        { name: 'Enregistrements', value: data.length, color: '#ec0000' },
        { name: 'Vide', value: Math.max(0, 100 - data.length), color: '#e5e7eb' },
      ];
  }
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<Record<string, any[]> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('main');
  // Manage filter and page state per section
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [pages, setPages] = useState<Record<string, number>>({});

  useEffect(() => {
  fetch('/Données_Assurance_S1.2_S2.2.xlsx')
      .then(res => res.arrayBuffer())
      .then(buffer => {
        const data = parseExcelArrayBuffer(buffer);
        setDashboardData(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Erreur lors du chargement du fichier Excel.');
        setLoading(false);
      });
  }, []);

  if (loading) return (<div className="p-8">Chargement...</div>);
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!dashboardData) return null;

  // Section mapping
  // Section mapping matches Excel sheet names
  const sectionMap: Record<string, string> = {
    main: 'Main',
    personne_morale: 'personne_morale',
    personne_physique: 'personne_physique',
    Contrats: 'Contrats',
    sinistres: 'sinistres',
    Mapping_Produits: 'Mapping_Produits',
  GarantieContrat: 'Garantie_contrat',
  };

  // Main section: show global stats and breakdowns
  const renderMain = () => {
    // Extract data from dashboardData
    const personneMorale = dashboardData['personne_morale'] || [];
    const personnePhysique = dashboardData['personne_physique'] || [];
    const contrats = dashboardData['Contrats'] || [];
    const sinistres = dashboardData['sinistres'] || [];
    const garanties = dashboardData['Garantie_contrat'] || [];
    // Breakdown clients
    const totalClients = personneMorale.length + personnePhysique.length;
    // Contracts
    const activeContracts = contrats.filter(c => c.LIB_ETAT_CONTRAT === 'Actif');
    const expiredContracts = contrats.filter(c => c.LIB_ETAT_CONTRAT !== 'Actif');
    const totalCapital = contrats.reduce((sum, c) => sum + (Number(c.Capital_assure) || 0), 0);
    // Claims
    const resolvedClaims = sinistres.filter(s => s.LIB_ETAT_SINISTRE === 'Règlé');
    const inProgressClaims = sinistres.filter(s => s.LIB_ETAT_SINISTRE !== 'Règlé');
    const totalPaid = sinistres.reduce((sum, s) => sum + (Number(s.MONTANT_ENCAISSE) || 0), 0);
    const totalPending = sinistres.reduce((sum, s) => sum + (Number(s.MONTANT_A_ENCAISSER) || 0), 0);
    // Branch distribution
    const branchCounts = {};
    contrats.forEach(c => {
      branchCounts[c.branche] = (branchCounts[c.branche] || 0) + 1;
    });
    const branchData = Object.entries(branchCounts).map(([name, value]) => ({ name, value }));
    // Guarantees
    const guaranteeCounts = {};
    garanties.forEach(g => {
      guaranteeCounts[g.LIB_GARANTIE] = (guaranteeCounts[g.LIB_GARANTIE] || 0) + 1;
    });
    const guaranteeData = Object.entries(guaranteeCounts).map(([name, value]) => ({ name, value }));
    // Professions
    const profCounts = {};
    personnePhysique.forEach(p => {
      profCounts[p.LIB_PROFESSION] = (profCounts[p.LIB_PROFESSION] || 0) + 1;
    });
  const topProfessions = Object.entries(profCounts).sort((a, b) => Number(b[1]) - Number(a[1])).slice(0, 5);
    // Geographical
    const geoCounts = {};
    [...personneMorale, ...personnePhysique].forEach(p => {
      geoCounts[p.LIB_GOUVERNORAT] = (geoCounts[p.LIB_GOUVERNORAT] || 0) + 1;
    });
    const geoData = Object.entries(geoCounts).map(([name, value]) => ({ name, value }));
    // Recent contracts/claims
  const recentContracts = [...contrats].sort((a, b) => new Date(b.EFFET_CONTRAT).getTime() - new Date(a.EFFET_CONTRAT).getTime()).slice(0, 5);
  const recentClaims = [...sinistres].sort((a, b) => new Date(b.DATE_SURVENANCE).getTime() - new Date(a.DATE_SURVENANCE).getTime()).slice(0, 5);
    // Coverage gaps (example: clients without contracts)
    const clientsWithNoContract = [...personneMorale, ...personnePhysique].filter(p => !contrats.some(c => c.REF_PERSONNE === p.REF_PERSONNE));

    return (
      <div className="p-8 w-full space-y-8">
        <h1 className="text-3xl font-bold mb-6 text-[#ec0000]">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(dashboardData).map(([sheet, rows], idx) => {
            const pieData = getPieData(rows, sheet);
            const getSheetDescription = (sheetName: string) => {
              switch (sheetName) {
                case 'personne_physique': return 'Distribution par genre des clients';
                case 'personne_morale': return 'Secteurs d\'activité et entreprises';
                case 'Contrats': return 'État des contrats d\'assurance';
                case 'sinistres': return 'État de traitement des sinistres';
                case 'Mapping_Produits': return 'Diversité des produits';
                default: return 'Données disponibles';
              }
            };
            
            return (
              <div key={sheet} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6">
                <div className="text-center mb-4">
                  <h2 className="text-lg font-bold text-[#ec0000] mb-1">{sheet}</h2>
                  <p className="text-xs text-gray-500 mb-2">{getSheetDescription(sheet)}</p>
                  <div className="text-2xl font-bold text-gray-800">{rows.length}</div>
                  <div className="text-xs text-gray-600">enregistrements</div>
                </div>
                
                <div style={{ width: '100%', height: 180 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={65}
                        innerRadius={25}
                        paddingAngle={2}
                        label={({ name, percent }) => 
                          percent > 0.1 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''
                        }
                        labelLine={false}
                        fontSize={10}
                      >
                        {pieData.map((entry, i) => (
                          <Cell key={`cell-${i}`} fill={entry.color || palette[i % palette.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any, name: any) => [`${value}`, name]}
                        labelStyle={{ fontWeight: 'bold', color: '#ec0000' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Mini stats */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  {pieData.slice(0, 2).map((item, i) => (
                    <div key={i} className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-bold text-sm" style={{ color: item.color }}>
                        {item.value}
                      </div>
                      <div className="text-gray-600 truncate">{item.name}</div>
                    </div>
                  ))}
                </div>
                
                {/* Progress indicator */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Complétude</span>
                    <span>{Math.min(100, (rows.length / 50) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-[#ec0000] h-1 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(100, (rows.length / 50) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Analytics Section */}
        <Analytics dashboardData={dashboardData} />
      </div>
    );
  };

  // Table section for each sheet
  const renderTableSection = (sheet: string) => {
    const rows = dashboardData[sheet] || [];
    const pageSize = 10;
    const filter = filters[sheet] || '';
    const page = pages[sheet] || 1;
    if (!rows.length) return <div className="p-8">Aucune donnée disponible.</div>;
    // Filter rows
    const filteredRows = filter
      ? rows.filter(row => Object.values(row).some(val => String(val).toLowerCase().includes(filter.toLowerCase())))
      : rows;
    const totalPages = Math.ceil(filteredRows.length / pageSize);
    const paginatedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);
    return (
      <div className="p-8 w-full max-w-full">
        <h1 className="text-2xl font-bold mb-6 text-[#ec0000]">{sheet}</h1>
        <div className="mb-4 flex flex-col md:flex-row gap-2 items-center justify-between">
          <input
            type="text"
            value={filter}
            onChange={e => {
              setFilters(f => ({ ...f, [sheet]: e.target.value }));
              setPages(p => ({ ...p, [sheet]: 1 }));
            }}
            placeholder="Filtrer..."
            className="border border-[#ec0000] rounded px-3 py-2 w-full md:w-1/3"
          />
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setPages(p => ({ ...p, [sheet]: Math.max(1, (p[sheet] || 1) - 1) }))}
              disabled={page === 1}
              className="px-2 py-1 rounded bg-[#ec0000] text-white disabled:opacity-50"
            >Précédent</button>
            <span className="font-semibold">Page {page} / {totalPages}</span>
            <button
              onClick={() => setPages(p => ({ ...p, [sheet]: Math.min(totalPages, (p[sheet] || 1) + 1) }))}
              disabled={page === totalPages}
              className="px-2 py-1 rounded bg-[#ec0000] text-white disabled:opacity-50"
            >Suivant</button>
          </div>
        </div>
        <div className="overflow-x-auto w-full" style={{ maxWidth: '100vw' }}>
          <table className="w-full bg-white rounded shadow" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr>
                {Object.keys(rows[0]).map((col, idx) => (
                  <th
                    key={idx}
                    className="px-2 py-2 border-b font-semibold text-[#ec0000] text-xs"
                    style={{ width: `${100 / Object.keys(rows[0]).length}%`, minWidth: 80, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((row, i) => (
                <tr key={i} className="hover:bg-[#f3f4f6]">
                  {Object.values(row).map((val, j) => (
                    <td
                      key={j}
                      className="px-2 py-2 border-b text-gray-700 text-xs"
                      style={{ maxWidth: 200, minWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      title={val as string}
                    >
                      {val as string}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8" style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={getPieData(rows)}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label
              >
                {getPieData(rows).map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={palette[i % palette.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f3f4f6]">
      <LogoBar />
      <div className="flex flex-1">
  <DashboardSidebar active={activeSection} onSelect={setActiveSection} />
        <main className="flex-1">
          {activeSection === 'main' && renderMain()}
          {activeSection !== 'main' && renderTableSection(sectionMap[activeSection])}
        </main>
      </div>
    </div>
  );
}
