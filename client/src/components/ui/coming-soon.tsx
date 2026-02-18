import { motion } from "framer-motion";
import { Clock, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-2xl w-full glass-card rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
        <div
          className="absolute -inset-24"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(600px 400px at 50% 50%, rgba(85,255,172,0.1), transparent 70%)",
          }}
        />
        
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="h-20 w-20 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center mx-auto mb-8"
          >
            <Clock className="h-10 w-10 text-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-semibold text-white tracking-tight"
          >
            {title}{title ? ' ' : ''}Coming Soon
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-white/60 leading-relaxed font-light"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10"
          >
            <Link href="/">
              <a data-testid="link-back-home" className="glass-soft rounded-full px-8 h-12 text-white hover:bg-white/10 transition-colors inline-flex items-center justify-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </a>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
