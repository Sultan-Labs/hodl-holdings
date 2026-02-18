import { CreateTokenForm } from "@/components/token/create-token-form";
import { TokenList } from "@/components/token/token-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { motion } from "framer-motion";

export default function TokensPage() {
  return (
    <div className="space-y-8" data-testid="page-tokens">
      <div className="relative overflow-hidden glass-card rounded-[48px] px-6 md:px-10 py-14 md:py-16 border border-white/5" data-testid="panel-tokens-hero">
        <div
          className="absolute -inset-24 opacity-20"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(1000px 600px at 0% 0%, rgba(85,255,172,0.12), transparent 70%), radial-gradient(1000px 600px at 100% 100%, rgba(0,214,255,0.10), transparent 70%)",
          }}
        />

        <div className="relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="glass-soft inline-flex items-center gap-2 rounded-full px-5 py-2.5 border-white/10"
            data-testid="pill-tokens"
          >
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[hsl(var(--ring))]" data-testid="text-tokens-pill">
              Token Factory
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
            className="mt-8 text-[32px] sm:text-5xl md:text-6xl font-semibold text-white leading-[1.2] tracking-tight px-4"
            data-testid="text-tokens-title"
          >
            <span className="text-gradient-primary">Deploy</span> in Seconds
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
            className="mt-6 text-[15px] md:text-[18px] text-white/60 leading-relaxed font-light max-w-[48rem] mx-auto"
            data-testid="text-tokens-subtitle"
          >
            Create & launch your own tokens on SULTAN with ease through our intuitive deployment interface.
          </motion.p>
        </div>
      </div>

      <Tabs defaultValue="create" className="space-y-6" data-testid="tabs-tokens">
        <TabsList className="glass-soft rounded-full p-1 w-fit mx-auto md:mx-0" data-testid="tabslist-tokens">
          <TabsTrigger
            value="create"
            className="rounded-full data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70 px-8"
            data-testid="tab-deploy-token"
          >
            Deploy Token
          </TabsTrigger>
          <TabsTrigger
            value="manage"
            className="rounded-full data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70 px-8"
            data-testid="tab-my-tokens"
          >
            My Tokens
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="pt-2 outline-none" data-testid="panel-token-create">
          <CreateTokenForm />
        </TabsContent>

        <TabsContent value="manage" className="pt-2 outline-none" data-testid="panel-token-manage">
          <TokenList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
