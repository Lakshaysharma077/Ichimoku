import { CreditCard, Bitcoin } from 'lucide-react';
import Card from '../ui/Card';

export default function PaymentMethods() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-24">
      <Card className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-accent/10 rounded-xl">
            <CreditCard className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h4 className="syne font-bold text-lg text-text-primary">Stripe Payments</h4>
            <p className="text-xs text-text-muted uppercase font-mono tracking-widest">Pay with Card</p>
          </div>
        </div>
        <ul className="space-y-3 text-sm text-text-secondary font-medium">
          <li className="flex items-center gap-2">✓ Billed in CAD (Canadian Dollars)</li>
          <li className="flex items-center gap-2">✓ Visa, Mastercard, Amex accepted</li>
          <li className="flex items-center gap-2">✓ 256-bit SSL encryption</li>
          <li className="flex items-center gap-2">✓ Instant access after payment</li>
          <li className="flex items-center gap-2">✓ Managed by Stripe — PCI DSS compliant</li>
        </ul>
      </Card>

      <Card className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-emerald-500/10 rounded-xl">
            <Bitcoin className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h4 className="syne font-bold text-lg text-text-primary">Crypto Payments</h4>
            <p className="text-xs text-text-muted uppercase font-mono tracking-widest">Pay with Digital Assets</p>
          </div>
        </div>
        <ul className="space-y-3 text-sm text-text-secondary font-medium">
          <li className="flex items-center gap-2">✓ Bitcoin, Ethereum, USDT accepted</li>
          <li className="flex items-center gap-2">✓ Payments via Coinbase Commerce</li>
          <li className="flex items-center gap-2">✓ Manual verification within 24h</li>
          <li className="flex items-center gap-2">✓ 3% discount for crypto payments</li>
          <li className="flex items-center gap-2">✓ Email receipt provided</li>
        </ul>
      </Card>
    </div>
  );
}
