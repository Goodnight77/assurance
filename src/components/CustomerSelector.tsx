import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// ...existing code...
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, User, Building, MapPin, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PersonnePhysique, PersonneMorale } from '@/types/insurance';
import { dataService } from '@/services/dataService';

interface CustomerSelectorProps {
  onCustomerSelect: (customer: PersonnePhysique | PersonneMorale) => void;
  selectedCustomer?: PersonnePhysique | PersonneMorale | null;
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

  useEffect(() => {
    // Initialize sample data and load customers
    dataService.initializeSampleData();
    const allCustomers = dataService.getAllCustomers();
    setCustomers(allCustomers);
    setFilteredCustomers(allCustomers);
  }, []);

  useEffect(() => {
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
        const contracts = dataService.getContractsByCustomer(customer.REF_PERSONNE);
        return contracts.some(c => c.branche && c.branche.toLowerCase().includes(filterBranch.toLowerCase()));
      });
    }

    setFilteredCustomers(filtered);
  }, [searchTerm, filterSector, filterLocation, filterProfession, filterType, filterAge, filterBranch, customers]);

  const getSectors = () => {
    const sectors = [...new Set(customers.map(c => c.LIB_SECTEUR_ACTIVITE))];
    return sectors.filter(Boolean);
  };

  const getLocations = () => {
    const locations = [...new Set(customers.map(c => c.LIB_GOUVERNORAT))];
    return locations.filter(Boolean);
  };

  const getProfessions = () => {
    const professions = [
      ...new Set(
        customers.map(c => ('LIB_PROFESSION' in c ? c.LIB_PROFESSION : c.LIB_ACTIVITE))
      ),
    ];
    return professions.filter(Boolean);
  };

  const getBranches = () => {
    const allContracts = customers.flatMap(c => dataService.getContractsByCustomer(c.REF_PERSONNE));
    const branches = [...new Set(allContracts.map(c => c.branche))];
    return branches.filter(Boolean);
  };

  const getCustomerType = (customer: PersonnePhysique | PersonneMorale): 'physical' | 'moral' => {
    return 'NOM_PRENOM' in customer ? 'physical' : 'moral';
  };

  const getCustomerAge = (customer: PersonnePhysique | PersonneMorale): number | undefined => {
    if ('DATE_NAISSANCE' in customer && customer.DATE_NAISSANCE) {
      return new Date().getFullYear() - new Date(customer.DATE_NAISSANCE).getFullYear();
    }
    return undefined;
  };

  const getCustomerContracts = (customer: PersonnePhysique | PersonneMorale) => {
    return dataService.getContractsByCustomer(customer.REF_PERSONNE);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-full max-w-2xl relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-base"
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="ml-2">Filtres</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl w-full p-8">
                <DialogHeader>
                  <DialogTitle>Filtres avancés</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                  <Select value={filterSector} onValueChange={setFilterSector}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Secteur d'activité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL_SECTORS">Tous les secteurs</SelectItem>
                      {getSectors().map(sector => (
                        <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterLocation} onValueChange={setFilterLocation}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Localisation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL_LOCATIONS">Toutes les régions</SelectItem>
                      {getLocations().map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterProfession} onValueChange={setFilterProfession}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Profession / Activité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL_PROFESSIONS">Toutes les professions</SelectItem>
                      {getProfessions().map(prof => (
                        <SelectItem key={prof} value={prof}>{prof}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Type de client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL_TYPES">Tous les types</SelectItem>
                      <SelectItem value="physical">Particulier</SelectItem>
                      <SelectItem value="moral">Entreprise</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterAge} onValueChange={setFilterAge}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Tranche d'âge" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL_AGES">Toutes les tranches</SelectItem>
                      <SelectItem value="18-30">18-30 ans</SelectItem>
                      <SelectItem value="31-45">31-45 ans</SelectItem>
                      <SelectItem value="46-65">46-65 ans</SelectItem>
                      <SelectItem value="65+">65 ans et plus</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterBranch} onValueChange={setFilterBranch}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Branche de contrat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL_BRANCHES">Toutes les branches</SelectItem>
                      {getBranches().map(branch => (
                        <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-6" onClick={() => {
                  setFilterSector('ALL_SECTORS');
                  setFilterLocation('ALL_LOCATIONS');
                  setFilterProfession('ALL_PROFESSIONS');
                  setFilterType('ALL_TYPES');
                  setFilterAge('ALL_AGES');
                  setFilterBranch('ALL_BRANCHES');
                }}>Réinitialiser les filtres</Button>
              </DialogContent>
            </Dialog>
          </div>
          {/* Active filters chips */}
          <div className="flex flex-wrap gap-2 mt-2">
            {filterSector !== 'ALL_SECTORS' && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setFilterSector('ALL_SECTORS')}>{filterSector} <span className="ml-1">×</span></Badge>
            )}
            {filterLocation !== 'ALL_LOCATIONS' && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setFilterLocation('ALL_LOCATIONS')}>{filterLocation} <span className="ml-1">×</span></Badge>
            )}
            {filterProfession !== 'ALL_PROFESSIONS' && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setFilterProfession('ALL_PROFESSIONS')}>{filterProfession} <span className="ml-1">×</span></Badge>
            )}
            {filterType !== 'ALL_TYPES' && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setFilterType('ALL_TYPES')}>{filterType === 'physical' ? 'Particulier' : 'Entreprise'} <span className="ml-1">×</span></Badge>
            )}
            {filterAge !== 'ALL_AGES' && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setFilterAge('ALL_AGES')}>{filterAge} <span className="ml-1">×</span></Badge>
            )}
            {filterBranch !== 'ALL_BRANCHES' && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setFilterBranch('ALL_BRANCHES')}>{filterBranch} <span className="ml-1">×</span></Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer, index) => {
          const customerType = getCustomerType(customer);
          const age = getCustomerAge(customer);
          const contracts = getCustomerContracts(customer);
          const isSelected = selectedCustomer?.REF_PERSONNE === customer.REF_PERSONNE;

          return (
            <motion.div
              key={customer.REF_PERSONNE}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all hover:shadow-elegant ${
                  isSelected ? 'ring-2 ring-primary shadow-glow' : ''
                } flex flex-col h-[340px] justify-between`}
                onClick={() => onCustomerSelect(customer)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {customerType === 'physical' ? (
                        <User className="h-5 w-5 text-primary" />
                      ) : (
                        <Building className="h-5 w-5 text-secondary" />
                      )}
                      <CardTitle className="text-base">
                        {'NOM_PRENOM' in customer ? customer.NOM_PRENOM : customer.RAISON_SOCIALE}
                      </CardTitle>
                    </div>
                    <Badge variant={customerType === 'physical' ? 'default' : 'secondary'}>
                      {customerType === 'physical' ? 'Particulier' : 'Entreprise'}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {'LIB_PROFESSION' in customer ? customer.LIB_PROFESSION : customer.LIB_ACTIVITE}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {customer.VILLE_GOUVERNORAT}
                    </div>
                    {age && (
                      <div className="text-sm text-muted-foreground">
                        Âge: {age} ans
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {contracts.length} contrat{contracts.length > 1 ? 's' : ''}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {customer.LIB_SECTEUR_ACTIVITE}
                      </Badge>
                    </div>
                    {contracts.length > 0 && (
                      <div className="flex flex-wrap gap-1">
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
                  <div className="mt-auto">
                    <Button 
                      className="w-full"
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                    >
                      {isSelected ? 'Client sélectionné' : 'Analyser ce client'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">Aucun client trouvé</h3>
          <p className="text-muted-foreground">
            Aucun client ne correspond à vos critères de recherche.
          </p>
        </div>
      )}
    </div>
  );
}