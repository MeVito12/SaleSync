
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Percent } from 'lucide-react';
import { CartItem } from '@/types/cart';
import { useFinancialFormat } from '@/hooks/useFinancialFormat';
import { useCommissionCalculation } from '@/hooks/useCommissionCalculation';
import { useEffect, useState } from 'react';

interface ProductCartTableProps {
  cartItems: CartItem[];
  onItemUpdate: (itemId: string, field: string, value: any) => void;
  onItemRemove: (itemId: string) => void;
  representanteId: string;
  industriaId: string;
}

export const ProductCartTable = ({ 
  cartItems, 
  onItemUpdate, 
  onItemRemove,
  representanteId,
  industriaId
}: ProductCartTableProps) => {
  const { formatCurrency } = useFinancialFormat();
  const { calculateCommission, getCommissionPercent } = useCommissionCalculation();
  const [enableRepasse, setEnableRepasse] = useState(false);

  // Aplicar comissão automaticamente baseada nas regras
  useEffect(() => {
    if (!representanteId || !industriaId || cartItems.length === 0) return;

    console.log('Applying commission rules with repasse:', enableRepasse);

    cartItems.forEach(item => {
      const categoriaId = item.produto?.categoria_id || undefined;
      
      const commissionData = calculateCommission(
        representanteId, 
        industriaId, 
        item.total,
        categoriaId,
        'total', 
        enableRepasse
      );
      
      if (commissionData.percent > 0) {
        // Só atualizar se o valor mudou para evitar loops infinitos
        if (Math.abs(item.percentualComissao - commissionData.percent) > 0.01) {
          console.log(`Auto-updating commission for item ${item.id}: ${commissionData.percent}% = R$ ${commissionData.value.toFixed(2)}`);
          onItemUpdate(item.id, 'percentualComissao', commissionData.percent);
          onItemUpdate(item.id, 'comissao', commissionData.value);
        }
      }
    });
  }, [cartItems.length, representanteId, industriaId, enableRepasse, calculateCommission, onItemUpdate]);

  const handleCommissionPercentChange = (itemId: string, percentValue: number) => {
    const item = cartItems.find(i => i.id === itemId);
    if (item) {
      const commissionValue = (item.total * percentValue) / 100;
      console.log(`Manual commission update for item ${itemId}: ${percentValue}% of ${item.total} = ${commissionValue.toFixed(2)}`);
      
      // Atualizar o percentual primeiro
      onItemUpdate(itemId, 'percentualComissao', percentValue);
      
      // Em seguida atualizar o valor (será recalculado automaticamente no ProductCart)
      // Não precisamos chamar onItemUpdate para 'comissao' pois já é calculado automaticamente
    }
  };

  const handleRepasseChange = (checked: boolean) => {
    console.log('Repasse changed to:', checked);
    setEnableRepasse(checked);
  };

  const getAutoCommissionText = (categoriaId?: string) => {
    const normalPercent = getCommissionPercent(representanteId, industriaId, categoriaId, false);
    const repassePercent = getCommissionPercent(representanteId, industriaId, categoriaId, true);
    
    if (normalPercent === 0) {
      return 'Auto: Sem regra';
    }
    
    if (enableRepasse && repassePercent !== normalPercent) {
      return `Auto: ${normalPercent}% → ${repassePercent}% (repasse)`;
    }
    return `Auto: ${normalPercent}%`;
  };

  return (
    <div className="space-y-4">
      {/* Opção de Repasse */}
      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
        <Checkbox
          id="enable-repasse"
          checked={enableRepasse}
          onCheckedChange={handleRepasseChange}
        />
        <label htmlFor="enable-repasse" className="text-sm font-medium">
          Aplicar repasse de comissão
        </label>
        <div className="text-xs text-gray-500 ml-2">
          {enableRepasse ? 'Usando percentual de repasse das regras' : 'Usando percentual integral da indústria'}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead className="w-20">Qtd</TableHead>
              <TableHead className="w-28">Preço Unit.</TableHead>
              <TableHead className="w-20">IPI (%)</TableHead>
              <TableHead className="w-28">Valor IPI</TableHead>
              <TableHead className="w-24">Comissão (%)</TableHead>
              <TableHead className="w-28">Total</TableHead>
              <TableHead className="w-16">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.produto?.nome}</div>
                    <div className="text-sm text-gray-500">{item.produto?.codigo}</div>
                    {item.produto?.ean && (
                      <div className="text-xs text-gray-400">EAN: {item.produto.ean}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantidade}
                    onChange={(e) => onItemUpdate(item.id, 'quantidade', Number(e.target.value))}
                    className="w-16"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.precoUnitario}
                    onChange={(e) => onItemUpdate(item.id, 'precoUnitario', Number(e.target.value))}
                    className="w-24"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.percentualIpi || 0}
                    onChange={(e) => onItemUpdate(item.id, 'percentualIpi', Number(e.target.value))}
                    className="w-16"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(item.ipi || 0)}
                </TableCell>
                <TableCell>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.percentualComissao || 0}
                      onChange={(e) => handleCommissionPercentChange(item.id, Number(e.target.value))}
                      className="w-20 pr-6"
                      placeholder="0,00"
                    />
                    <Percent className="absolute right-1 top-2.5 h-3 w-3 text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {getAutoCommissionText(item.produto?.categoria_id)}
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(item.total)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onItemRemove(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
