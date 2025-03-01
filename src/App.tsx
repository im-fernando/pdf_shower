import { useState, FormEvent, ChangeEvent } from 'react';
import { Document as PDFDocument, Page as PDFPage, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configuração estática do worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

// Estilos para o PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  field: {
    fontSize: 14,
    marginBottom: 10,
  },
});

// Defina a interface para os dados do formulário
interface FormData {
  name: string;
  email: string;
  message: string;
}

// Componente que define a estrutura do PDF
const MyDocument = ({ formData }: { formData: FormData }) => (
  <PDFDocument>
    <PDFPage size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Dados do Formulário</Text>
        <Text style={styles.field}>Nome: {formData.name}</Text>
        <Text style={styles.field}>Email: {formData.email}</Text>
        <Text style={styles.field}>Mensagem: {formData.message}</Text>
      </View>
    </PDFPage>
  </PDFDocument>
);

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [inputPage, setInputPage] = useState<string>('1');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Gera o PDF
    const blob = await pdf(<MyDocument formData={formData} />).toBlob();
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    setPdfGenerated(true);
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setInputPage('1');
  }

  function changePage(offset: number) {
    const newPageNumber = pageNumber + offset;
    if (newPageNumber >= 1 && newPageNumber <= (numPages || 1)) {
      setPageNumber(newPageNumber);
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
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Gerador de PDF</h1>
      
      {!pdfGenerated ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          
          <div>
            <label htmlFor="message">Mensagem:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          
          <button 
            type="submit" 
            style={{ 
              padding: '10px 15px', 
              backgroundColor: '#4CAF50', 
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Gerar PDF
          </button>
        </form>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button 
              onClick={() => {
                setPdfGenerated(false);
                if (pdfUrl) {
                  URL.revokeObjectURL(pdfUrl);
                  setPdfUrl(null);
                }
              }}
              style={{ 
                padding: '10px 15px', 
                backgroundColor: '#f44336', 
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Voltar ao Formulário
            </button>
            
            {pdfUrl && (
              <a 
                href={pdfUrl} 
                download="formulario.pdf"
                style={{ 
                  padding: '10px 15px', 
                  backgroundColor: '#2196F3', 
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  display: 'inline-block'
                }}
              >
                Baixar PDF
              </a>
            )}
          </div>
          
          <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '20px' }}>
            {pdfUrl && (
              <>
                <Document 
                  file={pdfUrl} 
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <div style={{ marginBottom: '20px' }}>
                    <Page 
                      pageNumber={pageNumber}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      width={750}
                    />
                  </div>
                </Document>

                {numPages && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    marginTop: '20px', 
                    gap: '10px' 
                  }}>
                    <button 
                      onClick={previousPage} 
                      disabled={pageNumber <= 1}
                      style={{
                        padding: '8px 12px', 
                        backgroundColor: pageNumber <= 1 ? '#ccc' : '#2196F3', 
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: pageNumber <= 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      &lt; Anterior
                    </button>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <p style={{ margin: 0 }}>Página</p>
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
                          border: '1px solid #ccc',
                          borderRadius: '4px'
                        }}
                      />
                      <p style={{ margin: 0 }}>de <span>{numPages}</span></p>
                    </div>
                    
                    <button 
                      onClick={nextPage} 
                      disabled={pageNumber >= numPages}
                      style={{
                        padding: '8px 12px', 
                        backgroundColor: pageNumber >= numPages ? '#ccc' : '#2196F3', 
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: pageNumber >= numPages ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Próxima &gt;
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
