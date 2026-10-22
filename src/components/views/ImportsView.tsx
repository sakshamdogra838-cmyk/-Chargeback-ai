import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import Papa from 'papaparse';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  FileText, 
  ShieldCheck,
  Download,
  Info
} from 'lucide-react';
import { CSV_SAMPLE_TEXT } from '../../lib/mockData';
import { Dispute } from '../../types';

export const ImportsView: React.FC = () => {
  const { currentOrg, importDisputesBatch, disputes } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [csvRawData, setCsvRawData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [mapping, setMapping] = useState<Record<string, string>>({
    internalCaseId: '',
    orderRef: '',
    transactionRef: '',
    paymentProcessor: '',
    disputeReasonCode: '',
    disputeReasonCategory: '',
    disputeAmount: '',
    currency: '',
    customerName: '',
    customerEmail: '',
    trackingNumber: '',
    submissionDeadline: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSummary, setImportSummary] = useState<{ imported: number; duplicates: number } | null>(null);

  // Field definitions for mapping
  const targetFields = [
    { key: 'internalCaseId', label: 'Internal Case ID *', hints: ['case', 'case id', 'internal', 'dispute id'] },
    { key: 'orderRef', label: 'Order Reference', hints: ['order', 'order id', 'order ref', 'invoice'] },
    { key: 'transactionRef', label: 'Transaction Reference', hints: ['transaction', 'charge', 'ch_', 'tx_'] },
    { key: 'paymentProcessor', label: 'Payment Processor', hints: ['processor', 'gateway', 'payment method'] },
    { key: 'disputeReasonCode', label: 'Reason Code', hints: ['reason code', 'code'] },
    { key: 'disputeReasonCategory', label: 'Reason Category', hints: ['reason', 'category', 'dispute reason'] },
    { key: 'disputeAmount', label: 'Dispute Amount *', hints: ['amount', 'disputed amount', 'value'] },
    { key: 'currency', label: 'Currency', hints: ['currency', 'curr'] },
    { key: 'customerName', label: 'Customer Name', hints: ['customer', 'name', 'cardholder'] },
    { key: 'customerEmail', label: 'Customer Email', hints: ['email', 'customer email'] },
    { key: 'trackingNumber', label: 'Tracking Number', hints: ['tracking', 'tracking number', 'shipment'] },
    { key: 'submissionDeadline', label: 'Submission Deadline', hints: ['deadline', 'due date', 'respond by'] }
  ];

  // Auto guess column mapping based on detected header names
  const autoMapHeaders = (detectedHeaders: string[]) => {
    const newMapping: Record<string, string> = {};
    for (const field of targetFields) {
      const match = detectedHeaders.find(h => 
        field.hints.some(hint => h.toLowerCase().includes(hint.toLowerCase()))
      );
      if (match) {
        newMapping[field.key] = match;
      }
    }
    setMapping(prev => ({ ...prev, ...newMapping }));
  };

  const handleFileUpload = (file: File) => {
    setFileName(file.name);
    setImportSummary(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const detectedHeaders = Object.keys(results.data[0] as object);
          setHeaders(detectedHeaders);
          setCsvRawData(results.data);
          autoMapHeaders(detectedHeaders);
        }
      },
      error: (error) => {
        console.error('CSV parse error:', error);
      }
    });
  };

  const handleLoadSampleCsv = () => {
    setFileName('sample_dtc_disputes.csv');
    setImportSummary(null);

    Papa.parse(CSV_SAMPLE_TEXT, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const detectedHeaders = Object.keys(results.data[0] as object);
        setHeaders(detectedHeaders);
        setCsvRawData(results.data);
        autoMapHeaders(detectedHeaders);
      }
    });
  };

  const handleExecuteImport = async () => {
    if (!csvRawData.length) return;
    setIsProcessing(true);
    try {
      const recordsToImport: Partial<Dispute>[] = csvRawData.map(row => {
        return {
          internalCaseId: mapping.internalCaseId ? row[mapping.internalCaseId] : undefined,
          orderRef: mapping.orderRef ? row[mapping.orderRef] : undefined,
          transactionRef: mapping.transactionRef ? row[mapping.transactionRef] : undefined,
          paymentProcessor: mapping.paymentProcessor ? row[mapping.paymentProcessor] : 'Manual Import',
          disputeReasonCode: mapping.disputeReasonCode ? row[mapping.disputeReasonCode] : '10.4',
          disputeReasonCategory: mapping.disputeReasonCategory ? row[mapping.disputeReasonCategory] : 'Imported Dispute',
          disputeAmount: mapping.disputeAmount ? parseFloat(row[mapping.disputeAmount]) || 100 : 100,
          currency: mapping.currency ? row[mapping.currency] : (currentOrg?.currency || 'USD'),
          customerName: mapping.customerName ? row[mapping.customerName] : 'Customer',
          customerEmail: mapping.customerEmail ? row[mapping.customerEmail] : 'customer@example.com',
          trackingNumber: mapping.trackingNumber ? row[mapping.trackingNumber] : '',
          submissionDeadline: mapping.submissionDeadline ? row[mapping.submissionDeadline] : undefined,
          status: 'new'
        };
      });

      const summary = await importDisputesBatch(recordsToImport, fileName || 'imported_file.csv');
      setImportSummary(summary);
      setCsvRawData([]);
      setHeaders([]);
    } catch (err: any) {
      console.error('Import failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dispute CSV Data Ingestion</h1>
          <p className="text-xs text-slate-400 mt-1">
            Universal drag-and-drop CSV importer with column mapping, duplicate detection, and formula injection defense.
          </p>
        </div>

        <button
          onClick={handleLoadSampleCsv}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-cyan-300 rounded-xl transition shrink-0"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
          Load Sample DTC CSV Template
        </button>
      </div>

      {/* Security notice regarding formula injection and sanitization */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-semibold text-slate-200">Formula Injection Sanitization Enabled:</span> Untrusted fields beginning with spreadsheet execution triggers (<code className="text-cyan-400">=</code>, <code className="text-cyan-400">+</code>, <code className="text-cyan-400">-</code>, <code className="text-cyan-400">@</code>) are safely neutralized to prevent DDE/CSV injection attacks.
          </div>
        </div>
      </div>

      {/* Import Success Banner */}
      {importSummary && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <div>
              <h4 className="text-sm font-bold text-white">Data Ingestion Completed</h4>
              <p className="text-xs text-emerald-300">
                Successfully imported <strong>{importSummary.imported}</strong> new dispute cases. 
                {importSummary.duplicates > 0 && ` Skipped ${importSummary.duplicates} duplicate cases.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {csvRawData.length === 0 ? (
        /* Dropzone Card */
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
          className="p-12 rounded-2xl border-2 border-dashed border-slate-800 hover:border-cyan-500/50 bg-slate-900/40 hover:bg-slate-900/60 transition cursor-pointer text-center group"
        >
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv,text/csv"
            onChange={(e) => e.target.files && e.target.files[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition">
            <UploadCloud className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="text-base font-bold text-white">Drag & drop your dispute CSV file here</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Supports exports from Shopify, Stripe, PayPal, Chargeflow, or custom ERP systems.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-[11px] font-medium px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300">
              Browse Files (.csv)
            </span>
          </div>
        </div>
      ) : (
        /* Column Mapping & Preview Interface */
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                  Map CSV Columns ({fileName})
                </h3>
                <p className="text-xs text-slate-400">
                  Detected {headers.length} headers and {csvRawData.length} records. Confirm field mappings before committing.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCsvRawData([]);
                    setHeaders([]);
                  }}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteImport}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-950/40 transition"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Ingesting Records...
                    </>
                  ) : (
                    <>
                      Import {csvRawData.length} Records
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Column Mapping Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {targetFields.map(field => (
                <div key={field.key} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 block truncate">
                    {field.label}
                  </label>
                  <select
                    value={mapping[field.key] || ''}
                    onChange={(e) => setMapping(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">-- Leave Unmapped --</option>
                    {headers.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* First 5 Rows Preview */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Data Preview (First 5 Rows)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500">
                    {headers.slice(0, 7).map(h => (
                      <th key={h} className="py-2 px-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {csvRawData.slice(0, 5).map((row, idx) => (
                    <tr key={idx}>
                      {headers.slice(0, 7).map(h => (
                        <td key={h} className="py-2 px-3 truncate max-w-[140px] font-mono text-[11px]">
                          {row[h] || '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Import History / Existing Dataset Stats */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white">Current Organization Data Volume</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Cases Stored</span>
            <div className="text-xl font-black text-white mt-1">{disputes.length}</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Disputed Value</span>
            <div className="text-xl font-black text-cyan-400 mt-1">
              ${disputes.reduce((sum, d) => sum + (Number(d.disputeAmount) || 0), 0).toFixed(2)}
            </div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Active Tenant</span>
            <div className="text-sm font-bold text-slate-200 mt-1 truncate">{currentOrg?.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
