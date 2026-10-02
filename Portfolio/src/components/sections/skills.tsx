"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { portfolioData } from "@/lib/portfolio-data";
import { Code, Server, Brain, Zap, BookOpen, Award } from "lucide-react";

const skillCategories = [
  { key: "frontend", label: "Frontend", icon: Code, color: "primary" },
  { key: "backend", label: "Backend", icon: Server, color: "tech" },
  { key: "ai", label: "AI/GenAI", icon: Brain, color: "accent" },
  { key: "fintech", label: "Fintech", icon: Zap, color: "wealth" },
] as const;

type SkillCategoryKey = typeof skillCategories[number]["key"];

export function Skills() {
  const [activeTab, setActiveTab] = React.useState<SkillCategoryKey>("frontend");

  return (
    <section
      id="skills"
      className="section bg-gradient-to-b from-background to-muted/50"
      aria-labelledby="skills-heading"
    >
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="badge-tech inline-block mb-4">Technical Expertise</span>
          <h2 id="skills-heading" className="text-display-lg font-display font-bold mb-4">
            Skills & Technologies
          </h2>
          <p className="text-body-lg text-muted-foreground">
            Deep expertise across the full stack with specialized knowledge in fintech systems
            and emerging AI technologies.
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as SkillCategoryKey)} className="w-full">
          <TabsList className="mb-10 justify-center bg-muted/50 rounded-xl p-1 w-fit mx-auto" aria-label="Skill categories">
            {skillCategories.map(({ key, label, icon: Icon, color }) => (
              <TabsTrigger
                key={key}
                value={key}
                className={cn(
                  "gap-2 px-6 py-2",
                  activeTab === key && "bg-background shadow-elevation-1"
                )}
              >
                <Icon className={cn("h-4 w-4", color === "primary" ? "text-primary" : color === "tech" ? "text-tech-500" : color === "wealth" ? "text-wealth-500" : "text-accent")} aria-hidden="true" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {skillCategories.map(({ key }) => (
            <TabsContent key={key} value={key} className="animate-in fade-in-200">
              <SkillCategory category={key} />
            </TabsContent>
          ))}
        </Tabs>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16"
        >
          <Certifications />
        </motion.div>
      </div>
    </section>
  );
}

function SkillCategory({ category }: { category: SkillCategoryKey }) {
  const skills = portfolioData.skills[category];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {skills.map((skill, index) => (
        <motion.div
          key={skill.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: index * 0.05 }}
          className="card-elevated p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Code className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{skill.name}</h4>
                <p className="text-xs text-muted-foreground capitalize">{skill.category}</p>
              </div>
            </div>
            <Badge variant={category === "frontend" ? "default" : category === "backend" ? "tech" : category === "ai" ? "tech" : "wealth"} className="text-xs">
              {skill.level}%
            </Badge>
          </div>

          <Progress value={skill.level} className="h-2" aria-label={`${skill.name} proficiency: ${skill.level}%`} />

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {skill.level >= 90 ? "Expert" : skill.level >= 80 ? "Advanced" : skill.level >= 70 ? "Proficient" : "Intermediate"}
            </span>
            <span className="text-xs font-mono text-primary">{skill.level}%</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function Certifications() {
  const certs = portfolioData.certifications;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" aria-hidden="true" />
            Education & Certifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4" role="list">
            {certs.map((cert) => (
              <li key={cert.name} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                <Award className="h-6 w-6 text-primary/50 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-foreground">{cert.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {cert.issuer} • {cert.year}
                    {cert.details && ` • ${cert.details}`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" aria-hidden="true" />
            Open to Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3" role="list">
            {portfolioData.openTo.map((role, index) => (
              <li key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Award className="h-5 w-5 text-primary/50 shrink-0" aria-hidden="true" />
                <p className="text-sm text-foreground">{role}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}