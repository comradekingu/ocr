import _ from 'underscore';


export class App {

    constructor() {
        _.defer(() => {
            console.log('test');
        });
    }
}



export let $app = new App();

/*
Avoid jQuery for events and most other cases.
Use it only for deferred and http call because Nextcloud ships a preconfigured version.

var submit = document.getElementById('my-submit');
submit.addEventListener('click', function () {

});

*/
