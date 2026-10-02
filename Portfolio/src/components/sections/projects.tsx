"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { portfolioData } from "@/lib/portfolio-data";
import { Github, ExternalLink, ArrowRight, Star, Shield, Zap, Brain, Code2 } from "lucide-react";
import Link from "next/link";

const categoryIcons = {
  Fintech: DollarSign,
  "AI/GenAI": Brain,
  "Frontend Engineering": Code2,
  "Fintech + AI": Zap,
};

function DollarSign({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

const categoryColors = {
  Fintech: "wealth",
  "AI/GenAI": "tech",
  "Frontend Engineering": "neutral",
  "Fintech + AI": "tech",
};

export function Projects() {
  const featuredProjects = portfolioData.projects.filter((p) => p.featured);
  const otherProjects = portfolioData.projects.filter((p) => !p.featured);

  return (
    <section
      id="projects"
      className="section"
      aria-labelledby="projects-heading"
    >
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="badge-tech inline-block mb-4">Featured Work</span>
          <h2 id="projects-heading" className="text-display-lg font-display font-bold mb-4">
            Projects
          </h2>
          <p className="text-body-lg text-muted-foreground">
            A curated selection of professional and personal projects spanning fintech platforms,
            AI/GenAI systems, and frontend engineering.
          </p>
        </motion.div>

        <Tabs defaultValue="featured" className="w-full">
          <TabsList className="mb-10 justify-center bg-muted/50 rounded-xl p-1 w-fit mx-auto">
            <TabsTrigger value="featured" className="px-6 py-2">
              Featured ({featuredProjects.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="px-6 py-2">
              All Projects ({portfolioData.projects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="featured" className="animate-in fade-in">
            <ProjectGrid projects={featuredProjects} />
          </TabsContent>

          <TabsContent value="all" className="animate-in fade-in">
            <ProjectGrid projects={portfolioData.projects} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

function ProjectGrid({ projects }: { projects: typeof portfolioData.projects }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}

function ProjectCard({ project, index }: { project: typeof portfolioData.projects[0]; index: number }) {
  const CategoryIcon = categoryIcons[project.category as keyof typeof categoryIcons] || Code2;
  const categoryColor = categoryColors[project.category as keyof typeof categoryColors] || "neutral";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <Card className="card-interactive h-full flex flex-col overflow-hidden">
        <div className="relative aspect-video overflow-hidden bg-muted/50">
          <div className="absolute inset-0 flex items-center justify-center">
            <CategoryIcon className="h-16 w-16 text-muted-foreground/30 group-hover:scale-110 transition-transform duration-500" aria-hidden="true" />
          </div>
          <div className="absolute top-3 right-3 flex gap-1">
            <Badge variant={categoryColor as any} className="text-xs">
              {project.category}
            </Badge>
            {project.featured && (
              <Badge variant="wealth" className="text-xs">
                <Star className="h-3 w-3 mr-1" aria-hidden="true" />Featured
              </Badge>
            )}
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-3 mb-2">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">{project.title}</CardTitle>
            {project.type === "Personal" && (
              <Shield className="h-4 w-4 text-muted-foreground/50 shrink-0 mt-0.5" aria-label="Personal project" />
            )}
          </div>
          <CardDescription className="text-body-md line-clamp-2">{project.description}</CardDescription>
        </CardHeader>

        <CardContent className="flex-1 pt-2">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, 5).map((tech) => (
              <Badge key={tech} variant="neutral" className="text-xs gap-1">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 5 && (
              <Badge variant="neutral" className="text-xs">+{project.technologies.length - 5}</Badge>
            )}
          </div>

          <div className="space-y-2">
            {project.highlights.slice(0, 3).map((highlight, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <ArrowRight className="h-4 w-4 text-primary/70 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="pt-0 border-t border-border/50">
          <div className="flex flex-wrap gap-2 w-full">
            {project.links.github && (
              <Button variant="ghost" size="sm" asChild className="flex-1 sm:flex-initial justify-center gap-1">
                <Link href={project.links.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Code</span>
                </Link>
              </Button>
            )}
            {project.links.demo && (
              <Button variant="ghost" size="sm" asChild className="flex-1 sm:flex-initial justify-center gap-1">
                <Link href={project.links.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Demo</span>
                </Link>
              </Button>
            )}
            {project.links.caseStudy && (
              <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-initial justify-center gap-1">
                <Link href={project.links.caseStudy}>
                  Case Study
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.article>
  );
}