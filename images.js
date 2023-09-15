import fs from 'fs'
import path from 'path';
import {principal} from './app.js'
import { fromPath } from "pdf2pic";

 async function conversion(archivo) {
 const pdfPath = await path.join('./Images', archivo);
const outputDir = './ImagesFinal'; 
const options = {
  density: 100,
  saveFilename: "untitled",
  savePath:outputDir,
  format: "png",
  width: 600,
  height: 600
};
const convert = await fromPath('./doc1.pdf', options);
const pageToConvertAsImage = 1;

convert(pageToConvertAsImage, { responseType: "image" })
  .then((resolve) => {
    console.log("Page 1 is now converted as image");

    return resolve;
  });


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