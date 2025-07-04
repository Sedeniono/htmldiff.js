import {createMap, createSegment, createToken, findBestMatch, findMatchingBlocks, htmlToTokens} from '../dist/htmldiff.js';

describe('findMatchingBlocks', function(){
    let cut, res, tokenize;

    beforeEach(function(){
        tokenize = function(tokens){
            return tokens.map(function(token){
                return createToken(token, [], []);
            });
        };
    });

    describe('createMap', function(){
        beforeEach(function(){
            cut = createMap;
        });

        it('should be a function', function(){
            expect(cut).is.a('function');
        });

        describe('When the items exist in the search target', function(){
            beforeEach(function(){
                res = cut(tokenize(['a', 'apple', 'has', 'a', 'worm']));
            });

            it('should find "a[][]" twice', function(){
                expect(res['a[][]'].length).to.equal(2);
            });

            it('should find "a" at 0', function(){
                expect(res['a[][]'][0]).to.equal(0);
            });

            it('should find "a" at 3', function(){
                expect(res['a[][]'][1]).to.equal(3);
            });

            it('should find "has" at 2', function(){
                expect(res['has[][]'][0]).to.equal(2);
            });
        });
    });

    describe('findBestMatch', function(){
        let invoke;

        beforeEach(function(){
            cut = findBestMatch;
            invoke = function(before, after){
                const segment = createSegment(before, after, 0, 0);

                res = cut(segment);
            };
        });

        describe('When there is a match', function(){
            beforeEach(function(){
                const before = tokenize(['a', 'dog', 'bites']);
                const after = tokenize(['a', 'dog', 'bites', 'a', 'man']);
                invoke(before, after);
            });

            it('should match the match', function(){
                expect(res).to.exist;
                expect(res.startInBefore).equal(0);
                expect(res.startInAfter).equal(0);
                expect(res.length).equal(3);
                expect(res.endInBefore).equal(2);
                expect(res.endInAfter).equal(2);
            });

            describe('When the match is surrounded', function(){
                beforeEach(function(){
                    const before = tokenize(['dog', 'bites']);
                    const after = tokenize(['the', 'dog', 'bites', 'a', 'man']);
                    invoke(before, after);
                });

                it('should match with appropriate indexing', function(){
                    expect(res).to.exist;
                    expect(res.startInBefore).to.equal(0);
                    expect(res.startInAfter).to.equal(1);
                    expect(res.endInBefore).to.equal(1);
                    expect(res.endInAfter).to.equal(2);
                });
            });
        });

        describe('When there is no match', function(){
            beforeEach(function(){
                const before = tokenize(['the', 'rat', 'sqeaks']);
                const after = tokenize(['a', 'dog', 'bites', 'a', 'man']);
                invoke(before, after);
            });

            it('should return nothing', function(){
                expect(res).to.not.exist;
            });
        });
    });

    describe('findMatchingBlocks', function(){
        let segment;

        beforeEach(function(){
            cut = findMatchingBlocks;
        });

        it('should be a function', function(){
            expect(cut).is.a('function');
        });

        describe('When called with a single match', function(){
            beforeEach(function(){
                const before = htmlToTokens('a dog bites');
                const after = htmlToTokens('when a dog bites it hurts');
                segment = createSegment(before, after, 0, 0);

                res = cut(segment);
            });

            it('should return a match', function(){
                expect(res.length).to.equal(1);
            });
        });

        describe('When called with multiple matches', function(){
            beforeEach(function(){
                const before = htmlToTokens('the dog bit a man');
                const after = htmlToTokens('the large brown dog bit a tall man');
                segment = createSegment(before, after, 0, 0);
                res = cut(segment);
            });

            it('should return 3 matches', function(){
                expect(res.length).to.equal(3);
            });

            it('should match "the"', function(){
                expect(res[0].startInBefore).eql(0);
                expect(res[0].startInAfter).eql(0);
                expect(res[0].endInBefore).eql(0);
                expect(res[0].endInAfter).eql(0);
                expect(res[0].length).eql(1);
            });

            it('should match "dog bit a"', function(){
                expect(res[1].startInBefore).eql(1);
                expect(res[1].startInAfter).eql(5);
                expect(res[1].endInBefore).eql(7);
                expect(res[1].endInAfter).eql(11);
                expect(res[1].length).eql(7);
            });

            it('should match "man"', function(){
                expect(res[2].startInBefore).eql(8);
                expect(res[2].startInAfter).eql(14);
                expect(res[2].endInBefore).eql(8);
                expect(res[2].endInAfter).eql(14);
                expect(res[2].length).eql(1);
            });
        });

        describe('HTML special case', function(){
            beforeEach(function(){
                const before = htmlToTokens('<div>Hello <p>foo</p> world! Hello Earth!</div>');
                const after = htmlToTokens('<div>Hello <p>foo</p> world! <p>bar</p> baz!</div>');
                segment = createSegment(before, after, 0, 0);
                res = cut(segment);
            });

            it('should return 2 matches', function(){
                expect(res.length).to.equal(2);
            });

            it('should match "<div>Hello <p>foo</p> world!"', function(){
                expect(res[0].startInBefore).eql(0);
                expect(res[0].startInAfter).eql(0);
                expect(res[0].endInBefore).eql(9);
                expect(res[0].endInAfter).eql(9);
                expect(res[0].length).eql(10);
            });

            it('should match "!</div>"', function(){
                expect(res[1].startInBefore).eql(13);
                expect(res[1].startInAfter).eql(15);
                expect(res[1].endInBefore).eql(14);
                expect(res[1].endInAfter).eql(16);
                expect(res[1].length).eql(2);
            });
        });

        describe('HTML special case -- reverse', function(){
            beforeEach(function(){
                const before = htmlToTokens('<div>Hello <p>foo</p> world! <p>bar</p> baz!</div>');
                const after = htmlToTokens('<div>Hello <p>foo</p> world! Hello Earth!</div>');
                segment = createSegment(before, after, 0, 0);
                res = cut(segment);
            });

            it('should return 2 matches', function(){
                expect(res.length).to.equal(2);
            });

            it('should match "<div>Hello <p>foo</p> world!"', function(){
                expect(res[0].startInBefore).eql(0);
                expect(res[0].startInAfter).eql(0);
                expect(res[0].endInBefore).eql(9);
                expect(res[0].endInAfter).eql(9);
                expect(res[0].length).eql(10);
            });

            it('should match "!</div>"', function(){
                expect(res[1].startInBefore).eql(15);
                expect(res[1].startInAfter).eql(13);
                expect(res[1].endInBefore).eql(16);
                expect(res[1].endInAfter).eql(14);
                expect(res[1].length).eql(2);
            });
        });

        describe('HTML special case with blockquote', function(){
            beforeEach(function(){
                const before = htmlToTokens('<div>Hello <p>foo</p> world! <blockquote>Hello Earth!</blockquote></div>');
                const after = htmlToTokens('<div>Hello <p>foo</p> world! <p>Hello Earth!</p></div>');
                segment = createSegment(before, after, 0, 0);
                res = cut(segment);
            });

            it('should return 2 matches', function(){
                expect(res.length).to.equal(2);
            });

            it('should match "<div>Hello <p>foo</p> world!"', function(){
                expect(res[0].startInBefore).eql(0);
                expect(res[0].startInAfter).eql(0);
                expect(res[0].endInBefore).eql(9);
                expect(res[0].endInAfter).eql(9);
                expect(res[0].length).eql(10);
            });

            it('should match "</div>"', function(){
                expect(res[1].startInBefore).eql(16);
                expect(res[1].startInAfter).eql(16);
                expect(res[1].endInBefore).eql(16);
                expect(res[1].endInAfter).eql(16);
                expect(res[1].length).eql(1);
            });
        });

        describe('HTML special case with blockquote -- reverse', function(){
            beforeEach(function(){
                const before = htmlToTokens('<div>Hello <p>foo</p> world! <p>Hello Earth!</p></div>');
                const after = htmlToTokens('<div>Hello <p>foo</p> world! <blockquote>Hello Earth!</blockquote></div>');
                segment = createSegment(before, after, 0, 0);
                res = cut(segment);
            });

            it('should return 2 matches', function(){
                expect(res.length).to.equal(2);
            });

            it('should match "<div>Hello <p>foo</p> world!"', function(){
                expect(res[0].startInBefore).eql(0);
                expect(res[0].startInAfter).eql(0);
                expect(res[0].endInBefore).eql(9);
                expect(res[0].endInAfter).eql(9);
                expect(res[0].length).eql(10);
            });

            it('should match "</div>"', function(){
                expect(res[1].startInBefore).eql(16);
                expect(res[1].startInAfter).eql(16);
                expect(res[1].endInBefore).eql(16);
                expect(res[1].endInAfter).eql(16);
                expect(res[1].length).eql(1);
            });
        });
    });
});
