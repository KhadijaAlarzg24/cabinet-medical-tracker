'use client';

import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { generateDatabaseSmartReport } from '@/app/actions/reportAction';

export default function AiReportButton() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setIsOpen(true);
    setReport(null);

    const result = await generateDatabaseSmartReport();
    
    if (result.success) {
      setReport(result.report || 'No report generated.');
    } else {
      setReport('Error: ' + (result.error || 'Failed to generate report.'));
    }
    setLoading(false);
  };

  return (
    <>
      {/* الزر الذي سيحل محل زر Rapport automatique الثابت */}
      <button
        onClick={handleGenerate}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-sm cursor-pointer"
      >
        <Sparkles className="h-4 w-4 text-blue-200 animate-pulse" />
        <span className="text-sm font-medium">Rapport automatique</span>
      </button>

      {/* النافذة المنبثقة (Modal) لعرض تقرير الـ AI Agent */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 flex flex-col max-h-[85vh]">
            
            {/* رأس النافذة */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">AI Clinic Practice Report</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* محتوى التقرير (يظهر التحميل ثم النص المُولّد) */}
            <div className="py-6 overflow-y-auto flex-1 text-gray-700 text-sm whitespace-pre-line leading-relaxed">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p>Analyzing patient database & generating insights...</p>
                </div>
              ) : (
                report
              )}
            </div>

            {/* أسفل النافذة */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition text-sm cursor-pointer"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}