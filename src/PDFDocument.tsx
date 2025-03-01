import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Interface para os dados do formulário
export interface FormData {
  name: string;
  email: string;
  message: string;
}

// Estilos para o PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    paddingBottom: 50,
    position: 'relative',
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
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
  },
});

// Componente que define a estrutura do PDF
const PDFDocument = ({ formData }: { formData: FormData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Dados do Formulário</Text>
        <Text style={styles.field}>Nome: {formData.name}</Text>
        <Text style={styles.field}>Email: {formData.email}</Text>
        <Text style={styles.field}>Mensagem: {formData.message}</Text>
      </View>
      <Text style={styles.footer}>Página 1 de 3</Text>
    </Page>
    
    {/* Segunda página com dados fictícios */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Informações Adicionais</Text>
        <Text style={styles.field}>Departamento: Recursos Humanos</Text>
        <Text style={styles.field}>Data de Submissão: {new Date().toLocaleDateString()}</Text>
        <Text style={styles.field}>Código de Referência: REF-{Math.floor(Math.random() * 10000)}</Text>
        <Text style={styles.field}>Status: Em Processamento</Text>
        <Text style={styles.field}>Prioridade: Alta</Text>
        <Text style={styles.field}>Responsável: João Silva</Text>
      </View>
      <Text style={styles.footer}>Página 2 de 3</Text>
    </Page>
    
    {/* Terceira página com mais dados fictícios */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Termos e Condições</Text>
        <Text style={styles.field}>Ao enviar este formulário, você concorda com nossos termos de serviço.</Text>
        <Text style={styles.field}>Seus dados serão processados de acordo com nossa política de privacidade.</Text>
        <Text style={styles.field}>Você pode solicitar a exclusão de seus dados a qualquer momento.</Text>
        <Text style={styles.field}>Este documento serve como comprovante de envio do formulário.</Text>
        <Text style={styles.field}>Para mais informações, entre em contato conosco pelo e-mail: suporte@exemplo.com</Text>
      </View>
      <Text style={styles.footer}>Página 3 de 3</Text>
    </Page>
  </Document>
);

export default PDFDocument; 