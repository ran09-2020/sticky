import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

export async function exportToPdf(element: HTMLElement, filename: string = 'luach.pdf') {
  try {
    // Capture the canvas
    const dataUrl = await toPng(element, {
      pixelRatio: 2,
      backgroundColor: '#f9fafb',
    });

    const img = new Image();
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = dataUrl;
    });

    // Calculate dimensions
    const imgWidth = 297; // A4 landscape width in mm
    const imgHeight = (img.height * imgWidth) / img.width;

    // Create PDF
    const pdf = new jsPDF({
      orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(filename);

    return true;
  } catch (error) {
    console.error('Failed to export PDF:', error);
    return false;
  }
}
