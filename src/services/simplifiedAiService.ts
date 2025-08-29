import type { 
  CustomerProfile, 
  ProductRecommendation, 
  CommercialPitch,
  PersonnePhysique,
  PersonneMorale,
  Contrat,
  RiskProfile,
  EquipmentGap
} from '@/types/insurance';
import { dataService } from './dataService';

class SimplifiedAIService {
  
  // Analyze customer profile and generate insights
  async analyzeCustomerProfile(
    customer: PersonnePhysique | PersonneMorale,
    contracts: Contrat[],
    claims: any[]
  ): Promise<CustomerProfile> {
    
    // Build risk profile
    const riskProfile: RiskProfile = this.buildRiskProfile(customer, contracts, claims);
    
    // Detect equipment gaps
    const equipmentGaps: EquipmentGap[] = this.detectEquipmentGaps(customer, contracts);
    
    return {
      customer,
      contracts,
      guarantees: [], // Would be populated from garanties_contrats
      claims,
      riskProfile,
      equipmentGaps
    };
  }

  // Generate product recommendations based on business rules
  async generateRecommendations(customerProfile: CustomerProfile): Promise<ProductRecommendation[]> {
    const recommendations: ProductRecommendation[] = [];
    const customer = customerProfile.customer;
    const existingBranches = customerProfile.contracts.map(c => c.branche);
    
    // Life insurance recommendations
    if (!existingBranches.includes('VIE')) {
      if ('LIB_PROFESSION' in customer) {
        const profession = customer.LIB_PROFESSION?.toLowerCase() || '';
        
        if (profession.includes('médecin') || profession.includes('ingénieur')) {
          recommendations.push({
            product: {
              LIB_BRANCHE: 'VIE',
              LIB_SOUS_BRANCHE: 'CAPITALISATION',
              LIB_PRODUIT: 'ASSURANCE VIE COMPLEMENT RETRAITE - HORIZON'
            },
            priority: 1,
            reasoning: 'Profil professionnel à revenus élevés - Constitution retraite prioritaire',
            targetProfile: 'Professions libérales/cadres supérieurs',
            estimatedPremium: 2400,
            expectedBenefit: 'Constitution capital retraite avec avantages fiscaux'
          });
        }
        
        if (customer.SITUATION_FAMILIALE === 'Marié') {
          recommendations.push({
            product: {
              LIB_BRANCHE: 'VIE',
              LIB_SOUS_BRANCHE: 'DECES',
              LIB_PRODUIT: 'TEMPORAIRE DECES'
            },
            priority: 2,
            reasoning: 'Protection familiale essentielle pour personne mariée',
            targetProfile: 'Chefs de famille',
            estimatedPremium: 1200,
            expectedBenefit: 'Sécurité financière famille en cas de décès'
          });
        }
      }
    }
    
    // Health insurance recommendations
    if (!existingBranches.includes('IARD') && !existingBranches.some(b => b.includes('SANTE'))) {
      recommendations.push({
        product: {
          LIB_BRANCHE: 'IARD',
          LIB_SOUS_BRANCHE: 'SANTE',
          LIB_PRODUIT: 'ASSURANCE GROUPE MALADIE'
        },
        priority: 1,
        reasoning: 'Couverture santé manquante - Protection médicale essentielle',
        targetProfile: 'Tous profils',
        estimatedPremium: 1800,
        expectedBenefit: 'Remboursement frais médicaux jusqu\'à 200% CNAM'
      });
    }
    
    // Home insurance for property owners
    if (!existingBranches.includes('HABITATION') && !existingBranches.includes('IARD')) {
      if ('LIB_PROFESSION' in customer && customer.LIB_PROFESSION) {
        recommendations.push({
          product: {
            LIB_BRANCHE: 'IARD',
            LIB_SOUS_BRANCHE: 'HABITATION',
            LIB_PRODUIT: 'MULTIRISQUE HABITATION'
          },
          priority: 3,
          reasoning: 'Protection du patrimoine immobilier recommandée',
          targetProfile: 'Propriétaires/locataires',
          estimatedPremium: 900,
          expectedBenefit: 'Protection logement et biens contre tous risques'
        });
      }
    }
    
    return recommendations.sort((a, b) => a.priority - b.priority);
  }

