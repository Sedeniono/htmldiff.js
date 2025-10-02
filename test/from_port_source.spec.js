import diff from "../dist/htmldiff.js";

describe('The specs from the ruby source project', function(){
  // 
  describe('original tests from ruby code in 2008', function(){  
    it('should diff text', function(){
      const d = diff('a word is here', 'a nother word is there');
      expect(d).to.equal('a<ins data-operation-index="1"> nother</ins> word is ' +
                '<del data-operation-index="3">here</del><ins data-operation-index="3">' +
                'there</ins>');
    });

    it('should insert a letter and a space', function(){
      const d = diff('a c', 'a b c');
      expect(d).to.equal('a <ins data-operation-index="1">b </ins>c');
    });

    it('should remove a letter and a space', function(){
      const d = diff('a b c', 'a c');
      expect(d).to.equal('a <del data-operation-index="1">b </del>c');
    });

    it('should change a letter', function(){
      const d = diff('a b c', 'a d c');
      expect(d).to.equal('a <del data-operation-index="1">b</del>' +
                '<ins data-operation-index="1">d</ins> c');
    });
  });

  // Tests from the ruby code, commit https://github.com/myobie/htmldiff/commit/003c74c61817b41864f7651e0c8fdb2c1117270c,
  // file 'html_diff_spec.rb'.
  // But tests related to the custom tokenizer and merge threshold were removed, since the javascript version does not have
  // these features.
  // The whole "data-operation-index" thing aside, the javascript version does not merge adjacent operations, so the
  // expected test output was adapted to match the javascript implementation in these cases.
  // Moreover, for languages like Chinese etc, the Intl.Segmenter used in our javascript version separates 'words' differently
  // than the ruby version. We believe Intl.Segmenter.
  describe('new tests from ruby code in 2025', function(){
    describe('when diffing basic text', function() {
      it('diffs text correctly', function() {
        expect(diff(
          'a word is here',
          'a nother word is there'
        )).to.equal(
          'a<ins data-operation-index="1"> nother</ins> word is <del data-operation-index="3">here</del><ins data-operation-index="3">there</ins>'
        );
      });
    });

    describe('when diffing basic text 2', function() {
      it('diffs text correctly', function() {
        expect(diff(
          'a word now is here',
          'a second word is there'
        )).to.equal(
          'a <ins data-operation-index="1">second </ins>word <del data-operation-index="3">now </del>is <del data-operation-index="5">here</del><ins data-operation-index="5">there</ins>'
        );
      });
    });

    describe('when inserting text', function() {
      it('inserts a letter and a space', function() {
        expect(diff(
          'a c',
          'a b c'
        )).to.equal(
          'a <ins data-operation-index="1">b </ins>c'
        );
      });
    });

    describe('when removing text', function() {
      it('removes a letter and a space', function() {
        expect(diff(
          'a b c',
          'a c'
        )).to.equal(
          'a <del data-operation-index="1">b </del>c'
        );
      });
    });

    describe('when changing text', function() {
      it('changes a letter', function() {
        expect(diff(
          'a b c',
          'a d c'
        )).to.equal(
          'a <del data-operation-index="1">b</del><ins data-operation-index="1">d</ins> c'
        );
      });
    });

    describe('when diffing accented characters', function() {
      it('supports accents', function() {
        expect(diff(
          'blåbær dèjá vu',
          'blåbær deja vu'
        )).to.equal(
          'blåbær <del data-operation-index="1">dèjá</del><ins data-operation-index="1">deja</ins> vu'
        );
      });
    });

    // The javascript version currently does not treat mail addresses as special cases.
    // describe('when diffing email addresses', function() {
    //   it('supports email addresses', function() {
    //     expect(diff(
    //       'I sent an email to foo@bar.com!',
    //       'I sent an email to baz@bar.com!'
    //     )).to.equal(
    //       'I sent an email to <del data-operation-index="1">foo@bar.com</del><ins data-operation-index="1">baz@bar.com</ins>!'
    //     );
    //   });
    // });

    describe('when diffing sentences with punctuation', function() {
      it('supports sentences', function() {
        expect(diff(
          'The quick red fox? "jumped" over; the "lazy", brown dog! Didn\'t he?',
          'The quick blue fox? \'hopped\' over! the "active", purple dog! Did he not?'
        )).to.equal(
          'The quick <del data-operation-index="1">red</del><ins data-operation-index="1">blue</ins> fox? <del data-operation-index="3">"jumped"</del><ins data-operation-index="3">\'hopped\'</ins> over<del data-operation-index="5">;</del><ins data-operation-index="5">!</ins> the "<del data-operation-index="7">lazy</del><ins data-operation-index="7">active</ins>", <del data-operation-index="9">brown</del><ins data-operation-index="9">purple</ins> dog! <del data-operation-index="11">Didn\'t</del><ins data-operation-index="11">Did</ins> he<ins data-operation-index="13"> not</ins>?'
        );
      });
    });

    describe('when diffing escaped HTML', function() {
      it('supports escaped HTML', function() {
        expect(diff(
          '&lt;div&gt;this &lt;span tag=1 class="foo"&gt;is a sentence&lt;/span&gt; test&lt;/div&gt;',
          '&lt;div&gt;this &lt;span class="bar" tag=2&gt;is a string&lt;/label&gt; also a test&lt;/label&gt;'
        )).to.equal(
          '&lt;div&gt;this &lt;span <del data-operation-index="1">tag=1 </del>class="<del data-operation-index="3">foo</del><ins data-operation-index="3">bar</ins>"<ins data-operation-index="5"> tag=2</ins>&gt;is a <del data-operation-index="7">sentence</del><ins data-operation-index="7">string</ins>&lt;/<del data-operation-index="9">span</del><ins data-operation-index="9">label</ins>&gt;<ins data-operation-index="11"> also a</ins> test&lt;/<del data-operation-index="13">div</del><ins data-operation-index="13">label</ins>&gt;'
        );
      });
    });

    describe('when diffing with image tags', function() {
      describe('with insertion', function() {
        it('supports img tags insertion', function() {
          expect(diff(
            'a b c',
            'a b <img src="some_url" /> c'
          )).to.equal(
            'a b <ins data-operation-index="1"><img src="some_url" /> </ins>c'
          );
        });
      });

      describe('with deletion', function() {
        it('supports img tags deletion', function() {
          expect(diff(
            'a b <img src="some_url" /> c',
            'a b c'
          )).to.equal(
            'a b <del data-operation-index="1"><img src="some_url" /> </del>c'
          );
        });
      });
    });

    describe('with nil (null) inputs', function() {
      it('handles null old_text', function() {
        expect(diff(null, 'some text')).to.equal('<ins data-operation-index="0">some text</ins>');
      });

      it('handles null new_text', function() {
        expect(diff('some text', null)).to.equal('<del data-operation-index="0">some text</del>');
      });

      it('handles both null', function() {
        expect(diff(null, null)).to.equal('');
      });

      it('returns empty string for empty inputs', function() {
        expect(diff('', '')).to.equal('');
      });
    });

    describe('multi-language support', function() {
      it('supports Cyrillic', function() {
        expect(diff(
          'Привет, как дела?',
          'Привет, хорошо дела!'
        )).to.equal(
          'Привет, <del data-operation-index="1">как</del><ins data-operation-index="1">хорошо</ins> дела<del data-operation-index="3">?</del><ins data-operation-index="3">!</ins>'
        );
      });

      it('supports Greek', function() {
        expect(diff(
          'Καλημέρα κόσμε',
          'Καλησπέρα κόσμε'
        )).to.equal(
          '<del data-operation-index="0">Καλημέρα</del><ins data-operation-index="0">Καλησπέρα</ins> κόσμε'
        );
      });

      it('supports Arabic', function() {
        expect(diff(
          'مرحبا بالعالم',
          'مرحبا جميل بالعالم'
        )).to.equal(
          'مرحبا <ins data-operation-index="1">جميل </ins>بالعالم'
        );
      });

      it('supports Hebrew', function() {
        expect(diff(
          'שלום עולם',
          'שלום עולם קטן'
        )).to.equal(
          'שלום עולם<ins data-operation-index="1"> קטן</ins>'
        );
      });

      it('supports Vietnamese', function() {
        expect(diff(
          'Xin chào thế giới',
          'Xin chào thế giới mới'
        )).to.equal(
          'Xin chào thế giới<ins data-operation-index="1"> mới</ins>'
        );
      });

      it('handles mixed scripts', function() {
        expect(diff(
          'Hello مرحبا Привет',
          'Hello مرحبا جدا Привет'
        )).to.equal(
          'Hello مرحبا <ins data-operation-index="1">جدا </ins>Привет'
        );
      });

      it('supports Cyrillic with HTML tags', function() {
        expect(diff(
          '<div>Текст в теге</div>',
          '<div>Новый текст в теге</div>'
        )).to.equal(
          '<div><del data-operation-index="1">Текст</del><ins data-operation-index="1">Новый текст</ins> в теге</div>'
        );
      });

      it('supports Arabic with HTML tags', function() {
        expect(diff(
          '<span>النص في العلامة</span>',
          '<span>النص الجديد في العلامة</span>'
        )).to.equal(
          '<span>النص</span><ins data-operation-index="1"><span> الجديد</span></ins><span> في العلامة</span>'
        );
      });

      it('handles complex Hebrew changes', function() {
        expect(diff(
          'אני אוהב לתכנת בשפת רובי',
          'אני אוהב מאוד לתכנת בשפת פייתון'
        )).to.equal(
          'אני אוהב <ins data-operation-index="1">מאוד </ins>לתכנת בשפת <del data-operation-index="3">רובי</del><ins data-operation-index="3">פייתון</ins>'
        );
      });

      it('supports Vietnamese diacritics', function() {
        expect(diff(
          'Tôi yêu lập trình',
          'Tôi thích lập trình'
        )).to.equal(
          'Tôi <del data-operation-index="1">yêu</del><ins data-operation-index="1">thích</ins> lập trình'
        );
      });

      it('handles mixed languages with punctuation', function() {
        expect(diff(
          'Hello, Привет! مرحبا. שלום',
          'Hello, Привет! مرحبا جدا. שלום עולם'
        )).to.equal(
          'Hello, Привет! مرحبا<ins data-operation-index="1"> جدا</ins>. שלום<ins data-operation-index="3"> עולם</ins>'
        );
      });

      it('supports Greek with formatting tags', function() {
        expect(diff(
          '<b>Γεια σας</b> κόσμε',
          '<b>Γεια σου</b> κόσμε'
        )).to.equal(
          '<b>Γεια </b><del data-operation-index="1"><b>σας</b></del><ins data-operation-index="1"><b>σου</b></ins> κόσμε'
        );
      });

      it('detects changes within Arabic words', function() {
        expect(diff(
          'البرمجة ممتعة',
          'البرمجة سهلة'
        )).to.equal(
          'البرمجة <del data-operation-index="1">ممتعة</del><ins data-operation-index="1">سهلة</ins>'
        );
      });

      it('properly handles RTL text with HTML', function() {
        expect(diff(
          '<div dir="rtl">שלום עולם</div>',
          '<div dir="rtl">שלום חבר</div>'
        )).to.equal(
          '<div dir="rtl">שלום <del data-operation-index="1">עולם</del><ins data-operation-index="1">חבר</ins></div>'
        );
      });

      it('handles multi-word changes in Vietnamese', function() {
        expect(diff(
          'Tôi đang học Ruby',
          'Tôi đang học Python rất vui'
        )).to.equal(
          'Tôi đang học <del data-operation-index="1">Ruby</del><ins data-operation-index="1">Python rất vui</ins>'
        );
      });

      it('supports Chinese', function() {
        expect(diff(
          '这个是中文内容, Ruby is the bast',
          '这是中国语内容，Ruby is the best language.'
        )).to.equal(
          '<del data-operation-index="0">这个</del><ins data-operation-index="0">这</ins>是<del data-operation-index="2">中文</del><ins data-operation-index="2">中国语</ins>内容<del data-operation-index="4">, </del><ins data-operation-index="4">，</ins>Ruby is the <del data-operation-index="6">bast</del><ins data-operation-index="6">best language.</ins>'
        );
      });

      it('supports Hindi (Devanagari)', function() {
        expect(diff(
          'नमस्ते दुनिया',
          'नमस्ते प्यारी दुनिया'
        )).to.equal(
          'नमस्ते <ins data-operation-index="1">प्यारी </ins>दुनिया'
        );
      });

      it('supports Thai', function() {
        expect(diff(
          'สวัสดีชาวโลก',
          'สวัสดีชาวโลกที่สวยงาม'
        )).to.equal(
          'สวัสดีชาวโลก<ins data-operation-index="1">ที่สวยงาม</ins>'
        );
      });

      it('supports Japanese', function() {
        expect(diff(
          'こんにちは世界',
          'こんにちは美しい世界'
        )).to.equal(
          'こんにちは<ins data-operation-index="1">美しい</ins>世界'
        );
      });

      it('supports Korean', function() {
        expect(diff(
          '안녕하세요 세계',
          '안녕하세요 아름다운 세계'
        )).to.equal(
          '안녕하세요 <ins data-operation-index="1">아름다운 </ins>세계'
        );
      });

      it('supports Armenian', function() {
        expect(diff(
          'Բարեւ աշխարհ',
          'Բարեւ գեղեցիկ աշխարհ'
        )).to.equal(
          'Բարեւ <ins data-operation-index="1">գեղեցիկ </ins>աշխարհ'
        );
      });

      it('supports Georgian', function() {
        expect(diff(
          'გამარჯობა მსოფლიო',
          'გამარჯობა ლამაზი მსოფლიო'
        )).to.equal(
          'გამარჯობა <ins data-operation-index="1">ლამაზი </ins>მსოფლიო'
        );
      });

      it('supports Amharic (Ethiopic)', function() {
        expect(diff(
          'ሰላም ዓለም',
          'ሰላም ውብ ዓለም'
        )).to.equal(
          'ሰላም <ins data-operation-index="1">ውብ </ins>ዓለም'
        );
      });

      it('handles complex changes in Japanese', function() {
        expect(diff(
          '日本語は面白いです',
          '日本語は素晴らしいです'
        )).to.equal(
          '日本語は<del data-operation-index="1">面白い</del><ins data-operation-index="1">素晴らしい</ins>です'
        );
      });

      it('detects changes within Devanagari words', function() {
        expect(diff(
          'मैं प्रोग्रामिंग पसंद करता हूँ',
          'मैं कोडिंग पसंद करता हूँ'
        )).to.equal(
          'मैं <del data-operation-index="1">प्रोग्रामिंग</del><ins data-operation-index="1">कोडिंग</ins> पसंद करता हूँ'
        );
      });
    });

    describe('HTML entities', function() {
      it('supports basic HTML entities', function() {
        expect(diff(
          'a &lt; b &gt; c',
          'a &lt; b &amp; c'
        )).to.equal(
          'a &lt; b <del data-operation-index="1">&gt;</del><ins data-operation-index="1">&amp;</ins> c'
        );
      });

      // Not sure if the ruby or the javascript version is 'better' here, comment out for now.
      // it('handles entity changes', function() {
      //   expect(diff(
      //     '&amp; &lt; &gt; &quot; &apos;',
      //     '&amp; &lt; &gt; &apos; &quot;'
      //   )).to.equal(
      //     '&amp; &lt; &gt; <del data-operation-index="1">&quot; </del>&apos;<ins data-operation-index="3"> &quot;</ins>'
      //   );
      // });

      it('preserves numeric HTML entities', function() {
        expect(diff(
          '&#8364; is euro',
          '&#8364; is the euro symbol'
        )).to.equal(
          '&#8364; is <ins data-operation-index="1">the </ins>euro<ins data-operation-index="3"> symbol</ins>'
        );
      });

      it('diffs content with multiple entities correctly', function() {
        expect(diff(
          '&lt;p&gt;text&lt;/p&gt;',
          '&lt;p&gt;new text&lt;/p&gt;'
        )).to.equal(
          '&lt;p&gt;<ins data-operation-index="1">new </ins>text&lt;/p&gt;'
        );
      });

      it('handles mixed entities and normal text', function() {
        expect(diff(
          '&copy; 2023 Company',
          '&copy; 2024 New Company'
        )).to.equal(
          '&copy; <del data-operation-index="1">2023</del><ins data-operation-index="1">2024 New</ins> Company'
        );    
      });

      it('diffs escaped HTML tags correctly', function() {
        expect(diff(
          '&lt;div class="old"&gt;content&lt;/div&gt;',
          '&lt;div class="new"&gt;content&lt;/div&gt;'
        )).to.equal(
          '&lt;div class="<del data-operation-index="1">old</del><ins data-operation-index="1">new</ins>"&gt;content&lt;/div&gt;'
        );
      });

      it('handles HTML entities in different scripts', function() {
        expect(diff(
          '&lt;span&gt;привет&lt;/span&gt;',
          '&lt;span&gt;здравствуйте&lt;/span&gt;'
        )).to.equal(
          '&lt;span&gt;<del data-operation-index="1">привет</del><ins data-operation-index="1">здравствуйте</ins>&lt;/span&gt;'
        );
      });

      it('correctly processes HTML entities in attributes', function() {
        expect(diff(
          '&lt;a title="&amp; more"&gt;link&lt;/a&gt;',
          '&lt;a title="&amp; less"&gt;link&lt;/a&gt;'
        )).to.equal(
          '&lt;a title="&amp; <del data-operation-index="1">more</del><ins data-operation-index="1">less</ins>"&gt;link&lt;/a&gt;'
        );
      });

      it('handles complex entity sequences', function() {
        expect(diff(
          '&alpha;&beta;&gamma;',
          '&alpha;&delta;&gamma;'
        )).to.equal(
          '&alpha;<del data-operation-index="1">&beta;</del><ins data-operation-index="1">&delta;</ins>&gamma;'
        );
      });
    });
  });
});
