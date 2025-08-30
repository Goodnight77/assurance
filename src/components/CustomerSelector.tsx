import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, User, Building, MapPin, Briefcase, X, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import type { PersonnePhysique, PersonneMorale } from '@/types/insurance';
import { dataService } from '@/services/dataService';

interface CustomerSelectorProps {
  onCustomerSelect: (customer: PersonnePhysique | PersonneMorale) => void;
  selectedCustomer?: PersonnePhysique | PersonneMorale | null;
}

function Arrow(props: any) {
  const { className, style, onClick, direction } = props;
  return (
    <button
      className={className}
      style={{ ...style, display: 'block', position: 'absolute', top: '50%', zIndex: 2, [direction === 'left' ? 'left' : 'right']: '-40px', transform: 'translateY(-50%)' }}
      onClick={onClick}
      aria-label={direction === 'left' ? 'Précédent' : 'Suivant'}
    >
      {direction === 'left' ? <span>&larr;</span> : <span>&rarr;</span>}
    </button>
  );
}

export function CustomerSelector({ onCustomerSelect, selectedCustomer }: CustomerSelectorProps) {
  const [customers, setCustomers] = useState<(PersonnePhysique | PersonneMorale)[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<(PersonnePhysique | PersonneMorale)[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSector, setFilterSector] = useState<string>('ALL_SECTORS');
  const [filterLocation, setFilterLocation] = useState<string>('ALL_LOCATIONS');
  const [filterProfession, setFilterProfession] = useState<string>('ALL_PROFESSIONS');
  const [filterType, setFilterType] = useState<string>('ALL_TYPES');
  const [filterAge, setFilterAge] = useState<string>('ALL_AGES');
  const [filterBranch, setFilterBranch] = useState<string>('ALL_BRANCHES');
  const [loading, setLoading] = useState(true);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    sector: '',
    location: '',
    profession: '',
    type: '',
    age: '',
    branch: '',
    name: '',
  });
  const [searchResults, setSearchResults] = useState<(PersonnePhysique | PersonneMorale)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const resultsPerPage = 6;

  useEffect(() => {
    // Wait for dataService to load data
    dataService.loadPromise.then(() => {
      const allCustomers = dataService.getAllCustomers();
      setCustomers(allCustomers);
      setFilteredCustomers(allCustomers);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (loading) return;
    // Apply filters
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter(customer => {
        const name = 'NOM_PRENOM' in customer ? customer.NOM_PRENOM : customer.RAISON_SOCIALE;
        return name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    if (filterSector && filterSector !== 'ALL_SECTORS') {
      filtered = filtered.filter(customer => 
        customer.LIB_SECTEUR_ACTIVITE.toLowerCase().includes(filterSector.toLowerCase())
      );
    }

    if (filterLocation && filterLocation !== 'ALL_LOCATIONS') {
      filtered = filtered.filter(customer => 
        customer.VILLE_GOUVERNORAT.toLowerCase().includes(filterLocation.toLowerCase())
      );
    }

    if (filterProfession && filterProfession !== 'ALL_PROFESSIONS') {
      filtered = filtered.filter(customer => {
        if ('LIB_PROFESSION' in customer) {
          return customer.LIB_PROFESSION.toLowerCase().includes(filterProfession.toLowerCase());
        }
        if ('LIB_ACTIVITE' in customer) {
          return customer.LIB_ACTIVITE.toLowerCase().includes(filterProfession.toLowerCase());
        }
        return false;
      });
    }

    if (filterType !== 'ALL_TYPES') {
      filtered = filtered.filter(customer => {
        if (filterType === 'physical') return 'NOM_PRENOM' in customer;
        if (filterType === 'moral') return 'RAISON_SOCIALE' in customer;
        return true;
      });
    }

    if (filterAge !== 'ALL_AGES') {
      filtered = filtered.filter(customer => {
        if ('DATE_NAISSANCE' in customer && customer.DATE_NAISSANCE) {
          const age = new Date().getFullYear() - new Date(customer.DATE_NAISSANCE).getFullYear();
          if (filterAge === '18-30') return age >= 18 && age <= 30;
          if (filterAge === '31-45') return age >= 31 && age <= 45;
          if (filterAge === '46-65') return age >= 46 && age <= 65;
          if (filterAge === '65+') return age > 65;
        }
        return filterAge === '65+' ? false : true;
      });
    }

    if (filterBranch !== 'ALL_BRANCHES') {
      filtered = filtered.filter(customer => {
        const contracts = dataService.getContractsByCustomer(String(customer.REF_PERSONNE));
        return contracts.some(c => c.branche && c.branche.toLowerCase().includes(filterBranch.toLowerCase()));
      });
    }

    setFilteredCustomers(filtered);
  }, [searchTerm, filterSector, filterLocation, filterProfession, filterType, filterAge, filterBranch, customers, loading]);

  // Split customers by type
  const physicalCustomers = customers.filter(c => 'NOM_PRENOM' in c);
  const moralCustomers = customers.filter(c => 'RAISON_SOCIALE' in c);

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    adaptiveHeight: false,
    prevArrow: <Arrow direction="left" />,
    nextArrow: <Arrow direction="right" />,
  };

  // Search modal logic
  const handleSearch = () => {
    let filtered = customers;
    
    if (searchFilters.name) {
      filtered = filtered.filter(customer => {
        const name = 'NOM_PRENOM' in customer ? customer.NOM_PRENOM : customer.RAISON_SOCIALE;
        return name && name.toLowerCase().includes(searchFilters.name.toLowerCase());
      });
    }
    
    if (searchFilters.sector) {
      filtered = filtered.filter(customer => customer.LIB_SECTEUR_ACTIVITE && customer.LIB_SECTEUR_ACTIVITE.toLowerCase().includes(searchFilters.sector.toLowerCase()));
    }
    
    if (searchFilters.location) {
      filtered = filtered.filter(customer => customer.VILLE_GOUVERNORAT && customer.VILLE_GOUVERNORAT.toLowerCase().includes(searchFilters.location.toLowerCase()));
    }
    
    if (searchFilters.profession) {
      filtered = filtered.filter(customer => {
        if ('LIB_PROFESSION' in customer && customer.LIB_PROFESSION) return customer.LIB_PROFESSION.toLowerCase().includes(searchFilters.profession.toLowerCase());
        if ('LIB_ACTIVITE' in customer && customer.LIB_ACTIVITE) return customer.LIB_ACTIVITE.toLowerCase().includes(searchFilters.profession.toLowerCase());
        return false;
      });
    }
    
    if (searchFilters.type && searchFilters.type !== 'all') {
      filtered = filtered.filter(customer => {
        if (searchFilters.type === 'physical') return 'NOM_PRENOM' in customer;
        if (searchFilters.type === 'moral') return 'RAISON_SOCIALE' in customer;
        return true;
      });
    }
    
    if (searchFilters.age && searchFilters.age !== 'all') {
      filtered = filtered.filter(customer => {
        if ('DATE_NAISSANCE' in customer && customer.DATE_NAISSANCE) {
          const age = new Date().getFullYear() - new Date(customer.DATE_NAISSANCE).getFullYear();
          if (searchFilters.age === '18-30') return age >= 18 && age <= 30;
          if (searchFilters.age === '31-45') return age >= 31 && age <= 45;
          if (searchFilters.age === '46-65') return age >= 46 && age <= 65;
          if (searchFilters.age === '65+') return age > 65;
        }
        return searchFilters.age === '65+' ? false : true;
      });
    }
    
    if (searchFilters.branch) {
      filtered = filtered.filter(customer => {
        const contracts = dataService.getContractsByCustomer(String(customer.REF_PERSONNE));
        return contracts.some(c => c.branche && c.branche.toLowerCase().includes(searchFilters.branch.toLowerCase()));
      });
    }
    
    setSearchResults(filtered);
    setCurrentPage(1);
    setHasSearched(true);
  };

  // Get current results for pagination
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);

  const loadMoreResults = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const resetSearch = () => {
    setSearchFilters({
      sector: '',
      location: '',
      profession: '',
      type: '',
      age: '',
      branch: '',
      name: '',
    });
    setSearchResults([]);
    setHasSearched(false);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">Chargement des clients...</h3>
        <p className="text-muted-foreground">Veuillez patienter pendant le chargement des données.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="mb-6 flex justify-end">
        <Button variant="default" onClick={() => setSearchModalOpen(true)}>
          <Search className="h-4 w-4 mr-2" />
          Rechercher un client
        </Button>
      </div>
      
      <Dialog open={searchModalOpen} onOpenChange={setSearchModalOpen}>
        <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b">
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-primary" />
              <DialogTitle>Recherche avancée de client</DialogTitle>
            </div>
           
          </DialogHeader>
          
          <div className="px-6 py-4 bg-muted/30 border-b">
            <div className="text-sm text-muted-foreground mb-3">
              Utilisez les filtres pour rechercher un client par secteur, localisation, profession, type, âge ou branche.
            </div>
            
            <div className="grid grid-cols-12 gap-3 items-end">
              <div className="col-span-3">
                <Input 
                  placeholder="Nom / Raison sociale" 
                  value={searchFilters.name} 
                  onChange={e => setSearchFilters(f => ({ ...f, name: e.target.value }))} 
                  className="h-10"
                />
              </div>
              
              <div className="col-span-2">
                <Input 
                  placeholder="Secteur d'activité" 
                  value={searchFilters.sector} 
                  onChange={e => setSearchFilters(f => ({ ...f, sector: e.target.value }))} 
                  className="h-10"
                />
              </div>
              
              <div className="col-span-2">
                <Input 
                  placeholder="Localisation" 
                  value={searchFilters.location} 
                  onChange={e => setSearchFilters(f => ({ ...f, location: e.target.value }))} 
                  className="h-10"
                />
              </div>
              
              <div className="col-span-2">
                <Select value={searchFilters.type} onValueChange={v => setSearchFilters(f => ({ ...f, type: v }))}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Type de client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="physical">Particulier</SelectItem>
                    <SelectItem value="moral">Entreprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2">
                <div className="flex gap-2">
                  <Button className="flex-1 h-10" onClick={handleSearch}>
                    <Search className="h-4 w-4 mr-2" />
                    Rechercher
                  </Button>
                  <Button variant="outline" className="h-10" onClick={resetSearch}>
                    Réinitialiser
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-12 gap-3 mt-3">
              <div className="col-span-3">
                <Input 
                  placeholder="Profession / Activité" 
                  value={searchFilters.profession} 
                  onChange={e => setSearchFilters(f => ({ ...f, profession: e.target.value }))} 
                  className="h-10"
                />
              </div>
              
              <div className="col-span-3">
                <Select value={searchFilters.age} onValueChange={v => setSearchFilters(f => ({ ...f, age: v }))}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Tranche d'âge" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les tranches</SelectItem>
                    <SelectItem value="18-30">18-30 ans</SelectItem>
                    <SelectItem value="31-45">31-45 ans</SelectItem>
                    <SelectItem value="46-65">46-65 ans</SelectItem>
                    <SelectItem value="65+">65 ans et plus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-3">
                <Input 
                  placeholder="Branche de contrat" 
                  value={searchFilters.branch} 
                  onChange={e => setSearchFilters(f => ({ ...f, branch: e.target.value }))} 
                  className="h-10"
                />
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden flex flex-col p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">
                Résultats de recherche ({searchResults.length})
              </h3>
              {hasSearched && (
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} sur {totalPages}
                </span>
              )}
            </div>
            
            {!hasSearched ? (
              <div className="flex flex-col items-center justify-center flex-1 py-12 text-muted-foreground">
                <Search className="h-16 w-16 mb-4 opacity-50" />
                <p className="text-lg">Utilisez les filtres ci-dessus pour rechercher des clients</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 py-12 text-muted-foreground">
                <Search className="h-16 w-16 mb-4 opacity-50" />
                <p className="text-lg">Aucun client trouvé avec ces critères</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 overflow-y-auto flex-1 pr-2">
                  {currentResults.map((customer) => {
                    const customerType = 'NOM_PRENOM' in customer ? 'physical' : 'moral';
                    const age = 'DATE_NAISSANCE' in customer ? new Date().getFullYear() - new Date(customer.DATE_NAISSANCE).getFullYear() : undefined;
                    const contracts = dataService.getContractsByCustomer(String(customer.REF_PERSONNE));
                    
                    return (
                      <Card key={String(customer.REF_PERSONNE)} className="flex flex-col h-full justify-between border shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2 max-w-[70%]">
                              {customerType === 'physical' ? 
                                <User className="h-5 w-5 text-primary" /> : 
                                <Building className="h-5 w-5 text-secondary" />
                              }
                              <CardTitle className="text-base truncate">
                                {'NOM_PRENOM' in customer ? customer.NOM_PRENOM : customer.RAISON_SOCIALE}
                              </CardTitle>
                            </div>
                            <Badge variant={customerType === 'physical' ? 'default' : 'secondary'}>
                              {customerType === 'physical' ? 'Particulier' : 'Entreprise'}
                            </Badge>
                          </div>
                          <CardDescription className="flex items-center gap-1 text-sm mt-1">
                            <Briefcase className="h-4 w-4" />
                            {'LIB_PROFESSION' in customer ? customer.LIB_PROFESSION : customer.LIB_ACTIVITE}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {customer.VILLE_GOUVERNORAT}
                            </div>
                            {age && (
                              <div className="text-sm text-muted-foreground mt-2">
                                Âge: {age} ans
                              </div>
                            )}
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-sm font-medium">
                                {contracts.length} contrat{contracts.length > 1 ? 's' : ''}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {customer.LIB_SECTEUR_ACTIVITE}
                              </Badge>
                            </div>
                            {contracts.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {[...new Set(contracts.map(c => c.branche))].slice(0, 3).map(branch => (
                                  <Badge key={branch} variant="secondary" className="text-xs">
                                    {branch}
                                  </Badge>
                                ))}
                                {contracts.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{contracts.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-4 pt-3 border-t">
                            <Button 
                              className="w-full" 
                              variant="default" 
                              size="sm" 
                              onClick={() => { 
                                onCustomerSelect(customer); 
                                setSearchModalOpen(false); 
                              }}
                            >
                              Analyser ce client
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                {currentPage < totalPages && (
                  <div className="pt-4 mt-4 border-t">
                    <Button 
                      className="w-full" 
                      variant="outline" 
                      onClick={loadMoreResults}
                    >
                      Voir plus de résultats ({searchResults.length - indexOfLastResult} restants)
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Physical persons row */}
      <div style={{ position: 'relative' }}>
        <h2 className="text-xl font-bold mb-4">Personnes Physiques</h2>
        <Slider {...sliderSettings}>
          {physicalCustomers.map((customer, index) => {
            const customerType = 'physical';
            const age = 'DATE_NAISSANCE' in customer ? new Date().getFullYear() - new Date(customer.DATE_NAISSANCE).getFullYear() : undefined;
            const contracts = dataService.getContractsByCustomer(String(customer.REF_PERSONNE));
            const isSelected = String(selectedCustomer?.REF_PERSONNE) === String(customer.REF_PERSONNE);
            return (
              <div key={String(customer.REF_PERSONNE)} style={{ padding: '0 12px', boxSizing: 'border-box' }}>
                <Card className={`cursor-pointer transition-all hover:shadow-elegant flex flex-col h-[260px] w-[400px] justify-between`} onClick={() => onCustomerSelect(customer)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">{customer.NOM_PRENOM}</CardTitle>
                      </div>
                      <Badge variant="default">Particulier</Badge>
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {customer.LIB_PROFESSION}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {customer.VILLE_GOUVERNORAT}
                      </div>
                      {age && <div className="text-sm text-muted-foreground">Âge: {age} ans</div>}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{contracts.length} contrat{contracts.length > 1 ? 's' : ''}</span>
                        <Badge variant="outline" className="text-xs">{customer.LIB_SECTEUR_ACTIVITE}</Badge>
                      </div>
                      {contracts.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {[...new Set(contracts.map(c => c.branche))].slice(0, 3).map(branch => (
                            <Badge key={branch} variant="secondary" className="text-xs">{branch}</Badge>
                          ))}
                          {contracts.length > 3 && (
                            <Badge variant="outline" className="text-xs">+{contracts.length - 3}</Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-auto">
                      <Button className="w-full" variant={isSelected ? "default" : "outline"} size="sm">{isSelected ? 'Client sélectionné' : 'Analyser ce client'}</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </Slider>
      </div>
      
      {/* Moral persons row */}
      <div style={{ position: 'relative' }}>
        <h2 className="text-xl font-bold mb-4">Personnes Morales</h2>
        <Slider {...sliderSettings}>
          {moralCustomers.map((customer, index) => {
            const customerType = 'moral';
            const contracts = dataService.getContractsByCustomer(String(customer.REF_PERSONNE));
            const isSelected = String(selectedCustomer?.REF_PERSONNE) === String(customer.REF_PERSONNE);
            return (
              <div key={String(customer.REF_PERSONNE)} style={{ padding: '0 12px', boxSizing: 'border-box' }}>
                <Card className={`cursor-pointer transition-all hover:shadow-elegant flex flex-col h-[260px] w-[400px] justify-between`} onClick={() => onCustomerSelect(customer)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-secondary" />
                        <CardTitle className="text-base">{customer.RAISON_SOCIALE}</CardTitle>
                      </div>
                      <Badge variant="secondary">Entreprise</Badge>
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {customer.LIB_ACTIVITE}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {customer.VILLE_GOUVERNORAT}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{contracts.length} contrat{contracts.length > 1 ? 's' : ''}</span>
                        <Badge variant="outline" className="text-xs">{customer.LIB_SECTEUR_ACTIVITE}</Badge>
                      </div>
                      {contracts.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {[...new Set(contracts.map(c => c.branche))].slice(0, 3).map(branch => (
                            <Badge key={branch} variant="secondary" className="text-xs">{branch}</Badge>
                          ))}
                          {contracts.length > 3 && (
                            <Badge variant="outline" className="text-xs">+{contracts.length - 3}</Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-auto">
                      <Button className="w-full" variant={isSelected ? "default" : "outline"} size="sm">{isSelected ? 'Client sélectionné' : 'Analyser ce client'}</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
}