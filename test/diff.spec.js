import diff, {htmlToTokens, calculateOperations} from "../dist/htmldiff.js";

describe('Diff', function(){
  var res;

  describe('When both inputs are the same', function(){
    beforeEach(function(){
      res = diff('input text', 'input text');
    });

    it('should return the text', function(){
      expect(res).equal('input text');
    });
  });

  describe('When a letter is added', function(){
    beforeEach(function(){
      res = diff('input', 'input 2');
    });

    it('should mark the new letter', function(){
      expect(res).to.equal('input<ins data-operation-index="1"> 2</ins>');
    });
  });

  describe('Whitespace differences', function(){
    it('should collapse adjacent whitespace', function(){
      expect(diff('Much \n\t    spaces', 'Much spaces')).to.equal('Much spaces');
    });

    it('should consider non-breaking spaces as equal', function(){
      expect(diff('Hello&nbsp;world', 'Hello&#160;world')).to.equal('Hello&#160;world');
    });

    it('should consider non-breaking spaces and non-adjacent regular spaces as equal', function(){
      expect(diff('Hello&nbsp;world', 'Hello world')).to.equal('Hello world');
    });
  });

  describe('html escape sequences', function(){
    it('inserted escape sequence should be detected', function() {
      expect(diff(
          'Hello world',
          'Hello &uacute; world'))
      .to.equal(
          'Hello <ins data-operation-index="1">&uacute; </ins>world'
      );
    });

    it('deleted escape sequence should be detected', function() {
      expect(diff(
          'Hello &#365;',
          'Hello'))
      .to.equal(
          'Hello<del data-operation-index="1"> &#365;</del>'
      );
    });

    it('double ampersand should not cause infinite loop', function() {
      expect(diff(
          'Hello && world',
          'Hello && code'))
      .to.equal(
          'Hello && <del data-operation-index="1">world</del><ins data-operation-index="1">code</ins>'
      );
    });

    it('should consider non-whitespace escape sequences as different', function() {
      expect(diff(
          'Hello&lt;&NewLine;world',
          'Hello&#60;&amp;world'))
      .to.equal(
          'Hello<del data-operation-index="1">&lt;&NewLine;</del><ins data-operation-index="1">&#60;&amp;</ins>world'
      );
    });

    it('should not throw or crash with invalid escape sequences', function() {
      expect(diff(
          'Hello &lt world',
          'Hello &ö world'))
      .to.equal(
          'Hello &<del data-operation-index="1">lt</del><ins data-operation-index="1">ö</ins> world'
      );
    });

    it('should consider same entity name and code referring to same symbol as different (because there is no special code to match them)', function() {
      expect(diff(
          'Hello &clubs; world',
          'Hello &#9827; world'))
      .to.equal(
          'Hello <del data-operation-index="1">&clubs;</del><ins data-operation-index="1">&#9827;</ins> world'
      );
    });
  });

  describe('When a class name is specified', function(){
    it('should include the class in the wrapper tags', function(){
      expect(diff('input', 'input 2', 'diff-result')).to.equal(
        'input<ins data-operation-index="1" class="diff-result"> 2</ins>');
    });
  });

  describe('Image Differences', function(){
    it('show two images as different if their src attributes are different', function() {
      var before = htmlToTokens('<img src="a.jpg">');
      var after = htmlToTokens('<img src="b.jpg">');
      var ops = calculateOperations(before, after);
      expect(ops.length).to.equal(1);
      expect(ops[0]).to.eql({
        action: 'replace',
        startInBefore: 0,
        endInBefore: 0,
        startInAfter: 0,
        endInAfter: 0
      });
    });

    it('should show two images are the same if their src attributes are the same', function() {
      var before = htmlToTokens('<img src="a.jpg">');
      var after = htmlToTokens('<img src="a.jpg" alt="hey!">');
      var ops = calculateOperations(before, after);
      expect(ops.length).to.equal(1);
      expect(ops[0]).to.eql({
        action: 'equal',
        startInBefore: 0,
        endInBefore: 0,
        startInAfter: 0,
        endInAfter: 0
      });
    });
  });

  describe('Anchor Differences', function() {
    const a11 = '<a href="1">1</a>';
    const a12 = '<a href="1">2</a>';
    const a21 = '<a href="2">1</a>';
    const a22 = '<a href="2">2</a>';
    it('should show two anchors as the same if they are the same', function() {
      expect(diff(a11, a11)).to.eql(a11);
    });
    it('should show two anchors as different if their text is different', function() {
      expect(diff(a11, a12)).to
        .eql(`<del data-operation-index="0">${a11}</del><ins data-operation-index="0">${a12}</ins>`);
    });
    it('should show two anchors as different if their href is different', function() {
      expect(diff(a11, a21)).to
        .eql(`<del data-operation-index="0">${a11}</del><ins data-operation-index="0">${a21}</ins>`);
    });
    it('should show two anchors as different if their href and text is different', function() {
      expect(diff(a11, a22)).to
        .eql(`<del data-operation-index="0">${a11}</del><ins data-operation-index="0">${a22}</ins>`);
    });
  });

  describe('Widget Differences', function(){
    it('show two widgets as different if their data attributes are different', function() {
      var before = htmlToTokens('<object data="a.jpg"></object>');
      var after = htmlToTokens('<object data="b.jpg"></object>');
      var ops = calculateOperations(before, after);
      expect(ops.length).to.equal(1);
      expect(ops[0]).to.eql({
        action: 'replace',
        startInBefore: 0,
        endInBefore: 0,
        startInAfter: 0,
        endInAfter: 0
      });
    });

    it('should show two widgets are the same if their data attributes are the same', function() {
      var before = htmlToTokens('<object data="a.jpg"><param>yo!</param></object>');
      var after = htmlToTokens('<object data="a.jpg"></object>');
      var ops = calculateOperations(before, after);
      expect(ops.length).to.equal(1);
      expect(ops[0]).to.eql({
        action: 'equal',
        startInBefore: 0,
        endInBefore: 0,
        startInAfter: 0,
        endInAfter: 0
      });
    });
  });

  describe('Math Differences', function(){
    it('should show two math elements as different if their contents are different', function() {
      var before = htmlToTokens('<math data-uuid="55784cd906504787a8e459e80e3bb554"><msqrt>' +
                                '<msup><mi>b</mi><mn>2</mn></msup></msqrt></math>');
      var after = htmlToTokens('<math data-uuid="55784cd906504787a8e459e80e3bb554"><msqrt>' +
                               '<msup><mn>b</mn><mn>5</mn></msup></msqrt></math>');
      var ops = calculateOperations(before, after);
      expect(ops.length).to.equal(1);
      expect(ops[0]).to.eql({
        action: 'replace',
        startInBefore: 0,
        endInBefore: 0,
        startInAfter: 0,
        endInAfter: 0
      });
    });

    it('should show two math elements as the same if their contents are the same', function() {
      var before = htmlToTokens('<math data-uuid="15568cd906504876548459e80e356878"><msqrt>' +
                                '<msup><mi>b</mi><mn>2</mn></msup></msqrt></math>');
      var after = htmlToTokens('<math data-uuid="55784cd906504787a8e459e80e3bb554"><msqrt>' +
                               '<msup><mi>b</mi><mn>2</mn></msup></msqrt></math>');
      var ops = calculateOperations(before, after);
      expect(ops.length).to.equal(1);
      expect(ops[0]).to.eql({
        action: 'equal',
        startInBefore: 0,
        endInBefore: 0,
        startInAfter: 0,
        endInAfter: 0
      });
    });
  });

  describe('Video Differences', function(){
    it('show two widgets as different if their data attributes are different', function() {
      var before = htmlToTokens('<video data-uuid="0787866ab5494d88b4b1ee423453224b">' +
                                '<source src="inkling-video:///big_buck_bunny/webm_high" type="video/webm" /></video>');
      var after = htmlToTokens('<video data-uuid="0787866ab5494d88b4b1ee423453224b">' +
                               '<source src="inkling-video:///big_buck_rabbit/mp4" type="video/webm" /></video>');
      var ops = calculateOperations(before, after);
      expect(ops.length).to.equal(1);
      expect(ops[0]).to.eql({
        action: 'replace',
        startInBefore: 0,
        endInBefore: 0,
        startInAfter: 0,
        endInAfter: 0
      });

    });

    it('should show two widgets are the same if their data attributes are the same', function() {
      var before = htmlToTokens('<video data-uuid="65656565655487787484545454548494">' +
                                '<source src="inkling-video:///big_buck_bunny/webm_high" type="video/webm" /></video>');
      var after = htmlToTokens('<video data-uuid="0787866ab5494d88b4b1ee423453224b">' +
                               '<source src="inkling-video:///big_buck_bunny/webm_high" type="video/webm" /></video>');
      var ops = calculateOperations(before, after);
      expect(ops.length).to.equal(1);
      expect(ops[0]).to.eql({
        action: 'equal',
        startInBefore: 0,
        endInBefore: 0,
        startInAfter: 0,
        endInAfter: 0
      });
    });
  });

  describe('iframe Differences', function(){
    it('show two widgets as different if their data attributes are different', function() {
      var before = htmlToTokens('<iframe src="a.jpg"></iframe>');
      var after = htmlToTokens('<iframe src="b.jpg"></iframe>');
      var ops = calculateOperations(before, after);
      expect(ops.length).to.equal(1);
      expect(ops[0]).to.eql({
        action: 'replace',
        startInBefore: 0,
        endInBefore: 0,
        startInAfter: 0,
        endInAfter: 0
      });
    });

    it('should show two widgets are the same if their data attributes are the same', function() {
      var before = htmlToTokens('<iframe src="a.jpg"></iframe>');
      var after = htmlToTokens('<iframe src="a.jpg" class="foo"></iframe>');
      var ops = calculateOperations(before, after);
      expect(ops.length).to.equal(1);
      expect(ops[0]).to.eql({
        action: 'equal',
        startInBefore: 0,
        endInBefore: 0,
        startInAfter: 0,
        endInAfter: 0
      });
    });
  });

  describe('processing tags', function(){
    it('should detect atomic tag correctly', function() {
      res = diff(
          'Some <abb class=" my-abb">Text</abb> within <embb class=" my-embb">custom tags</embb>',
          'Some <abb class=" my-abb"> other Text</abb> within <embb class=" my-embb">the same tags</embb>'
      );
      expect(res).to.equal(
          'Some <abb class=" my-abb"><ins data-operation-index="1"> other </ins>Text</abb> within <embb class=" my-embb"><del data-operation-index="3">custom</del><ins data-operation-index="3">the same</ins> tags</embb>'
      );
    });
  });

  describe('punctuation', function(){
    it('if only the punctuation changes then only the punctuation should be marked', function() {
      res = diff(
          'Hello world! Test',
          'Hello world. Test'
      );
      expect(res).to.equal(
          'Hello world<del data-operation-index="1">!</del><ins data-operation-index="1">.</ins> Test'
      );
    });

    it('if the word and the punctuation changes then both should be marked', function() {
      res = diff(
          'Hello wrld! Test',
          'Hello world. Test'
      );
      expect(res).to.equal(
          'Hello <del data-operation-index="1">wrld!</del><ins data-operation-index="1">world.</ins> Test'
      );
    });
  });

  describe('non-ASCII word characters should be part of the word thanks to Intl.Segmenter', function(){
    it('apostrophe in English word should be part of the word', function() {
      res = diff(
          "This dooesn't matter.",
          "This doesn't matter."
      );
      expect(res).to.equal(
          'This <del data-operation-index="1">dooesn\'t</del><ins data-operation-index="1">doesn\'t</ins> matter.'
      );
    });

    it('underscore should be part of the word', function() {
      res = diff(
          "Consider some_fnction now",
          "Consider some_function now"
      );
      expect(res).to.equal(
          'Consider <del data-operation-index="1">some_fnction</del><ins data-operation-index="1">some_function</ins> now'
      );
    });

    it('German Umlaut characters should not separate words', function() {
      res = diff(
          'Text möttige ÜmLLaute, noch määhr Umlaute',
          'Text möttige Ümlaute, noch mähr Umlaute'
      );
      expect(res).to.equal(
          'Text möttige <del data-operation-index="1">ÜmLLaute</del><ins data-operation-index="1">Ümlaute</ins>, noch <del data-operation-index="3">määhr</del><ins data-operation-index="3">mähr</ins> Umlaute'
      );
    });

    // I do not speak Japanese, so this test is an educated guess via tools like DeepL and ChatGPT. The main point 
    // is that Japanese does not use spaces to separate words. The use of Intl.Segmenter should still makes it work.
    // Without it, the translation DeepL gives me for the parts marked as changed by the algorithm seem wrong.
    it('should identify Japanese words', function() {
      res = diff(
          'リンゴは木から遠くには落ちない。それは良いことだ。',
          'リンゴは木から遠く離れて落ちる。それは良いことだ。'
      );
      expect(res).to.equal(
          'リンゴは木から遠く<del data-operation-index="1">には落ちない</del><ins data-operation-index="1">離れて落ちる</ins>。それは良いことだ。'
      );
    });

    it('If string ends with words then words should be split correctly', function() {
      res = diff(
          'これはリンゴだ',
          '日本語は話せない'
      );
      expect(res).to.equal(
          '<del data-operation-index="0">これ</del><ins data-operation-index="0">日本語</ins>は<del data-operation-index="2">リンゴだ</del><ins data-operation-index="2">話せない</ins>'
      );
    });
  });


  describe('headings', function(){
    it('If heading changes to paragraph then whole heading should be marked', function() {
      expect(diff(
          '<h1>Hello world</h1>',
          '<p>Hello world</p>'))
      .to.equal(
          '<h1 data-diff-node="del" data-operation-index="0"><del data-operation-index="0">Hello world</del></h1><p data-diff-node="ins" data-operation-index="0"><ins data-operation-index="0">Hello world</ins></p>'
      );
    });

    it('If heading level changes then whole heading should be marked', function() {
      expect(diff(
          '<h1>Hello world</h1>',
          '<h6>Hello world</h6>'))
      .to.equal(
          '<h1 data-diff-node="del" data-operation-index="0"><del data-operation-index="0">Hello world</del></h1><h6 data-diff-node="ins" data-operation-index="0"><ins data-operation-index="0">Hello world</ins></h6>'
      );
    });

    it('If only part of heading content changes then only that should be marked, while heading should not be split up', function() {
      expect(diff(
          '<h3>Hello world</h3>',
          '<h3>Hello code</h3>'))
      .to.equal(
          '<h3>Hello <del data-operation-index="1">world</del><ins data-operation-index="1">code</ins></h3>'
      );
    });
  });

  describe('formatting changes', function(){
    it('If formatting changes from bold to italic then whole part should be marked', function() {
      expect(diff(
          '<b>Hello world</b>',
          '<i>Hello world</i>'))
      .to.equal(
          '<del data-operation-index="0"><b>Hello world</b></del><ins data-operation-index="0"><i>Hello world</i></ins>'
      );
    });

    it('If only part of formatted content changes then only that should be marked; the deleted and inserted parts should have their individual formatting', function() {
      expect(diff(
          '<b>Hello world</b>',
          '<b>Hello code</b>'))
      .to.equal(
          '<b>Hello </b><del data-operation-index="1"><b>world</b></del><ins data-operation-index="1"><b>code</b></ins>'
      );
    });

    it('If formatting is removed then whole part should be marked', function() {
      expect(diff(
          '<b>Hello world</b>',
          'Hello world'))
      .to.equal(
          '<del data-operation-index="0"><b>Hello world</b></del><ins data-operation-index="0">Hello world</ins>'
      );
    });

    it('If formatting is inserted then whole part should be marked', function() {
      expect(diff(
          'Hello world',
          '<b>Hello world</b>'))
      .to.equal(
          '<del data-operation-index="0">Hello world</del><ins data-operation-index="0"><b>Hello world</b></ins>'
      );
    });

    it('If formatting is replaced with paragraph then whole part should be marked', function() {
      expect(diff(
          '<b>Hello world</b>',
          '<p>Hello world</p>'))
      .to.equal(
          '<del data-operation-index="0"><b>Hello world</b></del><p data-diff-node="ins" data-operation-index="0"><ins data-operation-index="0">Hello world</ins></p>'
      );
    });
  });
});
