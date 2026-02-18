import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center" data-testid="page-not-found">
      <Card className="glass-card w-full max-w-lg mx-4 rounded-3xl" data-testid="card-not-found">
        <CardContent className="pt-8 pb-8">
          <div className="flex items-start gap-3" data-testid="row-not-found-title">
            <div className="h-11 w-11 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-red-300" aria-hidden="true">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight" data-testid="text-not-found-title">
                Page not found
              </h1>
              <p className="mt-2 text-white/60" data-testid="text-not-found-desc">
                The page you\"re looking for doesn\"t exist yet in this prototype.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3" data-testid="group-not-found-actions">
            <Link href="/">
              <a className="glass-soft rounded-full px-5 h-11 inline-flex items-center justify-center text-white hover:border-white/20 transition-colors" data-testid="link-not-found-home">
                Back to Home
              </a>
            </Link>
            <Link href="/swap">
              <a className="glass-soft rounded-full px-5 h-11 inline-flex items-center justify-center text-white/80 hover:text-white hover:border-white/20 transition-colors" data-testid="link-not-found-trade">
                Go to Trade
              </a>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
