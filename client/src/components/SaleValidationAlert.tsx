
import { AlertTriangle } from 'lucide-react';

interface SaleValidationAlertProps {
  errors: string[];
}

export const SaleValidationAlert = ({ errors }: SaleValidationAlertProps) => {
  if (errors.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
      <div className="flex">
        <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
        <div>
          <h4 className="text-sm font-medium text-red-800">Erros de Validação:</h4>
          <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
