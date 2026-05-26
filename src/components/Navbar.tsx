"use client";

import Link from 'next/link';
import { Bug, LayoutDashboard, Zap, PieChart, Network } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="bg-card shadow-lg p-4 flex justify-between items-center text-foreground"
    >
      <Link href="/" className="flex items-center space-x-2">
        <Zap className="text-primary h-8 w-8" />
        <span className="text-2xl font-bold">SynaPath AI</span>
      </Link>
      <div className="space-x-6">
        <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
          <Bug className="h-5 w-5" />
          Home
        </Link>
        <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </Link>
        <Link href="/analytics" className="hover:text-primary transition-colors flex items-center gap-1">
          <PieChart className="h-5 w-5" />
          Analytics
        </Link>
        <Link href="/orchestrator" className="hover:text-primary transition-colors flex items-center gap-1">
          <Network className="h-5 w-5" />
          Orchestrator
        </Link>
      </div>
    </motion.nav>
  );
};

export default Navbar;
