"use client";

import { motion } from 'framer-motion';
import { Rocket, Lightbulb, Workflow, Zap, ShieldCheck, DollarSign } from 'lucide-react';
import Link from 'next/link';

const featureVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Page = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <motion.section 
        className="relative overflow-hidden py-20 md:py-40 text-center bg-gradient-to-br from-slate-900 to-indigo-950 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <img src="/hero-bg.png" alt="Futuristic AI Background" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="flex items-center justify-center mb-6"
          >
            <Zap className="h-20 w-20 text-foreground animate-pulse-slow" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight mb-6"
          >
            SynaPath AI
            <br />Autonomous IT Incident Management
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl md:text-2xl text-indigo-100 mb-10 max-w-3xl mx-auto"
          >
            Orchestrated by UiPath Agents, transforming reactive incident response into proactive, efficient, and &apos;human-in-the-loop&apos; resolution.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <Link href="/dashboard">
              <button className="bg-foreground text-primary hover:bg-indigo-100 font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
                Try SynaPath AI Demo
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <section className="py-20 bg-card">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-12">Innovation Showcase</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <motion.div variants={featureVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-background rounded-2xl shadow-xl border border-border flex flex-col overflow-hidden hover:shadow-primary/20 transition-shadow">
              <div className="h-48 w-full relative">
                <img src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=600&q=80" alt="Intelligent Triage" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen" />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
              </div>
              <div className="p-8 pt-0 flex flex-col items-center relative z-10 -mt-8">
                <div className="p-4 bg-card rounded-2xl border border-border shadow-lg mb-4">
                  <Lightbulb className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Intelligent Triage</h3>
                <p className="text-secondary text-sm">AI-powered intake agents categorize and prioritize incidents automatically, reducing manual effort.</p>
              </div>
            </motion.div>
            <motion.div variants={featureVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-background rounded-2xl shadow-xl border border-border flex flex-col overflow-hidden hover:shadow-primary/20 transition-shadow">
              <div className="h-48 w-full relative">
                <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80" alt="Autonomous Investigation" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen" />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
              </div>
              <div className="p-8 pt-0 flex flex-col items-center relative z-10 -mt-8">
                <div className="p-4 bg-card rounded-2xl border border-border shadow-lg mb-4">
                  <Workflow className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Autonomous Investigation</h3>
                <p className="text-secondary text-sm">UiPath agents orchestrate diagnostic workflows, gather context, and analyze logs without human intervention.</p>
              </div>
            </motion.div>
            <motion.div variants={featureVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-background rounded-2xl shadow-xl border border-border flex flex-col overflow-hidden hover:shadow-primary/20 transition-shadow">
              <div className="h-48 w-full relative">
                <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80" alt="Proactive Remediation" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen" />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
              </div>
              <div className="p-8 pt-0 flex flex-col items-center relative z-10 -mt-8">
                <div className="p-4 bg-card rounded-2xl border border-border shadow-lg mb-4">
                  <Rocket className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Proactive Remediation</h3>
                <p className="text-secondary text-sm">Leverage LLMs and Coding Agents to generate and apply fixes, with human-in-the-loop approval for critical actions.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <motion.div variants={featureVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card rounded-2xl shadow-xl border border-border flex flex-col overflow-hidden hover:scale-105 transition-transform duration-300">
              <div className="h-40 w-full relative">
                <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80" alt="Faster MTTR" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent"></div>
              </div>
              <div className="p-8 pt-0 flex flex-col items-center relative z-10 -mt-6">
                <div className="p-3 bg-background rounded-full border border-border shadow-lg mb-4">
                  <Zap className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Faster MTTR</h3>
                <p className="text-secondary text-sm">Significantly reduce Mean Time To Resolution with automated diagnostics and remediation.</p>
              </div>
            </motion.div>
            <motion.div variants={featureVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card rounded-2xl shadow-xl border border-border flex flex-col overflow-hidden hover:scale-105 transition-transform duration-300">
              <div className="h-40 w-full relative">
                <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80" alt="Enhanced Reliability" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent"></div>
              </div>
              <div className="p-8 pt-0 flex flex-col items-center relative z-10 -mt-6">
                <div className="p-3 bg-background rounded-full border border-border shadow-lg mb-4">
                  <ShieldCheck className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Enhanced Reliability</h3>
                <p className="text-secondary text-sm">Proactive incident detection and resolution minimize service disruptions and improve system stability.</p>
              </div>
            </motion.div>
            <motion.div variants={featureVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card rounded-2xl shadow-xl border border-border flex flex-col overflow-hidden hover:scale-105 transition-transform duration-300">
              <div className="h-40 w-full relative">
                <img src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80" alt="Reduced Costs" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent"></div>
              </div>
              <div className="p-8 pt-0 flex flex-col items-center relative z-10 -mt-6">
                <div className="p-3 bg-background rounded-full border border-border shadow-lg mb-4">
                  <DollarSign className="h-8 w-8 text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Reduced Operational Costs</h3>
                <p className="text-secondary text-sm">Automate routine and complex tasks, freeing up IT staff for strategic initiatives.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
