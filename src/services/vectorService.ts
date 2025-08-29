import { ChromaClient } from 'chromadb';
import type { DocumentChunk } from '@/types/insurance';

class VectorService {
  private client: ChromaClient;
  private collection: any;
  private isInitialized = false;

  constructor() {
    this.client = new ChromaClient({
      path: "http://localhost:8000"
    });
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Create or get collection for insurance documents
      this.collection = await this.client.createCollection({
        name: "insurance_documents",
        metadata: { description: "BH Assurance documents and product information" }
      });

      // Load sample insurance documents
      await this.loadSampleDocuments();
      this.isInitialized = true;
      
    } catch (error) {
      console.error('Error initializing vector service:', error);
      // For demo purposes, continue without vector store
      this.isInitialized = true;
    }
  }

  async loadSampleDocuments() {
    const sampleDocuments: DocumentChunk[] = [
      {
        id: "doc_vie_temporaire",
        content: "L'assurance temporaire décès de BH Assurance garantit le versement d'un capital aux bénéficiaires en cas de décès pendant la période de couverture. Particulièrement adaptée aux emprunteurs et chefs de famille. Capital garanti de 50.000 à 500.000 DT. Primes à partir de 800 DT/an selon l'âge et le capital.",
        metadata: {
          source: "CG_TEMPORAIRE_DECES.txt",
          type: "contract_terms",
          branch: "VIE",
          product: "TEMPORAIRE DECES"
        }
      },
      {
        id: "doc_retraite_horizon",
        content: "Le contrat Horizon permet de constituer un capital retraite grâce à des versements réguliers ou ponctuels. Rendement garanti minimum 3%. Possibilité de récupérer le capital sous forme de rente viagère ou capital. Avantages fiscaux selon la réglementation en vigueur.",
        metadata: {
          source: "CG_HORIZON.txt",
          type: "contract_terms",
          branch: "VIE",
          product: "HORIZON"
        }
      },
      {
        id: "doc_sante_groupe",
        content: "L'assurance groupe maladie couvre les frais médicaux, pharmaceutiques, d'hospitalisation et soins dentaires. Remboursement jusqu'à 200% du tarif CNAM. Prise en charge directe dans les cliniques conventionnées. Couverture familiale disponible.",
        metadata: {
          source: "CG_ASSURANCE_GROUPE_MALADIE.txt",
          type: "contract_terms",
          branch: "IARD",
          product: "ASSURANCE GROUPE MALADIE"
        }
      },
      {
        id: "doc_auto_vehicules",
        content: "L'assurance des véhicules terrestres à moteurs couvre la responsabilité civile obligatoire, les dommages tous accidents, vol, incendie. Extensions possibles : bris de glaces, assistance, valeur à neuf. Franchise à partir de 200 DT.",
        metadata: {
          source: "CG_VEHICULES_TERRESTRES.txt",
          type: "contract_terms",
          branch: "Automobile",
          product: "ASSURANCE DES VEHICULES TERRESTRES A MOTEURS"
        }
      },
      {
        id: "doc_habitation_multirisque",
        content: "La multirisque habitation protège votre logement et vos biens contre l'incendie, dégâts des eaux, vol, catastrophes naturelles. Responsabilité civile vie privée incluse. Capital mobilier jusqu'à 100.000 DT. Extension vol hors domicile possible.",
        metadata: {
          source: "CG_MULTIRISQUE_HABITATION.txt",
          type: "contract_terms",
          branch: "IARD",
          product: "MULTIRISQUE HABITATION"
        }
      },
      {
        id: "profil_medecin",
        content: "Profil type médecin : Revenus élevés et réguliers, besoin de protection prévoyance, responsabilité civile professionnelle indispensable, constitution d'un capital retraite prioritaire. Produits recommandés : assurance vie, retraite complémentaire, RC professionnelle.",
        metadata: {
          source: "profils_cibles.csv",
          type: "customer_data",
          branch: "PROFILING"
        }
      },
      {
        id: "profil_enseignant",
        content: "Profil type enseignant : Revenus réguliers fonctionnaire, protection familiale importante, épargne pour enfants. Produits recommandés : assurance vie, épargne éducation, multirisque habitation, complémentaire santé.",
        metadata: {
          source: "profils_cibles.csv",
          type: "customer_data",
          branch: "PROFILING"
        }
      },
      {
        id: "profil_ingenieur",
        content: "Profil type ingénieur : Revenus élevés secteur privé, mobilité professionnelle, patrimoine en constitution. Produits recommandés : assurance auto premium, prévoyance décès, épargne retraite, multirisque habitation.",
        metadata: {
          source: "profils_cibles.csv",
          type: "customer_data",
          branch: "PROFILING"
        }
      }
    ];

    try {
      for (const doc of sampleDocuments) {
        await this.addDocument(doc);
      }
      console.log('Sample documents loaded successfully');
    } catch (error) {
      console.error('Error loading sample documents:', error);
    }
  }

  async addDocument(document: DocumentChunk): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      await this.collection.add({
        ids: [document.id],
        documents: [document.content],
        metadatas: [document.metadata]
      });
    } catch (error) {
      console.error('Error adding document:', error);
    }
  }

  async searchSimilarDocuments(query: string, limit: number = 5): Promise<DocumentChunk[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const results = await this.collection.query({
        queryTexts: [query],
        nResults: limit
      });

      return results.documents[0].map((content: string, index: number) => ({
        id: results.ids[0][index],
        content,
        metadata: results.metadatas[0][index]
      }));
      
    } catch (error) {
      console.error('Error searching documents:', error);
      // Return fallback documents for demo
      return this.getFallbackDocuments(query, limit);
    }
  }

  async addCustomerDocuments(customerData: any): Promise<void> {
    // Add customer-specific documents to enhance recommendations
    const customerDoc: DocumentChunk = {
      id: `customer_${customerData.REF_PERSONNE}`,
      content: `Client ${customerData.NOM_PRENOM || customerData.RAISON_SOCIALE}, profession: ${customerData.LIB_PROFESSION || customerData.LIB_ACTIVITE}, secteur: ${customerData.LIB_SECTEUR_ACTIVITE}, localisation: ${customerData.VILLE_GOUVERNORAT}`,
      metadata: {
        source: "customer_database",
        type: "customer_data",
        customerId: customerData.REF_PERSONNE
      }
    };

    await this.addDocument(customerDoc);
  }

  async addContractDocuments(contracts: any[]): Promise<void> {
    for (const contract of contracts) {
      const contractDoc: DocumentChunk = {
        id: `contract_${contract.NUM_CONTRAT}`,
        content: `Contrat ${contract.NUM_CONTRAT}, produit: ${contract.LIB_PRODUIT}, branche: ${contract.branche}, capital: ${contract.Capital_assure} DT, statut: ${contract.LIB_ETAT_CONTRAT}`,
        metadata: {
          source: "contracts_database",
          type: "customer_data",
          branch: contract.branche,
          product: contract.LIB_PRODUIT
        }
      };

      await this.addDocument(contractDoc);
    }
  }

  private getFallbackDocuments(query: string, limit: number): DocumentChunk[] {
    // Fallback search for demo purposes
    const fallbackDocs: DocumentChunk[] = [
      {
        id: "fallback_vie",
        content: "L'assurance vie est un pilier de la protection financière familiale, offrant sécurité et épargne.",
        metadata: {
          source: "fallback",
          type: "product_description",
          branch: "VIE"
        }
      },
      {
        id: "fallback_sante",
        content: "L'assurance santé garantit l'accès aux soins de qualité et la protection contre les frais médicaux.",
        metadata: {
          source: "fallback",
          type: "product_description",
          branch: "SANTE"
        }
      }
    ];

    return fallbackDocs.slice(0, limit);
  }

  async getDocumentsByBranch(branch: string): Promise<DocumentChunk[]> {
    try {
      const results = await this.collection.query({
        queryTexts: [branch],
        nResults: 10,
        where: { "branch": branch }
      });

      return results.documents[0].map((content: string, index: number) => ({
        id: results.ids[0][index],
        content,
        metadata: results.metadatas[0][index]
      }));
      
    } catch (error) {
      console.error('Error getting documents by branch:', error);
      return [];
    }
  }
}

export const vectorService = new VectorService();