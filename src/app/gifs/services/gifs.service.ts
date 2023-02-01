import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';


@Injectable({
  providedIn: 'root'
})
export class GifsService {
  
  //apiKey es la direccion de los gifs traida de giphy developers 
  private apiKey     : string='52s0Vr0jBkKzL77aKevImu4Gt74X2ssK';
  private servicioUrl: string='https://api.giphy.com/v1/gifs';
                   
  private _historial:string[]=[];

  //TODO: cambiar any por su tipo
  public resultados: Gif[]=[];

  get historial(){

    return [...this._historial];
  }

  constructor (private http: HttpClient){

    // 1 forma de almacenar los resultados
    if(localStorage.getItem('historial')){
      this._historial= JSON.parse( localStorage.getItem('historial')!) ;
    // 2 forma de almacenar los resultados
    this.resultados=JSON.parse(localStorage.getItem('resultados')!)
  
    }
  }

  buscarGifs( query: string = '' ){

    query=query.trim().toLocaleLowerCase();
    
    // no ingresar valores repetidos en el arreglo
    if( !this._historial.includes(query)){
      this._historial.unshift(query);
   //solo mostrar los ultimos 10 registros ingresados
      this._historial=this._historial.splice(0,10);

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', '10')
    .set('q', query);
    console.log(params.toString())
    
 
    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, {params})  
    .subscribe((resp) =>{
      
      this.resultados=resp.data;
      localStorage.setItem('resultados',JSON.stringify(this.resultados));
      
    });
  }
}
