
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Calendar, Building } from 'lucide-react';

interface SalesFiltersProps {
  searchTerm: string;
  startDate: string;
  endDate: string;
  selectedIndustry: string;
  selectedStatus: string;
  industries: Array<{ id: string; nome: string }>;
  statusOptions: string[];
  onSearchChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onIndustryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
}

export const SalesFilters = ({
  searchTerm,
  startDate,
  endDate,
  selectedIndustry,
  selectedStatus,
  industries,
  statusOptions,
  onSearchChange,
  onStartDateChange,
  onEndDateChange,
  onIndustryChange,
  onStatusChange,
  onClearFilters
}: SalesFiltersProps) => {
  const hasActiveFilters = searchTerm || startDate || endDate || selectedIndustry || selectedStatus;

  const filterSummary = () => {
    if (!startDate && !endDate && !selectedIndustry && !selectedStatus) return null;
    
    return (
      <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
        Filtros ativos: 
        {(startDate || endDate) && (
          <span className="ml-1">
            Período: {startDate ? new Date(startDate).toLocaleDateString('pt-BR') : 'início'} até {endDate ? new Date(endDate).toLocaleDateString('pt-BR') : 'hoje'}
          </span>
        )}
        {selectedIndustry && selectedIndustry !== 'all' && (
          <span className="ml-1">
            • Indústria: {industries.find(i => i.id === selectedIndustry)?.nome}
          </span>
        )}
        {selectedStatus && selectedStatus !== 'all' && (
          <span className="ml-1">• Status: {selectedStatus}</span>
        )}
      </div>
    );
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Search */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por cliente, pedido ou observação..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>
          
          {/* Date Range */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="date"
                placeholder="Data inicial"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="pl-10 w-40"
              />
            </div>
            <span className="text-gray-500">até</span>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="date"
                placeholder="Data final"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="pl-10 w-40"
              />
            </div>
          </div>

          {/* Industry Filter */}
          <div className="w-48">
            <Select value={selectedIndustry} onValueChange={onIndustryChange}>
              <SelectTrigger>
                <Building className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Todas as indústrias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as indústrias</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry.id} value={industry.id}>
                    {industry.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-40">
            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Todos status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              Limpar Filtros
            </Button>
          )}
        </div>

        {/* Filter Summary */}
        {filterSummary()}
      </div>
    </Card>
  );
};
