// import Papa from 'papaparse';
import type {
  PersonnePhysique,
  PersonneMorale,
  Contrat,
  Sinistre,
  MappingProduit,
  GarantieContrat,
  ProductProfile
} from '@/types/insurance';

class DataService {
  private personnesPhysiques: PersonnePhysique[] = [];
  private personnesMorales: PersonneMorale[] = [];
  private contrats: Contrat[] = [];
  private sinistres: Sinistre[] = [];
  private mappingProduits: MappingProduit[] = [];
  private garantiesContrats: GarantieContrat[] = [];
  private productProfiles: ProductProfile[] = [];
  private contractTerms: Map<string, string> = new Map();
  public isLoaded: boolean = false;
  public loadPromise: Promise<void>;

  constructor() {
    this.loadPromise = this.loadDataFromJson();
  }

  async loadDataFromJson() {
    try {
      const response = await fetch('/assurance-data.json');
      const json = await response.json();
      this.personnesPhysiques = (json.personnesPhysiques || []).slice(0, 1000);
      this.personnesMorales = (json.personnesMorales || []).slice(0, 10);
      this.contrats = json.contrats || [];
      this.sinistres = json.sinistres || [];
      this.garantiesContrats = json.garantiesContrats || [];
      this.productProfiles = json.productProfiles || [];
      this.mappingProduits = json.mappingProduits || [];
      if (json.contractTerms) {
        Object.entries(json.contractTerms).forEach(([key, value]) => {
          this.contractTerms.set(key, value as string);
        });
      }
      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load assurance-data.json:', error);
    }
  }

  async load() {
    if (!this.isLoaded) {
      await this.loadPromise;
    }
  }
  // Get customer by ID
  getCustomerById(refPersonne: string): PersonnePhysique | PersonneMorale | null {
    const physical = this.personnesPhysiques.find(p => p.REF_PERSONNE === refPersonne);
    if (physical) return physical;
    const moral = this.personnesMorales.find(p => p.REF_PERSONNE === refPersonne);
    return moral || null;
  }

  // Get contracts by customer
  getContractsByCustomer(refPersonne: string): Contrat[] {
    return this.contrats.filter(c => c.REF_PERSONNE === refPersonne);
  }

  // Get claims by customer
  getClaimsByCustomer(refPersonne: string): Sinistre[] {
    const customerContracts = this.getContractsByCustomer(refPersonne);
    const contractNumbers = customerContracts.map(c => c.NUM_CONTRAT);
    return this.sinistres.filter(s => contractNumbers.includes(s.NUM_CONTRAT));
  }

  // Get guarantees by contract
  getGuaranteesByContract(numContrat: string): GarantieContrat[] {
    return this.garantiesContrats.filter(g => g.NUM_CONTRAT === numContrat);
  }

  // Get all customers
  getAllCustomers(): (PersonnePhysique | PersonneMorale)[] {
    return [...this.personnesPhysiques, ...this.personnesMorales];
  }

  // Get product profiles
  getProductProfiles(): ProductProfile[] {
    return this.productProfiles;
  }

  // Get mapping products
  getMappingProducts(): MappingProduit[] {
    return this.mappingProduits;
  }

  // Get contract terms
  getContractTerms(productName: string): string | undefined {
    return this.contractTerms.get(productName);
  }

  // Search customers by criteria
  searchCustomers(criteria: {
    profession?: string;
    sector?: string;
    location?: string;
    ageRange?: [number, number];
  }): (PersonnePhysique | PersonneMorale)[] {
    let results = this.getAllCustomers();
    if (criteria.profession) {
      results = results.filter(customer =>
        'LIB_PROFESSION' in customer &&
        customer.LIB_PROFESSION?.toLowerCase().includes(criteria.profession!.toLowerCase())
      );
    }
    if (criteria.sector) {
      results = results.filter(customer =>
        customer.LIB_SECTEUR_ACTIVITE?.toLowerCase().includes(criteria.sector!.toLowerCase())
      );
    }
    if (criteria.location) {
      results = results.filter(customer =>
        customer.VILLE?.toLowerCase().includes(criteria.location!.toLowerCase()) ||
        customer.LIB_GOUVERNORAT?.toLowerCase().includes(criteria.location!.toLowerCase())
      );
    }
    if (criteria.ageRange && criteria.ageRange[0] > 0) {
      results = results.filter(customer => {
        if ('DATE_NAISSANCE' in customer && customer.DATE_NAISSANCE) {
          const age = new Date().getFullYear() - new Date(customer.DATE_NAISSANCE).getFullYear();
          return age >= criteria.ageRange![0] && age <= criteria.ageRange![1];
        }
        return true;
      });
    }
    return results;
  }
  // ...existing methods (searchCustomers, getCustomerById, getContractsByCustomer, etc.) should be here...

  // Get equipment gaps for a customer
  analyzeEquipmentGaps(customer: PersonnePhysique | PersonneMorale): string[] {
    const contracts = this.getContractsByCustomer(customer.REF_PERSONNE);
    const existingBranches = contracts.map(c => c.branche);
    const gaps: string[] = [];
    // Basic coverage analysis
    if (!existingBranches.includes('VIE')) {
      gaps.push('Assurance Vie manquante');
    }
    if (!existingBranches.includes('IARD') && 'LIB_PROFESSION' in customer) {
      gaps.push('Assurance Santé recommandée');
    }
    if (!existingBranches.includes('Automobile') && customer.LIB_SECTEUR_ACTIVITE !== 'Retraité') {
      gaps.push('Assurance Automobile potentielle');
    }
    return gaps;
  }

  // Getter methods for ChatBot access
  getPersonnesPhysiques(): PersonnePhysique[] {
    return this.personnesPhysiques;
  }
  getPersonnesMorales(): PersonneMorale[] {
    return this.personnesMorales;
  }
  getAllContracts(): Contrat[] {
    return this.contrats;
  }
  getAllClaims(): Sinistre[] {
    return this.sinistres;
  }
  getClaimsByContract(contractNumbers: string[]): Sinistre[] {
    return this.sinistres.filter(s => contractNumbers.includes(s.NUM_CONTRAT));
  }
}

export const dataService = new DataService();