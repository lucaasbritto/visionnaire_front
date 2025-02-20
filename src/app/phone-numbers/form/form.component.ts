import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PhoneNumberService } from '../../_services/phone-number.service';
import { CommonModule } from '@angular/common';
import {ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { take } from 'rxjs';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit{

  phoneForm: FormGroup;
  phoneNumberId: number = 0; 
  isEditMode: boolean = false;
  phoneNumber: any;

  constructor(
    private fb: FormBuilder,
    private phoneNumberService: PhoneNumberService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private location: Location
  ) {
    this.phoneForm = this.fb.group({
      value: ['', [Validators.required]],
      monthlyPrice: ['', [Validators.required, Validators.min(0)]],
      setupPrice: ['', [Validators.required, Validators.min(0)]],
      currency: ['', [Validators.required]],
    });
  }

  

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.phoneNumberId = +id;
        this.loadPhoneDetails();        
      }
    });
  }

  loadPhoneDetails() {
    if (this.phoneNumberId) {
      this.phoneNumberService.currentPhoneNumber$.pipe(
        take(1)
      ).subscribe(phoneNumber => {        
        if (phoneNumber && phoneNumber.id === this.phoneNumberId) {
          this.phoneNumber = phoneNumber;
          this.phoneForm.patchValue(phoneNumber);
        } else {
          this.phoneNumberService.getPhoneNumber(this.phoneNumberId).subscribe((data) => {
            this.phoneForm.patchValue(data);
          });
        }
      });
    }
  }

  
  onSubmit() {
    if (this.phoneForm.valid) {
      if (this.isEditMode && this.phoneNumberId) {       
        this.phoneNumberService.updatePhoneNumber(this.phoneNumberId, this.phoneForm.value).subscribe(() => {
          this.toastr.success('Número editado com sucesso!', 'Sucesso');

          this.phoneNumberService.clearAllCache();
          this.router.navigate(['/phone-numbers']);
        });
      } else {
        this.phoneNumberService.createPhoneNumber(this.phoneForm.value).subscribe(() => {
          this.toastr.success('Número criado com sucesso!', 'Sucesso');
          this.router.navigate(['/phone-numbers']);
        });
      }
    }
  }

  goBack(): void {
    this.location.back();
  }

}