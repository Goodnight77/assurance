import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Users, 
  TrendingUp, 
  MessageSquare,
  RefreshCw,
  Play
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { AgentState, WorkflowStep } from '@/types/insurance';
import { workflowService } from '@/services/workflowService';

interface WorkflowVisualizationProps {
  customerId?: string;
  onWorkflowComplete?: (state: AgentState) => void;
}

export function WorkflowVisualization({ customerId, onWorkflowComplete }: WorkflowVisualizationProps) {
  const [currentState, setCurrentState] = useState<AgentState | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const state = workflowService.getCurrentState();
    setCurrentState(state);
    setProgress(workflowService.getProgress());
  }, []);

  const steps: { step: WorkflowStep; label: string; icon: any; description: string }[] = [
    {
      step: 'customer_analysis',
      label: 'Analyse Client',
      icon: Users,
      description: 'Analyse du profil et des contrats existants'
    },
    {
      step: 'gap_detection',
      label: 'Détection Lacunes',
      icon: AlertCircle,
      description: 'Identification des manques de couverture'
    },
    {
      step: 'product_recommendation',
      label: 'Recommandations',
      icon: TrendingUp,
      description: 'Génération des produits recommandés'
    },
    {
      step: 'pitch_generation',
      label: 'Pitch Commercial',
      icon: MessageSquare,
      description: 'Création du message personnalisé'
    },
    {
      step: 'completed',
      label: 'Terminé',
      icon: CheckCircle,
      description: 'Processus terminé avec succès'
    }
  ];

  const executeWorkflow = async () => {
    if (!customerId) return;

    setIsExecuting(true);
    
    try {
      // Initialize workflow
      await workflowService.initializeWorkflow(customerId);
      setProgress(0);

      // Execute workflow with progress updates
      const finalState = await workflowService.executeWorkflow(customerId);
      
      setCurrentState(finalState);
      setProgress(100);
      onWorkflowComplete?.(finalState);
      
    } catch (error) {
      console.error('Workflow execution failed:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const resetWorkflow = () => {
    workflowService.resetWorkflow();
    setCurrentState(null);
    setProgress(0);
  };

  const getStepStatus = (step: WorkflowStep): 'completed' | 'current' | 'pending' | 'error' => {
    if (!currentState) return 'pending';
    
    const currentStepIndex = steps.findIndex(s => s.step === currentState.currentStep);
    const stepIndex = steps.findIndex(s => s.step === step);
    
    if (currentState.error && stepIndex === currentStepIndex) return 'error';
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'pending';
  };

  const getStepVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'current': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Workflow Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className={`h-5 w-5 ${isExecuting ? 'animate-spin' : ''}`} />
                Workflow d'Analyse IA
              </CardTitle>
              <CardDescription>
                Processus automatisé d'analyse client et de recommandation
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {!currentState && customerId && (
                <Button onClick={executeWorkflow} disabled={isExecuting}>
                  <Play className="h-4 w-4 mr-2" />
                  Démarrer l'analyse
                </Button>
              )}
              {currentState && (
                <Button variant="outline" onClick={resetWorkflow}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Nouvelle analyse
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Progression:</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            {currentState && (
              <div className="text-sm text-muted-foreground">
                {workflowService.generateWorkflowSummary()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Workflow Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step.step);
          const Icon = step.icon;
          
          return (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative transition-all ${
                status === 'current' ? 'ring-2 ring-primary shadow-glow' : ''
              }`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${
                      status === 'completed' ? 'text-success' :
                      status === 'current' ? 'text-primary' :
                      status === 'error' ? 'text-destructive' :
                      'text-muted-foreground'
                    }`} />
                    <CardTitle className="text-sm">{step.label}</CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground mb-3">
                    {step.description}
                  </p>
                  
                  <Badge variant={getStepVariant(status)} className="text-xs">
                    {status === 'completed' && 'Terminé'}
                    {status === 'current' && (isExecuting ? 'En cours...' : 'Actuel')}
                    {status === 'pending' && 'En attente'}
                    {status === 'error' && 'Erreur'}
                  </Badge>
                  
                  {status === 'current' && isExecuting && (
                    <div className="mt-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  )}
                </CardContent>
                
                {/* Step connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-0.5 bg-border transform -translate-y-1/2"></div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Error Display */}
      {currentState?.error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Erreur dans le processus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{currentState.error}</p>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      {currentState && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">
                {currentState.customerProfile?.contracts.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Contrats actuels</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-secondary">
                {currentState.customerProfile?.equipmentGaps?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Lacunes détectées</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-success">
                {currentState.recommendations?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Recommandations</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-warning">
                {currentState.commercialPitch?.urgencyLevel === 'High' ? 'Haute' :
                 currentState.commercialPitch?.urgencyLevel === 'Medium' ? 'Moyenne' : 
                 currentState.commercialPitch?.urgencyLevel === 'Low' ? 'Faible' : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">Priorité</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}