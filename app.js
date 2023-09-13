import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path'
import axios from 'axios'
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();


 //Conversion de texto
 var contenido =[];
 var arrayResultado=[];
 async function llamado(){


  const imageName = './ImagesFinal/image-1.jpg';
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const imagePath = path.join(__dirname, imageName);
  const imageBytes = fs.readFileSync(imagePath);


    const subscriptionKey = process.env.CONTRASEÑA;
    const url = 'https://extraccion1.cognitiveservices.azure.com/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=read&language=en&gender-neutral-caption=False';

     await axios.post(url, imageBytes, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Ocp-Apim-Subscription-Key':  process.env.PASSWORD
        }
      })
        .then(response => { 
      contenido = response.data.readResult.pages[0].words;
      //console.log('ingreso a axios',contenido)

// Respuesta del Form
      const arrayDeCampo=[ ['Nº','000000'],//1
      ['FECHA', '000000'],//2
      ['INICIO','000000'],//3
      ['CARÁTULA','CARATULA'],//4
      ['Nº', '000000'],//5
      ['VICTIMA', 'VÍCTIMA'],//6
      ['DNI', '000000'],//7
      ['IMPUTADO', '000000'],//8
      ['DNI', '000000'],//9
      ['Nº', '000000'],//10
      ['JUDICIAL', '000000'],//11
      ['DESCENTRALIZADA', '000000'],//12
      ['DEPENDENCIA', '000000'],//13
      ['SOLICITANTE', '000000'],//14
    ['CALLE', '000000'],//15
    ['Nº', '000000'],//16
    ['G.P.S.', 'C.P.S.'],//17
    ['OBSERVACIONES', '000000']//18
  ]
      const arrayDeCampo2=[['FECHA','000000'],//1
        ['HORA','000000'],//2
        ['REF.','000000'],//3
        ['I.P.P./CAUSA','000000'],//4
        ['VICTIMA','000000'],//5
        ['DNI','000000'],//6
        ['IMPUTADO','000000'],//7
       [ 'DNI','000000'],//8
        ['U.F.I.','000000'],//9
        ['DR./A.','DR.'],//10
        ['DESCENTRALIZADA','000000'],//11
        ['DEPENDENCIA','000000'],//12
        ['DEPENDENCIA','000000'],//13
        ['DATOS','000000'],//14
        ['Nº','000000'],//15
        ['LOCALIDAD','TIPO'],//16
        ['VEHICULO','000000'],//17
        ['000000','000000']
      ]
      var numbermagic=0;
      var NumberCampo=0
      var cadena=''
      var activado=true
      arrayResultado.length=0

       contenido.map((elemento,index)=> { console.log(elemento.content);
         // console.log(NumberCampo)
          
       if(elemento.content == arrayDeCampo[NumberCampo][0] || elemento.content == arrayDeCampo[NumberCampo][1] ){
        cadena='';
        activado=true

  
  for(var i=1;i<6;i++){

  numbermagic=index+i;
 //console.log('primero paso por aca')
  if(numbermagic==contenido.length){
    arrayResultado.push(cadena)
   break;
  }
  else if(contenido[numbermagic].content != arrayDeCampo2[NumberCampo][0])
  {
    cadena +=  contenido[numbermagic].content+' '

  }
  if(contenido[numbermagic].content == arrayDeCampo2[NumberCampo][0] || contenido[numbermagic].content == arrayDeCampo2[NumberCampo][1] && activado){
    
     if( cadena == ''){
          cadena = '0000'
          arrayResultado.push(cadena)
          activado=false
     } else{
      //console.log('ingreso a comun')
       arrayResultado.push(cadena)
      activado=false}
  }
  else if(i == 5 && activado){
    //console.log('ingreso a 8')
    arrayResultado.push(cadena)
    activado=false
  }
  
}   
// console.log(NumberCampo)
//console.log('respuestas para el formulario', arrayResultado)
NumberCampo++

}
        
       })
       return arrayResultado

        })
      .catch(error => {
        console.error(error);
        // Manejar el error aquí
      });
 }
 //llamado()

//PUPPETER
//Llenado del form
 async function form () {
  console.log('respuestas para el formulario', arrayResultado)
  const input = ['#NL_NroActaLEF',
    '#NL_FechaInicio',
    '#NL_HoraInicio',
    '#NL_Caratula',
    '#NL_IppCausa']
     const navegador = await puppeteer.launch({headless: false});
     const page = await navegador.newPage();
     await page.goto('http://10.62.12.16/SuperintendenciaCientifica')
    
     await page.type('[placeholder="Nombre de Usuario"]','robottaro')
     await page.type('[placeholder="Password"]','485847')
     await page.click('.btn.btn-primary.btn-block.btn-flat')
     const page2 = await navegador.newPage();
     await page2.goto('http://10.62.12.16/SuperintendenciaCientifica/v.php?v=NuevaLEF')
   
//NRO. ActaLef
     for (var j = 0 ; j<input.length; j++){
      if(input[j]=='#NL_NroActaLEF'){
        
        const regex = /(\d{2})\s*$/;
        const match =  arrayResultado[j].match(regex);

        const regex1 = /(\d{5})\//;
        const match1 = arrayResultado[j].match(regex1);

        if(match && match1){
          var resultado= match1[1]+match[1]
          await page2.type(input[j],resultado)
        }
      }
//IPP causa, Caratula, fecha, hora.   
      else{
        await page2.type(input[j],arrayResultado[j])
        await page2.keyboard.press('Enter')
      }
      
     }
//Hora FIn
await page2.type('#NL_HoraFin','0000')
await page2.keyboard.press('Enter')
//Dpto. judicial
     await page2.click('#select2-NL_DeptoJudicial-container')
     await page2.type('span.select2-search--dropdown input.select2-search__field',arrayResultado[10])
     await page2.keyboard.press('Enter')
//Depencia
     await page2.click('#select2-NL_Dependencia-container')
     await page2.type('span.select2-dropdown--above span.select2-search--dropdown input.select2-search__field',arrayResultado[13])
     await page2.keyboard.press('Enter')
//victima
      await page2.click('#select2-NL_VictimaImputado-container')

      const lista = await page2.$$('li.select2-results__option')
      const victima = lista[3]
      await victima.click()
      await page2.type('#NL_ApeNom',arrayResultado[5])
      await page2.click('#AgregarTablaPersonasProcesales')
//Perito    
     await page2.click('#select2-NL_Especialidad-container')
     await page2.type('span.select2-search--dropdown input.select2-search__field','rastros')
     await page2.click('#select2-NL_Perito-container')
     await page2.type('span.select2-search--dropdown input.select2-search__field','Bottaro, Rocio')
     await page2.keyboard.press('Enter')
//Domicilio
      await page2.click('#select2-NL_Partido-container')
      await page2.type('span.select2-search--dropdown input.select2-search__field',arrayResultado[11].trim())
      await page2.keyboard.press('Enter')
      //await page2.type('#NL_Calle',arrayResultado[20])
     await page2.type('#NL_Calle',arrayResultado[15])
     await page2.type('#NL_NroCalle',arrayResultado[16])
     await page2.type('#NL_GPS',arrayResultado[17])
//Observaciones
     await page2.type('#NL_Observaciones',arrayResultado[18])
     
   // await page.screenshot({path: 'example.png'})
     //await navegador.close();
    
     console.log('llego')
 };
// form();


export async function principal(){
  try{
    await llamado();
   await form();

  }catch(error){
    console.log(error)
  }
}
//principal();


