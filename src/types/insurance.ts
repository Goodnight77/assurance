// Insurance Data Types
export interface PersonneMorale {
  REF_PERSONNE: string;
  RAISON_SOCIALE: string;
  MATRICULE_FISCALE: string;
  LIB_SECTEUR_ACTIVITE: string;
  LIB_ACTIVITE: string;
  VILLE: string;
  LIB_GOUVERNORAT: string;
  VILLE_GOUVERNORAT: string;
}

export interface PersonnePhysique {
  REF_PERSONNE: string;
  NOM_PRENOM: string;
  DATE_NAISSANCE: string;
  LIEU_NAISSANCE: string;
  CODE_SEXE: 'M' | 'F';
  SITUATION_FAMILIALE: string;
  NUM_PIECE_IDENTITE: string;
  LIB_SECTEUR_ACTIVITE: string;
  LIB_PROFESSION: string;
  VILLE: string;
  LIB_GOUVERNORAT: string;
  VILLE_GOUVERNORAT: string;
}

export interface Contrat {
  REF_PERSONNE: string;
  NUM_CONTRAT: string;
  LIB_PRODUIT: string;
  EFFET_CONTRAT: string;
  DATE_EXPIRATION: string;
  PROCHAIN_TERME: string;
  LIB_ETAT_CONTRAT: string;
  branche: string;
  somme_quittances: number;
  statut_paiement: 'Payé' | 'Non payé';
  Capital_assure: number;
}

export interface Sinistre {
  NUM_SINISTRE: string;
  NUM_CONTRAT: string;
  LIB_BRANCHE: string;
  LIB_SOUS_BRANCHE: string;
  LIB_PRODUIT: string;
  NATURE_SINISTRE: string;
  LIB_TYPE_SINISTRE: string;
  TAUX_RESPONSABILITE: number;
  DATE_SURVENANCE: string;
  DATE_DECLARATION: string;
  DATE_OUVERTURE: string;
  OBSERVATION_SINISTRE: string;
  LIB_ETAT_SINISTRE: string;
  LIEU_ACCIDENT: string;
  MOTIF_REOUVERTURE: string;
  MONTANT_ENCAISSE: number;
  MONTANT_A_ENCAISSER: number;
}

export interface MappingProduit {
  LIB_BRANCHE: string;
  LIB_SOUS_BRANCHE: string;
  LIB_PRODUIT: string;
}

export interface GarantieContrat {
  NUM_CONTRAT: string;
  CODE_GARANTIE: string;
  CAPITAL_ASSURE: number;
  LIB_GARANTIE: string;
}

export interface ProductProfile {
  LIB_BRANCHE: string;
  LIB_SOUS_BRANCHE: string;
  LIB_PRODUIT: string;
  Profils_cibles: string;
}

// AI Analysis Types
export interface CustomerProfile {
  customer: PersonnePhysique | PersonneMorale;
  contracts: Contrat[];
  guarantees: GarantieContrat[];
  claims: Sinistre[];
  riskProfile: RiskProfile;
  equipmentGaps: EquipmentGap[];
}

export interface RiskProfile {
  age?: number;
  profession: string;
  sector: string;
  familyStatus?: string;
  location: string;
  totalInsuredValue: number;
  paymentHistory: 'Excellent' | 'Good' | 'Average' | 'Poor';
  claimsHistory: ClaimsSummary;
}

export interface ClaimsSummary {
  totalClaims: number;
  totalAmount: number;
  averageClaimAmount: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface EquipmentGap {
  branch: string;
  missingProducts: string[];
  priority: 'High' | 'Medium' | 'Low';
  reasoning: string;
}

export interface ProductRecommendation {
  product: MappingProduit;
  priority: number;
  reasoning: string;
  targetProfile: string;
  estimatedPremium: number;
  expectedBenefit: string;
}

export interface CommercialPitch {
  customerId: string;
  recommendations: ProductRecommendation[];
  personalizedMessage: string;
  salesArguments: string[];
  communicationChannel: 'email' | 'phone' | 'whatsapp';
  urgencyLevel: 'High' | 'Medium' | 'Low';
  followUpStrategy: string;
}

// Agent Workflow Types
export interface AgentState {
  customerId: string;
  customerProfile?: CustomerProfile;
  recommendations?: ProductRecommendation[];
  commercialPitch?: CommercialPitch;
  feedback?: AgentFeedback;
  currentStep: WorkflowStep;
  error?: string;
}

export type WorkflowStep = 
  | 'customer_analysis'
  | 'gap_detection'
  | 'product_recommendation'
  | 'pitch_generation'
  | 'feedback_collection'
  | 'completed';

export interface AgentFeedback {
  feedbackId: string;
  customerId: string;
  pitchId: string;
  agentNotes: string;
  customerResponse: 'Interested' | 'Not Interested' | 'Need More Info' | 'Follow Up Later';
  improvementSuggestions: string;
  timestamp: string;
}

// Vector Store Types
export interface DocumentChunk {
  id: string;
  content: string;
  metadata: {
    source: string;
    type: 'contract_terms' | 'product_description' | 'customer_data';
    branch?: string;
    product?: string;
    customerId?: string;
  };
}

// LLM Response Types
export interface LLMAnalysisResponse {
  customerSummary: string;
  riskAssessment: string;
  equipmentAnalysis: string;
  recommendations: string[];
  reasoning: string;
}

export interface LLMPitchResponse {
  subject: string;
  greeting: string;
  mainMessage: string;
  salesPoints: string[];
  callToAction: string;
  signature: string;
}