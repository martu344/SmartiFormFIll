import { PDFDocument, rgb } from 'pdf-lib';
import { promises as fsPromises } from 'fs';

(async () => {
  const pdfBytes = await fsPromises.readFile('archivo.pdf');
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const [firstPage] = pdfDoc.getPages();

  // Renderizar la página como una imagen (ajusta el tamaño según sea necesario)
  const imgBytes = await firstPage.asPNG();

  // Guardar la imagen en un archivo
  await fsPromises.writeFile('pagina.png', imgBytes);

  console.log('Imagen guardada como pagina.png');
})();
