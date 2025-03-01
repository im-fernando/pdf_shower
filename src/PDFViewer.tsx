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
    <div style={{ 
      border: darkMode ? '1px solid #555' : '1px solid #ddd', 
      borderRadius: '4px', 
      padding: '20px',
      backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
      color: darkMode ? '#e0e0e0' : '#333333'
    }}>
      {pdfUrl && (
        <>
          <Document 
            file={pdfUrl} 
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
              <Page 
                pageNumber={pageNumber}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                width={300}
                className={darkMode ? 'dark-mode-page' : ''}
              />
            </div>
          </Document>

          {numPages && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              marginTop: '20px', 
              gap: '10px',
              padding: '10px',
              backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
              borderRadius: '8px',
              boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <button 
                onClick={previousPage} 
                disabled={pageNumber <= 1}
                style={{
                  padding: '8px 12px', 
                  backgroundColor: pageNumber <= 1 
                    ? (darkMode ? '#555' : '#ccc') 
                    : (darkMode ? '#0d6efd' : '#2196F3'), 
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: pageNumber <= 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 'bold'
                }}
              >
                <span style={{ fontSize: '18px', marginRight: '5px' }}>&laquo;</span> Anterior
              </button>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '5px',
                padding: '0 15px',
                borderLeft: darkMode ? '1px solid #555' : '1px solid #ddd',
                borderRight: darkMode ? '1px solid #555' : '1px solid #ddd'
              }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>Página</p>
                <input
                  type="text"
                  value={inputPage}
                  onChange={(e) => setInputPage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && goToPage()}
                  onBlur={goToPage}
                  style={{
                    width: '40px',
                    padding: '4px',
                    textAlign: 'center',
                    backgroundColor: darkMode ? '#3d3d3d' : '#fff',
                    color: darkMode ? '#e0e0e0' : '#333',
                    border: darkMode ? '1px solid #555' : '1px solid #ccc',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}
                />
                <p style={{ margin: 0, fontWeight: 'bold' }}>de <span>{numPages}</span></p>
              </div>
              
              <button 
                onClick={nextPage} 
                disabled={pageNumber >= numPages}
                style={{
                  padding: '8px 12px', 
                  backgroundColor: pageNumber >= numPages 
                    ? (darkMode ? '#555' : '#ccc') 
                    : (darkMode ? '#0d6efd' : '#2196F3'),  
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: pageNumber >= numPages ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 'bold'
                }}
              >
                Próxima <span style={{ fontSize: '18px', marginLeft: '5px' }}>&raquo;</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PDFViewer; 