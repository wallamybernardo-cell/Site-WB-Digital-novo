'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  Target, 
  TrendingUp, 
  Zap, 
  Globe, 
  MessageSquare, 
  BarChart3, 
  ShieldCheck, 
  Users, 
  Star, 
  ChevronDown, 
  Plus, 
  Instagram, 
  Facebook, 
  MapPin, 
  Phone,
  ArrowRight,
  CheckCircle2,
  ShoppingCart,
  Layout,
  Search,
  MousePointer2,
  Clock,
  Award
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

import { db, auth } from './firebase';
import { collection, addDoc, serverTimestamp, getDocFromServer, doc } from 'firebase/firestore';

// --- Error Boundary Component ---
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark flex items-center justify-center p-10 text-center">
          <div className="glass p-10 rounded-3xl border border-neon/20">
            <h2 className="text-white font-display text-2xl mb-4">Ops! Algo deu errado.</h2>
            <p className="text-gray-400 text-sm mb-6">Ocorreu um erro inesperado. Por favor, recarregue a página.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-neon text-dark font-bold px-6 py-3 rounded-md uppercase text-xs tracking-widest"
            >
              Recarregar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Firestore Error Handler ---
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- Neural Canvas Component ---
const NeuralCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W: number, H: number, nodes: any[], RAF: number;
    const NODE_COUNT = typeof window !== 'undefined' && window.innerWidth < 768 ? 40 : 80;
    const MAX_DIST = typeof window !== 'undefined' && window.innerWidth < 768 ? 120 : 160;
    const COLOR = '255, 210, 0';

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };

    const init = () => {
      resize();
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
        pulse: Math.random() * Math.PI * 2
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            const alpha = (1 - d / MAX_DIST) * 0.35;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${COLOR},${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach(n => {
        n.pulse += 0.02;
        const glow = 0.5 + 0.5 * Math.sin(n.pulse);
        const radius = n.r * (1 + 0.3 * glow);
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COLOR},${0.4 + 0.4 * glow})`;
        ctx.fill();

        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      RAF = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    init();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(RAF);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40" />;
};

// --- Navbar Component ---
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Solução', href: '#solucao' },
    { name: 'Prova Real', href: '#prova-real' },
    { name: 'Planos', href: '#planos' },
    { name: 'Depoimentos', href: '#depoimentos' },
    { name: 'Sobre', href: '#sobre' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-[100] transition-all duration-500 px-5 md:px-10 py-4",
      scrolled ? "bg-dark/90 backdrop-blur-xl border-b border-neon/10 py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="#hero" className="flex items-center group">
          <div className="relative w-48 h-12 transition-transform duration-300 group-hover:scale-105">
            <Image 
              src="/logo_wb_digital_358_px.png" 
              alt="WB Digital Logo" 
              fill 
              className="object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </a>

        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a 
                href={link.href} 
                className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-neon transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <a 
            href="#cta" 
            className="hidden md:flex items-center gap-2 bg-neon text-dark font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-md hover:bg-neon/90 hover:neon-glow transition-all active:scale-95"
          >
            Análise Grátis
          </a>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex flex-col gap-1.5 p-2"
          >
            <span className={cn("w-6 h-0.5 bg-white transition-all", mobileMenuOpen && "rotate-45 translate-y-2")} />
            <span className={cn("w-6 h-0.5 bg-white transition-all", mobileMenuOpen && "opacity-0")} />
            <span className={cn("w-6 h-0.5 bg-white transition-all", mobileMenuOpen && "-rotate-45 -translate-y-2")} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 w-full bg-dark/95 backdrop-blur-2xl border-b border-neon/10 p-6 flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold uppercase tracking-widest text-gray-300 hover:text-neon py-2"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#cta" 
              onClick={() => setMobileMenuOpen(false)}
              className="bg-neon text-dark font-bold text-sm uppercase tracking-widest px-6 py-4 rounded-md text-center"
            >
              Análise Grátis
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Hero Section ---
const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <NeuralCanvas />
      <div className="absolute inset-0 bg-radial-gradient from-neon/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-5 md:px-10 relative z-10 py-20">
        <div className="max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon/10 border border-neon/20 text-neon text-[10px] font-bold uppercase tracking-[0.2em] mb-8"
          >
            <Rocket className="w-3 h-3" />
            Marketing Digital de Alta Performance
          </motion.div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-8 tracking-tighter">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="block text-white"
            >
              Transforme seu
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="block text-neon neon-text"
            >
              negócio local
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="block text-white"
            >
              em uma máquina
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="block text-white"
            >
              de vendas
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="block text-neon neon-text"
            >
              em 30 dias.
            </motion.span>
          </h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed mb-12"
          >
            Instalamos em até <span className="text-white font-bold">30 dias</span> um sistema completo de marketing que faz seu negócio local aparecer no Google e redes, atrair clientes qualificados e <span className="text-neon font-bold neon-text">vender todo santo dia</span> – sem contrato longo, sem fidelidade e com resultados previsíveis.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-6 mb-20"
          >
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a 
                href="#cta" 
                className="group relative bg-neon text-dark font-bold text-base uppercase tracking-widest px-10 py-5 rounded-md hover:neon-glow transition-all overflow-hidden flex items-center justify-center gap-2"
              >
                <span className="relative z-10">Análise Gratuita agora</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </a>
              <a 
                href="#depoimentos" 
                className="bg-dark border border-neon/30 text-neon font-bold text-base uppercase tracking-widest px-10 py-5 rounded-md hover:bg-neon/5 transition-all flex items-center justify-center"
              >
                Ver resultados
              </a>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-neon/30">
                <Image 
                  src="/af906f00-2777-491b-be59-2866631f0890.jpg" 
                  alt="Wallamy Bernardo" 
                  fill 
                  className="object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="text-white font-bold text-xs">Wallamy Bernardo</div>
                <div className="text-neon text-[10px] font-bold uppercase tracking-widest">Fundador da WB Digital</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
            className="flex flex-wrap items-center gap-10"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-dark bg-dark-3 overflow-hidden relative">
                    <Image 
                      src={`https://picsum.photos/seed/user${i}/100/100`} 
                      alt="User" 
                      fill 
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                +50 negócios atendidos
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-neon text-neon" />)}
              </div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                Avaliação 5 estrelas
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Pain Points Section ---
const PainPoints = () => {
  const points = [
    {
      icon: <Users className="w-8 h-8 text-neon" />,
      title: "Vive só de indicação",
      desc: "Seu negócio depende 100% de indicações. Quando elas somem, a receita despenca junto. Não há previsibilidade nem crescimento escalável."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-neon" />,
      title: "Instagram sem alcance",
      desc: "Você posta todo dia, mas o engajamento é zero. O algoritmo não trabalha para você porque não há estratégia por trás do conteúdo."
    },
    {
      icon: <Award className="w-8 h-8 text-neon" />,
      title: "Concorrente crescendo",
      desc: "Enquanto você hesita, seu concorrente já aparece na primeira página do Google e domina as redes. Cada dia que passa, ele toma mais mercado."
    },
    {
      icon: <Zap className="w-8 h-8 text-neon" />,
      title: "Medo de investir",
      desc: "Já gastou dinheiro com 'agências' que entregaram nada. O medo de perder mais paralisou você. Mas ficar parado tem um custo ainda maior."
    },
    {
      icon: <Clock className="w-8 h-8 text-neon" />,
      title: "Atendimento lento",
      desc: "O cliente pergunta pelo Instagram, WhatsApp, Google… e demora horas para ser respondido. Enquanto isso, já comprou do concorrente."
    },
    {
      icon: <Target className="w-8 h-8 text-neon" />,
      title: "Você se identificou?",
      desc: "Esses problemas têm solução. E começa com uma conversa gratuita.",
      cta: true
    }
  ];

  return (
    <section id="dor" className="py-32 px-5 md:px-10 relative bg-dark-2">
      <div className="grid-bg absolute inset-0 opacity-20" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label"
          >
            A Realidade Dolorosa
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-display text-4xl sm:text-5xl md:text-7xl text-white mb-6"
          >
            A maioria dos negócios locais<br/>
            <span className="text-neon neon-text">hoje vivem assim…</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((point, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "glass p-10 rounded-2xl border border-white/5 hover:border-neon/30 transition-all group",
                point.cta && "bg-neon/5 border-neon/20"
              )}
            >
              <div className="mb-6 group-hover:scale-110 transition-transform duration-500">
                {point.icon}
              </div>
              <h3 className="font-display text-3xl text-white mb-4 uppercase tracking-tight">{point.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">{point.desc}</p>
              {point.cta && (
                <a href="#solucao" className="inline-flex items-center gap-2 text-neon font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all">
                  Quero resolver isso <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Solution Section ---
const Solution = () => {
  const services = [
    {
      icon: <Layout className="w-10 h-10 text-neon" />,
      title: "Sites que Convertem",
      desc: "Páginas rápidas, bonitas e otimizadas para transformar visitante em cliente. Design que convence, botões que vendem.",
      tags: ["Landing pages", "Sites institucionais", "E-commerce"]
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-neon" />,
      title: "Tráfego Pago",
      desc: "Google Ads + Meta Ads gerenciados por especialistas. Segmentação precisa para atingir quem realmente vai comprar de você.",
      tags: ["Google Ads", "Meta Ads", "YouTube Ads"]
    },
    {
      icon: <Instagram className="w-10 h-10 text-neon" />,
      title: "Social Media Estratégico",
      desc: "Conteúdo que educa, engaja e vende. Calendário editorial, artes profissionais e copy persuasivo para Instagram e Facebook.",
      tags: ["Instagram", "Facebook", "TikTok"]
    },
    {
      icon: <Zap className="w-10 h-10 text-neon" />,
      title: "CRM e Automações",
      desc: "Nenhum lead perdido. Funis automáticos de WhatsApp, e-mail e SMS que nutrem o cliente do primeiro contato até a venda.",
      tags: ["WhatsApp", "E-mail", "Funis de vendas"]
    },
    {
      icon: <Globe className="w-10 h-10 text-neon" />,
      title: "Estratégia Mensal",
      desc: "Reuniões mensais de estratégia com análise de dados, ajustes de campanha e planejamento de crescimento. Você nunca navega sozinho.",
      tags: ["Planejamento", "Ajustes", "Crescimento"]
    },
    {
      icon: <BarChart3 className="w-10 h-10 text-neon" />,
      title: "Relatórios Transparentes",
      desc: "Dashboard em tempo real com todos os números. Sabe exatamente cada centavo investido e cada resultado gerado. Zero fumaça.",
      tags: ["Dashboard", "KPIs", "ROI claro"]
    }
  ];

  return (
    <section id="solucao" className="py-32 px-5 md:px-10 bg-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label"
          >
            Nosso Método
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-display text-5xl md:text-7xl text-white mb-6"
          >
            Chega de achismo. Chega de sorte.<br/>
            <span className="text-neon neon-text">Aqui está o Método WB.</span>
          </motion.h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">Um sistema integrado onde cada peça funciona em conjunto para transformar seu negócio local numa máquina de vendas digital.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-10 rounded-3xl border border-white/5 hover:border-neon/20 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-neon/10 transition-all" />
              <div className="mb-8 p-4 bg-neon/5 rounded-2xl border border-neon/10 inline-block group-hover:neon-glow transition-all">
                {service.icon}
              </div>
              <h3 className="font-display text-3xl text-white mb-4 uppercase tracking-tight">{service.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">{service.desc}</p>
              <div className="flex flex-wrap gap-2">
                {service.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-neon bg-neon/10 border border-neon/20 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Founder Results Section ---
const FounderResults = () => {
  const cards = [
    {
      title: "Shopee – De R$ 5 mil para R$ 953 mil em 12 meses",
      text: "Criamos a loja do zero, rodamos campanhas promocionais + Shopee Ads e escalamos o faturamento em +369% em um ano.",
      number: "R$ 953.256",
      caption: "Mesmo método que oferecemos para você agora",
      icon: <ShoppingCart className="w-8 h-8 text-neon" />
    },
    {
      title: "Site Jujuba Kids",
      text: "Criamos o site do zero + tráfego pago (Meta + Google + Remarketing) e geramos mais de R$ 750 mil em vendas diretas ao longo dos anos.",
      number: "+R$ 750.000",
      caption: "Faturamento acumulado em vendas diretas",
      icon: <Globe className="w-8 h-8 text-neon" />
    },
    {
      title: "Record em faturamento",
      text: "Somando loja física, site próprio e Shopee: R$ 1.161.023 faturados em um único ano.",
      number: "R$ 1.161.023",
      caption: "Resultado real usando as mesmas estratégias que instalamos para nossos clientes",
      icon: <Award className="w-8 h-8 text-neon" />
    }
  ];

  return (
    <section id="prova-real" className="py-32 px-5 md:px-10 bg-dark relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon/20 to-transparent" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6 mb-8"
          >
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-neon/30 neon-glow">
              <Image 
                src="/af906f00-2777-491b-be59-2866631f0890.jpg" 
                alt="Wallamy Bernardo" 
                fill 
                className="object-cover object-top"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="section-label">Prova Real do Fundador</div>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-display text-4xl sm:text-5xl md:text-7xl text-white mb-8 leading-[0.9] tracking-tighter"
          >
            Antes de atender clientes, apliquei o método nas minhas próprias empresas e gerei <span className="text-neon neon-text">mais de R$ 1,2 milhão</span> em um único ano.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-10 rounded-[2.5rem] border border-white/5 hover:border-neon/30 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="mb-8 p-4 bg-neon/5 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-500">
                  {card.icon}
                </div>
                <h3 className="font-display text-2xl text-white mb-4 uppercase tracking-tight">{card.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">{card.text}</p>
              </div>
              <div className="pt-8 border-t border-white/5">
                <div className="font-display text-4xl sm:text-5xl text-neon mb-2 neon-text">{card.number}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{card.caption}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Plans Section ---
const Plans = () => {
  const [showAll, setShowAll] = useState(false);
  const plans = [
    {
      name: "Plano X1",
      price: "300",
      traffic: "300",
      desc: "Ideal para quem quer dar o primeiro passo no digital com foco total em WhatsApp e tráfego direto.",
      items: [
        "Configuração da conta de anúncio Meta Ads",
        "Gestão e otimização diária da campanha",
        "Relatórios semanais e mensais detalhados",
        "Análise de KPIs (ROI, cliques, impressões)",
        "Reuniões quinzenais de estratégia",
        "Suporte via WhatsApp"
      ],
      bonus: [
        "Copywriter para os criativos",
        "Designer para os anúncios",
        "Treinamento de atendimento via WhatsApp",
        "Cliente oculto (verificação do atendimento)"
      ]
    },
    {
      name: "Plano Start",
      price: "800",
      traffic: "500",
      desc: "Para negócios que querem estrutura real de anúncios com todos os formatos e campanhas de remarketing.",
      items: [
        "Config. conta Google ou Meta Ads + Pixel",
        "Criação de públicos e audiências segmentados",
        "Anúncios em todos os formatos (feed, stories, reels, YT)",
        "Gestão e otimização diária baseada em dados",
        "Campanhas de Remarketing",
        "Relatórios semanais e mensais + KPIs",
        "Reuniões quinzenais + grupo WhatsApp"
      ],
      bonus: [
        "Planejamento estratégico completo",
        "Copywriter + Designer para criativos",
        "Treinamento de atendimento",
        "Cliente oculto (verificação do processo)"
      ]
    },
    {
      name: "Plano Crescimento",
      price: "1.100",
      traffic: "800",
      featured: true,
      desc: "Gestão completa com atendimento prioritário, análise de concorrentes e Google Meu Negócio incluso.",
      items: [
        "Tudo do Plano Start +",
        "Reuniões semanais de estratégia",
        "WhatsApp Fulltime (prioridade no atendimento)",
        "Google Meu Negócio com posts quinzenais",
        "Atualização mensal de Landing Page"
      ],
      bonus: [
        "Planejamento estratégico completo",
        "Relatório mensal dos concorrentes",
        "Copywriter + Designer para criativos",
        "Treinamento de atendimento",
        "Cliente oculto mensal"
      ]
    },
    {
      name: "Plano Aceleração",
      price: "1.500",
      traffic: "1.200",
      desc: "Para quem quer dominar o digital de forma agressiva: Google + Meta Ads, testes A/B, LAL e muito mais.",
      items: [
        "Tudo do Plano Crescimento +",
        "Testes A/B em criativos e segmentações",
        "Criação de Públicos LAL",
        "Campanhas de Remarketing avançado",
        "Google Meu Negócio com posts semanais",
        "Planner 30 dias de conteúdo IG/FB"
      ],
      bonus: [
        "Pack de artes personalizáveis no Canva",
        "Programa de indicação mensal",
        "Config. WhatsApp Business + etiquetas",
        "Relatório mensal dos concorrentes"
      ]
    },
    {
      name: "Gestão E-commerce",
      price: "1.000",
      traffic: "Variável",
      desc: "Gestão completa da sua loja virtual para vender mais todos os dias.",
      items: [
        "Cadastro de 10 produtos novos/mês",
        "Recuperação de vendas no WhatsApp",
        "Criação de cupons de desconto",
        "Promoções do tipo 'Compre X Leve Y'",
        "Cross-sell estratégico via WhatsApp",
        "Banner novo na home toda semana"
      ],
      bonus: [
        "Análise de funil de conversão",
        "Otimização de checkout",
        "Estratégia de abandono de carrinho",
        "Relatório de performance de produtos"
      ]
    },
    {
      name: "Plano Personalité",
      price: "Custom",
      traffic: "Personalizado",
      isCustom: true,
      desc: "O plano sob medida para o seu negócio. Você escolhe os serviços e nós montamos a estratégia perfeita.",
      items: [
        "Suporte a Marketplaces (Shopee, Mercado Livre, etc)",
        "Gestão de Tráfego Omnichannel",
        "Estratégia de Branding e Posicionamento",
        "Consultoria de Processos de Vendas",
        "Desenvolvimento de Landing Pages",
        "Gestão de Redes Sociais Estratégica"
      ],
      bonus: [
        "Consultoria direta com Wallamy Bernardo",
        "Análise de viabilidade de novos canais",
        "Planejamento de escala agressiva",
        "Suporte VIP 24/7"
      ]
    }
  ];

  const visiblePlans = showAll ? plans : plans.slice(0, 3);

  return (
    <section id="planos" className="py-32 px-5 md:px-10 bg-dark relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-neon/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label"
          >
            Investimento
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-display text-5xl md:text-7xl text-white mb-6"
          >
            Escolha o plano que<br/>
            <span className="text-neon neon-text">acelera seu crescimento</span>
          </motion.h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">Sem contrato de fidelidade. Cancele quando quiser. O investimento em tráfego pago é à parte e vai direto para a plataforma.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          <AnimatePresence mode="popLayout">
            {visiblePlans.map((plan, idx) => (
              <motion.div 
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                layout
                className={cn(
                  "glass p-10 rounded-[2.5rem] border border-white/5 transition-all relative flex flex-col",
                  plan.featured ? "border-neon/40 neon-glow scale-105 z-20 bg-neon/5" : "hover:border-neon/20"
                )}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-neon text-dark text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-xl">
                    Mais Escolhido
                  </div>
                )}
                
                <div className="mb-8">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">{plan.name}</div>
                  <div className="flex items-baseline gap-1 mb-2">
                    {!plan.isCustom && <span className="text-2xl text-white font-bold">R$</span>}
                    <span className={cn(
                      "text-white font-display tracking-tighter",
                      plan.isCustom ? "text-4xl" : "text-6xl"
                    )}>{plan.price}</span>
                    {!plan.isCustom && <span className="text-gray-500 font-bold">/mês</span>}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-neon">
                    {plan.isCustom ? "Investimento conforme demanda" : `+ invest. mín. tráfego: R$ ${plan.traffic}`}
                  </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-8 h-12">{plan.desc}</p>

                <div className="space-y-6 flex-1 mb-10">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-neon mb-4">Entregáveis</div>
                    <ul className="space-y-3">
                      {plan.items.map(item => (
                        <li key={item} className="flex items-start gap-3 text-xs text-gray-300">
                          <CheckCircle2 className="w-4 h-4 text-neon shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-yellow-500 mb-4">🎁 Bônus</div>
                    <ul className="space-y-3">
                      {plan.bonus.map(item => (
                        <li key={item} className="flex items-start gap-3 text-xs text-gray-400">
                          <Star className="w-4 h-4 text-yellow-500 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <a 
                  href="#cta" 
                  className={cn(
                    "w-full py-5 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all text-center",
                    plan.featured ? "bg-neon text-dark hover:bg-neon/90 neon-glow" : "bg-white/5 text-white border border-white/10 hover:bg-neon hover:text-dark hover:border-neon"
                  )}
                >
                  Quero esse plano
                </a>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {!showAll && (
          <div className="mt-16 text-center">
            <button 
              onClick={() => setShowAll(true)}
              className="group flex items-center gap-3 mx-auto px-8 py-4 rounded-full border border-white/10 hover:border-neon/40 hover:bg-neon/5 transition-all"
            >
              <span className="text-sm font-bold uppercase tracking-widest text-white group-hover:text-neon">Ver todos os planos</span>
              <ChevronDown className="w-4 h-4 text-neon group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// --- Testimonials Section ---
const Testimonials = () => {
  const testimonials = [
    {
      name: "Solange Ferreira",
      role: "Maceió/AL",
      text: "Nossa operação online está toda com a WB Digital, trabalhamos nesta parceria há anos e sempre fomos muito bem atendidos, já fizeram do site à entrada em marketplaces, do cartão de visita à fachada da loja, muito bom ter um parceiro de confiança.",
      initials: "SF",
      image: "/solange.png"
    },
    {
      name: "Marluce Bolina",
      role: "Belo Horizonte/MG",
      text: "Sempre quis entrar para o online mas como sempre fui avessa a tecnologia tudo parecia impossível, até WB Digital aparecer na minha vida, estamos bem felizes com o início de nossa operação",
      initials: "MB",
      image: "/marluce.png"
    },
    {
      name: "José Fabiano",
      role: "Maceió/AL",
      text: "Conheço o dono há muito tempo, quando pensamos em montar o projeto da fábrica já fechamos toda parte de designe e social media com a WB, agora estamos estruturando para montar nosso site de atacado e tráfego pago para acelerar as vendas, top demais o trabalho do pessoal.",
      initials: "JF",
      image: "/fabiano.png"
    }
  ];

  return (
    <section id="depoimentos" className="py-32 px-5 md:px-10 bg-dark-2">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label"
          >
            Quem já transformou
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-display text-5xl md:text-7xl text-white mb-6"
          >
            O que nossos clientes<br/>
            <span className="text-neon neon-text">falam da WB Digital</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-10 rounded-3xl border border-white/5 hover:border-neon/20 transition-all group"
            >
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-neon text-neon" />)}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-8 italic">&quot;{item.text}&quot;</p>
              <div className="flex items-center gap-4 pt-8 border-t border-white/5">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neon/10 border border-neon/20 flex items-center justify-center font-bold text-neon group-hover:bg-neon group-hover:text-dark transition-all">
                  <span className="absolute inset-0 flex items-center justify-center z-0">{item.initials}</span>
                  {item.image && (
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover z-10 group-hover:opacity-0 transition-opacity duration-300"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        const target = e.target as any;
                        target.style.display = 'none';
                      }}
                    />
                  )}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{item.name}</div>
                  <div className="text-gray-500 text-[10px] uppercase tracking-widest">{item.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- About Section ---
const About = () => {
  return (
    <section id="sobre" className="py-32 px-5 md:px-10 bg-dark">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden border-2 border-neon/20 neon-glow">
              <Image 
                src="/af906f00-2777-491b-be59-2866631f0890.jpg" 
                alt="Wallamy Bernardo" 
                fill 
                className="object-cover object-top"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 glass rounded-3xl flex items-center justify-center border border-neon/30 neon-glow">
              <span className="font-display text-6xl text-neon">WB</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="section-label">Fundador</div>
            <h2 className="font-display text-5xl md:text-7xl text-white mb-6 uppercase tracking-tight">Wallamy Bernardo</h2>
            <div className="text-neon font-bold text-xs tracking-[0.3em] uppercase mb-8">Especialista em Marketing Digital</div>
            
            <div className="space-y-6 text-gray-400 leading-relaxed text-sm mb-12">
              <p>Wallamy Bernardo é especialista em transformar negócios locais em máquinas de vendas digitais. Com mais de <span className="text-white font-bold">8 anos de experiência</span> em estratégia digital, tráfego pago e growth hacking, ele fundou a WB Digital Hub com uma missão clara: democratizar o acesso ao marketing de alta performance para negócios brasileiros.</p>
              <p>Trabalha com desde clínicas e restaurantes até e-commerces e construtoras em todo o Brasil, entregando resultados mensuráveis e estratégias personalizadas para cada tipo de negócio.</p>
              <p className="text-white font-bold text-lg italic">&quot;Sua filosofia é simples: resultado mensurável ou não merece seu dinheiro.&quot;</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Clientes", val: "50+" },
                { label: "Anos Exp.", val: "8+" },
                { label: "ROI Médio", val: "4x" }
              ].map(stat => (
                <div key={stat.label} className="glass p-6 rounded-2xl text-center border border-neon/10">
                  <div className="font-display text-3xl text-neon mb-1">{stat.val}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- FAQ Section ---
const FAQ = () => {
  const faqs = [
    {
      q: "Preciso assinar um contrato longo de fidelidade?",
      a: "Não. Na WB Digital Hub trabalhamos sem contratos de fidelidade. Você pode cancelar a qualquer momento com 30 dias de aviso prévio. Acreditamos que a melhor forma de fidelizar clientes é entregando resultados, não prendendo com papel."
    },
    {
      q: "Em quanto tempo vejo os primeiros resultados?",
      a: "Com tráfego pago, os primeiros resultados aparecem em 7 a 14 dias após o início das campanhas. Com SEO e social media, os resultados são progressivos e mais sólidos, normalmente entre 30 e 90 dias. Você verá sinais de melhora desde o primeiro mês."
    },
    {
      q: "Vocês atendem empresas fora de Maceió?",
      a: "Sim! Atendemos negócios em todo o Brasil. Nossa estrutura é 100% digital e temos clientes em diversas regiões do país, entregando a mesma qualidade e performance independente da localização."
    },
    {
      q: "Existe alguma garantia de resultado?",
      a: "Nenhuma agência séria pode garantir um número específico de vendas, pois isso depende de muitos fatores externos. O que garantimos é: estratégia baseada em dados, transparência total, relatórios semanais e dedicação máxima."
    }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" className="py-32 px-5 md:px-10 bg-dark-2">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label"
          >
            Dúvidas
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-display text-5xl md:text-7xl text-white mb-6"
          >
            Perguntas<br/>
            <span className="text-neon neon-text">Frequentes</span>
          </motion.h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass rounded-2xl overflow-hidden border border-white/5">
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-bold text-white text-sm md:text-base">{faq.q}</span>
                <div className={cn("w-8 h-8 rounded-full bg-neon/10 flex items-center justify-center text-neon transition-transform duration-300", openIdx === idx && "rotate-45")}>
                  <Plus className="w-5 h-5" />
                </div>
              </button>
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-gray-400 text-sm leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- CTA Section ---
const CTA = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    businessType: '',
    website: '',
    revenue: '',
    mainGoal: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.whatsapp || !formData.businessType || !formData.email) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    const path = 'leads';
    try {
      // 1. Save to Firestore
      await addDoc(collection(db, path), {
        ...formData,
        createdAt: serverTimestamp()
      });

      // 2. Prepare WhatsApp message
      const message = `*Novo Lead WB Digital*%0A%0A*Nome:* ${formData.name}%0A*Email:* ${formData.email}%0A*WhatsApp:* ${formData.whatsapp}%0A*Negócio:* ${formData.businessType}%0A*Website/Rede:* ${formData.website || 'Não informado'}%0A*Objetivo:* ${formData.mainGoal}%0A*Faturamento:* ${formData.revenue || 'Não informado'}`;
      const whatsappUrl = `https://wa.me/5582988352548?text=${message}`;

      setSuccess(true);
      setLoading(false);

      // 3. Redirect to WhatsApp (using location.href to avoid popup blockers)
      window.location.href = whatsappUrl;
      
      // Reset form
      setFormData({ name: '', email: '', whatsapp: '', businessType: '', website: '', revenue: '', mainGoal: '' });
    } catch (error) {
      setLoading(false);
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  return (
    <section id="cta" className="py-32 px-5 md:px-10 bg-dark relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="section-label mb-8">Análise Gratuita</div>
          <h2 className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-white leading-[0.85] tracking-tighter mb-8">
            Pronto para parar de perder<br/>
            <span className="text-neon neon-text">clientes para o concorrente?</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg mb-16">Preencha abaixo e nossa equipe entra em contato em até 2 horas com uma análise personalizada do seu negócio.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass p-10 md:p-16 rounded-[3rem] border border-neon/20 max-w-2xl mx-auto text-left relative"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon to-transparent" />
          
          {success ? (
            <div className="text-center py-10">
              <CheckCircle2 className="w-20 h-20 text-neon mx-auto mb-6" />
              <h3 className="text-white font-display text-3xl mb-4">Dados Enviados!</h3>
              <p className="text-gray-400 mb-8">Obrigado pelo interesse. Estamos analisando seu perfil e entraremos em contato em breve.</p>
              <button 
                onClick={() => setSuccess(false)}
                className="text-neon font-bold uppercase text-xs tracking-widest border border-neon/30 px-6 py-3 rounded-md hover:bg-neon/5 transition-all"
              >
                Enviar outro formulário
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2">Seu nome</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: João Silva"
                    className="w-full bg-dark-3 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2">Seu melhor E-mail</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="joao@exemplo.com"
                    className="w-full bg-dark-3 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2">WhatsApp</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    placeholder="(82) 9 9999-9999"
                    className="w-full bg-dark-3 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2">Website ou Rede Social</label>
                  <input 
                    type="text" 
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    placeholder="www.seusite.com.br ou @suaempresa"
                    className="w-full bg-dark-3 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2">Tipo de negócio</label>
                <select 
                  required
                  value={formData.businessType}
                  onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                  className="w-full bg-dark-3 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Selecione seu segmento</option>
                  <option>Clínica / Saúde</option>
                  <option>Restaurante / Bar / Delivery</option>
                  <option>Loja / Comércio</option>
                  <option>Imobiliária / Construtora</option>
                  <option>Advocacia / Consultoria</option>
                  <option>Serviços em geral</option>
                  <option>E-commerce</option>
                  <option>Outro</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2">Qual seu objetivo principal? (Em poucas palavras)</label>
                <textarea 
                  required
                  value={formData.mainGoal}
                  onChange={(e) => setFormData({...formData, mainGoal: e.target.value})}
                  placeholder="Conte-nos o que você busca alcançar..."
                  rows={3}
                  className="w-full bg-dark-3 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2">Faturamento mensal atual (opcional)</label>
                <select 
                  value={formData.revenue}
                  onChange={(e) => setFormData({...formData, revenue: e.target.value})}
                  className="w-full bg-dark-3 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Selecione</option>
                  <option>Até R$10.000</option>
                  <option>R$10k – R$30k</option>
                  <option>R$30k – R$100k</option>
                  <option>R$100k – R$500k</option>
                  <option>Acima de R$500k</option>
                </select>
              </div>

              <button 
                disabled={loading}
                className="w-full bg-neon text-dark font-bold text-base uppercase tracking-widest py-6 rounded-2xl hover:neon-glow transition-all active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Receber minha análise gratuita →'}
              </button>
            </form>
          )}
          
          <p className="text-center text-[10px] text-gray-600 uppercase tracking-widest mt-6">
            🔒 Seus dados estão 100% seguros. Prometemos não enviar spam.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// --- Footer Component ---
const Footer = () => {
  return (
    <footer className="bg-dark-2 border-t border-white/5 py-20 px-5 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-2">
            <a href="#hero" className="flex items-center mb-8">
              <div className="relative w-56 h-14">
                <Image 
                  src="/logo_wb_digital_358_px.png" 
                  alt="WB Digital Logo" 
                  fill 
                  className="object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </a>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-8">
              Transformando negócios locais em máquinas de vendas digitais em todo o Brasil.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/wbdigitaloficial" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-neon hover:border-neon/30 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61572906634566" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-neon hover:border-neon/30 transition-all">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-8">Navegação</h4>
            <ul className="space-y-4">
              {['Solução', 'Planos', 'Depoimentos', 'FAQ'].map(item => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-sm text-gray-500 hover:text-neon transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-8">Políticas</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-neon transition-colors">Política de Privacidade</Link>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-neon transition-colors">Termos de Uso</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-8">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-gray-500">
                <Globe className="w-4 h-4 text-neon" /> Atendimento em todo o Brasil
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500">
                <Phone className="w-4 h-4 text-neon" /> (82) 98835-2548
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500">
                <Instagram className="w-4 h-4 text-neon" /> @wbdigitaloficial
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500">
                <MessageSquare className="w-4 h-4 text-neon" /> contato@wbdigitalhub.com.br
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest">
            © 2026 WB Digital Hub – Todos os direitos reservados.
          </p>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest flex items-center gap-2">
            Desenvolvido com <Zap className="w-3 h-3 text-neon" />
          </p>
        </div>
      </div>
    </footer>
  );
};

// --- WhatsApp Float ---
const WhatsAppFloat = () => {
  return (
    <a 
      href="https://wa.me/5582988352548?text=Quero%20minha%20an%C3%A1lise%20gratuita!" 
      target="_blank" 
      rel="noopener"
      className="fixed bottom-8 right-8 z-[90] w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group"
    >
      <div className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-20" />
      <MessageSquare className="w-8 h-8 text-white fill-white" />
    </a>
  );
};

// --- Main Page Component ---
export default function Page() {
  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();
  }, []);

  return (
    <ErrorBoundary>
      <main className="relative bg-dark selection:bg-neon selection:text-dark">
        <Navbar />
        <Hero />
        <PainPoints />
        <Solution />
        <FounderResults />
        <Plans />
        <Testimonials />
        <About />
        <FAQ />
        <CTA />
        <Footer />
        <WhatsAppFloat />
      </main>
    </ErrorBoundary>
  );
}
