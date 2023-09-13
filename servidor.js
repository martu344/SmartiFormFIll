import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import {images} from './images.js'

const servidor = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let contador = 1;
//carga de imagenes

// Configurar la ubicación donde se guardarán los archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images'); // Directorio de destino
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    const nombreBase = 'doc'; 
    
    function generarNombre() {
      const nombreArchivo = `${nombreBase}${contador}${extname}`;
      contador++;
      return nombreArchivo;
    }

    const nombreArchivo = generarNombre();
    cb(null, nombreArchivo); // Llama a la función para obtener el nombre de archivo único
  },
});

// Configurar multer
const upload = multer({ storage: storage });

// Ruta para manejar la carga de archivos

servidor.use(express.static(path.join(__dirname, 'public')));


servidor.post('/upload',  upload.any(), (req, res) => {
    res.sendFile(path.resolve(__dirname,'./public/procesado.html'));
    
    images()
  });

servidor.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './index.html'));
});

servidor.get('*',(req,res)=>{
    res.send('NO SE ENCONTRO LA PAGINA')
})


servidor.listen(4000,()=>{

    console.log('servidor funcionando')
});

