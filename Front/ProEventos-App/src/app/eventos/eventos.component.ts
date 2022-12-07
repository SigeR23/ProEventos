import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  public eventos: any = [];
  public eventosFiltrados: any = [];
  public widthImg = 50;
  public marginImg = 2;
  public imgIsCollapsed = false;
  private _filtro = '';

  public get filtro() : string {
    return this._filtro;
  }

  public set filtro(value: string) {
    this._filtro = value;
    this.eventosFiltrados = this._filtro ? this.filtrarEventos(this._filtro) : this.eventos;
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getEventos();
  }

  filtrarEventos(filtrarPor: string) : any {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter((e: { tema: string; local: string; }) => e.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 || e.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1);
  }

  public getEventos(): void {
    this.http.get("https://localhost:5001/api/Eventos").subscribe(
      response => {
        this.eventos = response;
        this.eventosFiltrados = response;
      },
      error => console.log(error)
    );
  }

}
