import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Brain, Shield, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { CustomerSelector } from '@/components/CustomerSelector';
import { WorkflowVisualization } from '@/components/WorkflowVisualization';
import { AnalysisResults } from '@/components/AnalysisResults';
import { CommercialPitchDisplay } from '@/components/CommercialPitchDisplay';
import { ChatBot } from '@/components/ChatBot';
import { workflowService } from '@/services/workflowService';
import type { PersonnePhysique, PersonneMorale, AgentState } from '@/types/insurance';
import LogoBar from '@/components/LogoBar';
import Footer from '@/components/Footer';

// Extend Window interface to include particlesJS
declare global {
  interface Window {
    particlesJS: (id: string, params: any) => void;
  }
}

// Replace with your actual image path or URL
const heroImage = 'public/bh-assurance-logo.png';

const Index = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<PersonnePhysique | PersonneMorale | null>(null);
  const [workflowState, setWorkflowState] = useState<AgentState | null>(null);
  const [activeTab, setActiveTab] = useState('selection');

  const handleCustomerSelect = (customer: PersonnePhysique | PersonneMorale) => {
    setSelectedCustomer(customer);
    setActiveTab('workflow');
  };

  const handleWorkflowComplete = (state: AgentState) => {
    setWorkflowState(state);
    setActiveTab('analysis');
  };

  const handleFeedbackSubmit = async (feedback: any) => {
    await workflowService.submitFeedback(feedback);
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.particlesJS) {
        window.particlesJS('particles-js', {
          particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: true, anim: { enable: false } },
            size: { value: 3, random: true, anim: { enable: false } },
            line_linked: { enable: false },
            move: { enable: true, speed: 2, direction: 'none', random: true, straight: false, out_mode: 'out' }
          },
          interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: false }, onclick: { enable: false } },
            modes: { grab: { distance: 400, line_linked: { opacity: 0.5 } } }
          },
          retina_detect: true
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <LogoBar />
      <div className="min-h-screen bg-background">
        <div className="relative h-96 bg-gradient-to-r from-[#EC0000] via-[#0D3F37] to-[#072241] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-opacity-70 bg-[#EC0000]"></div>
          <div id="particles-js" className="absolute inset-0 z-0"></div>
          <motion.div
            className="relative text-center text-white z-10 max-w-4xl mx-auto px-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <motion.h1
              className="text-6xl font-extrabold mb-6 text-shadow-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Agent IA BH Assurance
            </motion.h1>
            <motion.p
              className="text-2xl text-white/90 mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Système intelligent d'analyse client et de recommandations commerciales
            </motion.p>
            <div className="flex flex-wrap justify-center gap-6">
              <Badge className="px-6 py-3 text-md bg-[#072241]/80 text-white border-[#EC0000]/30 rounded-full shadow-lg hover:bg-[#EC0000] transition-all duration-300">
                <Brain className="h-5 w-5 mr-2" />
                IA Avancée
              </Badge>
              <Badge className="px-6 py-3 text-md bg-[#072241]/80 text-white border-[#EC0000]/30 rounded-full shadow-lg hover:bg-[#EC0000] transition-all duration-300">
                <Shield className="h-5 w-5 mr-2" />
                Analyse Risques
              </Badge>
              <Badge className="px-6 py-3 text-md bg-[#072241]/80 text-white border-[#EC0000]/30 rounded-full shadow-lg hover:bg-[#EC0000] transition-all duration-300">
                <TrendingUp className="h-5 w-5 mr-2" />
                Recommandations
              </Badge>
            </div>
          </motion.div>
        </div>
        {/* Main Content */}
        <div className="container mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="selection" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Sélection Client
                </TabsTrigger>
                <TabsTrigger value="workflow" disabled={!selectedCustomer}>
                  <Brain className="h-4 w-4 mr-2" />
                  Workflow IA
                </TabsTrigger>
                <TabsTrigger value="analysis" disabled={!workflowState?.customerProfile}>
                  <Shield className="h-4 w-4 mr-2" />
                  Analyse
                </TabsTrigger>
                <TabsTrigger value="pitch" disabled={!workflowState?.commercialPitch}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Pitch Commercial
                </TabsTrigger>
              </TabsList>
              <TabsContent value="selection" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sélection du Client</CardTitle>
                    <CardDescription>
                      Choisissez un client pour démarrer l'analyse IA et générer des recommandations commerciales
                    </CardDescription>
                  </CardHeader>
                </Card>
                <CustomerSelector
                  onCustomerSelect={handleCustomerSelect}
                  selectedCustomer={selectedCustomer}
                />
              </TabsContent>
              <TabsContent value="workflow" className="space-y-6">
                <WorkflowVisualization
                  customerId={selectedCustomer?.REF_PERSONNE}
                  onWorkflowComplete={handleWorkflowComplete}
                />
              </TabsContent>
              <TabsContent value="analysis" className="space-y-6">
                {workflowState?.customerProfile && (
                  <AnalysisResults customerProfile={workflowState.customerProfile} />
                )}
              </TabsContent>
              <TabsContent value="pitch" className="space-y-6">
                {workflowState?.commercialPitch && (
                  <CommercialPitchDisplay
                    commercialPitch={workflowState.commercialPitch}
                    onFeedbackSubmit={handleFeedbackSubmit}
                  />
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
          {/* Features Overview */}
          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="text-center">
              <CardHeader>
                <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Analyse IA Avancée</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Algorithmes d'intelligence artificielle pour analyser les profils clients et détecter les opportunités commerciales.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-secondary mx-auto mb-4" />
                <CardTitle>Évaluation des Risques</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Évaluation sophistiquée du profil de risque basée sur l'historique, la profession et les sinistres.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-success mx-auto mb-4" />
                <CardTitle>Recommandations Ciblées</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Génération automatique de recommandations produits personnalisées avec pitch commercial optimisé.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        {/* ChatBot Component */}
        <ChatBot />
      </div>
      <Footer />
    </>
  );
};

export default Index;