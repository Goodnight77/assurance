import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Star, 
  Phone, 
  Mail, 
  MessageCircle, 
  Copy,
  Send,
  Edit,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import type { CommercialPitch, ProductRecommendation } from '@/types/insurance';

interface CommercialPitchDisplayProps {
  commercialPitch: CommercialPitch;
  onFeedbackSubmit?: (feedback: {
    customerId: string;
    pitchId: string;
    agentNotes: string;
    customerResponse: 'Interested' | 'Not Interested' | 'Need More Info' | 'Follow Up Later';
    improvementSuggestions: string;
  }) => void;
}

export function CommercialPitchDisplay({ commercialPitch, onFeedbackSubmit }: CommercialPitchDisplayProps) {
  const [agentNotes, setAgentNotes] = useState('');
  const [customerResponse, setCustomerResponse] = useState<'Interested' | 'Not Interested' | 'Need More Info' | 'Follow Up Later'>('Interested');
  const [improvementSuggestions, setImprovementSuggestions] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const { toast } = useToast();
  const { authData } = useAuth();

  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState(commercialPitch.personalizedMessage)

  const handleSave = () => {
    setIsEditing(false)
    // 👉 optionally call API or update parent state with `message`
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return Mail;
      case 'phone': return Phone;
      case 'whatsapp': return MessageCircle;
      default: return MessageSquare;
    }
  };

  const getChannelLabel = (channel: string) => {
    switch (channel) {
      case 'email': return 'Email';
      case 'phone': return 'Téléphone';
      case 'whatsapp': return 'WhatsApp';
      default: return 'Message';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'Haute';
      case 'Medium': return 'Moyenne';
      case 'Low': return 'Faible';
      default: return 'Non définie';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: "Le message a été copié dans le presse-papiers.",
    });
  };

  const handleFeedbackSubmit = async () => {
    if (!agentNotes.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter des notes avant de soumettre.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingFeedback(true);

    try {
      const feedbackData = {
        commercialPitch: commercialPitch.personalizedMessage,
        customerId: commercialPitch.customerId,
        pitchId: `pitch_${Date.now()}`,
        agentEmail: authData?.email || 'unknown@example.com',
        agentNotes,
        customerResponse,
        improvementSuggestions,
        timestamp: new Date().toISOString(),
      };

      // 🔹 Send feedback to local server to store in feedback/feedback.json
      const response = await fetch('http://localhost:3001/api/save-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        throw new Error('Failed to save feedback to file');
      }

      const result = await response.json();

      // 🔹 Log JSON in the console
      console.log("Feedback JSON:", JSON.stringify(feedbackData, null, 2));
      console.log("Server response:", result);

      // 🔹 Call your submit handler if provided
      await onFeedbackSubmit?.({
        customerId: commercialPitch.customerId,
        pitchId: `pitch_${Date.now()}`,
        agentNotes,
        customerResponse,
        improvementSuggestions
      });

      toast({
        title: "Feedback enregistré",
        description: `Vos retours ont été sauvegardés dans feedback.json (${result.count} feedback total).`,
      });

      // Reset form
      setAgentNotes('');
      setImprovementSuggestions('');
      
    } catch (error) {
      console.error('Error saving feedback:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le feedback.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const ChannelIcon = getChannelIcon(commercialPitch.communicationChannel);

  return (
    <div className="space-y-6">
      {/* Pitch Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="gradient-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Pitch Commercial Personnalisé
            </CardTitle>
            <CardDescription className="text-foreground/80">
              Message généré par l'IA pour optimiser la conversion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <ChannelIcon className="h-5 w-5" />
                <div>
                  <p className="font-medium">{getChannelLabel(commercialPitch.communicationChannel)}</p>
                  <p className="text-sm text-foreground/80">Canal recommandé</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <div>
                  <Badge variant={getUrgencyColor(commercialPitch.urgencyLevel)}>
                    Priorité {getUrgencyLabel(commercialPitch.urgencyLevel)}
                  </Badge>
                  <p className="text-sm text-foreground/80 mt-1">Niveau d'urgence</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <div>
                  <p className="font-medium">{commercialPitch.recommendations.length} produits</p>
                  <p className="text-sm text-foreground/80">Recommandations</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Edit className="h-5 w-5 text-primary" />
                  Message Commercial
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(message)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copier
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                {isEditing ? (
                  <textarea
                    className="w-full p-4 bg-muted rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                  />
                ) : (
                  <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
                    {message}
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer par {getChannelLabel(commercialPitch.communicationChannel)}
                </Button>

                {isEditing ? (
                  <Button variant="outline" onClick={handleSave}>
                    ✅ Sauvegarder
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommendations Detail */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-secondary" />
                Produits Recommandés
              </CardTitle>
              <CardDescription>
                Solutions identifiées pour ce client
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {commercialPitch.recommendations.map((recommendation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 border rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{recommendation.product.LIB_PRODUIT}</h4>
                    <Badge variant="outline">
                      Priorité {recommendation.priority}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">{recommendation.reasoning}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="font-medium">Prime estimée:</span>
                      <p>{recommendation.estimatedPremium.toLocaleString('fr-TN')} DT/an</p>
                    </div>
                    <div>
                      <span className="font-medium">Bénéfice:</span>
                      <p>{recommendation.expectedBenefit}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Sales Arguments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Arguments de Vente
            </CardTitle>
            <CardDescription>
              Points clés à mettre en avant lors de l'échange
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {commercialPitch.salesArguments.map((argument, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 p-3 bg-muted rounded-lg"
                >
                  <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{argument}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Follow-up Strategy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" />
              Stratégie de Suivi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{commercialPitch.followUpStrategy}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Agent Feedback Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Retour Agent
            </CardTitle>
            <CardDescription>
              Enregistrez les retours client et vos observations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Réponse du client</label>
              <div className="flex gap-2 flex-wrap">
                {(['Interested', 'Not Interested', 'Need More Info', 'Follow Up Later'] as const).map(response => (
                  <Button
                    key={response}
                    variant={customerResponse === response ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCustomerResponse(response)}
                  >
                    {response === 'Interested' && 'Intéressé'}
                    {response === 'Not Interested' && 'Pas intéressé'}
                    {response === 'Need More Info' && 'Besoin d\'infos'}
                    {response === 'Follow Up Later' && 'Relancer plus tard'}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Notes de l'agent</label>
              <Textarea
                placeholder="Décrivez l'échange avec le client, ses réactions, questions posées..."
                value={agentNotes}
                onChange={(e) => setAgentNotes(e.target.value)}
                className="min-h-20"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Suggestions d'amélioration</label>
              <Textarea
                placeholder="Comment pourrait-on améliorer ce type de pitch ? (optionnel)"
                value={improvementSuggestions}
                onChange={(e) => setImprovementSuggestions(e.target.value)}
                className="min-h-16"
              />
            </div>

            <Separator />

            <Button 
              onClick={handleFeedbackSubmit}
              disabled={isSubmittingFeedback || !agentNotes.trim()}
              className="w-full"
            >
              {isSubmittingFeedback ? "Enregistrement..." : "Enregistrer le retour"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}