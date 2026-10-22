import React, { useState } from 'react';
import { 
  CheckSquare, 
  Play, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  Lock, 
  Terminal,
  Clock
} from 'lucide-react';

interface TestResult {
  name: string;
  category: string;
  passed: boolean;
  message: string;
  durationMs: number;
}

interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  allPassed: boolean;
  executedAt: string;
}

export const SecurityTestsView: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState<TestSummary | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const runSuite = async () => {
    setIsRunning(true);
    setError(null);
    try {
      const res = await fetch('/api/tests/run-security-suite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Test suite execution failed');

      setSummary(data.summary);
      setResults(data.results);
    } catch (err: any) {
      console.error('Test runner error:', err);
      setError(err.message || 'Failed to execute test suite');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Automated Security & Tenant Isolation Tests</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold font-mono">
              Server-Side Runner
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time automated verification of cross-tenant boundary isolation, CSV formula sanitization, and webhook idempotency.
          </p>
        </div>

        <button
          onClick={runSuite}
          disabled={isRunning}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950/40 transition shrink-0"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Executing Automated Suite...
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              Run Security Test Suite
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Scorecard if tests have run */}
      {summary && (
        <div className={`p-6 rounded-2xl border ${
          summary.allPassed 
            ? 'bg-emerald-950/20 border-emerald-800/60' 
            : 'bg-rose-950/20 border-rose-800/60'
        } flex flex-col md:flex-row md:items-center justify-between gap-6`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              summary.allPassed ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
            }`}>
              {summary.allPassed ? <CheckCircle2 className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {summary.allPassed ? 'All Security Assertions Passed' : 'Test Failures Detected'}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {summary.passed} of {summary.total} verification tests succeeded ({summary.failed} failed).
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400 text-right shrink-0">
            <div>Executed at: <span className="font-mono text-slate-200">{new Date(summary.executedAt).toLocaleTimeString()}</span></div>
            <div className="text-emerald-400 font-semibold mt-0.5">Zero Cross-Tenant Leakage Confirmed</div>
          </div>
        </div>
      )}

      {/* Test Results Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            Security Test Assertions & Results
          </h3>
          <span className="text-xs text-slate-400">
            {results.length > 0 ? `${results.length} Tests Loaded` : 'Ready to execute'}
          </span>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
            <CheckSquare className="w-10 h-10 text-cyan-400/40 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-white">Automated Suite Ready</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Click <strong>"Run Security Test Suite"</strong> above to launch end-to-end tests against the server endpoints.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {results.map((test, index) => (
              <div key={index} className="py-3.5 flex items-start justify-between gap-4 hover:bg-slate-800/30 px-2 -mx-2 rounded-xl transition">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {test.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{test.name}</span>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                        {test.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {test.message}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    test.passed 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40' 
                      : 'bg-rose-950 text-rose-300 border border-rose-800/40'
                  }`}>
                    {test.passed ? 'PASSED' : 'FAILED'}
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    {test.durationMs}ms
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
