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
  ShieldAlert,
  Wallet,
  Trash2
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface AccessRequestRecord {
  id: string;
  email: string;
  tradingViewUsername: string;
  productName: string;
  amount: number | null;
  currency: string;
  paymentMethod: string | null;
  paymentStatus: 'pending' | 'verified' | 'rejected';
  accessStatus: 'pending' | 'active' | 'rejected' | 'expired' | 'revoked';
  transactionHash: string | null;
  isTrial: boolean;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminAccessRequestsPage() {
  const { status: authStatus } = useSession();
  const router = useRouter();

  const [requests, setRequests] = useState<AccessRequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Helpers
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [rejectingRequest, setRejectingRequest] = useState<AccessRequestRecord | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  const fetchRequestsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (statusFilter !== 'ALL') queryParams.set('status', statusFilter);
      if (searchTerm.trim()) queryParams.set('search', searchTerm.trim());

      const res = await fetch(`/api/admin/access-requests?${queryParams.toString()}`);

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to load access requests');
      }

      const data = await res.json();
      setRequests(data.requests || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred fetching requests.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm, router]);

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/admin/login');
    } else if (authStatus === 'authenticated') {
      fetchRequestsData();
    }
  }, [authStatus, fetchRequestsData, router]);

  const handleAction = async (id: string, action: string, payload?: any) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/access-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Action failed');
      }

      setRejectingRequest(null);
      setRejectReason('');
      await fetchRequestsData();
    } catch (err: any) {
      alert(`Error updating request: ${err.message}`);
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
        <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="pt-36 pb-24 min-h-[100svh] relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[160px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-accent font-bold tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </div>
            <h1 className="syne font-extrabold text-3xl lg:text-4xl text-text-primary uppercase tracking-tight">
              Indicator Access Requests
            </h1>
            <p className="text-text-secondary text-sm">
              Manual verification queue for passwordless purchase flow.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={fetchRequestsData} className="flex items-center gap-2 font-mono text-xs">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>

        <Card className="p-4 md:p-6 mb-8 bg-bg-secondary/40 border-border/80">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search email, TV user, TXID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-bg-primary border border-border rounded-xl pl-10 pr-4 py-2 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted/60"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <Filter className="w-3.5 h-3.5 text-text-muted shrink-0 mr-1" />
              {['ALL', 'Pending', 'Verified', 'Active', 'Rejected'].map((st) => (
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

        <Card className="p-0 overflow-hidden border-border/80">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto" />
            </div>
          ) : requests.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <div className="text-text-muted font-mono text-sm uppercase tracking-widest">No matching requests found</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-bg-secondary/80 border-b border-border text-text-muted font-mono uppercase tracking-widest text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">User Details</th>
                    <th className="py-3.5 px-4 font-semibold">Product</th>
                    <th className="py-3.5 px-4 font-semibold">Payment Info</th>
                    <th className="py-3.5 px-4 font-semibold">Status (Pay / Access)</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {requests.map((r) => {
                    const formattedDate = new Date(r.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    });

                    const isPayVerified = r.paymentStatus === 'verified';
                    const isAccessActive = r.accessStatus === 'active';
                    const isRejected = r.accessStatus === 'rejected';

                    return (
                      <tr key={r.id} className="hover:bg-bg-secondary/30 transition-colors">
                        {/* User Details */}
                        <td className="py-4 px-4 align-top space-y-1.5">
                          <div className="font-mono text-[11px] font-bold">{r.email}</div>
                          <div className="inline-flex items-center gap-1.5 bg-accent/10 border border-accent/30 rounded-lg px-2 py-1">
                            <span className="font-mono font-bold text-accent text-xs select-all">{r.tradingViewUsername}</span>
                            <button onClick={() => handleCopyText(r.tradingViewUsername, `tv-${r.id}`)} className="text-accent hover:text-white transition-colors">
                              {copiedId === `tv-${r.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                          <div className="text-[10px] text-text-muted font-mono">{formattedDate}</div>
                        </td>

                        {/* Product */}
                        <td className="py-4 px-4 align-top">
                          <span className="font-bold text-text-primary uppercase text-xs">{r.productName}</span>
                          {r.isTrial && (
                            <span className="ml-2 inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                              TRIAL
                            </span>
                          )}
                        </td>

                        {/* Payment Info */}
                        <td className="py-4 px-4 align-top space-y-1.5">
                          {r.isTrial ? (
                            <span className="text-[10px] font-mono text-text-muted">N/A (Free Trial)</span>
                          ) : (
                            <>
                              <div className="font-mono text-accent font-extrabold text-sm">
                                ${r.amount} {r.currency}
                              </div>
                              <div className="text-[10px] font-mono text-text-secondary">{r.paymentMethod}</div>
                              {r.transactionHash && (
                                <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                                  <span className="truncate max-w-[110px] select-all font-bold" title={r.transactionHash}>{r.transactionHash}</span>
                                  <button onClick={() => handleCopyText(r.transactionHash!, `tx-${r.id}`)}>
                                    {copiedId === `tx-${r.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-emerald-400 hover:text-white" />}
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 align-top space-y-1.5">
                          <div className="flex items-center gap-2 text-[10px] font-mono font-bold">
                            <span className="text-text-muted">Pay:</span>
                            <span className={`px-2 py-0.5 rounded ${
                              r.paymentStatus === 'verified' ? 'bg-emerald-500/15 text-emerald-400' :
                              r.paymentStatus === 'rejected' ? 'bg-red-500/15 text-red-400' :
                              'bg-amber-500/15 text-amber-400'
                            }`}>{r.paymentStatus.toUpperCase()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-mono font-bold">
                            <span className="text-text-muted">Access:</span>
                            <span className={`px-2 py-0.5 rounded ${
                              r.accessStatus === 'active' ? 'bg-emerald-500/15 text-emerald-400' :
                              r.accessStatus === 'rejected' ? 'bg-red-500/15 text-red-400' :
                              'bg-amber-500/15 text-amber-400'
                            }`}>{r.accessStatus.toUpperCase()}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 align-top text-right space-y-1">
                          {!r.isTrial && !isPayVerified && !isRejected && (
                            <button
                              onClick={() => handleAction(r.id, 'VERIFY_PAYMENT')}
                              disabled={updatingId === r.id}
                              className="px-2.5 py-1 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 border border-blue-500/40 text-[10px] font-bold rounded transition-all block w-full text-center"
                            >
                              Verify Payment
                            </button>
                          )}

                          {!isAccessActive && !isRejected && (isPayVerified || r.isTrial) && (
                            <button
                              onClick={() => handleAction(r.id, 'GRANT_ACCESS')}
                              disabled={updatingId === r.id}
                              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-[10px] rounded transition-all block w-full text-center"
                            >
                              Grant Access
                            </button>
                          )}

                          {!isRejected && !isAccessActive && (
                            <button
                              onClick={() => setRejectingRequest(r)}
                              className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] rounded transition-all block w-full text-center"
                            >
                              Reject
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Reject Modal */}
        {rejectingRequest && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#0F172A] border border-red-500/40 rounded-2xl p-6 relative space-y-4">
              <div className="flex items-center gap-3 text-red-400 font-extrabold text-lg uppercase tracking-tight">
                <XCircle className="w-6 h-6 shrink-0" />
                <span>Reject Access Request</span>
              </div>
              <p className="text-xs text-text-secondary">
                Rejecting request for <strong className="text-text-primary">{rejectingRequest.email}</strong>.
              </p>
              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Reason (sent to user):</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-bg-primary border border-border rounded-xl p-3 text-xs text-text-primary focus:outline-none focus:border-red-400"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => { setRejectingRequest(null); setRejectReason(''); }}
                  className="px-4 py-2 bg-bg-primary hover:bg-bg-secondary text-text-secondary rounded-xl text-xs font-mono font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAction(rejectingRequest.id, 'REJECT', { adminNotes: rejectReason })}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-extrabold rounded-xl text-xs font-mono transition-all"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
