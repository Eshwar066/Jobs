"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { portfolioData } from "@/lib/portfolio-data";
import { Mail, Linkedin, Github, MapPin, Phone, Send, Loader2, CheckCircle } from "lucide-react";

export function Contact() {
  const [formState, setFormState] = React.useState<"idle" | "submitting" | "success">("idle");
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setFormState("success");
    setFormData({ name: "", email: "", subject: "", message: "" });

    setTimeout(() => setFormState("idle"), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section
      id="contact"
      className="section bg-gradient-to-b from-background to-muted/50"
      aria-labelledby="contact-heading"
    >
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="badge-tech inline-block mb-4">Let's Connect</span>
          <h2 id="contact-heading" className="text-display-lg font-display font-bold mb-4">
            Get in Touch
          </h2>
          <p className="text-body-lg text-muted-foreground">
            Open to opportunities, collaborations, or just a chat about fintech, AI, or frontend engineering.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h3 className="text-display-sm font-display font-bold mb-6">Let's Build Something</h3>
            <p className="text-body-lg text-muted-foreground mb-8">
              I'm always interested in hearing about challenging problems in fintech, real-time systems,
              or AI applications. Whether you're hiring, have a project in mind, or want to discuss
              technology—feel free to reach out.
            </p>

            <div className="space-y-6 mb-10">
              {[
                { icon: Mail, label: "Email", value: portfolioData.email, href: `mailto:${portfolioData.email}` },
                { icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/eshwar", href: portfolioData.social.linkedin },
                { icon: Github, label: "GitHub", value: "github.com/eshwar", href: portfolioData.social.github },
                { icon: Phone, label: "Phone", value: portfolioData.phone, href: `tel:${portfolioData.phone}` },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <item.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-medium text-foreground">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>

            <Card className="card-elevated border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{portfolioData.location}</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Open to Remote / Hybrid / On-site</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                        disabled={formState !== "idle"}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                        disabled={formState !== "idle"}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      required
                      disabled={formState !== "idle"}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project, role, or just say hi..."
                      rows={5}
                      required
                      disabled={formState !== "idle"}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={formState !== "idle"}>
                    {formState === "submitting" && (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" aria-hidden="true" />
                        Sending...
                      </>
                    )}
                    {formState === "success" && (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" aria-hidden="true" />
                        Message Sent!
                      </>
                    )}
                    {formState === "idle" && (
                      <>
                        Send Message
                        <Send className="h-5 w-5 ml-2" aria-hidden="true" />
                      </>
                    )}
                  </Button>

                  {formState === "success" && (
                    <p className="text-sm text-green-500 text-center">
                      Thanks for reaching out! I'll get back to you soon.
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}