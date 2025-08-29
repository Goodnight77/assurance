import { ChatOllama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import type { 
  CustomerProfile, 
  ProductRecommendation, 
  CommercialPitch,
  PersonnePhysique,
  PersonneMorale,
  Contrat,
  LLMAnalysisResponse,
  LLMPitchResponse,
  RiskProfile,
  EquipmentGap
} from '@/types/insurance';
import { vectorService } from './vectorService';
import { dataService } from './dataService';

class AIService {
  private llm: ChatOllama;
  
  constructor() {
    // Initialize Ollama with Mistral model
    this.llm = new ChatOllama({
      baseUrl: "http://localhost:11434",
      model: "mistral",
      temperature: 0.7,
    });
  }

  // Analyze customer profile and generate insights
  async analyzeCustomerProfile(
    customer: PersonnePhysique | PersonneMorale,
    contracts: Contrat[],
    claims: any[]
  ): Promise<CustomerProfile> {
    
    const analysisPrompt = PromptTemplate.fromTemplate(`
      Vous êtes un expert en assurance travaillant pour BH Assurance en Tunisie.
      
      Analysez le profil client suivant:
      
      CLIENT: {customerData}
      CONTRATS EXISTANTS: {contractsData}
      HISTORIQUE SINISTRES: {claimsData}
      
      Fournissez une analyse détaillée incluant:
      1. Résumé du profil client
      2. Évaluation du risque
      3. Analyse de l'équipement actuel
      4. Lacunes dans la couverture
      5. Recommandations prioritaires
      
      Répondez en JSON avec la structure suivante:
      {{
        "customerSummary": "...",
        "riskAssessment": "...",
        "equipmentAnalysis": "...",
        "recommendations": ["...", "..."],
        "reasoning": "..."
      }}
    `);

    const chain = RunnableSequence.from([
      analysisPrompt,
      this.llm,
    ]);

    try {
      const result = await chain.invoke({
        customerData: JSON.stringify(customer, null, 2),
        contractsData: JSON.stringify(contracts, null, 2),
        claimsData: JSON.stringify(claims, null, 2)
      });

      const analysisResult: LLMAnalysisResponse = JSON.parse(result.content as string);
      
      // Build risk profile
      const riskProfile: RiskProfile = this.buildRiskProfile(customer, contracts, claims);
      
      // Detect equipment gaps
      const equipmentGaps: EquipmentGap[] = this.detectEquipmentGaps(customer, contracts, analysisResult);
      
      return {
        customer,
        contracts,
        guarantees: [], // Would be populated from garanties_contrats
        claims,
        riskProfile,
        equipmentGaps
      };
      
    } catch (error) {
      console.error('Error analyzing customer profile:', error);
      // Fallback analysis
      return this.generateFallbackProfile(customer, contracts, claims);
    }
  }

  // Generate product recommendations
  async generateRecommendations(customerProfile: CustomerProfile): Promise<ProductRecommendation[]> {
    const productProfiles = dataService.getProductProfiles();
    
    const recommendationPrompt = PromptTemplate.fromTemplate(`
      Basé sur le profil client analysé, recommandez les meilleurs produits d'assurance.
      
      PROFIL CLIENT: {customerProfile}
      PRODUITS DISPONIBLES: {availableProducts}
      LACUNES IDENTIFIÉES: {equipmentGaps}
      
      Pour chaque recommandation, fournissez:
      1. Le produit recommandé
      2. La priorité (1-10)
      3. Le raisonnement détaillé
      4. L'estimation de prime
      5. Les bénéfices attendus
      
      Répondez en JSON avec un tableau de recommandations.
    `);

    const chain = RunnableSequence.from([
      recommendationPrompt,
      this.llm,
    ]);

    try {
      const result = await chain.invoke({
        customerProfile: JSON.stringify(customerProfile, null, 2),
        availableProducts: JSON.stringify(productProfiles, null, 2),
        equipmentGaps: JSON.stringify(customerProfile.equipmentGaps, null, 2)
      });

      // Parse and process recommendations
      return this.processRecommendations(result.content as string, customerProfile);
      
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return this.generateFallbackRecommendations(customerProfile);
    }
  }

  // Generate commercial pitch
  async generateCommercialPitch(
    customerProfile: CustomerProfile, 
    recommendations: ProductRecommendation[]
  ): Promise<CommercialPitch> {
    
    const pitchPrompt = PromptTemplate.fromTemplate(`
      Créez un pitch commercial personnalisé et persuasif pour ce client BH Assurance.
      
      PROFIL CLIENT: {customerProfile}
      RECOMMANDATIONS: {recommendations}
      
      Le pitch doit inclure:
      1. Une approche personnalisée basée sur le profil
      2. Des arguments de vente convaincants
      3. Une mise en avant des bénéfices spécifiques
      4. Un appel à l'action clair
      5. Le canal de communication optimal
      
      Style: Professionnel mais chaleureux, adapté au marché tunisien.
      
      Répondez en JSON avec la structure:
      {{
        "subject": "...",
        "greeting": "...",
        "mainMessage": "...",
        "salesPoints": ["...", "..."],
        "callToAction": "...",
        "signature": "..."
      }}
    `);

    const chain = RunnableSequence.from([
      pitchPrompt,
      this.llm,
    ]);

    try {
      const result = await chain.invoke({
        customerProfile: JSON.stringify(customerProfile.customer, null, 2),
        recommendations: JSON.stringify(recommendations, null, 2)
      });

      const pitchResult: LLMPitchResponse = JSON.parse(result.content as string);
      
      return {
        customerId: customerProfile.customer.REF_PERSONNE,
        recommendations,
        personalizedMessage: this.buildPersonalizedMessage(pitchResult),
        salesArguments: pitchResult.salesPoints,
        communicationChannel: this.selectOptimalChannel(customerProfile),
        urgencyLevel: this.determineUrgencyLevel(recommendations),
        followUpStrategy: this.buildFollowUpStrategy(customerProfile, recommendations)
      };
      
    } catch (error) {
      console.error('Error generating commercial pitch:', error);
      return this.generateFallbackPitch(customerProfile, recommendations);
    }
  }

  // Enhanced context retrieval using vector store
  async enhanceWithContextualData(query: string, customer: PersonnePhysique | PersonneMorale): Promise<string> {
    try {
      const relevantDocs = await vectorService.searchSimilarDocuments(query, 5);
      const contextualInfo = relevantDocs.map(doc => doc.content).join('\n\n');
      
      const enhancementPrompt = PromptTemplate.fromTemplate(`
        Question: {query}
        Client: {customer}
        Contexte documentaire: {context}
        
        Fournissez une réponse enrichie et personnalisée basée sur le contexte.
      `);

      const chain = RunnableSequence.from([
        enhancementPrompt,
        this.llm,
      ]);

      const result = await chain.invoke({
        query,
        customer: JSON.stringify(customer, null, 2),
        context: contextualInfo
      });

      return result.content as string;
      
    } catch (error) {
      console.error('Error enhancing with contextual data:', error);
      return query;
    }
  }

  // Helper methods
  private buildRiskProfile(
    customer: PersonnePhysique | PersonneMorale, 
    contracts: Contrat[], 
    claims: any[]
  ): RiskProfile {
    const age = 'DATE_NAISSANCE' in customer ? 
      new Date().getFullYear() - new Date(customer.DATE_NAISSANCE).getFullYear() : undefined;
    
    const totalInsuredValue = contracts.reduce((sum, contract) => sum + contract.Capital_assure, 0);
    const paidContracts = contracts.filter(c => c.statut_paiement === 'Payé').length;
    const paymentHistory = paidContracts / contracts.length >= 0.8 ? 'Excellent' : 
                          paidContracts / contracts.length >= 0.6 ? 'Good' : 
                          paidContracts / contracts.length >= 0.4 ? 'Average' : 'Poor';

    const totalClaimAmount = claims.reduce((sum, claim) => sum + (claim.MONTANT_ENCAISSE || 0), 0);
    
    return {
      age,
      profession: 'LIB_PROFESSION' in customer ? customer.LIB_PROFESSION : customer.LIB_ACTIVITE,
      sector: customer.LIB_SECTEUR_ACTIVITE,
      familyStatus: 'SITUATION_FAMILIALE' in customer ? customer.SITUATION_FAMILIALE : undefined,
      location: customer.VILLE_GOUVERNORAT,
      totalInsuredValue,
      paymentHistory: paymentHistory as any,
      claimsHistory: {
        totalClaims: claims.length,
        totalAmount: totalClaimAmount,
        averageClaimAmount: claims.length > 0 ? totalClaimAmount / claims.length : 0,
        riskLevel: claims.length > 3 ? 'High' : claims.length > 1 ? 'Medium' : 'Low'
      }
    };
  }

  private detectEquipmentGaps(
    customer: PersonnePhysique | PersonneMorale, 
    contracts: Contrat[],
    analysis: LLMAnalysisResponse
  ): EquipmentGap[] {
    const existingBranches = contracts.map(c => c.branche);
    const gaps: EquipmentGap[] = [];

    // Life insurance gap
    if (!existingBranches.includes('VIE')) {
      gaps.push({
        branch: 'VIE',
        missingProducts: ['TEMPORAIRE DECES', 'ASSURANCE VIE COMPLEMENT RETRAITE'],
        priority: 'High',
        reasoning: 'Aucune couverture vie détectée - Protection familiale recommandée'
      });
    }

    // Health insurance gap
    if (!existingBranches.includes('IARD') || !existingBranches.includes('SANTE')) {
      gaps.push({
        branch: 'SANTE',
        missingProducts: ['ASSURANCE GROUPE MALADIE'],
        priority: 'High',
        reasoning: 'Couverture santé manquante - Essentielle pour la protection médicale'
      });
    }

    return gaps;
  }

  private processRecommendations(llmResponse: string, customerProfile: CustomerProfile): ProductRecommendation[] {
    try {
      const recommendations = JSON.parse(llmResponse);
      return recommendations.map((rec: any, index: number) => ({
        product: {
          LIB_BRANCHE: rec.branch || 'VIE',
          LIB_SOUS_BRANCHE: rec.subBranch || 'DECES',
          LIB_PRODUIT: rec.product || 'TEMPORAIRE DECES'
        },
        priority: rec.priority || index + 1,
        reasoning: rec.reasoning || 'Recommandation basée sur l\'analyse du profil',
        targetProfile: rec.targetProfile || 'Profil client',
        estimatedPremium: rec.estimatedPremium || 1000,
        expectedBenefit: rec.expectedBenefit || 'Protection améliorée'
      }));
    } catch (error) {
      return this.generateFallbackRecommendations(customerProfile);
    }
  }

  private selectOptimalChannel(customerProfile: CustomerProfile): 'email' | 'phone' | 'whatsapp' {
    const age = customerProfile.riskProfile.age;
    if (age && age < 35) return 'whatsapp';
    if (age && age > 55) return 'phone';
    return 'email';
  }

  private determineUrgencyLevel(recommendations: ProductRecommendation[]): 'High' | 'Medium' | 'Low' {
    const highPriorityCount = recommendations.filter(r => r.priority <= 3).length;
    return highPriorityCount > 2 ? 'High' : highPriorityCount > 0 ? 'Medium' : 'Low';
  }

  private buildPersonalizedMessage(pitchResult: LLMPitchResponse): string {
    return `${pitchResult.greeting}\n\n${pitchResult.mainMessage}\n\n${pitchResult.callToAction}\n\n${pitchResult.signature}`;
  }

  private buildFollowUpStrategy(customerProfile: CustomerProfile, recommendations: ProductRecommendation[]): string {
    return `Relance téléphonique dans 3-5 jours si pas de réponse. Focus sur les ${recommendations.length} recommandations prioritaires.`;
  }

  private generateFallbackProfile(
    customer: PersonnePhysique | PersonneMorale, 
    contracts: Contrat[], 
    claims: any[]
  ): CustomerProfile {
    return {
      customer,
      contracts,
      guarantees: [],
      claims,
      riskProfile: this.buildRiskProfile(customer, contracts, claims),
      equipmentGaps: []
    };
  }

  private generateFallbackRecommendations(customerProfile: CustomerProfile): ProductRecommendation[] {
    return [
      {
        product: {
          LIB_BRANCHE: 'VIE',
          LIB_SOUS_BRANCHE: 'DECES',
          LIB_PRODUIT: 'TEMPORAIRE DECES'
        },
        priority: 1,
        reasoning: 'Protection familiale recommandée',
        targetProfile: 'Chef de famille',
        estimatedPremium: 1200,
        expectedBenefit: 'Sécurité financière pour la famille'
      }
    ];
  }

  private generateFallbackPitch(
    customerProfile: CustomerProfile, 
    recommendations: ProductRecommendation[]
  ): CommercialPitch {
    return {
      customerId: customerProfile.customer.REF_PERSONNE,
      recommendations,
      personalizedMessage: "Cher client, nous avons analysé votre profil et identifié des opportunités d'amélioration de votre couverture d'assurance.",
      salesArguments: ["Protection optimisée", "Tarifs compétitifs", "Service client de qualité"],
      communicationChannel: 'email',
      urgencyLevel: 'Medium',
      followUpStrategy: "Relance dans 7 jours"
    };
  }
}

export const aiService = new AIService();