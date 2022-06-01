import cut from '../dist/htmldiff.js';

const tableBasic = `<table>
<thead>
<tr>
<th id="col1">col1</th>
<th id="col2">col2</th>
</tr>
</thead>
<tbody>
<tr>
<td>a</td>
<td>b</td>
</tr>
<tr>
<td>c</td>
<td>d</td>
</tr>
</tbody>
</table>`;

const tableBasicEdited = `<table>
<thead>
<tr>
<th id="col1">col1</th>
<th id="col2">col2</th>
</tr>
</thead>
<tbody>
<tr>
<td>aa</td>
<td>b</td>
</tr>
<tr>
<td>c</td>
<td>dd</td>
</tr>
</tbody>
</table>`;

const basicEditDiff = `<table>
<thead>
<tr>
<th id="col1">col1</th>
<th id="col2">col2</th>
</tr>
</thead>
<tbody>
<tr>
<td><del data-operation-index="1">a</del><ins data-operation-index="1">aa</ins></td>
<td>b</td>
</tr>
<tr>
<td>c</td>
<td><del data-operation-index="3">d</del><ins data-operation-index="3">dd</ins></td>
</tr>
</tbody>
</table>`;

const tableFancy = `<table>
<thead>
<tr>
<th id="col1">col1</th>
<th id="col2">col2</th>
</tr>
</thead>
<tbody>
<tr>
<td><p>a</p><p>aa</p></td>
<td>b<br>bb</td>
</tr>
<tr>
<td><ul><li>c</li><li>cc</li></ul></td>
<td><ol><li>c</li><li>cc</li></ol></td>
</tr>
</tbody>
</table>`;

const tableFancyEdited = `<table>
<thead>
<tr>
<th id="col1">col1</th>
<th id="col2">col2</th>
</tr>
</thead>
<tbody>
<tr>
<td><p>a</p><p>aa</p></td>
<td>b<br>bb</td>
</tr>
<tr>
<td><ul><li>c</li><li>cc</li></ul></td>
<td><ol><li>d</li><li>cc</li></ol></td>
</tr>
</tbody>
</table>`;

const fancyEditDiff = `<table>
<thead>
<tr>
<th id="col1">col1</th>
<th id="col2">col2</th>
</tr>
</thead>
<tbody>
<tr>
<td><p>a</p><p>aa</p></td>
<td>b<br></br>bb</td>
</tr>
<tr>
<td><ul><li>c</li><li>cc</li></ul></td>
<td><ol><li><del data-operation-index="1">c</del><ins data-operation-index="1">d</ins></li><li>cc</li></ol></td>
</tr>
</tbody>
</table>`;

const basicToFancy = `<table>
<thead>
<tr>
<th id="col1">col1</th>
<th id="col2">col2</th>
</tr>
</thead>
<tbody>
<tr>
<td><del data-operation-index="1">a</del></td><td><del data-operation-index="1">b</del><p data-diff-node="ins" data-operation-index="1"><ins data-operation-index="1">a</ins></p><p data-diff-node="ins" data-operation-index="1"><ins data-operation-index="1">aa</ins></p></td><td><ins data-operation-index="1">b</ins><br data-diff-node="ins" data-operation-index="1"></br><ins data-operation-index="1">bb</ins></td>
</tr>
<tr>
<td><del data-operation-index="3">c</del></td><td><del data-operation-index="3">d</del><ul data-diff-node="ins" data-operation-index="3"><li data-diff-node="ins" data-operation-index="3"><ins data-operation-index="3">c</ins></li><li data-diff-node="ins" data-operation-index="3"><ins data-operation-index="3">cc</ins></li></ul></td><td><ol data-diff-node="ins" data-operation-index="3"><li data-diff-node="ins" data-operation-index="3"><ins data-operation-index="3">c</ins></li><li data-diff-node="ins" data-operation-index="3"><ins data-operation-index="3">cc</ins></li></ol></td>
</tr>
</tbody>
</table>`;

const fancyToBasic = `<table>
<thead>
<tr>
<th id="col1">col1</th>
<th id="col2">col2</th>
</tr>
</thead>
<tbody>
<tr>
<td><del data-operation-index="1">a</del></td><td><del data-operation-index="1">b</del><p data-diff-node="ins" data-operation-index="1"><ins data-operation-index="1">a</ins></p><p data-diff-node="ins" data-operation-index="1"><ins data-operation-index="1">aa</ins></p></td><td><ins data-operation-index="1">b</ins><br data-diff-node="ins" data-operation-index="1"></br><ins data-operation-index="1">bb</ins></td>
</tr>
<tr>
<td><del data-operation-index="3">c</del></td><td><del data-operation-index="3">d</del><ul data-diff-node="ins" data-operation-index="3"><li data-diff-node="ins" data-operation-index="3"><ins data-operation-index="3">c</ins></li><li data-diff-node="ins" data-operation-index="3"><ins data-operation-index="3">cc</ins></li></ul></td><td><ol data-diff-node="ins" data-operation-index="3"><li data-diff-node="ins" data-operation-index="3"><ins data-operation-index="3">c</ins></li><li data-diff-node="ins" data-operation-index="3"><ins data-operation-index="3">cc</ins></li></ol></td>
</tr>
</tbody>
</table>`;

