'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-dark text-gray-300 font-sans selection:bg-neon/30 selection:text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-dark/80 backdrop-blur-xl border-b border-white/5 py-6 px-5 md:px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-neon hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-xs font-bold uppercase tracking-widest">Voltar para Home</span>
          </Link>
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
            WB Digital Hub <span className="text-neon">/</span> Jurídico
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-5 md:px-10">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h1 className="font-display text-4xl md:text-6xl text-white mb-6">Política de <span className="text-neon">Privacidade</span></h1>
            <p className="text-gray-500 text-sm uppercase tracking-widest">Última atualização: 30 de Março de 2026</p>
          </motion.div>

          <div className="space-y-12 text-gray-400 leading-relaxed">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-neon" />
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">1. Introdução</h2>
              </div>
              <p>
                A WB Digital Hub está comprometida com a proteção da sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você visita nosso site e utiliza nossos serviços de marketing digital.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-neon" />
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">2. Coleta de Dados</h2>
              </div>
              <p className="mb-4">Coletamos informações que você nos fornece diretamente quando:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Preenche formulários de contato ou solicita análise gratuita;</li>
                <li>Entra em contato conosco via WhatsApp ou e-mail;</li>
                <li>Assina nossa newsletter ou materiais educativos;</li>
                <li>Contrata nossos serviços de tráfego pago, SEO ou desenvolvimento.</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-5 h-5 text-neon" />
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">3. Uso das Informações</h2>
              </div>
              <p className="mb-4">Utilizamos os dados coletados para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Prestar e melhorar nossos serviços;</li>
                <li>Personalizar sua experiência e responder às suas solicitações;</li>
                <li>Enviar comunicações de marketing e atualizações (com seu consentimento);</li>
                <li>Analisar o desempenho do site e otimizar nossas campanhas de tráfego.</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 text-neon" />
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">4. Proteção e Segurança</h2>
              </div>
              <p>
                Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição. Seus dados são armazenados em servidores seguros e o acesso é restrito a pessoal autorizado.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-neon" />
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">5. Seus Direitos (LGPD)</h2>
              </div>
              <p className="mb-4">Em conformidade com a Lei Geral de Proteção de Dados (LGPD), você tem o direito de:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Confirmar a existência de tratamento de seus dados;</li>
                <li>Acessar seus dados pessoais;</li>
                <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
                <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários;</li>
                <li>Revogar seu consentimento a qualquer momento.</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-neon" />
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">6. Cookies</h2>
              </div>
              <p>
                Utilizamos cookies e tecnologias semelhantes para rastrear a atividade em nosso site e manter certas informações. Você pode instruir seu navegador a recusar todos os cookies ou a indicar quando um cookie está sendo enviado.
              </p>
            </section>

            <section className="pt-10 border-t border-white/5">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-4">Contato</h2>
              <p>
                Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco:<br/>
                <span className="text-neon">contato@wbdigitalhub.com.br</span>
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="py-10 border-t border-white/5 text-center">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest">
          © 2026 WB Digital Hub – Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
