'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  Copy,
  Check,
  Filter,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  X,
  Mail,
  ExternalLink,
  ShieldAlert,
  ShieldCheck as ShieldVerified,
  DollarSign,
  Users,
  Sliders,
  Calendar,
  Trash2,
  Wallet
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getExplorerTxUrl } from '@/lib/payments/explorers';

interface PaymentRecord {
  id: string;
  plan: string;
  amount: number;
  currency: string;
  billingPeriod: string;
  paymentMethod: string;
  network: string;
  walletAddressUsed: string;
  customerName: string;
  customerEmail: string;
  tradingViewUsername: string;
  country?: string | null;
  status: 'Pending' | 'Pending Verification' | 'Verified' | 'Approved' | 'Rejected' | 'Refunded' | 'Expired';
  txnHash?: string | null;
  paymentScreenshot?: string | null;
  verificationStatus?: 'VERIFIED' | 'FAILED' | 'NOT_VERIFIED' | null;
  verificationResult?: string | null;
  adminNotes?: string | null;
  refundedAt?: string | null;
  refundReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPaymentsPage() {
  const { status: authStatus } = useSession();
  const router = useRouter();

  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [analytics, setAnalytics] = useState<any>({
    totalRevenue: 0,
    totalPaymentsCount: 0,
    pendingPaymentsCount: 0,
    verifiedPaymentsCount: 0,
    approvedPaymentsCount: 0,
    rejectedPaymentsCount: 0,
    refundedPaymentsCount: 0,
    activeSubscriptionsCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Generate dynamic list of last 12 months for month selector
  const monthOptions = [
    { value: 'ALL', label: 'All Months' },
    ...Array.from({ length: 12 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const lbl = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      return { value: val, label: lbl };
    }),
  ];

  // Helpers
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  // Modals
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [rejectingPayment, setRejectingPayment] = useState<PaymentRecord | null>(null);
  const [refundingPayment, setRefundingPayment] = useState<PaymentRecord | null>(null);
  const [refundReasonInput, setRefundReasonInput] = useState<string>('');
  const [overridePayment, setOverridePayment] = useState<PaymentRecord | null>(null);

  const fetchPaymentsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (statusFilter !== 'ALL') queryParams.set('status', statusFilter);
      if (selectedMonth !== 'ALL') queryParams.set('month', selectedMonth);
      if (searchTerm.trim()) queryParams.set('search', searchTerm.trim());

      const [pRes, aRes] = await Promise.all([
        fetch(`/api/admin/payments?${queryParams.toString()}`),
        fetch(`/api/admin/analytics`),
      ]);

      if (!pRes.ok) {
        if (pRes.status === 401) {
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to load payment records');
      }

      const pData = await pRes.json();
      setPayments(pData.payments || []);

      if (aRes.ok) {
        const aData = await aRes.json();
        setAnalytics(aData.analytics || {});
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred fetching payments.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, selectedMonth, searchTerm, router]);

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/admin/login');
    } else if (authStatus === 'authenticated') {
      fetchPaymentsData();
    }
  }, [authStatus, fetchPaymentsData, router]);