const textWithSimilarities = `<p>a</p><p>aa</p>`;

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
    });

    describe('table -- basic', function () {
        it ('should do alright adding a table', function(){
            res = cut(textWithSimilarities, tableBasic);
            expect(res).to.equal( // string concatenation done purely for readability
                '<p data-diff-node="del" data-operation-index="0"><del data-operation-index="0">a</del></p>' +
                '<p data-diff-node="del" data-operation-index="0"><del data-operation-index="0">aa</del></p>' +
                '<table data-diff-node="ins" data-operation-index="0">' +
                    '<thead data-diff-node="ins" data-operation-index="0"><tr data-diff-node="ins" data-operation-index="0">' +
                        '<th id="col1" data-diff-node="ins" data-operation-index="0"><ins data-operation-index="0">col1</ins></th>' +
                        '<th id="col2" data-diff-node="ins" data-operation-index="0"><ins data-operation-index="0">col2</ins></th>' +
                    '</tr></thead>' +
                    '<tbody data-diff-node="ins" data-operation-index="0">' +
                        '<tr data-diff-node="ins" data-operation-index="0">' +
                            '<td data-diff-node="ins" data-operation-index="0"><ins data-operation-index="0">a</ins></td>' +
                            '<td data-diff-node="ins" data-operation-index="0"><ins data-operation-index="0">b</ins></td>' +
                        '</tr>' +
                        '<tr data-diff-node="ins" data-operation-index="0">' +
                            '<td data-diff-node="ins" data-operation-index="0"><ins data-operation-index="0">c</ins></td>' +
                            '<td data-diff-node="ins" data-operation-index="0"><ins data-operation-index="0">d</ins></td>' +
                        '</tr>' +
                    '</tbody>' +
                '</table>'
            );
        });
        it ('should do alright with editing one table cell', function(){
            res = cut(tableBasic, tableBasicEdited);
            expect(res).to.equal(basicEditDiff);
        });
    });

    describe('table -- fancy', function () {
        it ('should do alright adding a fancy table with similar text', function(){
            res = cut(textWithSimilarities, tableFancy);
            expect(res).to.equal( // string concatenation done purely for readability
                '<p data-diff-node="del" data-operation-index="0"><del data-operation-index="0">a</del></p>' +
                '<p data-diff-node="del" data-operation-index="0"><del data-operation-index="0">aa</del></p>' +
                '<table data-diff-node="ins" data-operation-index="0">' +
                    '<thead data-diff-node="ins" data-operation-index="0">' +
                        '<tr data-diff-node="ins" data-operation-index="0">' +
                            '<th id="col1" data-diff-node="ins" data-operation-index="0"><ins data-operation-index="0">col1</ins></th>' +
                            '<th id="col2" data-diff-node="ins" data-operation-index="0"><ins data-operation-index="0">col2</ins></th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody data-diff-node="ins" data-operation-index="0">' +
                        '<tr data-diff-node="ins" data-operation-index="0">' +
                            '<td data-diff-node="ins" data-operation-index="0"><p data-diff-node="ins" data-operation-index="0"><ins data-operation-index="0">a</ins></p><p data-diff-node="ins" data-operation-index="0"><ins data-operation-index="0">aa</ins></p></td>' +
                            '<td data-diff-node="ins" data-operation-index="0"><ins data-operation-index="0">b</ins><br data-diff-node="ins" data-operation-index="0"></br><ins data-operation-index="0">bb</ins></td>' +
                        '</tr>' +
                        '<tr data-diff-node="ins" data-operation-index="0">' +
                            '<td data-diff-node="ins" data-operation-index="0"><ul data-diff-node="ins" data-operation-index="0"><li data-diff-node="ins" data-operation-index="0"><ins data-operation-index="0">c</ins></li><li data-diff-node="ins" data-operation-index="0"><ins data-operation-index="0">cc</ins></li></ul></td>' +
                            '<td data-diff-node="ins" data-operation-index="0"><ol data-diff-node="ins" data-operation-index="0"><li data-diff-node="ins" data-operation-index="0"><ins data-operation-index="0">c</ins></li><li data-diff-node="ins" data-operation-index="0"><ins data-operation-index="0">cc</ins></li></ol></td>' +
                        '</tr>' +
                    '</tbody>' +
                '</table>'
            );
        });
        it ('should do alright with editing one fancy table cell', function(){
            res = cut(tableFancy, tableFancyEdited);
            expect(res).to.equal(fancyEditDiff);
        });
        it ('should do alright converting a basic table to a fancy one', function(){
            res = cut(tableBasic, tableFancy);
            expect(res).to.equal(basicToFancy);
        });
        it ('should do alright converting a fancy table to a basic one', function(){
            res = cut(tableBasic, tableFancy);
            expect(res).to.equal(fancyToBasic);
        });
    });

});