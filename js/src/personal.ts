import { View } from './personal/view';
export class Personal {

    public view: View;

    constructor() {
        this.view = new View();
    }

}

export let $personal = new Personal();
