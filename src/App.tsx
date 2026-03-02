/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Download, Plus, Trash2, Calendar, Clock, User, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContentRecord {
  id: string;
  description: string;
  designerName: string;
  date: string;
  time: string;
  timestamp: number;
}

export default function App() {
  const [records, setRecords] = useState<ContentRecord[]>([]);
  const [description, setDescription] = useState('');
  const [designerName, setDesignerName] = useState('');

  // Load records from localStorage on mount
  useEffect(() => {
    const savedRecords = localStorage.getItem('rede_pampa_records');
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords));
      } catch (e) {
        console.error('Error parsing records from localStorage', e);
      }
    }
  }, []);

  // Save records to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('rede_pampa_records', JSON.stringify(records));
  }, [records]);

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !designerName.trim()) return;

    const now = new Date();
    const newRecord: ContentRecord = {
      id: crypto.randomUUID(),
      description: description.trim(),
      designerName: designerName.trim(),
      date: now.toLocaleDateString('pt-BR'),
      time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      timestamp: now.getTime(),
    };

    setRecords([newRecord, ...records]);
    setDescription('');
    setDesignerName('');
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      setRecords(records.filter(r => r.id !== id));
    }
  };

  const downloadHistory = () => {
    const tableRows = records
      .map(
        (r) => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 12px; white-space: pre-wrap;">${r.description}</td>
        <td style="border: 1px solid #ddd; padding: 12px;">${r.designerName}</td>
        <td style="border: 1px solid #ddd; padding: 12px;">${r.date}</td>
        <td style="border: 1px solid #ddd; padding: 12px;">${r.time}</td>
      </tr>`
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Histórico de Conteúdos - Rede Pampa</title>
        <style>
          body { font-family: sans-serif; padding: 40px; color: #333; }
          h1 { color: #f27d26; border-bottom: 2px solid #f27d26; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f27d26; color: white; text-align: left; padding: 12px; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          td { vertical-align: top; }
        </style>
      </head>
      <body>
        <h1>Histórico de Conteúdos Produzidos - Rede Pampa</h1>
        <p>Documento gerado em: ${new Date().toLocaleString('pt-BR')}</p>
        <table>
          <thead>
            <tr>
              <th>Descrição do Conteúdo</th>
              <th>Designer</th>
              <th>Data</th>
              <th>Hora</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historico_pampa_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-100">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <img 
            src="https://res.cloudinary.com/dobcfwbhp/image/upload/v1772459507/Rede-Pampa-Redes-Sociais-Horizontal_glswrr.png" 
            alt="Rede Pampa Logo" 
            className="h-10 object-contain"
            referrerPolicy="no-referrer"
          />
          <div className="text-right hidden sm:block">
            <h1 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Controle de Conteúdos</h1>
            <p className="text-xs text-slate-400">Designers Rede Pampa</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 pb-32">
        {/* Registration Form */}
        <section className="bg-slate-50 rounded-2xl p-6 mb-10 border border-slate-100 shadow-sm">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#f27d26]" />
            Registrar Novo Conteúdo
          </h2>
          <form onSubmit={handleAddRecord} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Descrição do Conteúdo (O que foi postado)</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva detalhadamente o conteúdo postado..."
                    rows={4}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f27d26]/20 focus:border-[#f27d26] transition-all resize-none"
                    required
                  />
                </div>
              </div>
              <div className="space-y-6 flex flex-col justify-between">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome do Designer</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={designerName}
                      onChange={(e) => setDesignerName(e.target.value)}
                      placeholder="Nome do Designer"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f27d26]/20 focus:border-[#f27d26] transition-all"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#f27d26] hover:bg-[#d96a1a] text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-md shadow-orange-200 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  ADICIONAR REGISTRO
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Content List */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Conteúdos Produzidos</h2>
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
              {records.length} {records.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>

          <div className="overflow-hidden border border-slate-100 rounded-2xl shadow-sm">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="w-1/2 px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Descrição do Conteúdo</th>
                  <th className="w-1/6 px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Designer</th>
                  <th className="w-1/8 px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data</th>
                  <th className="w-1/8 px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Hora</th>
                  <th className="w-12 px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence initial={false}>
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                        Nenhum conteúdo registrado ainda.
                      </td>
                    </tr>
                  ) : (
                    records.map((record) => (
                      <motion.tr
                        key={record.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4 text-slate-800 break-words whitespace-pre-wrap align-top">
                          {record.description}
                        </td>
                        <td className="px-6 py-4 text-slate-600 align-top">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-[#f27d26] shrink-0">
                              {record.designerName.charAt(0).toUpperCase()}
                            </div>
                            <span className="truncate">{record.designerName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-sm align-top">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 opacity-60" />
                            {record.date}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-sm align-top">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 opacity-60" />
                            {record.time}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right align-top">
                          <button
                            onClick={() => handleDeleteRecord(record.id)}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer / Download Button */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
        <div className="max-w-5xl mx-auto flex justify-center pointer-events-auto">
          <button
            onClick={downloadHistory}
            disabled={records.length === 0}
            className="bg-white border-2 border-[#f27d26] text-[#f27d26] hover:bg-[#f27d26] hover:text-white font-bold py-3 px-10 rounded-full transition-all shadow-xl flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#f27d26]"
          >
            <Download className="w-5 h-5" />
            BAIXAR HISTÓRICO
          </button>
        </div>
      </footer>
    </div>
  );
}
