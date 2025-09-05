import type { 
  AgentState, 
  WorkflowStep, 
  CustomerProfile, 
  ProductRecommendation, 
  CommercialPitch,
  AgentFeedback 
} from '@/types/insurance';
import { dataService } from './dataService';
import { simplifiedAiService } from './simplifiedAiService';

class WorkflowService {
  private currentState: AgentState | null = null;
  private stateHistory: AgentState[] = [];

  // Initialize workflow for a customer
  async initializeWorkflow(customerId: string): Promise<AgentState> {
    this.currentState = {
      customerId,
      currentStep: 'customer_analysis'
    };
    
    this.stateHistory.push({ ...this.currentState });
    return this.currentState;
  }

  // Execute the complete workflow
  async executeWorkflow(customerId: string): Promise<AgentState> {
    try {
      // Step 1: Customer Analysis
      await this.executeCustomerAnalysis(customerId);
      
      // Step 2: Gap Detection (included in analysis)
      await this.executeGapDetection();
      
      // Step 3: Product Recommendation
      await this.executeProductRecommendation();
      
      // Step 4: Pitch Generation
      await this.executePitchGeneration();
      
      // Mark as completed
      this.updateState({ currentStep: 'completed' });
      
      return this.currentState!;
      
    } catch (error) {
      this.updateState({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        currentStep: 'completed'
      });
      
      throw error;
    }
  }

  // Step 1: Analyze customer profile
  private async executeCustomerAnalysis(customerId: string): Promise<void> {
    this.updateState({ currentStep: 'customer_analysis' });
    
    // Simulate realistic processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get customer data
    const customer = dataService.getCustomerById(customerId);
    if (!customer) {
      throw new Error(`Customer not found: ${customerId}`);
    }
    
    const contracts = dataService.getContractsByCustomer(customerId);
    const claims = dataService.getClaimsByCustomer(customerId);
    
    // Analyze customer profile
    const customerProfile = await simplifiedAiService.analyzeCustomerProfile(customer, contracts, claims);
    
    this.updateState({ customerProfile });
  }

  // Step 2: Detect gaps (already done in analysis)
  private async executeGapDetection(): Promise<void> {
    this.updateState({ currentStep: 'gap_detection' });
    // Simulate gap detection processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Gap detection is already included in customer analysis
  }

  // Step 3: Generate product recommendations
  private async executeProductRecommendation(): Promise<void> {
    this.updateState({ currentStep: 'product_recommendation' });
    
    if (!this.currentState?.customerProfile) {
      throw new Error('Customer profile not available');
    }
    
    // Simulate AI recommendation processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const recommendations = await simplifiedAiService.generateRecommendations(this.currentState.customerProfile);
    
    this.updateState({ recommendations });
  }

  // Step 4: Generate commercial pitch
  private async executePitchGeneration(): Promise<void> {
    this.updateState({ currentStep: 'pitch_generation' });
    
    if (!this.currentState?.customerProfile || !this.currentState?.recommendations) {
      throw new Error('Prerequisites not available for pitch generation');
    }
    
    const commercialPitch = await simplifiedAiService.generateCommercialPitch(
      this.currentState.customerProfile,
      this.currentState.recommendations
    );
    
    this.updateState({ commercialPitch });
  }

  // Submit agent feedback
  async submitFeedback(feedback: Omit<AgentFeedback, 'feedbackId' | 'timestamp'>): Promise<void> {
    const agentFeedback: AgentFeedback = {
      ...feedback,
      feedbackId: `feedback_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    
    this.updateState({ 
      feedback: agentFeedback,
      currentStep: 'feedback_collection'
    });
    
    // Store feedback for future improvements
    this.storeFeedback(agentFeedback);
  }

  // Get current workflow state
  getCurrentState(): AgentState | null {
    return this.currentState;
  }

  // Get workflow history
  getStateHistory(): AgentState[] {
    return this.stateHistory;
  }

  // Get workflow progress percentage
  getProgress(): number {
    if (!this.currentState) return 0;
    
    const stepOrder: WorkflowStep[] = [
      'customer_analysis',
      'gap_detection', 
      'product_recommendation',
      'pitch_generation',
      'feedback_collection',
      'completed'
    ];
    
    const currentIndex = stepOrder.indexOf(this.currentState.currentStep);
    return Math.round((currentIndex / (stepOrder.length - 1)) * 100);
  }

  // Get step description
  getStepDescription(step: WorkflowStep): string {
    const descriptions = {
      'customer_analysis': 'Analyse du profil client et des contrats existants',
      'gap_detection': 'Détection des lacunes dans la couverture',
      'product_recommendation': 'Génération des recommandations produits',
      'pitch_generation': 'Création du pitch commercial personnalisé',
      'feedback_collection': 'Collecte des retours agent',
      'completed': 'Processus terminé'
    };
    
    return descriptions[step];
  }

  // Check if workflow can proceed to next step
  canProceedToNextStep(): boolean {
    if (!this.currentState) return false;
    
    switch (this.currentState.currentStep) {
      case 'customer_analysis':
        return !!this.currentState.customerProfile;
      case 'gap_detection':
        return !!this.currentState.customerProfile?.equipmentGaps;
      case 'product_recommendation':
        return !!this.currentState.recommendations;
      case 'pitch_generation':
        return !!this.currentState.commercialPitch;
      case 'feedback_collection':
        return !!this.currentState.feedback;
      default:
        return false;
    }
  }

  // Reset workflow
  resetWorkflow(): void {
    this.currentState = null;
    this.stateHistory = [];
  }

  // Generate workflow summary
  generateWorkflowSummary(): string {
    if (!this.currentState) return 'Aucun workflow en cours';
    
    const customer = this.currentState.customerProfile?.customer;
    const customerName = customer ? 
      ('NOM_PRENOM' in customer ? customer.NOM_PRENOM : customer.RAISON_SOCIALE) : 
      'Client inconnu';
    
    const recommendations = this.currentState.recommendations?.length || 0;
    const urgency = this.currentState.commercialPitch?.urgencyLevel || 'Non définie';
    
    return `Workflow pour ${customerName}: ${recommendations} recommandations générées, priorité ${urgency}, étape ${this.getStepDescription(this.currentState.currentStep)}`;
  }

  // Export workflow data for reporting
  exportWorkflowData(): any {
    return {
      currentState: this.currentState,
      history: this.stateHistory,
      progress: this.getProgress(),
      summary: this.generateWorkflowSummary(),
      exportTimestamp: new Date().toISOString()
    };
  }

  // Private helper methods
  private updateState(updates: Partial<AgentState>): void {
    if (this.currentState) {
      this.currentState = { ...this.currentState, ...updates };
      this.stateHistory.push({ ...this.currentState });
    }
  }

  private storeFeedback(feedback: AgentFeedback): void {
    // Store feedback in local storage for demo purposes
    const existingFeedback = JSON.parse(localStorage.getItem('agent_feedback') || '[]');
    existingFeedback.push(feedback);
    localStorage.setItem('agent_feedback', JSON.stringify(existingFeedback));
  }
}

export const workflowService = new WorkflowService();