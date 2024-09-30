import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Noticias } from './noticias';
import { AlertController, Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ServicebdService {
  //variable de conexión a la Base de Datos
  public database!: SQLiteObject;

  //variables de creación de tablas
  tablaNoticia: string = "CREATE TABLE IF NOT EXISTS noticia(idnoticia INTEGER PRIMARY KEY autoincrement, titulo VARCHAR(100) NOT NULL, texto TEXT NOT NULL);";
  
  //variables de insert por defecto en la bd

  //buscar como eliminar un insert por defecto y que no se vuelva a ejecutar nuevamente
  registroNoticia: string = "INSERT OR IGNORE INTO tablaNoticia (idnoticia, titulo, texto) VALUES (1, 'Soy el titulo de una noticia', 'Soy el contenido de la noticia')";

  //variables para guardar los registros resultantes de los select
  //se recomienda que se creee una clase para cada select que traiga distintos datos
  //las clases se añaden mediante cmd (ionic generate)
  //tambien se genera clase para utilizar join
  listadoNoticias = new BehaviorSubject([]);


  //variable para manipular el estado de la Base de Datos (solo se crea UNA variable de este tipo)
  //cuando la bd este lista cambiar el valor
  private idDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  //Platform: verifica que el dispositivo permita usar la bd
  //añadir las alertas a un servicio y NO PUEDE HABER ALERTAS REPETIDAS
  constructor(private sqlite: SQLite, private platform: Platform, private alertController: AlertController) { 
    this.crearBD();
  }

  //funciones de retorno de observables
  //se recomienda que todas las funciones de los select comience con fetch y luego un nombre referente de lo que devuelve
  //la variable
  //siempre devuelve un observable
  fetchNoticias(): Observable<Noticias[]>{
    return this.listadoNoticias.asObservable();
  } 

  //val observable de la bd
  dbState(){
    return this.idDBReady.asObservable();
  }

  async presentAlert(titulo:string, msj:string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
    });

    await alert.present();
  }

  crearBD(){
    //verificar la plataforma esta dispoible o de error
    //en la funcion de flecha se añade .then(()=>{}) el () antes de la flecha se añade para no capturar la info de la funcion de flecha 
    this.platform.ready().then(()=>{
      //procedemos a crear la base de datos
      this.sqlite.create({
        //necesita 2 parametros
        name: 'noticias.db', //nombre conexion (luego del nombre se añade .db) al cambiar el nombre se creara una conexion nueva y se podra utilizar tablas nuevas
        location: 'default' //localicacion bd en default
      }).then((db: SQLiteObject)=>{ //.then() si la conexion es exitosa
        //capturar y guardar la conexion de Base de Datos
        this.database = db;
        //llamar a la funcion de creacion de tablas
        this.creartablas();

        //modificar el observable (todos los observables se les cambia el valor con .next() y en el () se inserta el nuevo valor)
        this.idDBReady.next(true);
      }).catch(e=>{
        this.presentAlert("Creacion de BD", "error creando la BD" + JSON.stringify(e));
      })
    })
  }

  //para reconocer await la funcion debe ser asyncrona (async funcion(){ })
  async creartablas(){
    try{
      //mandar a ejecutar las tablas en el orden especifico
      //se le agrega await para que el programa espere a que ejecute una linea para pasar a la siguiente
      await this.database.executeSql(this.tablaNoticia,[])

      //generamos los insert en caso que existan
      await this.database.executeSql(this.registroNoticia,[])

    }catch(e){
      this.presentAlert("Creacion de tabla", "Error creando la tablas" + JSON.stringify(e));
    }
  }
}















