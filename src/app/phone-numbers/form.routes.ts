import { Routes } from "@angular/router";
import { FormComponent } from "./form/form.component";
import { ListComponent } from "./list/list.component";

export const FORM_ROUTES: Routes = [
    {
        path: '',
        component: ListComponent
    },
    { 
        path: 'new', 
        component: FormComponent
    },

    { 
        path: 'edit/:id', 
        component: FormComponent 
    },
]