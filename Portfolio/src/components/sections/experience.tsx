"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { portfolioData } from "@/lib/portfolio-data";
import { CheckCircle, ChevronRight, Building2, Code, Database, Globe } from "lucide-react";

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function Experience() {
  return (
    <section
      id="experience"
      className="section bg-gradient-to-b from-background to-muted/50"
      aria-labelledby="experience-heading"
    >
      <div className="container-wide">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="badge-tech inline-block mb-4"
          >
            Professional Journey
          </motion.span>
          <motion.h2
            id="experience-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-display-lg font-display font-bold mb-4"
          >
            Experience
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-body-lg text-muted-foreground"
          >
            Leading frontend architecture for wealth management platforms serving 100K+ users.
            Building real-time trading interfaces, portfolio analytics, and regulatory-compliant financial products.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          className="space-y-8"
        >
          {(portfolioData.experience as ExperienceItem[]).map((exp, index) => (
            <ExperienceCard key={exp.id} experience={exp} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  duration: string;
  location: string;
  type: string;
  description: string;
  achievements: string[];
  technologies: string[];
  products?: {
    name: string;
    description: string;
    metrics: string;
  }[];
}

function ExperienceCard({ experience, index }: { experience: ExperienceItem; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        "relative rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-300 hover:border-primary/20 hover:shadow-elevation-3",
        isEven ? "lg:flex-row" : "lg:flex-row-reverse"
      )}
    >
      <div className={cn("relative lg:w-2/5 p-6 lg:p-8 flex items-center justify-center", isEven ? "border-r border-border/50" : "border-l border-border/50")}>
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{experience.period}</p>
              <p className="text-sm font-medium text-foreground">{experience.duration} • {experience.type}</p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-foreground mb-2">{experience.role}</h3>
          <p className="text-lg text-primary font-medium mb-4">{experience.company}</p>
          <p className="text-muted-foreground text-body-md mb-6">{experience.location}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {experience.technologies.slice(0, 6).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {experience.technologies.length > 6 && (
              <Badge variant="secondary" className="text-xs">
                +{experience.technologies.length - 6} more
              </Badge>
            )}
          </div>

          <div className="space-y-3">
            {experience.achievements.slice(0, 3).map((achievement, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span>{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={cn("flex-1 p-6 lg:p-8", isEven ? "lg:pl-8" : "lg:pr-8")}>
        <p className="text-body-md text-muted-foreground mb-6">{experience.description}</p>

        {experience.products && experience.products.length > 0 && (
          <div className="space-y-4">
            <h4 className="heading-sm text-foreground">Key Products</h4>
            <div className="space-y-3">
              {experience.products.map((product, i) => (
                <motion.div key={product.name + i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h5 className="font-semibold text-foreground mb-1">{product.name}</h5>
                      <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                      <span className="badge-wealth text-xs">{product.metrics}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" aria-hidden="true" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}