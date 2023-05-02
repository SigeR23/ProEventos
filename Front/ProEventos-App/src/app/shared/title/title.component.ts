import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {

  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() iconClass: string = 'fa fa-user';
  @Input() botaoListar: boolean = false;


  constructor(private _router: Router) { }

  ngOnInit() {
  }

  listar(): void {
    this._router.navigate([`${this.title.toLocaleLowerCase()}/lista`]);
  }

}
