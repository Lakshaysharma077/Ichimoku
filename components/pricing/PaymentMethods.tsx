import { ShieldCheck, Zap, Globe, Lock } from 'lucide-react';
import Card from '../ui/Card';

export default function PaymentMethods() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-24">
      <Card className="p-8 relative overflow-hidden">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-accent/10 rounded-xl">
            <ShieldCheck className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h4 className="syne font-bold text-lg text-text-primary">Cryptocurrency Checkout</h4>
            <p className="text-xs text-text-muted uppercase font-mono tracking-widest">USDT & USDC Payments</p>
          </div>
        </div>
        <ul className="space-y-3 text-sm text-text-secondary font-medium">
          <li className="flex items-center gap-2">✓ Billed in standard USD ($22/mo or $220/yr)</li>
          <li className="flex items-center gap-2">✓ Tether (USDT) & USD Coin (USDC) accepted</li>
          <li className="flex items-center gap-2">✓ 5 Supported Networks: Arbitrum, Ethereum, Avalanche, TRON, Solana</li>
          <li className="flex items-center gap-2">✓ Direct wallet-to-wallet transfer with zero intermediary fees</li>
          <li className="flex items-center gap-2">✓ Fast on-chain verification & indicator activation</li>
        </ul>
      </Card>

      <Card className="p-8 relative overflow-hidden">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-emerald-500/10 rounded-xl">
            <Lock className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h4 className="syne font-bold text-lg text-text-primary">Institutional Security</h4>
            <p className="text-xs text-text-muted uppercase font-mono tracking-widest">Direct Blockchain Confirmation</p>
          </div>
        </div>
        <ul className="space-y-3 text-sm text-text-secondary font-medium">
          <li className="flex items-center gap-2">✓ Transparent TXID verification on public block explorers</li>
          <li className="flex items-center gap-2">✓ Official verified receiving addresses for each network</li>
          <li className="flex items-center gap-2">✓ No recurring auto-debits without explicit authorization</li>
          <li className="flex items-center gap-2">✓ Instant email receipt & activation notification upon approval</li>
          <li className="flex items-center gap-2">✓ 2 Months Free included on all annual subscriptions</li>
        </ul>
      </Card>
    </div>
  );
}
