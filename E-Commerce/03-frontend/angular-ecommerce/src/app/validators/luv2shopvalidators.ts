import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2shopvalidators {
    static notOnlyWhiteSpaces(control : FormControl): ValidationErrors{
        if(control.value != null && (control.value.toString().trim().length === 0))
        {
            return {'notOnlyWhiteSpaces':true};
        }
        else{
            return null;
        }
    }
}
