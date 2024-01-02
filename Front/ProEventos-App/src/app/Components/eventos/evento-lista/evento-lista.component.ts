import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EventoService } from '@app/services/evento.service';
import { Evento } from 'src/models/Evento';
import { HttpErrorResponse } from '@angular/common/http';

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
  public eventoId: number = 0
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
    this.carregarEventos();
  }

  public confirm(): void {
    this.modalRef.hide();
    this.spinner.show();
    this.eventoService.deleteEvento(this.eventoId).subscribe({
      next: (result: any) => {
        if (result.message === 'Deletado') {
          this.toastr.success("O evento foi deletado com sucesso", "Deletado!");
          this.spinner.hide();
          this.carregarEventos();
        }
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error(`Erro ao tentar deletar o evento ${this.eventoId}:`, 'Erro');
        console.log(error);
        this.spinner.hide();
      },
      complete: () => {}
    });
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

  public carregarEventos(): void {
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

  public openModal(event: MouseEvent, template: TemplateRef<any>, eventoId: number): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

}
