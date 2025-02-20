import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';

export const routes: Routes = [ 
    {
        path: '',
        loadComponent: () => import('./componentes/home/home.component').then(c=>HomeComponent)
    },   
    {
        path: 'phone-numbers',
        loadChildren: () => import('./phone-numbers/form.routes').then(r=> r.FORM_ROUTES)
    },
];
