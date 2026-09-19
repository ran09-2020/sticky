import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportToPdf(element: HTMLElement, filename: string = 'luach.pdf') {
  try {
    // Capture the canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#f9fafb',
      logging: false,
    });

    // Calculate dimensions
    const imgWidth = 297; // A4 landscape width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF({
      orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(filename);

    return true;
  } catch (error) {
    console.error('Failed to export PDF:', error);
    return false;
  }
}
