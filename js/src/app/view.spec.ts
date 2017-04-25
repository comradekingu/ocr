import { View } from './view';

describe('The view of the app', () => {
    
    let cut: View;

    beforeEach(() => {
        cut = new View();
    });

    it('should contain the viewProp with the right text assigned.', () => {
        expect(cut.viewProp).toEqual('test');
    });

});