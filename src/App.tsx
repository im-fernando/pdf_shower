import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import PDFDocument, { FormData } from './PDFDocument';
import PDFViewer from './PDFViewer';

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Aplicar tema quando mudar
  useEffect(() => {
    if (darkMode) {
      document.body.style.backgroundColor = '#121212';
      document.body.style.color = '#ffffff';
    } else {
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
    }
  }, [darkMode]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Gera o PDF
    const blob = await pdf(<PDFDocument formData={formData} />).toBlob();
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    setPdfGenerated(true);
  };

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className="container" style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '20px',
        position: 'relative',
        backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
        color: darkMode ? '#ffffff' : '#000000',
        minHeight: '100vh'
      }}>
      {/* Botão de Tema */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: darkMode ? '#ffffff' : '#333333',
          color: darkMode ? '#333333' : '#ffffff',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Gerador de PDF</h1>
      
      {!pdfGenerated ? (
        <form onSubmit={handleSubmit} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '15px',
          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: darkMode ? '0 2px 10px rgba(0,0,0,0.5)' : '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <div>
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '8px', 
                marginTop: '5px',
                backgroundColor: darkMode ? '#3d3d3d' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
                border: darkMode ? '1px solid #555' : '1px solid #ced4da',
                borderRadius: '4px'
              }}
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
              style={{ 
                width: '100%', 
                padding: '8px', 
                marginTop: '5px',
                backgroundColor: darkMode ? '#3d3d3d' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
                border: darkMode ? '1px solid #555' : '1px solid #ced4da',
                borderRadius: '4px'
              }}
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
              style={{ 
                width: '100%', 
                padding: '8px', 
                marginTop: '5px',
                backgroundColor: darkMode ? '#3d3d3d' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
                border: darkMode ? '1px solid #555' : '1px solid #ced4da',
                borderRadius: '4px'
              }}
            />
          </div>
          
          <button 
            type="submit" 
            style={{ 
              padding: '10px 15px', 
              backgroundColor: darkMode ? '#007bff' : '#4CAF50', 
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
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px',
          backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: darkMode ? '0 2px 10px rgba(0,0,0,0.5)' : '0 2px 5px rgba(0,0,0,0.1)'
        }}>
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
          
          <PDFViewer pdfUrl={pdfUrl} darkMode={darkMode} />
        </div>
      )}
    </div>
  );
}

export default App;
