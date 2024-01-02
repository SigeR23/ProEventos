import { HttpErrorResponse } from '@angular/common/http';
import { Expression } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EventoService } from '@app/services/evento.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/models/Evento';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {

  evento = {} as Evento;
  form: FormGroup = new FormGroup({});
  modoSalvar: string = 'post';
  get f(): any {
    return this.form.controls;
  }

  get bsConfig(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY HH:mm',
      containerClass: 'theme-default',
      showWeekNumbers: false
    }
  }

  constructor(
    private fb: FormBuilder
    , private localeService: BsLocaleService
    , private router: ActivatedRoute
    , private eventoService: EventoService
    , private spinner: NgxSpinnerService
    , private toastr: ToastrService
  )
  {
    this.localeService.use('pt-br');
  }

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }

  public carregarEvento(): void {
    const eventoIdParam = this.router.snapshot.paramMap.get('id');

    if (eventoIdParam !== null) {
      this.spinner.show();
      this.modoSalvar = 'put';
      this.eventoService.getEventoById(+eventoIdParam).subscribe({
        next: (evento: Evento) => {
          this.evento = {...evento};
          this.form.patchValue(this.evento);
        },
        error: (error: HttpErrorResponse) => {
          this.spinner.hide();
          this.toastr.error('Erro ao tentar carregar o evento.', 'Erro!');
          console.log(error);
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    }
  }

  public validation() : void {
    this.form = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemURL: ['', Validators.required]
    })
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(formField: FormControl): any {
    return {'is-invalid' : formField.errors && formField.touched };
  }

  public salvarAlteracao(): void {
    this.spinner.show();
    if (this.form.valid) {
        this.evento = (this.modoSalvar === 'post') ? { ... this.form.value } : { id: this.evento.id, ... this.form.value }
        this.eventoService[this.modoSalvar](this.evento).subscribe({
          next: () => {
            this.toastr.success('Evento salvo com sucesso', 'Sucesso');
          },
          error: (error: HttpErrorResponse) => {
            console.log(error);
            this.toastr.error('Ocorreu um erro ao salvar o evento', 'Erro!');
          }
        }).add(() => this.spinner.hide());
    }
  }
}