  const handleUpdateStatus = async (
    id: string,
    newStatus: string,
    payload?: { adminNotes?: string; refundReason?: string; allowUnverifiedOverride?: boolean }
  ) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/payments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          ...payload,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.requiresOverrideConfirm) {
          const targetP = payments.find((p) => p.id === id);
          if (targetP) setOverridePayment(targetP);
          return;
        }
        throw new Error(data.error || 'Failed to update status');
      }

      setRejectingPayment(null);
      setRefundingPayment(null);
      setOverridePayment(null);
      setRefundReasonInput('');
      await fetchPaymentsData();
    } catch (err: any) {
      alert(`Error updating payment: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleVerifyTransaction = async (id: string) => {
    setVerifyingId(id);
    try {
      const res = await fetch(`/api/admin/payments/${id}/verify`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification request failed');
      await fetchPaymentsData();
    } catch (err: any) {
      alert(`Verification error: ${err.message}`);
    } finally {
      setVerifyingId(null);
    }
  };

  const handleDeletePayment = async (id: string, customerName: string) => {
    if (!confirm(`Are you sure you want to PERMANENTLY DELETE the payment record for "${customerName}"? This action cannot be undone.`)) {
      return;
    }
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/payments/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete payment record');
      }
      await fetchPaymentsData();
    } catch (err: any) {
      alert(`Error deleting payment: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (authStatus === 'loading') {
    return (
      <div className="pt-40 pb-24 min-h-[100svh] flex items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-text-muted font-mono uppercase tracking-widest">Checking admin authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-36 pb-24 min-h-[100svh] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[160px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-accent font-bold tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Operations Dashboard</span>
            </div>
            <h1 className="syne font-extrabold text-3xl lg:text-4xl text-text-primary uppercase tracking-tight">
              Payments & Subscriptions
            </h1>
            <p className="text-text-secondary text-sm">
              Live on-chain blockchain verification, invite-only TradingView activation, and order management.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" onClick={() => router.push('/admin/content')} className="flex items-center gap-2 font-mono text-xs">
              <Sliders className="w-3.5 h-3.5" />
              <span>Manage CMS Content</span>
            </Button>

            <Button size="sm" variant="outline" onClick={fetchPaymentsData} className="flex items-center gap-2 font-mono text-xs">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Telemetry Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5 mb-8">
          <Card className="p-4 border-border/70 bg-bg-secondary/40">
            <div className="text-text-muted font-mono text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-accent" />
              <span>Total Revenue</span>
            </div>
            <div className="syne font-bold text-2xl text-accent">${analytics.totalRevenue || 0} USD</div>
          </Card>

          <Card className="p-4 border-amber-500/20 bg-amber-500/5">
            <div className="text-amber-400 font-mono text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Clock className="w-3 h-3 animate-spin" />
              <span>Pending</span>
            </div>
            <div className="syne font-bold text-2xl text-amber-400">{analytics.pendingPaymentsCount || 0}</div>
          </Card>

          <Card className="p-4 border-blue-500/20 bg-blue-500/5">
            <div className="text-blue-400 font-mono text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <ShieldVerified className="w-3 h-3" />
              <span>On-Chain Verified</span>
            </div>
            <div className="syne font-bold text-2xl text-blue-400">{analytics.verifiedPaymentsCount || 0}</div>
          </Card>

          <Card className="p-4 border-emerald-500/20 bg-emerald-500/5">
            <div className="text-emerald-400 font-mono text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>Approved</span>
            </div>
            <div className="syne font-bold text-2xl text-emerald-400">{analytics.approvedPaymentsCount || 0}</div>
          </Card>

          <Card className="p-4 border-purple-500/20 bg-purple-500/5">
            <div className="text-purple-400 font-mono text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Users className="w-3 h-3" />
              <span>Active Subs</span>
            </div>
            <div className="syne font-bold text-2xl text-purple-400">{analytics.activeSubscriptionsCount || 0}</div>
          </Card>

          <Card className="p-4 border-red-500/20 bg-red-500/5">
            <div className="text-red-400 font-mono text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <XCircle className="w-3 h-3" />
              <span>Rejected</span>
            </div>
            <div className="syne font-bold text-2xl text-red-400">{analytics.rejectedPaymentsCount || 0}</div>
          </Card>
        </div>

        {/* Controls Bar */}
        <Card className="p-4 md:p-6 mb-8 bg-bg-secondary/40 border-border/80">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search customer, email, TV user, TXID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-bg-primary border border-border rounded-xl pl-10 pr-4 py-2 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted/60"
                />
              </div>

              {/* Month Selection Dropdown */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0">
                <Calendar className="w-4 h-4 text-accent shrink-0" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full sm:w-auto bg-bg-primary border border-border text-text-primary text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-accent cursor-pointer"
                >
                  {monthOptions.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <Filter className="w-3.5 h-3.5 text-text-muted shrink-0 mr-1" />
              {['ALL', 'Pending', 'Pending Verification', 'Verified', 'Approved', 'Rejected', 'Refunded'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 ${
                    statusFilter === st
                      ? 'bg-accent text-bg-primary font-bold shadow-[0_0_10px_rgba(41,98,255,0.3)]'
                      : 'bg-bg-primary/50 text-text-secondary hover:bg-bg-primary border border-border/50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

          </div>
        </Card>

        {/* Data Table */}
        <Card className="p-0 overflow-hidden border-border/80">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-text-muted font-mono uppercase tracking-wider">Fetching payment records...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <div className="text-text-muted font-mono text-sm uppercase tracking-widest">No matching payments found</div>
              <p className="text-text-secondary text-xs">Adjust your search term or filter status tab.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-bg-secondary/80 border-b border-border text-text-muted font-mono uppercase tracking-widest text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Customer Info</th>
                    <th className="py-3.5 px-4 font-semibold">TradingView User</th>
                    <th className="py-3.5 px-4 font-semibold">Plan & Amount</th>
                    <th className="py-3.5 px-4 font-semibold">Network & Wallet</th>
                    <th className="py-3.5 px-4 font-semibold">TXID & Explorer</th>
                    <th className="py-3.5 px-4 font-semibold">Receipt</th>
                    <th className="py-3.5 px-4 font-semibold">On-Chain Check</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {payments.map((p) => {
                    const isApproved = p.status === 'Approved';
                    const isRejected = p.status === 'Rejected';
                    const isRefunded = p.status === 'Refunded';

                    let vData: any = null;
                    if (p.verificationResult) {
                      try { vData = JSON.parse(p.verificationResult); } catch {}
                    }

                    const isVerified = p.verificationStatus === 'VERIFIED' || vData?.isVerified === true;
                    const isVerificationFailed = p.verificationStatus === 'FAILED' || (vData && vData.isVerified === false);

                    const { url: explorerUrl, explorerName } = getExplorerTxUrl(p.network, p.txnHash || '');

                    const formattedDate = new Date(p.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <tr key={p.id} className="hover:bg-bg-secondary/30 transition-colors">

                        {/* Customer Info */}
                        <td className="py-4 px-4 align-top">
                          <div className="space-y-0.5">
                            <div className="font-bold text-text-primary text-sm">{p.customerName}</div>
                            <div className="text-text-secondary font-mono text-[11px] flex items-center gap-1">
                              <Mail className="w-3 h-3 text-text-muted" />
                              <span>{p.customerEmail}</span>
                            </div>
                            <div className="text-[10px] text-text-muted font-mono">{formattedDate}</div>
                          </div>
                        </td>

                        {/* TradingView Username with 1-Click Copy */}
                        <td className="py-4 px-4 align-top">
                          <div className="inline-flex items-center gap-1.5 bg-accent/10 border border-accent/30 rounded-lg px-2.5 py-1.5">
                            <span className="font-mono font-bold text-accent text-xs select-all">
                              {p.tradingViewUsername}
                            </span>
                            <button
                              onClick={() => handleCopyText(p.tradingViewUsername, `tv-${p.id}`)}
                              className="text-accent hover:text-white transition-colors"
                              title="Copy TradingView Username"
                            >
                              {copiedId === `tv-${p.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>

                        {/* Plan & Amount (USD) */}
                        <td className="py-4 px-4 align-top space-y-0.5">
                          <span className="font-bold text-text-primary uppercase text-xs block">
                            {p.plan} ({p.billingPeriod})
                          </span>
                          <span className="font-mono text-accent font-extrabold text-sm block">
                            ${p.amount} {p.currency || 'USD'}
                          </span>
                        </td>

                        {/* Network & Wallet Address with 1-Click Copy */}
                        <td className="py-4 px-4 align-top space-y-1.5">
                          <div className="font-bold text-text-primary font-mono text-[11px]">
                            {p.paymentMethod} on {p.network}
                          </div>

                          {p.walletAddressUsed ? (
                            <div className="text-[10px] font-mono text-text-secondary flex items-center gap-1">
                              <Wallet className="w-3 h-3 text-text-muted shrink-0" />
                              <span className="truncate max-w-[110px] select-all font-mono" title={p.walletAddressUsed}>
                                {p.walletAddressUsed}
                              </span>
                              <button
                                onClick={() => handleCopyText(p.walletAddressUsed, `w-${p.id}`)}
                                title="Copy Wallet Address"
                                className="text-text-muted hover:text-white transition-colors"
                              >
                                {copiedId === `w-${p.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] font-mono text-text-muted">N/A</span>
                          )}
                        </td>

                        {/* TXID with 1-Click Copy & Explorer Link */}
                        <td className="py-4 px-4 align-top space-y-1.5">
                          {p.txnHash ? (
                            <div className="space-y-1">
                              <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                                <span className="truncate max-w-[110px] select-all font-bold font-mono" title={p.txnHash}>
                                  {p.txnHash}
                                </span>
                                <button onClick={() => handleCopyText(p.txnHash!, `tx-${p.id}`)} title="Copy TXID">
                                  {copiedId === `tx-${p.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-emerald-400 hover:text-white" />}
                                </button>
                              </div>

                              <a
                                href={explorerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-[10px] font-mono transition-all"
                              >
                                <span>{explorerName}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          ) : (
                            <span className="text-[10px] font-mono text-red-400 block">No TXID</span>
                          )}
                        </td>

                        {/* Payment Screenshot */}
                        <td className="py-4 px-4 align-top">
                          {p.paymentScreenshot ? (
                            <button
                              onClick={() => setSelectedScreenshot(p.paymentScreenshot!)}
                              className="group relative block overflow-hidden rounded-lg border border-border hover:border-accent transition-colors"
                              title="Click to view screenshot modal"
                            >
                              <img src={p.paymentScreenshot} alt="Receipt" className="w-12 h-12 object-cover" />
                            </button>
                          ) : (
                            <span className="text-[10px] font-mono text-text-muted italic">None</span>
                          )}
                        </td>

                        {/* On-Chain Verification Status & Live Check */}
                        <td className="py-4 px-4 align-top space-y-1.5">
                          {isVerified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              <ShieldVerified className="w-3 h-3 text-emerald-400" />
                              <span>Verified On-Chain</span>
                            </span>
                          ) : isVerificationFailed ? (
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                                <ShieldAlert className="w-3 h-3 text-red-400" />
                                <span>Check Failed</span>
                              </span>
                              {vData?.failureReason && (
                                <p className="text-[9px] text-red-300 font-mono line-clamp-2 max-w-[130px]" title={vData.failureReason}>
                                  {vData.failureReason}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                              <Clock className="w-3 h-3" />
                              <span>Awaiting Check</span>
                            </span>
                          )}

                          <button
                            onClick={() => handleVerifyTransaction(p.id)}
                            disabled={verifyingId === p.id}
                            className="block text-[9px] font-mono text-blue-400 hover:underline"
                          >
                            {verifyingId === p.id ? "Checking Blockchain..." : "Verify On-Chain"}
                          </button>
                        </td>

                        {/* Workflow Status */}
                        <td className="py-4 px-4 align-top">
                          <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-mono font-bold ${
                            isApproved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                            isRejected ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                            isRefunded ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' :
                            'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          }`}>
                            {p.status}
                          </span>
                        </td>

                        {/* Admin Actions: Approve, Reject, Refund, Delete */}
                        <td className="py-4 px-4 align-top text-right space-y-1">
                          {!isApproved && (
                            <button
                              onClick={() => handleUpdateStatus(p.id, 'Approved', { allowUnverifiedOverride: true })}
                              disabled={updatingId === p.id}
                              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-[10px] rounded transition-all block w-full text-center"
                            >
                              Approve
                            </button>
                          )}

                          {!isRejected && !isRefunded && (
                            <button
                              onClick={() => setRejectingPayment(p)}
                              className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] rounded transition-all block w-full text-center"
                            >
                              Reject
                            </button>
                          )}

                          {isApproved && !isRefunded && (
                            <button
                              onClick={() => setRefundingPayment(p)}
                              className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] rounded transition-all block w-full text-center"
                            >
                              Refund
                            </button>
                          )}

                          <button
                            onClick={() => handleDeletePayment(p.id, p.customerName)}
                            disabled={updatingId === p.id}
                            className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/40 text-[10px] rounded transition-all flex items-center justify-center gap-1 w-full text-center"
                            title="Permanently delete payment record"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Screenshot Lightbox Modal */}
        {selectedScreenshot && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="max-w-3xl w-full bg-[#0F172A] border border-border rounded-2xl p-4 relative">
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="absolute top-4 right-4 p-2 text-text-muted hover:text-white bg-bg-primary rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
              <img src={selectedScreenshot} alt="Receipt Full Modal" className="max-h-[80vh] w-auto mx-auto rounded-xl" />
            </div>
          </div>
        )}

        {/* Manual Override Confirmation Modal */}
        {overridePayment && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-[#0F172A] border border-amber-500/40 rounded-2xl p-6 relative space-y-4">
              <div className="flex items-center gap-3 text-amber-400 font-extrabold text-lg uppercase tracking-tight">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <span>Manual Approval Override</span>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed">
                This transaction for <strong className="text-text-primary">{overridePayment.customerName}</strong> (<span className="font-mono text-accent">${overridePayment.amount} {overridePayment.currency}</span>) has not passed automated on-chain verification.
              </p>

              <div className="bg-bg-primary border border-border rounded-xl p-3 text-xs space-y-1 font-mono">
                <div><span className="text-text-muted">TradingView User:</span> <span className="text-emerald-400 font-bold">{overridePayment.tradingViewUsername}</span></div>
                <div><span className="text-text-muted">Txn Hash / TXID:</span> <span className="text-blue-400 break-all">{overridePayment.txnHash || "None Provided"}</span></div>
                <div><span className="text-text-muted">Verification Status:</span> <span className="text-red-400 font-bold">{overridePayment.verificationStatus || "NOT_VERIFIED"}</span></div>
              </div>

              <p className="text-xs text-text-muted">
                Are you sure you want to manually override and activate subscription access for this user?
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setOverridePayment(null)}
                  className="px-4 py-2 bg-bg-primary hover:bg-bg-secondary text-text-secondary rounded-xl text-xs font-mono font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateStatus(overridePayment.id, 'Approved', { allowUnverifiedOverride: true })}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-extrabold rounded-xl text-xs font-mono transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                >
                  Confirm & Force Approve
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Payment Modal */}
        {rejectingPayment && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#0F172A] border border-red-500/40 rounded-2xl p-6 relative space-y-4">
              <div className="flex items-center gap-3 text-red-400 font-extrabold text-lg uppercase tracking-tight">
                <XCircle className="w-6 h-6 shrink-0" />
                <span>Reject Payment</span>
              </div>

              <p className="text-xs text-text-secondary">
                Rejecting payment for <strong className="text-text-primary">{rejectingPayment.customerName}</strong> ({rejectingPayment.customerEmail}). An email will be sent to the user.
              </p>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Admin Reason / Notes (sent to user):</label>
                <textarea
                  value={refundReasonInput}
                  onChange={(e) => setRefundReasonInput(e.target.value)}
                  placeholder="e.g. Invalid TXID or transaction not found on-chain."
                  className="w-full bg-bg-primary border border-border rounded-xl p-3 text-xs text-text-primary focus:outline-none focus:border-red-400"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => { setRejectingPayment(null); setRefundReasonInput(''); }}
                  className="px-4 py-2 bg-bg-primary hover:bg-bg-secondary text-text-secondary rounded-xl text-xs font-mono font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateStatus(rejectingPayment.id, 'Rejected', { adminNotes: refundReasonInput })}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-extrabold rounded-xl text-xs font-mono transition-all"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Refund Payment Modal */}
        {refundingPayment && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#0F172A] border border-purple-500/40 rounded-2xl p-6 relative space-y-4">
              <div className="flex items-center gap-3 text-purple-400 font-extrabold text-lg uppercase tracking-tight">
                <RotateCcw className="w-6 h-6 shrink-0" />
                <span>Process Refund</span>
              </div>

              <p className="text-xs text-text-secondary">
                Refunding <strong className="text-text-primary">{refundingPayment.customerName}</strong> (${refundingPayment.amount} {refundingPayment.currency || 'USD'}).
              </p>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Refund Reason:</label>
                <textarea
                  value={refundReasonInput}
                  onChange={(e) => setRefundReasonInput(e.target.value)}
                  placeholder="Reason for refund..."
                  className="w-full bg-bg-primary border border-border rounded-xl p-3 text-xs text-text-primary focus:outline-none focus:border-purple-400"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => { setRefundingPayment(null); setRefundReasonInput(''); }}
                  className="px-4 py-2 bg-bg-primary hover:bg-bg-secondary text-text-secondary rounded-xl text-xs font-mono font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateStatus(refundingPayment.id, 'Refunded', { refundReason: refundReasonInput })}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs font-mono transition-all"
                >
                  Confirm Refund
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
