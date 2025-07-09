
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Search, Plus } from 'lucide-react';
import { CommissionRuleDialog } from '@/components/CommissionRuleDialog';
import { useCommissionRules } from '@/hooks/useCommissionRules';

const CommissionRulesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { 
    commissionRules, 
    loading, 
    createCommissionRule, 
    updateCommissionRule, 
    deleteCommissionRule 
  } = useCommissionRules();

  const filteredRules = commissionRules.filter(rule =>
    rule.representative?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.industry?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.category?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveRule = async (ruleData: any) => {
    try {
      await createCommissionRule({
        new_representante_id: ruleData.representanteId,
        industria_id: ruleData.industriaId || null,
        categoria_id: ruleData.categoriaId || null,
        percentual_industria: Number(ruleData.percentualIndustria),
        percentual_repasse: Number(ruleData.percentualRepasse),
        base_calculo: ruleData.baseCalculo
      });
    } catch (error) {
      console.error('Error saving commission rule:', error);
    }
  };

  const handleUpdateRule = async (id: string, ruleData: any) => {
    try {
      await updateCommissionRule(id, {
        new_representante_id: ruleData.representanteId,
        industria_id: ruleData.industriaId || null,
        categoria_id: ruleData.categoriaId || null,
        percentual_industria: Number(ruleData.percentualIndustria),
        percentual_repasse: Number(ruleData.percentualRepasse),
        base_calculo: ruleData.baseCalculo
      });
    } catch (error) {
      console.error('Error updating commission rule:', error);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover esta regra de comissão?')) {
      try {
        await deleteCommissionRule(id);
      } catch (error) {
        console.error('Error deleting commission rule:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando regras de comissão...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Regras de Comissão</h1>
          <p className="text-muted-foreground">
            Gerencie as regras de comissão por indústria, representante e categoria
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar regras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <CommissionRuleDialog onSave={handleSaveRule} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Ações</TableHead>
              <TableHead>Representante</TableHead>
              <TableHead>Indústria</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="w-[120px]">% Indústria</TableHead>
              <TableHead className="w-[120px]">% Repasse</TableHead>
              <TableHead className="w-[120px]">Base Cálculo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  <Plus className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-lg font-medium">Nenhuma regra cadastrada</p>
                  <p className="text-sm">Adicione sua primeira regra de comissão</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <div className="flex space-x-2">
                      <CommissionRuleDialog
                        commissionRule={{
                          id: rule.id,
                          representanteId: rule.new_representante_id || '',
                          industriaId: rule.industria_id || '',
                          categoriaId: rule.categoria_id || '',
                          percentualIndustria: rule.percentual_industria,
                          percentualRepasse: rule.percentual_repasse,
                          baseCalculo: rule.base_calculo
                        }}
                        onSave={(data) => handleUpdateRule(rule.id, data)}
                        trigger={
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{rule.representative?.nome || 'N/A'}</TableCell>
                  <TableCell>{rule.industry?.nome || 'Todas'}</TableCell>
                  <TableCell className="font-medium">{rule.category?.nome || 'Todas'}</TableCell>
                  <TableCell className="text-center">{rule.percentual_industria}%</TableCell>
                  <TableCell className="text-center">{rule.percentual_repasse}%</TableCell>
                  <TableCell>
                    <span className="capitalize">
                      {rule.base_calculo === 'produto' ? 'Produto' : 'Total'}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CommissionRulesPage;
