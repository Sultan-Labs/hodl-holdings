import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const POOLS = [
  { id: 1, pair: "SLTN/USDH", tvl: "$1,240,500", vol: "$450,200", apy: "12.5%" },
  { id: 2, pair: "SLTN/GLD", tvl: "$850,000", vol: "$120,000", apy: "8.2%" },
  { id: 3, pair: "USDH/TECH", tvl: "$2,100,000", vol: "$980,000", apy: "24.5%" },
  { id: 4, pair: "GLD/USDH", tvl: "$3,400,000", vol: "$150,000", apy: "5.1%" },
];

export function PoolList() {
  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-display text-xl">Top Liquidity Pools</CardTitle>
        <Button size="sm" variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-black">
          <Plus className="w-4 h-4 mr-2" />
          Create Pool
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Pool Pair</TableHead>
              <TableHead className="text-right text-muted-foreground">TVL</TableHead>
              <TableHead className="text-right text-muted-foreground">Volume (24h)</TableHead>
              <TableHead className="text-right text-muted-foreground">APY</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {POOLS.map((pool) => (
              <TableRow key={pool.id} className="border-white/5 hover:bg-white/5 transition-colors">
                <TableCell className="font-bold text-foreground">{pool.pair}</TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">{pool.tvl}</TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">{pool.vol}</TableCell>
                <TableCell className="text-right font-bold text-green-400">{pool.apy}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" className="text-accent hover:text-accent hover:bg-accent/10">
                    Add Liquidity
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
