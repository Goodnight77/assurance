import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dataService } from '@/services/dataService';
import { simplifiedAiService } from '@/services/simplifiedAiService';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Bonjour ! Je suis votre assistant IA BH Assurance. Posez-moi des questions sur vos clients, leurs contrats, ou demandez des analyses spécifiques.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Process the user query
      const response = await processQuery(inputValue);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Désolé, une erreur s\'est produite. Veuillez réessayer.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to trace chat interactions to fake AI backend
  const traceChat = async (question: string, answer: string) => {
    try {
      await fetch('http://localhost:5000/api/chat-interaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          answer,
          sessionId: 'chat_session_' + Date.now(),
          userId: 'agent_user',
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      // Silent fail - backend logging is optional
      console.log('🤖 AI Backend not available for chat tracing');
    }
  };

  const processQuery = async (query: string): Promise<string> => {
    const lowerQuery = query.toLowerCase();
    let response = '';

    // Search for specific client by name or reference
    if (lowerQuery.includes('client') || lowerQuery.includes('personne')) {
      const clients = dataService.getPersonnesPhysiques();
      const entreprises = dataService.getPersonnesMorales();
      
      // Extract potential client name from query
      const words = query.split(' ');
      const searchTerm = words.find(word => word.length > 3) || '';
      
      if (searchTerm) {
        const foundClients = clients.filter(client => 
          client.NOM_PRENOM.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (foundClients.length > 0) {
          const client = foundClients[0];
          const contracts = dataService.getContractsByCustomer(client.REF_PERSONNE);
          
          response = `Client trouvé: ${client.NOM_PRENOM}
• Profession: ${client.LIB_PROFESSION}
• Secteur: ${client.LIB_SECTEUR_ACTIVITE}
• Localisation: ${client.VILLE_GOUVERNORAT}
• Nombre de contrats: ${contracts.length}
• Contrats: ${contracts.map(c => c.LIB_PRODUIT).join(', ')}`;
          
          await traceChat(query, response);
          return response;
        }
      }
      
      response = `J'ai trouvé ${clients.length} personnes physiques et ${entreprises.length} entreprises dans la base. Précisez un nom pour plus d'informations.`;
      await traceChat(query, response);
      return response;
    }

    // Contract statistics
    if (lowerQuery.includes('contrat') || lowerQuery.includes('police')) {
      const contracts = dataService.getAllContracts();
      const activeContracts = contracts.filter(c => c.LIB_ETAT_CONTRAT === 'Actif');
      const branches = [...new Set(contracts.map(c => c.branche))];
      
      response = `Statistiques des contrats:
• Total: ${contracts.length} contrats
• Actifs: ${activeContracts.length}
• Branches disponibles: ${branches.join(', ')}
• Valeur totale assurée: ${contracts.reduce((sum, c) => sum + (c.Capital_assure || 0), 0).toLocaleString()} TND`;
      
      await traceChat(query, response);
      return response;
    }

    // Claims statistics
    if (lowerQuery.includes('sinistre') || lowerQuery.includes('réclamation')) {
      const sinistres = dataService.getAllClaims();
      const openClaims = sinistres.filter(s => s.LIB_ETAT_SINISTRE === 'Ouvert');
      
      response = `Statistiques des sinistres:
• Total: ${sinistres.length} sinistres
• En cours: ${openClaims.length}
• Montant total encaissé: ${sinistres.reduce((sum, s) => sum + (s.MONTANT_ENCAISSE || 0), 0).toLocaleString()} TND`;
      
      await traceChat(query, response);
      return response;
    }

    // Analysis requests
    if (lowerQuery.includes('analyse') || lowerQuery.includes('recommandation')) {
      const clients = dataService.getPersonnesPhysiques();
      const randomClient = clients[Math.floor(Math.random() * clients.length)];
      
      if (randomClient) {
        const contracts = dataService.getContractsByCustomer(randomClient.REF_PERSONNE);
        const claims = dataService.getClaimsByContract(contracts.map(c => c.NUM_CONTRAT));
        const profile = await simplifiedAiService.analyzeCustomerProfile(randomClient, contracts, claims);
        const recommendations = await simplifiedAiService.generateRecommendations(profile);
        
        response = `Analyse exemple pour ${randomClient.NOM_PRENOM}:
• Profil: ${profile.riskProfile.profession} - ${profile.riskProfile.claimsHistory.riskLevel}
• Produits recommandés: ${recommendations.map(r => r.product.LIB_PRODUIT).join(', ')}
• Opportunité principale: ${recommendations[0]?.reasoning || 'Aucune recommandation spécifique'}`;
        
        await traceChat(query, response);
        return response;
      }
    }

    // General help
    response = `Je peux vous aider avec:
• Recherche de clients spécifiques
• Statistiques des contrats et sinistres
• Analyses de profils clients
• Recommandations de produits

Essayez des questions comme:
- "Montre-moi les contrats de [nom du client]"
- "Combien de sinistres en cours ?"
- "Analyse le profil de [nom du client]"`;

    await traceChat(query, response);
    return response;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-gradient-primary shadow-elegant hover:shadow-glow transition-all duration-300"
            size="icon"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        )}
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="shadow-elegant border-border/50 backdrop-blur-sm bg-card/95">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-primary text-white rounded-t-lg">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Assistant IA BH
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              
              <CardContent className="p-0">
                {/* Messages Area */}
                <ScrollArea className="h-80 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.type === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.type === 'bot' && (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 ${
                            message.type === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {formatTime(message.timestamp)}
                          </p>
                        </div>

                        {message.type === 'user' && (
                          <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-secondary" />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="bg-muted rounded-lg px-3 py-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t border-border/50 p-4">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Posez votre question..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      size="icon"
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};