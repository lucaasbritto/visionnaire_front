import { Component, OnInit } from '@angular/core';
import { PhoneNumberService } from '../../_services/phone-number.service';
import { PhoneNumber } from '../../models/phone-number.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
    phoneNumbers: PhoneNumber[] = [];
    currentPage: number = 1;
    totalPages: number = 1;
    perPage: number = 2;
    isLoading: boolean = true;

    constructor(private phoneNumberService: PhoneNumberService,private router: Router ) {}

    ngOnInit() : void {
      this.loadPhoneNumbers();
    }

    loadPhoneNumbers() {
      this.phoneNumberService.getPhoneNumbers(this.currentPage, this.perPage).subscribe(data => {
        this.phoneNumbers = data.data;
        this.totalPages = data.last_page;
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao carregar os números de telefone', error);
        this.isLoading = false;
      });
    }

    carregarDados(phoneNumber: any) {
      this.phoneNumberService.setPhoneNumber(phoneNumber);
      this.router.navigate([`/phone-numbers/edit/${phoneNumber.id}`]);
    }

    deletePhoneNumber(id: number) {
      if (confirm('Confirmar a exclusão do numero?')) {
        this.phoneNumberService.deletePhoneNumber(id).subscribe(() => {
          this.loadPhoneNumbers();
        });
      }
    }

    changePage(page: number) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        this.loadPhoneNumbers();
      }
    }
}
