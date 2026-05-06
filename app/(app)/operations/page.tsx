'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api/apiClient';

interface Instrument {
  id: string;
  ticker: string;
  name: string;
  type: string;
  currentPrice: string;
}

export default function OperationsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [type, setType] = useState<'BUY' | 'SELL' | 'DIVIDEND'>('BUY');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [executedAt, setExecutedAt] = useState(new Date().toISOString().slice(0, 16));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Buscar instrumentos conforme digita
  useEffect(() => {
    if (searchTerm.length < 2) {
      setInstruments([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const res = await api.get(`/instruments?search=${encodeURIComponent(searchTerm)}`);
        setInstruments(res.data);
      } catch (err) {
        console.error(err);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleSelectInstrument = (inst: Instrument) => {
    setSelectedInstrument(inst);
    setSearchTerm(inst.ticker); // mostra o ticker no campo
    setUnitPrice(inst.currentPrice); // pré-preenche com preço atual
    setInstruments([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInstrument) {
      setMessage({ type: 'error', text: 'Selecione um ativo' });
      return;
    }
    if (!quantity || !unitPrice) {
      setMessage({ type: 'error', text: 'Preencha quantidade e preço' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const portfolioId = 'f06740c2-c17b-46c9-8c10-9a472ee6cf53';

      await api.post('/operations', {
        portfolioId,
        instrumentId: selectedInstrument.id,
        type,
        quantity: parseFloat(quantity),
        unitPrice: parseFloat(unitPrice),
        executedAt: new Date(executedAt).toISOString(),
      });

      setMessage({ type: 'success', text: 'Operação lançada com sucesso!' });
      // Limpa formulário
      setSelectedInstrument(null);
      setSearchTerm('');
      setQuantity('');
      setUnitPrice('');
      // Redireciona após 2 segundos
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erro ao lançar operação' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Lançar Operação</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Busca de ativo */}
            <div>
              <Label>Ativo (buscar por ticker ou nome)</Label>
              <Input
                placeholder="Digite BB, BBDC4, etc."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
              />
              {instruments.length > 0 && (
                <div className="border rounded-md mt-1 max-h-40 overflow-y-auto">
                  {instruments.map((inst) => (
                    <div
                      key={inst.id}
                      className="p-2 hover:bg-muted cursor-pointer"
                      onClick={() => handleSelectInstrument(inst)}
                    >
                      <span className="font-medium">{inst.ticker}</span> - {inst.name} (R$ {inst.currentPrice})
                    </div>
                  ))}
                </div>
              )}
              {selectedInstrument && (
                <p className="text-sm text-green-600 mt-1">
                  Selecionado: {selectedInstrument.ticker} - Preço atual: R$ {selectedInstrument.currentPrice}
                </p>
              )}
            </div>

            {/* Tipo de operação */}
            <div>
              <Label>Tipo</Label>
              <Select value={type} onValueChange={(v: any) => setType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUY">Compra (BUY)</SelectItem>
                  <SelectItem value="SELL">Venda (SELL)</SelectItem>
                  <SelectItem value="DIVIDEND">Dividendo (DIVIDEND)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quantidade */}
            <div>
              <Label>Quantidade</Label>
              <Input
                type="number"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            {/* Preço unitário */}
            <div>
              <Label>Preço unitário (R$)</Label>
              <Input
                type="number"
                step="any"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                required
              />
            </div>

            {/* Data */}
            <div>
              <Label>Data da operação</Label>
              <Input
                type="datetime-local"
                value={executedAt}
                onChange={(e) => setExecutedAt(e.target.value)}
                required
              />
            </div>

            {message && (
              <div className={`p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message.text}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Lançando...' : 'Lançar Operação'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}