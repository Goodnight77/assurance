import Papa from 'papaparse';
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

  // Sample data initialization for demo purposes
  initializeSampleData() {
    // Sample Physical Persons
    this.personnesPhysiques = [
      {
        REF_PERSONNE: "PP001",
        NOM_PRENOM: "Ahmed Ben Salah",
        DATE_NAISSANCE: "1985-03-15",
        LIEU_NAISSANCE: "Tunis",
        CODE_SEXE: "M",
        SITUATION_FAMILIALE: "Marié",
        NUM_PIECE_IDENTITE: "12345678",
        LIB_SECTEUR_ACTIVITE: "Santé",
        LIB_PROFESSION: "Médecin",
        VILLE: "Tunis",
        LIB_GOUVERNORAT: "Tunis",
        VILLE_GOUVERNORAT: "Tunis - Tunis"
      },
      {
        REF_PERSONNE: "PP002",
        NOM_PRENOM: "Fatma Trabelsi",
        DATE_NAISSANCE: "1990-07-22",
        LIEU_NAISSANCE: "Sfax",
        CODE_SEXE: "F",
        SITUATION_FAMILIALE: "Célibataire",
        NUM_PIECE_IDENTITE: "87654321",
        LIB_SECTEUR_ACTIVITE: "Education",
        LIB_PROFESSION: "Enseignante",
        VILLE: "Sfax",
        LIB_GOUVERNORAT: "Sfax",
        VILLE_GOUVERNORAT: "Sfax - Sfax"
      },
      {
        REF_PERSONNE: "PP003",
        NOM_PRENOM: "Mohamed Karray",
        DATE_NAISSANCE: "1978-12-03",
        LIEU_NAISSANCE: "Sousse",
        CODE_SEXE: "M",
        SITUATION_FAMILIALE: "Marié",
        NUM_PIECE_IDENTITE: "11223344",
        LIB_SECTEUR_ACTIVITE: "Ingénierie",
        LIB_PROFESSION: "Ingénieur",
        VILLE: "Sousse",
        LIB_GOUVERNORAT: "Sousse",
        VILLE_GOUVERNORAT: "Sousse - Sousse"
      },
      {
        REF_PERSONNE: "PP004",
        NOM_PRENOM: "Souad Mejri",
        DATE_NAISSANCE: "1982-09-10",
        LIEU_NAISSANCE: "Bizerte",
        CODE_SEXE: "F",
        SITUATION_FAMILIALE: "Divorcée",
        NUM_PIECE_IDENTITE: "44332211",
        LIB_SECTEUR_ACTIVITE: "Commerce",
        LIB_PROFESSION: "Commerçante",
        VILLE: "Bizerte",
        LIB_GOUVERNORAT: "Bizerte",
        VILLE_GOUVERNORAT: "Bizerte - Bizerte"
      }
    ];

    // Sample Legal Persons
    this.personnesMorales = [
      {
        REF_PERSONNE: "PM001",
        RAISON_SOCIALE: "Entreprise Karray & Fils",
        MATRICULE_FISCALE: "MF001",
        LIB_SECTEUR_ACTIVITE: "Construction",
        LIB_ACTIVITE: "Bâtiment",
        VILLE: "Tunis",
        LIB_GOUVERNORAT: "Tunis",
        VILLE_GOUVERNORAT: "Tunis - Tunis"
      },
      {
        REF_PERSONNE: "PM002",
        RAISON_SOCIALE: "Société Trabelsi Education",
        MATRICULE_FISCALE: "MF002",
        LIB_SECTEUR_ACTIVITE: "Education",
        LIB_ACTIVITE: "Formation",
        VILLE: "Sfax",
        LIB_GOUVERNORAT: "Sfax",
        VILLE_GOUVERNORAT: "Sfax - Sfax"
      }
    ];

    // Sample Contracts
    this.contrats = [
      {
        REF_PERSONNE: "PP001",
        NUM_CONTRAT: "C001",
        LIB_PRODUIT: "ASSURANCE DES VEHICULES TERRESTRES A MOTEURS",
        EFFET_CONTRAT: "2024-01-01",
        DATE_EXPIRATION: "2024-12-31",
        PROCHAIN_TERME: "2024-12-31",
        LIB_ETAT_CONTRAT: "Actif",
        branche: "Automobile",
        somme_quittances: 1200,
        statut_paiement: "Payé",
        Capital_assure: 25000
      },
      {
        REF_PERSONNE: "PP002",
        NUM_CONTRAT: "C002",
        LIB_PRODUIT: "MULTIRISQUE HABITATION",
        EFFET_CONTRAT: "2024-02-01",
        DATE_EXPIRATION: "2025-02-01",
        PROCHAIN_TERME: "2025-02-01",
        LIB_ETAT_CONTRAT: "Actif",
        branche: "IARD",
        somme_quittances: 800,
        statut_paiement: "Payé",
        Capital_assure: 150000
      },
      {
        REF_PERSONNE: "PP003",
        NUM_CONTRAT: "C003",
        LIB_PRODUIT: "ASSURANCE DES VEHICULES TERRESTRES A MOTEURS",
        EFFET_CONTRAT: "2024-03-01",
        DATE_EXPIRATION: "2025-03-01",
        PROCHAIN_TERME: "2025-03-01",
        LIB_ETAT_CONTRAT: "Actif",
        branche: "Automobile",
        somme_quittances: 1500,
        statut_paiement: "Non payé",
        Capital_assure: 30000
      },
      {
        REF_PERSONNE: "PP004",
        NUM_CONTRAT: "C004",
        LIB_PRODUIT: "ASSURANCE GROUPE MALADIE",
        EFFET_CONTRAT: "2024-04-01",
        DATE_EXPIRATION: "2025-04-01",
        PROCHAIN_TERME: "2025-04-01",
        LIB_ETAT_CONTRAT: "Actif",
        branche: "IARD",
        somme_quittances: 1000,
        statut_paiement: "Payé",
        Capital_assure: 50000
      },
      {
        REF_PERSONNE: "PM001",
        NUM_CONTRAT: "C005",
        LIB_PRODUIT: "MULTIRISQUE ENTREPRISE",
        EFFET_CONTRAT: "2024-05-01",
        DATE_EXPIRATION: "2025-05-01",
        PROCHAIN_TERME: "2025-05-01",
        LIB_ETAT_CONTRAT: "Actif",
        branche: "IARD",
        somme_quittances: 3000,
        statut_paiement: "Payé",
        Capital_assure: 500000
      }
    ];

    // Sample Claims
    this.sinistres = [
      {
        NUM_SINISTRE: "S001",
        NUM_CONTRAT: "C001",
        LIB_BRANCHE: "Automobile",
        LIB_SOUS_BRANCHE: "VEHICULES",
        LIB_PRODUIT: "ASSURANCE DES VEHICULES TERRESTRES A MOTEURS",
        NATURE_SINISTRE: "Collision",
        LIB_TYPE_SINISTRE: "Accident",
        TAUX_RESPONSABILITE: 0.7,
        DATE_SURVENANCE: "2024-06-15",
        DATE_DECLARATION: "2024-06-16",
        DATE_OUVERTURE: "2024-06-17",
        OBSERVATION_SINISTRE: "Dommages modérés",
        LIB_ETAT_SINISTRE: "En cours",
        LIEU_ACCIDENT: "Tunis",
        MOTIF_REOUVERTURE: "",
        MONTANT_ENCAISSE: 0,
        MONTANT_A_ENCAISSER: 5000
      },
      {
        NUM_SINISTRE: "S002",
        NUM_CONTRAT: "C002",
        LIB_BRANCHE: "IARD",
        LIB_SOUS_BRANCHE: "HABITATION",
        LIB_PRODUIT: "MULTIRISQUE HABITATION",
        NATURE_SINISTRE: "Incendie",
        LIB_TYPE_SINISTRE: "Sinistre majeur",
        TAUX_RESPONSABILITE: 0.3,
        DATE_SURVENANCE: "2024-07-10",
        DATE_DECLARATION: "2024-07-11",
        DATE_OUVERTURE: "2024-07-12",
        OBSERVATION_SINISTRE: "Dommages importants",
        LIB_ETAT_SINISTRE: "Règlé",
        LIEU_ACCIDENT: "Sfax",
        MOTIF_REOUVERTURE: "",
        MONTANT_ENCAISSE: 20000,
        MONTANT_A_ENCAISSER: 0
      },
      {
        NUM_SINISTRE: "S003",
        NUM_CONTRAT: "C003",
        LIB_BRANCHE: "Automobile",
        LIB_SOUS_BRANCHE: "VEHICULES",
        LIB_PRODUIT: "ASSURANCE DES VEHICULES TERRESTRES A MOTEURS",
        NATURE_SINISTRE: "Accident",
        LIB_TYPE_SINISTRE: "Collision",
        TAUX_RESPONSABILITE: 0.9,
        DATE_SURVENANCE: "2024-08-05",
        DATE_DECLARATION: "2024-08-06",
        DATE_OUVERTURE: "2024-08-07",
        OBSERVATION_SINISTRE: "Dommages légers",
        LIB_ETAT_SINISTRE: "En cours",
        LIEU_ACCIDENT: "Sousse",
        MOTIF_REOUVERTURE: "",
        MONTANT_ENCAISSE: 0,
        MONTANT_A_ENCAISSER: 8000
      }
    ];

    // Sample Contract Guarantees
    this.garantiesContrats = [
      {
        NUM_CONTRAT: "C001",
        CODE_GARANTIE: "RC",
        CAPITAL_ASSURE: 10000,
        LIB_GARANTIE: "Responsabilité Civile"
      },
      {
        NUM_CONTRAT: "C001",
        CODE_GARANTIE: "DC",
        CAPITAL_ASSURE: 25000,
        LIB_GARANTIE: "Dommages Collision"
      },
      {
        NUM_CONTRAT: "C002",
        CODE_GARANTIE: "INC",
        CAPITAL_ASSURE: 150000,
        LIB_GARANTIE: "Incendie"
      },
      {
        NUM_CONTRAT: "C004",
        CODE_GARANTIE: "HOSP",
        CAPITAL_ASSURE: 50000,
        LIB_GARANTIE: "Hospitalisation"
      }
    ];

    // Sample Product Profiles
    this.productProfiles = [
      {
        LIB_BRANCHE: "VIE",
        LIB_SOUS_BRANCHE: "DECES",
        LIB_PRODUIT: "TEMPORAIRE DECES",
        Profils_cibles: "Emprunteurs; chefs de famille; personnes souhaitant protéger leurs proches"
      },
      {
        LIB_BRANCHE: "VIE",
        LIB_SOUS_BRANCHE: "CAPITALISATION",
        LIB_PRODUIT: "ASSURANCE VIE COMPLEMENT RETRAITE - HORIZON",
        Profils_cibles: "Salariés publics et privés; professions libérales; travailleurs indépendants préparant leur retraite"
      },
      {
        LIB_BRANCHE: "IARD",
        LIB_SOUS_BRANCHE: "SANTE",
        LIB_PRODUIT: "ASSURANCE GROUPE MALADIE",
        Profils_cibles: "Salariés; familles; professions libérales"
      },
      {
        LIB_BRANCHE: "IARD",
        LIB_SOUS_BRANCHE: "HABITATION",
        LIB_PRODUIT: "MULTIRISQUE HABITATION",
        Profils_cibles: "Propriétaires; locataires; familles"
      },
      {
        LIB_BRANCHE: "IARD",
        LIB_SOUS_BRANCHE: "ENTREPRISE",
        LIB_PRODUIT: "MULTIRISQUE ENTREPRISE",
        Profils_cibles: "PME; grandes entreprises"
      }
    ];

    // Sample Mapping Products
    this.mappingProduits = [
      { LIB_BRANCHE: "VIE", LIB_SOUS_BRANCHE: "DECES", LIB_PRODUIT: "TEMPORAIRE DECES" },
      { LIB_BRANCHE: "VIE", LIB_SOUS_BRANCHE: "CAPITALISATION", LIB_PRODUIT: "ASSURANCE VIE COMPLEMENT RETRAITE - HORIZON" },
      { LIB_BRANCHE: "IARD", LIB_SOUS_BRANCHE: "SANTE", LIB_PRODUIT: "ASSURANCE GROUPE MALADIE" },
      { LIB_BRANCHE: "IARD", LIB_SOUS_BRANCHE: "HABITATION", LIB_PRODUIT: "MULTIRISQUE HABITATION" },
      { LIB_BRANCHE: "Automobile", LIB_SOUS_BRANCHE: "VEHICULES", LIB_PRODUIT: "ASSURANCE DES VEHICULES TERRESTRES A MOTEURS" },
      { LIB_BRANCHE: "IARD", LIB_SOUS_BRANCHE: "ENTREPRISE", LIB_PRODUIT: "MULTIRISQUE ENTREPRISE" }
    ];

    // Sample Contract Terms (simulating PDF content)
    this.contractTerms.set("TEMPORAIRE DECES",
      "L'assurance temporaire décès garantit le versement d'un capital aux bénéficiaires désignés en cas de décès de l'assuré pendant la durée du contrat. Cette assurance est particulièrement adaptée aux emprunteurs et aux chefs de famille souhaitant protéger leurs proches."
    );
    this.contractTerms.set("ASSURANCE VIE COMPLEMENT RETRAITE - HORIZON",
      "Le contrat Horizon permet de constituer un complément de retraite grâce à des versements réguliers ou ponctuels. Le capital constitué peut être récupéré sous forme de rente viagère ou de capital à la retraite."
    );
    this.contractTerms.set("ASSURANCE GROUPE MALADIE",
      "L'assurance groupe maladie couvre les frais médicaux, pharmaceutiques, d'hospitalisation et les soins dentaires selon les garanties souscrites. Elle peut être individuelle ou familiale."
    );
    this.contractTerms.set("MULTIRISQUE HABITATION",
      "Cette assurance couvre les dommages aux biens immobiliers contre incendie, inondation, vol et responsabilité civile locative ou de propriétaire."
    );
    this.contractTerms.set("MULTIRISQUE ENTREPRISE",
      "Couvre les biens, la responsabilité civile et les pertes d'exploitation pour les entreprises contre divers risques."
    );
  }

  // Load CSV data (placeholder for real implementation)
  async loadCSVData(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => resolve(results.data),
        error: (error) => reject(error)
      });
    });
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