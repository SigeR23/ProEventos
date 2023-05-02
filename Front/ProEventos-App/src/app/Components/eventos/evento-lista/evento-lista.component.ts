import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EventoService } from 'src/app/services/evento.service';
import { Evento } from 'src/models/Evento';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent {
  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  public widthImg = 50;
  public marginImg = 2;
  public imgIsCollapsed = false;
  public modalRef!: BsModalRef;
  private _filtro = '';

  public get filtro() : string {
    return this._filtro;
  }

  public set filtro(value: string) {
    this._filtro = value;
    this.eventosFiltrados = this._filtro ? this.filtrarEventos(this._filtro) : this.eventos;
  }

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
    ) { }

  public ngOnInit(): void {
    this.spinner.show();
    this.getEventos();
  }

  public confirm(): void {
    this.toastr.success("O evento foi deletado com sucesso", "Deletado!");
    this.modalRef.hide();
  }

  public decline(): void {
    this.modalRef.hide();
  }

  public detalheEvento(id: number ): void {
    this.router.navigate([`eventos/detalhe/${id}`]);

  }

  public filtrarEventos(filtrarPor: string) : Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter((e: { tema: string; local: string; }) => e.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 || e.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1);
  }

  public getEventos(): void {
    this.eventoService.getEventos().subscribe({

      next: (eventos: Evento[]) => {
        this.eventos = eventos;
        this.eventosFiltrados = eventos;
      },
      error: (e) => {
        this.toastr.error("Erro ao carregar os eventos", "Erro!");
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  public openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

}
