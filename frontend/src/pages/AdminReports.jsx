import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiDownload, FiBarChart2, FiFileText } from 'react-icons/fi';

const AdminReports = () => {
  const { showToast } = useAuth();
  const [downloading, setDownloading] = useState(false);

  const handleCsvDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch('http://localhost:5000/api/reports/export-csv', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to generate CSV export');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `complaints-report-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast('CSV export downloaded successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Download error', 'error');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 min-h-screen p-6 sm:p-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Report & Download Center</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed font-medium">
            Export ticket records, verify service speeds, and analyze department compliance ratings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CSV export card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col justify-between gap-8 group hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -mr-10 -mt-10 opacity-50 group-hover:scale-110 transition-transform pointer-events-none"></div>
            
            <div className="flex flex-col gap-4 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-3xl shadow-inner group-hover:bg-teal-100 transition-colors">
                <FiFileText />
              </div>
              <div>
                <h3 className="font-black text-slate-800 dark:text-slate-100 text-2xl mb-2 group-hover:text-teal-700 transition-colors">Raw Grievance Audit Logs</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                  Export the full database of complaints as a structured CSV spreadsheet. This contains tracking IDs, category departments, priority ratings, creation dates, resolution notes, and officer names.
                </p>
              </div>
            </div>

            <button
              onClick={handleCsvDownload}
              disabled={downloading}
              className="w-full py-4 bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-teal-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 relative z-10"
            >
              <FiDownload className="text-lg" /> {downloading ? 'Generating Spreadsheet...' : 'Export Complaints (CSV)'}
            </button>
          </div>

          {/* Analytics card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col justify-between gap-8 group hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-10 -mt-10 opacity-50 group-hover:scale-110 transition-transform pointer-events-none"></div>
            
            <div className="flex flex-col gap-4 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl shadow-inner group-hover:bg-indigo-100 transition-colors">
                <FiBarChart2 />
              </div>
              <div>
                <h3 className="font-black text-slate-800 dark:text-slate-100 text-2xl mb-2 group-hover:text-indigo-700 transition-colors">Department KPI Summaries</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                  Compile summaries containing operational performance indexes, average days elapsed before resolution, and compliance parameters against the system-wide SLA limits.
                </p>
              </div>
            </div>

            <button
              onClick={() => showToast('KPI compilation logic completed. Render charts dynamically on dashboard pages.', 'info')}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl shadow-lg shadow-slate-900/20 transition-all active:scale-95 relative z-10"
            >
              Review Performance Metrics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
