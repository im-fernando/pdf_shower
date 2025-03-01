import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configuração estática do worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

interface PDFViewerProps {
  pdfUrl: string | null;
  darkMode?: boolean;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, darkMode = false }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [inputPage, setInputPage] = useState<string>('1');

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setInputPage('1');
  }

  function changePage(offset: number) {
    const newPageNumber = pageNumber + offset;
    if (newPageNumber >= 1 && newPageNumber <= (numPages || 1)) {
      setPageNumber(newPageNumber);
      setInputPage(newPageNumber.toString());
    }
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function goToPage() {
    const pageNum = parseInt(inputPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= (numPages || 1)) {
      setPageNumber(pageNum);
    } else {
      setInputPage(pageNumber.toString());
    }
  }

  return (
    <div className={`border ${darkMode ? 'border-gray-600 bg-gray-900 text-gray-200' : 'border-gray-300 bg-white text-gray-800'} rounded p-5`}>
      {pdfUrl && (
        <>
          <Document 
            file={pdfUrl} 
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <div className="mb-5 flex justify-center">
              <div className={`rounded-lg overflow-hidden ${darkMode ? 'shadow-lg shadow-black/50' : 'shadow-md shadow-black/20'}`}>
                <Page 
                  pageNumber={pageNumber}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  width={300}
                  className={darkMode ? 'dark-mode-page' : ''}
                />
              </div>
            </div>
          </Document>

          {numPages && (
            <div className={`flex justify-center items-center mt-5 gap-2.5 p-2.5 rounded-lg ${darkMode ? 'bg-gray-800 shadow-lg shadow-black/30' : 'bg-gray-100 shadow shadow-black/10'}`}>
              <button 
                onClick={previousPage} 
                disabled={pageNumber <= 1}
                className={`px-3 py-2 rounded flex items-center font-bold text-white ${
                  pageNumber <= 1 
                    ? (darkMode ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-400 cursor-not-allowed') 
                    : (darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600')
                }`}
              >
                <span className="text-lg mr-1">&laquo;</span> Anterior
              </button>
              
              <div className={`flex items-center gap-1.5 px-4 ${darkMode ? 'border-l border-r border-gray-600' : 'border-l border-r border-gray-300'}`}>
                <p className="m-0 font-bold">Página</p>
                <input
                  type="text"
                  value={inputPage}
                  onChange={(e) => setInputPage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && goToPage()}
                  onBlur={goToPage}
                  className={`w-10 p-1 text-center font-bold rounded ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-200 border border-gray-600' 
                      : 'bg-white text-gray-800 border border-gray-300'
                  }`}
                />
                <p className="m-0 font-bold">de <span>{numPages}</span></p>
              </div>
              
              <button 
                onClick={nextPage} 
                disabled={pageNumber >= numPages}
                className={`px-3 py-2 rounded flex items-center font-bold text-white ${
                  pageNumber >= numPages 
                    ? (darkMode ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-400 cursor-not-allowed') 
                    : (darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600')
                }`}
              >
                Próxima <span className="text-lg ml-1">&raquo;</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PDFViewer; 