import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { PhoneNumber } from '../models/phone-number.model';
import { tap } from 'rxjs/operators';

interface PhoneNumberResponse {
  current_page: number;
  last_page: number;
  data: PhoneNumber[];
}

@Injectable({
  providedIn: 'root'
})
export class PhoneNumberService {

  private apiUrl = 'http://localhost:8000/api/phone-numbers';
  private http = inject(HttpClient);
  private cache: { [key: string]: PhoneNumberResponse } = {};
  private phoneNumberSource = new BehaviorSubject<PhoneNumber | null>(null);
  currentPhoneNumber$ = this.phoneNumberSource.asObservable();

    
  // Buscar todos os Numeros
  getPhoneNumbers(page: number, perPage: number): Observable<PhoneNumberResponse> {
    const cacheKey = `${page}-${perPage}`;
        
    if (this.cache[cacheKey]) {      
      return of(this.cache[cacheKey]);
    }
    
    return this.http.get<PhoneNumberResponse>(`${this.apiUrl}?page=${page}&perPage=${perPage}`).pipe(      
      tap(response => {
        this.cache[cacheKey] = response;
      })
    );
  }

  // Buscar numero especifico
  getPhoneNumber(id: number): Observable<PhoneNumber> {
    return this.http.get<PhoneNumber>(`${this.apiUrl}/${id}`);
  }

  //Criar novo numero
  createPhoneNumber(phoneNumber: PhoneNumber): Observable<PhoneNumber> {
    return this.http.post<PhoneNumber>(this.apiUrl, phoneNumber);
  }

  //Editar Numero
  updatePhoneNumber(id: number, phoneNumber: PhoneNumber): Observable<PhoneNumber> {
    return this.http.put<PhoneNumber>(`${this.apiUrl}/${id}`, phoneNumber);
  }

  //Excluir Numero
  deletePhoneNumber(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Salvar dados para ediçao
  setPhoneNumber(phoneNumber: PhoneNumber) {
    this.phoneNumberSource.next(phoneNumber);
  }

  // Limpa todos os caches
  clearAllCache() {
    this.cache = {}; 
  }
}