  // Generate commercial pitch
  async generateCommercialPitch(
    customerProfile: CustomerProfile, 
    recommendations: ProductRecommendation[]
  ): Promise<CommercialPitch> {
    
    const customer = customerProfile.customer;
    const customerName = 'NOM_PRENOM' in customer ? customer.NOM_PRENOM : customer.RAISON_SOCIALE;
    const profession = 'LIB_PROFESSION' in customer ? customer.LIB_PROFESSION : customer.LIB_ACTIVITE;
    
    // Build personalized message
    const greeting = `Cher(e) ${customerName},`;
    
    const mainMessage = this.buildMainMessage(customer, recommendations);
    const salesArguments = this.buildSalesArguments(recommendations);
    const callToAction = this.buildCallToAction(recommendations.length);
    
    const personalizedMessage = `${greeting}\n\n${mainMessage}\n\n${salesArguments.join('\n\n')}\n\n${callToAction}\n\nCordialement,\nVotre conseiller BH Assurance`;
    
    return {
      customerId: customer.REF_PERSONNE,
      recommendations,
      personalizedMessage,
      salesArguments,
      communicationChannel: this.selectOptimalChannel(customerProfile),
      urgencyLevel: this.determineUrgencyLevel(recommendations),
      followUpStrategy: this.buildFollowUpStrategy(customerProfile, recommendations)
    };
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
    const paymentHistory = contracts.length === 0 ? 'Good' :
                          paidContracts / contracts.length >= 0.8 ? 'Excellent' : 
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
    contracts: Contrat[]
  ): EquipmentGap[] {
    const existingBranches = contracts.map(c => c.branche);
    const gaps: EquipmentGap[] = [];

    // Life insurance gap
    if (!existingBranches.includes('VIE')) {
      gaps.push({
        branch: 'VIE',
        missingProducts: ['TEMPORAIRE DECES', 'ASSURANCE VIE COMPLEMENT RETRAITE'],
        priority: 'High',
        reasoning: 'Aucune couverture vie détectée - Protection familiale et épargne retraite recommandées'
      });
    }

    // Health insurance gap
    if (!existingBranches.includes('IARD') && !existingBranches.some(b => b.includes('SANTE'))) {
      gaps.push({
        branch: 'SANTE',
        missingProducts: ['ASSURANCE GROUPE MALADIE'],
        priority: 'High',
        reasoning: 'Couverture santé manquante - Protection médicale essentielle'
      });
    }

    // Home insurance gap
    if (!existingBranches.includes('HABITATION') && 'LIB_PROFESSION' in customer) {
      gaps.push({
        branch: 'HABITATION',
        missingProducts: ['MULTIRISQUE HABITATION'],
        priority: 'Medium',
        reasoning: 'Protection du patrimoine immobilier recommandée'
      });
    }

    return gaps;
  }

  private buildMainMessage(customer: PersonnePhysique | PersonneMorale, recommendations: ProductRecommendation[]): string {
    const profession = 'LIB_PROFESSION' in customer ? customer.LIB_PROFESSION : customer.LIB_ACTIVITE;
    
    if (recommendations.length === 0) {
      return "Nous avons analysé votre profil et votre couverture d'assurance actuelle semble complète.";
    }
    
    let message = `En tant que ${profession}, nous avons identifié des opportunités d'amélioration de votre couverture d'assurance qui correspondent parfaitement à votre profil professionnel.`;
    
    if (recommendations.length === 1) {
      message += ` Nous vous recommandons particulièrement notre produit ${recommendations[0].product.LIB_PRODUIT}.`;
    } else {
      message += ` Nous avons sélectionné ${recommendations.length} produits qui répondent spécifiquement à vos besoins.`;
    }
    
    return message;
  }

  private buildSalesArguments(recommendations: ProductRecommendation[]): string[] {
    return recommendations.map((rec, index) => {
      return `${index + 1}. **${rec.product.LIB_PRODUIT}** (${rec.estimatedPremium} DT/an)\n   ✓ ${rec.reasoning}\n   ✓ ${rec.expectedBenefit}`;
    });
  }

  private buildCallToAction(recommendationCount: number): string {
    if (recommendationCount === 0) {
      return "Nous restons à votre disposition pour tout complément d'information sur nos produits.";
    }
    
    return `Je serais ravi de vous présenter ces solutions en détail lors d'un rendez-vous à votre convenance. Puis-je vous contacter cette semaine pour programmer notre entretien ?`;
  }

  private selectOptimalChannel(customerProfile: CustomerProfile): 'email' | 'phone' | 'whatsapp' {
    const age = customerProfile.riskProfile.age;
    if (age && age < 35) return 'whatsapp';
    if (age && age > 55) return 'phone';
    return 'email';
  }

  private determineUrgencyLevel(recommendations: ProductRecommendation[]): 'High' | 'Medium' | 'Low' {
    const highPriorityCount = recommendations.filter(r => r.priority <= 2).length;
    return highPriorityCount > 1 ? 'High' : highPriorityCount > 0 ? 'Medium' : 'Low';
  }

  private buildFollowUpStrategy(customerProfile: CustomerProfile, recommendations: ProductRecommendation[]): string {
    const channel = this.selectOptimalChannel(customerProfile);
    const timeframe = recommendations.length > 2 ? '3-5 jours' : '7 jours';
    
    return `Relance ${channel} dans ${timeframe} si pas de réponse. Focus sur les ${recommendations.length} recommandations prioritaires. Prévoir rendez-vous de présentation détaillée.`;
  }
}

export const simplifiedAiService = new SimplifiedAIService();