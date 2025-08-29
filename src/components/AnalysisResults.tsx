import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  DollarSign,
  Calendar,
  MapPin,
  User
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { CustomerProfile, RiskProfile } from '@/types/insurance';

interface AnalysisResultsProps {
  customerProfile: CustomerProfile;
}

export function AnalysisResults({ customerProfile }: AnalysisResultsProps) {
  const { customer, contracts, riskProfile, equipmentGaps } = customerProfile;
  
  const customerName = 'NOM_PRENOM' in customer ? customer.NOM_PRENOM : customer.RAISON_SOCIALE;
  const profession = 'LIB_PROFESSION' in customer ? customer.LIB_PROFESSION : customer.LIB_ACTIVITE;

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-success';
      case 'Medium': return 'text-warning';
      case 'High': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskLevelBadge = (level: string) => {
    switch (level) {
      case 'Low': return 'default';
      case 'Medium': return 'secondary';
      case 'High': return 'destructive';
      default: return 'outline';
    }
  };

  const getPaymentScore = (history: string) => {
    switch (history) {
      case 'Excellent': return 95;
      case 'Good': return 80;
      case 'Average': return 60;
      case 'Poor': return 30;
      default: return 50;
    }
  };

  const getPaymentColor = (history: string) => {
    const score = getPaymentScore(history);
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-primary';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Customer Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="gradient-primary text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil Client Analysé
            </CardTitle>
            <CardDescription className="text-white/80">
              Synthèse complète du client et de son équipement actuel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold text-lg">{customerName}</h3>
                <p className="text-white/90">{profession}</p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  <span className="text-sm text-white/80">{customer.VILLE_GOUVERNORAT}</span>
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">{contracts.length}</div>
                <p className="text-white/80 text-sm">Contrats actifs</p>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {riskProfile.totalInsuredValue.toLocaleString('fr-TN')} DT
                </div>
                <p className="text-white/80 text-sm">Capital total assuré</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Profile */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Profil de Risque
              </CardTitle>
              <CardDescription>
                Évaluation du risque client basée sur l'historique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {riskProfile.age && (
                  <div>
                    <p className="text-sm font-medium">Âge</p>
                    <p className="text-2xl font-bold text-primary">{riskProfile.age} ans</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">Secteur</p>
                  <Badge variant="outline" className="mt-1">{riskProfile.sector}</Badge>
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Historique de paiement</span>
                  <Badge variant={getRiskLevelBadge(riskProfile.paymentHistory)}>
                    {riskProfile.paymentHistory}
                  </Badge>
                </div>
                <Progress 
                  value={getPaymentScore(riskProfile.paymentHistory)} 
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Niveau de risque sinistres</span>
                  <Badge variant={getRiskLevelBadge(riskProfile.claimsHistory.riskLevel)}>
                    {riskProfile.claimsHistory.riskLevel}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {riskProfile.claimsHistory.totalClaims} sinistres pour {riskProfile.claimsHistory.totalAmount.toLocaleString('fr-TN')} DT
                </div>
              </div>

              {riskProfile.familyStatus && (
                <div>
                  <p className="text-sm font-medium">Situation familiale</p>
                  <p className="text-sm text-muted-foreground">{riskProfile.familyStatus}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Current Equipment */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Équipement Actuel
              </CardTitle>
              <CardDescription>
                Contrats d'assurance en cours
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contracts.length > 0 ? (
                <div className="space-y-3">
                  {contracts.map((contract, index) => (
                    <motion.div
                      key={contract.NUM_CONTRAT}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 border rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{contract.LIB_PRODUIT}</h4>
                        <Badge variant={contract.statut_paiement === 'Payé' ? 'default' : 'destructive'}>
                          {contract.statut_paiement}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>Branche: {contract.branche}</div>
                        <div>Capital: {contract.Capital_assure.toLocaleString('fr-TN')} DT</div>
                        <div>Prime: {contract.somme_quittances.toLocaleString('fr-TN')} DT</div>
                        <div>
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {new Date(contract.PROCHAIN_TERME).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Aucun contrat actuel</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Equipment Gaps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Lacunes dans la Couverture
            </CardTitle>
            <CardDescription>
              Opportunités d'amélioration identifiées par l'IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            {equipmentGaps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipmentGaps.map((gap, index) => (
                  <motion.div
                    key={gap.branch}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{gap.branch}</h4>
                      <Badge variant={
                        gap.priority === 'High' ? 'destructive' :
                        gap.priority === 'Medium' ? 'secondary' : 'outline'
                      }>
                        Priorité {gap.priority === 'High' ? 'Haute' : gap.priority === 'Medium' ? 'Moyenne' : 'Faible'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{gap.reasoning}</p>
                    
                    <div>
                      <p className="text-xs font-medium mb-1">Produits manquants:</p>
                      <div className="flex flex-wrap gap-1">
                        {gap.missingProducts.map(product => (
                          <Badge key={product} variant="outline" className="text-xs">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-success mx-auto mb-2" />
                <p className="font-medium">Couverture complète</p>
                <p className="text-sm text-muted-foreground">
                  Aucune lacune majeure détectée dans la couverture actuelle
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {((equipmentGaps.length / (equipmentGaps.length + contracts.length)) * 100).toFixed(0)}%
              </div>
              <p className="text-xs text-muted-foreground">Potentiel d'amélioration</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {contracts.reduce((sum, c) => sum + c.somme_quittances, 0).toLocaleString('fr-TN')}
              </div>
              <p className="text-xs text-muted-foreground">Primes actuelles (DT)</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {[...new Set(contracts.map(c => c.branche))].length}
              </div>
              <p className="text-xs text-muted-foreground">Branches couvertes</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <AlertTriangle className={`h-8 w-8 mx-auto mb-2 ${getRiskLevelColor(riskProfile.claimsHistory.riskLevel)}`} />
              <div className={`text-2xl font-bold ${getRiskLevelColor(riskProfile.claimsHistory.riskLevel)}`}>
                {riskProfile.claimsHistory.riskLevel}
              </div>
              <p className="text-xs text-muted-foreground">Niveau de risque</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}