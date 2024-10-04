import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.page.html',
  styleUrls: ['./listar.page.scss'],
})
export class ListarPage implements OnInit {
  //se debe crear una variable con any (ya que tenemos varios tipos de datos) para almacenar los registros de bd
  arregloNoticias: any = [
    {
      id: '',
      titulo: '',
      texto: ''
    }
  ];


  //llamar al servicio de bd EN LA PRIMERA PAG Y EN EL CONSTRUCTOR
  constructor(private bd: ServicebdService, private router: Router) { }

  ngOnInit() {
    //se verifica si la base de datos esta lista o no
    this.bd.dbState().subscribe(data=>{
      if(data){
        //subscribir al observable de la consulta
        this.bd.fetchNoticias().subscribe(res=>{
          this.arregloNoticias = res;
        })
      }
    });
  }

  //funciones

  modificar(x: any){
    //var de contexto
    let navigationExtras: NavigationExtras = {
      state: {
        noticiaEnviada: x
      }
    }
    this.router.navigate(['/modificar'], navigationExtras);
  }

  eliminar(x: any){

  }

}
