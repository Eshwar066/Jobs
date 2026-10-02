"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { portfolioData } from "@/lib/portfolio-data";
import { Mail, MapPin, Calendar, Code, Brain, TrendingUp, BookOpen, Users } from "lucide-react";

const stats = [
  { icon: TrendingUp, value: "100K+", label: "Users Served Daily" },
  { icon: Code, value: "3+", label: "Years Experience" },
  { icon: Brain, value: "6", label: "Production Systems" },
  { icon: Users, value: "5", label: "Product Teams Led" },
];

const values = [
  {
    icon: Code,
    title: "Craftsmanship",
    description: "Clean, maintainable code with attention to detail. Type-safe by default, tested thoroughly.",
  },
  {
    icon: TrendingUp,
    title: "Performance First",
    description: "Sub-100ms latency targets. Core Web Vitals optimization. Real-time data synchronization.",
  },
  {
    icon: Brain,
    title: "Continuous Learning",
    description: "Expanding into Python, FastAPI, GenAI. Building RAG systems, agents, LLM applications.",
  },
  {
    icon: Users,
    title: "Team Enablement",
    description: "Design systems, shared tooling, mentoring. Multi-product component library adoption.",
  },
];

export function About() {
  return (
    <section
      id="about"
      className="section"
      aria-labelledby="about-heading"
    >
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="badge-tech inline-block mb-4">About Me</span>
          <h2 id="about-heading" className="text-display-lg font-display font-bold mb-4">
            About
          </h2>
          <p className="text-body-lg text-muted-foreground">
            Senior Frontend Engineer passionate about building scalable fintech platforms
            and exploring the cutting edge of AI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="grid lg:grid-cols-3 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              className="text-center p-6 rounded-2xl bg-card border border-border/50"
            >
              <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" aria-hidden="true" />
              <div className="text-3xl sm:text-4xl font-display font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h3 className="text-display-sm font-display font-bold mb-6">What I Do</h3>
            <div className="space-y-6">
              <div className="flex gap-4 p-6 rounded-xl bg-card border border-border/50">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Code className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Frontend Architecture</h4>
                  <p className="text-muted-foreground text-body-md">
                    Designing scalable React/TypeScript applications with micro-frontend architecture,
                    real-time WebSocket infrastructure, and comprehensive design systems.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-6 rounded-xl bg-card border border-border/50">
                <div className="w-12 h-12 rounded-lg bg-wealth-500/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-6 w-6 text-wealth-500" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Fintech Domain Expertise</h4>
                  <p className="text-muted-foreground text-body-md">
                    Deep knowledge of equity trading, fixed income (NCDs), IPO systems, regulatory compliance
                    (SEBI/RBI), portfolio analytics, and risk management.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-6 rounded-xl bg-card border border-border/50">
                <div className="w-12 h-12 rounded-lg bg-tech-500/10 flex items-center justify-center shrink-0">
                  <Brain className="h-6 w-6 text-tech-500" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">AI/GenAI Engineering</h4>
                  <p className="text-muted-foreground text-body-md">
                    Building production RAG systems, multi-agent frameworks, LLM-powered tools,
                    and exploring fine-tuning, evaluation, and deployment pipelines.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h3 className="text-display-sm font-display font-bold mb-6">Core Values</h3>
            <div className="space-y-4">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-5 rounded-xl bg-card border border-border/50 hover:border-primary/20 transition-all"
                >
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <value.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{value.title}</h4>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h3 className="text-display-sm font-display font-bold text-center mb-10">Currently Exploring</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Brain, label: "LLM Fine-tuning", desc: "LoRA/QLoRA techniques" },
              { icon: BookOpen, label: "RAG Evaluation", desc: "RAGAS, custom metrics" },
              { icon: Users, label: "Multi-agent Systems", desc: "LangGraph, AutoGen patterns" },
              { icon: TrendingUp, label: "Vector Databases", desc: "pgvector, Pinecone, Weaviate" },
              { icon: Code, label: "Python Ecosystem", desc: "FastAPI, Pydantic, Polars" },
              { icon: BookOpen, label: "MLOps/LLMOps", desc: "MLflow, observability" },
              { icon: Users, label: "Agent Frameworks", desc: "Tool use, planning, memory" },
              { icon: TrendingUp, label: "Real-time AI", desc: "Streaming, edge inference" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-5 rounded-xl bg-card border border-border/50 text-center hover:border-primary/20 transition-all"
              >
                <item.icon className="h-7 w-7 text-primary mx-auto mb-3" aria-hidden="true" />
                <h4 className="font-semibold text-foreground mb-1">{item.label}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}