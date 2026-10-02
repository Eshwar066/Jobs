"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Terminal, Zap, Brain, TrendingUp } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";

const highlights = [
  { icon: TrendingUp, label: "100K+", desc: "Daily Active Users" },
  { icon: Zap, label: "<100ms", desc: "Real-time Latency" },
  { icon: Brain, label: "3+", desc: "Years Experience" },
  { icon: Terminal, label: "5", desc: "Production Systems" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden" aria-labelledby="hero-heading">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl animate-pulse-subtle" />
      </div>

      <div className="container-wide relative z-10 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-6 flex items-center justify-center lg:justify-start gap-3"
            >
              <span className="badge-tech px-3 py-1">SDE2 @ Nuvama Wealth</span>
              <span className="badge-wealth px-3 py-1">Fintech & WealthTech</span>
              <span className="badge-tech px-3 py-1">AI/GenAI Explorer</span>
            </motion.div>

            <motion.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
              className="text-display-xl font-display font-bold text-balance mb-6"
            >
              Building <span className="gradient-text">Scalable Fintech</span>{" "}
              <br />
              Platforms & Exploring the{" "}
              <span className="gradient-text-tech">AI Frontier</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="text-body-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 text-balance"
            >
              {portfolioData.summary.currentRole} with {portfolioData.summary.experience} experience in{" "}
              <strong className="text-foreground">{portfolioData.summary.domain}</strong>. Architecting
              real-time, data-heavy applications for equity, NCD, and IPO products. Currently expanding
              into Python, FastAPI, and GenAI—building RAG systems, AI agents, and LLM-powered tools.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12"
            >
              <Button size="xl" asChild className="group">
                <Link href="#projects">
                  View Projects
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link href="#contact">Get in Touch</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
              className="grid grid-cols-2 gap-6 md:grid-cols-4"
              role="list"
              aria-label="Key metrics"
            >
              {highlights.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                  className="text-center p-4 rounded-xl bg-card border border-border/50"
                  role="listitem"
                >
                  <item.icon className="h-6 w-6 text-primary mx-auto mb-2" aria-hidden="true" />
                  <div className="text-2xl sm:text-3xl font-display font-bold text-foreground">{item.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{item.desc}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <CodeTerminal />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float"
        aria-hidden="true"
      >
        <svg className="h-6 w-6 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
}

function CodeTerminal() {
  const lines = [
    { prompt: "eshwar@portfolio:~$", command: "whoami", output: "Senior Frontend Engineer" },
    { prompt: "eshwar@portfolio:~$", command: "cat .profile", output: "Fintech | WealthTech | Real-time Systems" },
    { prompt: "eshwar@portfolio:~$", command: "python3 --version", output: "Python 3.11.5  •  FastAPI 0.109" },
    { prompt: "eshwar@portfolio:~$", command: "npm list --depth=0", output: "react@18 • typescript@5 • tailwind@3" },
    { prompt: "eshwar@portfolio:~$", command: "git status", output: "Building: RAG • Agents • LLM Apps" },
    { prompt: "eshwar@portfolio:~$", command: "_", output: "", typing: true },
  ];

  return (
    <div className="relative rounded-xl border border-border/50 bg-card overflow-hidden shadow-elevation-4 max-w-xl mx-auto">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/50">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/80" aria-hidden="true" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" aria-hidden="true" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" aria-hidden="true" />
        </div>
        <div className="ml-4 flex-1 text-xs text-muted-foreground font-mono">terminal.zsh — zsh — 80×24</div>
      </div>
      <div className="p-4 font-mono text-sm text-foreground overflow-x-auto" style={{ fontFamily: "var(--font-mono)" }}>
        <div className="space-y-2">
          {lines.map((line, index) => (
            <TerminalLine key={index} line={line} delay={index * 0.3} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TerminalLine({ line, delay }: { line: typeof lines[0]; delay: number }) {
  const [showCommand, setShowCommand] = React.useState(false);
  const [showOutput, setShowOutput] = React.useState(false);

  React.useEffect(() => {
    const timer1 = setTimeout(() => setShowCommand(true), delay * 1000 + 300);
    const timer2 = setTimeout(() => setShowOutput(true), delay * 1000 + 800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [delay]);

  return (
    <div className="flex gap-3" style={{ opacity: showCommand ? 1 : 0, transition: "opacity 0.3s" }}>
      <span className="text-primary font-medium whitespace-nowrap shrink-0">{line.prompt}</span>
      <span className="text-foreground whitespace-pre-wrap">{showCommand ? line.command : ""}</span>
      {line.output && showOutput && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-muted-foreground whitespace-pre-wrap block"
        >
          {line.output}
        </motion.span>
      )}
      {line.typing && showCommand && (
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-primary"
        >
          █
        </motion.span>
      )}
    </div>
  );
}