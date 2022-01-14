import cut from '../dist/htmldiff.js';

describe('Pain Games', function(){
    let res;

    describe('When an entire sentence is replaced', function(){
        beforeEach(function(){
            res = cut('this is what I had', 'and now we have a new one');
        });

        it('should replace the whole chunk', function(){
            expect(res).to.equal('<del data-operation-index="0">this is what I had</del>' +
                    '<ins data-operation-index="0">and now we have a new one</ins>');
        });
    });

    describe('styling -- simple tag replacement', function () {
        it ('should recognize simple addition of strong tags', function(){
            res = cut('this text should be bolded', 'this <strong>text</strong> should be bolded');
            expect(res).to.equal('this <del data-operation-index="1">text</del>' +
                '<ins data-operation-index="1"><strong>text</strong></ins> should be bolded');
        });
        it ('should recognize simple addition of em tags', function(){
            res = cut('this text should be italicized', 'this <em>text</em> should be italicized');
            expect(res).to.equal('this <del data-operation-index="1">text</del>' +
                '<ins data-operation-index="1"><em>text</em></ins> should be italicized');
        });
        it ('should recognize switching tags', function(){
            res = cut('this <strong>text</strong> should be italicized', 'this <em>text</em> should be italicized');
            expect(res).to.equal('this <del data-operation-index="1"><strong>text</strong></del>' +
                '<ins data-operation-index="1"><em>text</em></ins> should be italicized');
        });
        it ('should recognize overlap', function(){
            res = cut('<strong>this text should</strong> be italicized', '<strong>this <em>text</em> should</strong> be italicized');
            expect(res).to.equal('<strong>this </strong><del data-operation-index="1"><strong>text</strong></del>' +
                '<ins data-operation-index="1"><strong><em>text</em></strong></ins><strong> should</strong> be italicized');
        });
    });

    describe('styling -- extra cases', function () {
        it ('should be okay with internal changes', function(){
            res = cut('here <strong>is a bunch of styled</strong> text', 'here <strong>is a bunch of edited styled</strong> text');
            expect(res).to.equal('here <strong>is a bunch of </strong><ins data-operation-index="1"><strong>edited </strong></ins><strong>styled</strong> text');
        });
        it ('should handle spicy overlap', function(){
            res = cut('here <strong>is a bunch of</strong> styled text string', 'here <strong>is a </strong><em><strong>bunch of</strong> styled</em> text string');
            expect(res).to.equal('here <strong>is a </strong><del data-operation-index="1"><strong>bunch of</strong> styled</del>' +
                '<ins data-operation-index="1"><em><strong>bunch of</strong> styled</em></ins> text string');
        });
    }

    );
});