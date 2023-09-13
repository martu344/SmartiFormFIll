import pdf from 'pdf-poppler';
import fs from 'fs';
import path from 'path';
import {principal} from './app.js'


 async function conversion(archivo) {
 const pdfPath = path.join('./Images', archivo);
const outputDir = './ImagesFinal'; 

const opts = {
  format: '.jpg', 
  out_dir: outputDir, 
  out_prefix: 'image', 
  page: '1', 
};

try {
    const result = await pdf.convert(pdfPath, opts);
    console.log('Conversión exitosa:', result);
  } catch (error) {
    console.error('Error al convertir el PDF:', error);
  }
}

export function images(){
const carpeta = './Images'

fs.readdir(carpeta, async (error, archivos) => {
    if (error) {
        console.error('Error al leer el directorio:', error);
        return;
      }
const extensioneshabilitadas = '.jpg';
for (const archivo of archivos){
    const extension = path.extname(archivo).toLowerCase();
    if (extension != '.pdf' ){
        fs.rename(`./Images/${archivo}`, './Imagesfinal/image-1.jpg', async (error) => {
            if (error) {
              console.error('Error al cambiar el nombre del archivo:', error);
            } else {
              console.log('Nombre del archivo cambiado con éxito.',archivo);
              
              await principal();
            
            }
        fs.unlink(`./Images/${archivo}`, (error) => {
                if (error) {
                  console.error('Error al borrar el archivo:', error);
                } else {
                  console.log(`Archivo ${archivo} borrado con éxito.`);
                }
              });
              
            
          });
    } else if (extension == '.pdf'){
        await conversion(archivo);

        fs.unlink(`./Images/${archivo}`, (error) => {
            if (error) {
              console.error('Error al borrar el archivo:', error);
            } else {
              console.log(`Archivo ${archivo} borrado con éxito.`);
            }
        });
       
        await principal();
    }
}

})}