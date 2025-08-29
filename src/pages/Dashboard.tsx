import React, { useEffect, useState } from 'react';
import { parseExcelArrayBuffer } from '@/lib/excelParser';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardSidebar from '@/components/DashboardSidebar';
import LogoBar from '@/components/LogoBar';

const palette = ['#ec0000', '#222', '#fff', '#e5e7eb', '#f3f4f6'];

function getPieData(data: any[]) {
  return [
    { name: 'Enregistrements', value: data.length },
    { name: 'Vide', value: Math.max(0, 100 - data.length) },
  ];
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(dashboardData).map(([sheet, rows], idx) => (
            <div key={sheet} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-2 text-[#ec0000]">{sheet}</h2>
              <p className="text-gray-600 mb-4">{rows.length} enregistrements</p>
              <div style={{ width: '100%', height: 200 }}>
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
              <div className="mt-4 w-full flex justify-center">
                <span className="bg-[#ec0000] text-white px-4 py-1 rounded-full font-bold">
                  {((rows.length / 100) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
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
