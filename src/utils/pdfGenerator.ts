import html2pdf from 'html2pdf.js/dist/html2pdf.min';

export const generatePDF = async (element: HTMLElement, fileName: string = 'invoice.pdf') => {
  const opt = {
    margin: 1,
    filename: fileName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  try {
    const pdf = await html2pdf().set(opt).from(element).save();
    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};