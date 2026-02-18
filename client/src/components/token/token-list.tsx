import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpRight, Flame, Send } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const MY_TOKENS = [
  { symbol: "TEST", name: "Test Token", supply: "1,000,000", holderCount: 12 },
  { symbol: "GAME", name: "Game Coin", supply: "50,000", holderCount: 154 },
];

export function TokenList() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-display font-medium text-muted-foreground mb-4">Your Deployed Tokens</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MY_TOKENS.map((token) => (
          <Card key={token.symbol} className="bg-card/30 border-white/5 hover:border-accent/30 transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                   <CardTitle className="text-xl font-bold">{token.symbol}</CardTitle>
                   <span className="text-xs text-muted-foreground">{token.name}</span>
                </div>
                <div className="bg-accent/10 text-accent text-xs px-2 py-1 rounded font-mono">
                  Owner
                </div>
              </div>
            </CardHeader>
            <CardContent>
               <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Supply</span>
                    <span className="font-mono">{token.supply}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Holders</span>
                    <span className="font-mono">{token.holderCount}</span>
                  </div>
               </div>
               
               <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 border-white/10 hover:bg-white/5">
                    <ArrowUpRight className="w-3 h-3 mr-1" /> Mint
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-9 w-9 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Send className="w-4 h-4 mr-2" /> Transfer Ownership
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Flame className="w-4 h-4 mr-2" /> Burn Supply
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Placeholder for empty state if needed, but we have mock data */}
      </div>
    </div>
  );
}
