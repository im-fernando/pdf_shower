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
    <div className={`container max-w-3xl mx-auto p-5 relative ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min-h-screen`}>
      {/* Botão de Tema */}
      <button
        onClick={toggleTheme}
        className={`absolute top-5 right-5 p-2.5 rounded-full w-10 h-10 flex items-center justify-center ${
          darkMode ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'
        } border-none cursor-pointer shadow-md z-10`}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      <h1 className="text-center mb-5 text-2xl font-bold">Gerador de PDF</h1>
      
      {!pdfGenerated ? (
        <form onSubmit={handleSubmit} className={`flex flex-col gap-4 ${
          darkMode ? 'bg-gray-800 shadow-lg shadow-black/50' : 'bg-gray-100 shadow shadow-black/10'
        } p-5 rounded-lg`}>
          <div>
            <label htmlFor="name" className="block mb-1">Nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full p-2 mt-1 rounded ${
                darkMode 
                  ? 'bg-gray-700 text-white border border-gray-600' 
                  : 'bg-white text-gray-900 border border-gray-300'
              }`}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block mb-1">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full p-2 mt-1 rounded ${
                darkMode 
                  ? 'bg-gray-700 text-white border border-gray-600' 
                  : 'bg-white text-gray-900 border border-gray-300'
              }`}
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block mb-1">Mensagem:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className={`w-full p-2 mt-1 rounded ${
                darkMode 
                  ? 'bg-gray-700 text-white border border-gray-600' 
                  : 'bg-white text-gray-900 border border-gray-300'
              }`}
            />
          </div>
          
          <button 
            type="submit" 
            className={`py-2.5 px-4 ${
              darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
            } text-white border-none rounded cursor-pointer text-base font-medium`}
          >
            Gerar PDF
          </button>
        </form>
      ) : (
        <div className={`flex flex-col gap-5 ${
          darkMode ? 'bg-gray-800 shadow-lg shadow-black/50' : 'bg-gray-100 shadow shadow-black/10'
        } p-5 rounded-lg`}>
          <div className="flex justify-between">
            <button 
              onClick={() => {
                setPdfGenerated(false);
                if (pdfUrl) {
                  URL.revokeObjectURL(pdfUrl);
                  setPdfUrl(null);
                }
              }}
              className="py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white border-none rounded cursor-pointer"
            >
              Voltar ao Formulário
            </button>
            
            {pdfUrl && (
              <a 
                href={pdfUrl} 
                download="formulario.pdf"
                className="py-2.5 px-4 bg-blue-500 hover:bg-blue-600 text-white no-underline rounded inline-block"
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
