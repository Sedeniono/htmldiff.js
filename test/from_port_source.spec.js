import diff from "../dist/htmldiff.js";

describe('The specs from the ruby source project', function(){
  describe('original tests', function(){  
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

  describe('new tests', function(){
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
          'a <ins>second </ins>word <del class="mod">now is here</del><ins class="mod">is there</ins>'
        );
      });
    });

    describe('when inserting text', function() {
      it('inserts a letter and a space', function() {
        expect(diff(
          'a c',
          'a b c'
        )).to.equal(
          'a <ins>b </ins>c'
        );
      });
    });

    describe('when removing text', function() {
      it('removes a letter and a space', function() {
        expect(diff(
          'a b c',
          'a c'
        )).to.equal(
          'a <del>b </del>c'
        );
      });
    });

    describe('when changing text', function() {
      it('changes a letter', function() {
        expect(diff(
          'a b c',
          'a d c'
        )).to.equal(
          'a <del class="mod">b</del><ins class="mod">d</ins> c'
        );
      });
    });

    describe('when diffing accented characters', function() {
      it('supports accents', function() {
        expect(diff(
          'blåbær dèjá vu',
          'blåbær deja vu'
        )).to.equal(
          'blåbær <del class="mod">dèjá</del><ins class="mod">deja</ins> vu'
        );
      });
    });

    describe('when diffing email addresses', function() {
      it('supports email addresses', function() {
        expect(diff(
          'I sent an email to foo@bar.com!',
          'I sent an email to baz@bar.com!'
        )).to.equal(
          'I sent an email to <del class="mod">foo@bar.com</del><ins class="mod">baz@bar.com</ins>!'
        );
      });
    });

    describe('when diffing sentences with punctuation', function() {
      it('supports sentences', function() {
        expect(diff(
          'The quick red fox? "jumped" over; the "lazy", browng! Didn\'t he?',
          'The quick blue fox? \'hopped\' over! the "active", purpleg! Did he not?'
        )).to.equal(
          "The quick <del class=\"mod\">red</del><ins class=\"mod\">blue</ins> fox? <del class=\"mod\">\"jumped\" over;</del><ins class=\"mod\">'hopped' over!</ins> the \"<del class=\"mod\">lazy\", brown</del><ins class=\"mod\">active\", purple</ins>g! <del class=\"mod\">Didn't he</del><ins class=\"mod\">Did he not</ins>"
        );
      });
    });

    describe('when diffing escaped HTML', function() {
      it('supports escaped HTML', function() {
        expect(diff(
          '&lt;div&gt;this &lt;span tag=1 class="foo"&gt;is a sentence&lt;/span&gt; test&lt;/div&gt;',
          '&lt;div&gt;this &lt;span class="bar" tag=2&gt;is a string&lt;/label&gt; also a test&lt;/label&gt;'
        )).to.equal(
          '&lt;div&gt;this &lt;span <del>tag=1 </del>class="<del class="mod">foo"</del><ins class="mod">bar" tag=2</ins>&gt;is a <del class="mod">sentence&lt;/span&gt; </del><ins class="mod">string&lt;/label&gt; also a </ins>test&lt;/<del class="mod">div</del><ins class="mod">label</ins>&gt;'
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
            'a b <ins><img src="some_url" /> </ins>c'
          );
        });
      });

      describe('with deletion', function() {
        it('supports img tags deletion', function() {
          expect(diff(
            'a b <img src="some_url" /> c',
            'a b c'
          )).to.equal(
            'a b <del><img src="some_url" /> </del>c'
          );
        });
      });
    });

    describe('with custom tokenizer', function() {
      it('uses the custom tokenizer', function() {
        const custom = { tokenize: s => s.split('') };
        expect(diff(
          'abc',
          'abd',
          { tokenizer: custom }
        )).to.equal(
          'ab<del>c</del><ins>d</ins>'
        );
      });
    });

    describe('with merge_threshold parameter', function() {
      describe('with default merge_threshold', function() {
        it('merges word "fox" into changes', function() {
          expect(diff(
            'The quick fox jumped over the dog.',
            'The slow fox hopped over the dog.'
          )).to.equal(
            'The <del>quick fox jumped</del><ins>slow fox hopped</ins> over the dog.'
          );
        });
      });
    });

    describe('with nil (null) inputs', function() {
      it('handles null old_text', function() {
        expect(diff(null, 'some text')).to.equal('<ins>some text</ins>');
      });

      it('handles null new_text', function() {
        expect(diff('some text', null)).to.equal('<del>some text</del>');
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
          'Привет, <del class="mod">как дела?</del><ins class="mod">хорошо дела!</ins>'
        );
      });

      it('supports Greek', function() {
        expect(diff(
          'Καλημέρα κόσμε',
          'Καλησπέρα κόσμε'
        )).to.equal(
          '<del class="mod">Καλημέρα</del><ins class="mod">Καλησπέρα</ins> κόσμε'
        );
      });

      it('supports Arabic', function() {
        expect(diff(
          'مرحبا بالعالم',
          'مرحبا جميل بالعالم'
        )).to.equal(
          'مرحبا <ins>جميل </ins>بالعالم'
        );
      });

      it('supports Hebrew', function() {
        expect(diff(
          'שלום עולם',
          'שלום עולם קטן'
        )).to.equal(
          'שלום עולם<ins> קטן</ins>'
        );
      });

      it('supports Vietnamese', function() {
        expect(diff(
          'Xin chào thế giới',
          'Xin chào thế giới mới'
        )).to.equal(
          'Xin chào thế giới<ins> mới</ins>'
        );
      });

      it('handles mixed scripts', function() {
        expect(diff(
          'Hello مرحبا Привет',
          'Hello مرحبا جدا Привет'
        )).to.equal(
          'Hello مرحبا <ins>جدا </ins>Привет'
        );
      });

      it('supports Cyrillic with HTML tags', function() {
        expect(diff(
          '<div>Текст в теге</div>',
          '<div>Новый текст в теге</div>'
        )).to.equal(
          '<div><del class="mod">Текст</del><ins class="mod">Новый текст</ins> в теге</div>'
        );
      });

      it('supports Arabic with HTML tags', function() {
        expect(diff(
          '<span>النص في العلامة</span>',
          '<span>النص الجديد في العلامة</span>'
        )).to.equal(
          '<span>النص <ins>الجديد </ins>في العلامة</span>'
        );
      });

      it('handles complex Hebrew changes', function() {
        expect(diff(
          'אני אוהב לתכנת בשפת רובי',
          'אני אוהב מאוד לתכנת בשפת פייתון'
        )).to.equal(
          'אני אוהב <ins>מאוד </ins>לתכנת בשפת <del class="mod">רובי</del><ins class="mod">פייתון</ins>'
        );
      });

      it('supports Vietnamese diacritics', function() {
        expect(diff(
          'Tôi yêu lập trình',
          'Tôi thích lập trình'
        )).to.equal(
          'Tôi <del class="mod">yêu</del><ins class="mod">thích</ins> lập trình'
        );
      });

      it('handles mixed languages with punctuation', function() {
        expect(diff(
          'Hello, Привет! مرحبا. שלום',
          'Hello, Привет! مرحبا جدا. שלום עולם'
        )).to.equal(
          'Hello, Привет! مرحبا<ins> جدا</ins>. שלום<ins> עולם</ins>'
        );
      });

      it('supports Greek with formatting tags', function() {
        expect(diff(
          '<b>Γεια σας</b> κόσμε',
          '<b>Γεια σου</b> κόσμε'
        )).to.equal(
          '<b>Γεια <del class="mod">σας</del><ins class="mod">σου</ins></b> κόσμε'
        );
      });

      it('detects changes within Arabic words', function() {
        expect(diff(
          'البرمجة ممتعة',
          'البرمجة سهلة'
        )).to.equal(
          'البرمجة <del class="mod">ممتعة</del><ins class="mod">سهلة</ins>'
        );
      });

      it('properly handles RTL text with HTML', function() {
        expect(diff(
          '<div dir="rtl">שלום עולם</div>',
          '<div dir="rtl">שלום חבר</div>'
        )).to.equal(
          '<div dir="rtl">שלום <del class="mod">עולם</del><ins class="mod">חבר</ins></div>'
        );
      });

      it('handles multi-word changes in Vietnamese', function() {
        expect(diff(
          'Tôi đang học Ruby',
          'Tôi đang học Python rất vui'
        )).to.equal(
          'Tôi đang học <del class="mod">Ruby</del><ins class="mod">Python rất vui</ins>'
        );
      });

      it('supports Chinese', function() {
        expect(diff(
          '这个是中文内容, Ruby is the bast',
          '这是中国语内容，Ruby is the best language.'
        )).to.equal(
          '这<del class="mod">个是中文内容, </del><ins class="mod">是中国语内容，</ins>Ruby is the <del class="mod">bast</del><ins class="mod">best language.</ins>'
        );
      });

      it('supports Hindi (Devanagari)', function() {
        expect(diff(
          'नमस्ते दुनिया',
          'नमस्ते प्यारी दुनिया'
        )).to.equal(
          'नमस्ते <ins>प्यारी </ins>दुनिया'
        );
      });

      it('supports Thai', function() {
        expect(diff(
          'สวัสดีชาวโลก',
          'สวัสดีชาวโลกที่สวยงาม'
        )).to.equal(
          'สวัสดีชาวโลก<ins>ที่สวยงาม</ins>'
        );
      });

      it('supports Japanese', function() {
        expect(diff(
          'こんにちは世界',
          'こんにちは美しい世界'
        )).to.equal(
          'こんにちは<ins>美しい</ins>世界'
        );
      });

      it('supports Korean', function() {
        expect(diff(
          '안녕하세요 세계',
          '안녕하세요 아름다운 세계'
        )).to.equal(
          '안녕하세요 <ins>아름다운 </ins>세계'
        );
      });

      it('supports Armenian', function() {
        expect(diff(
          'Բարեւ աշխարհ',
          'Բարեւ գեղեցիկ աշխարհ'
        )).to.equal(
          'Բարեւ <ins>գեղեցիկ </ins>աշխարհ'
        );
      });

      it('supports Georgian', function() {
        expect(diff(
          'გამარჯობა მსოფლიო',
          'გამარჯობა ლამაზი მსოფლიო'
        )).to.equal(
          'გამარჯობა <ins>ლამაზი </ins>მსოფლიო'
        );
      });

      it('supports Amharic (Ethiopic)', function() {
        expect(diff(
          'ሰላም ዓለም',
          'ሰላም ውብ ዓለም'
        )).to.equal(
          'ሰላም <ins>ውብ </ins>ዓለም'
        );
      });

      it('handles complex changes in Japanese', function() {
        expect(diff(
          '日本語は面白いです',
          '日本語は素晴らしいです'
        )).to.equal(
          '日本語は<del class="mod">面白</del><ins class="mod">素晴らし</ins>いです'
        );
      });

      it('detects changes within Devanagari words', function() {
        expect(diff(
          'मैं प्रोग्रामिंग पसंद करता हूँ',
          'मैं कोडिंग पसंद करता हूँ'
        )).to.equal(
          'मैं <del class="mod">प्रोग्रामिंग</del><ins class="mod">कोडिंग</ins> पसंद करता हूँ'
        );
      });
    });

    describe('HTML entities', function() {
      it('supports basic HTML entities', function() {
        expect(diff(
          'a &lt; b &gt; c',
          'a &lt; b &amp; c'
        )).to.equal(
          'a &lt; b <del class="mod">&gt;</del><ins class="mod">&amp;</ins> c'
        );
      });

      it('handles entity changes', function() {
        expect(diff(
          '&amp; &lt; &gt; &quot; &apos;',
          '&amp; &lt; &gt; &apos; &quot;'
        )).to.equal(
          '&amp; &lt; &gt; <del>&quot; </del>&apos;<ins> &quot;</ins>'
        );
      });

      it('preserves numeric HTML entities', function() {
        expect(diff(
          '&#8364; is euro',
          '&#8364; is the euro symbol'
        )).to.equal(
          '&#8364; is <ins>the </ins>euro<ins> symbol</ins>'
        );
      });

      it('diffs content with multiple entities correctly', function() {
        expect(diff(
          '&lt;p&gt;text&lt;/p&gt;',
          '&lt;p&gt;new text&lt;/p&gt;'
        )).to.equal(
          '&lt;p&gt;<ins>new </ins>text&lt;/p&gt;'
        );
      });

      it('treats entities as single units', function() {
        expect(diff(
          'a&nbsp;b',
          'a b'
        )).to.equal(
          'a<del class="mod">&nbsp;</del><ins class="mod"> </ins>b'
        );
      });

      it('handles mixed entities and normal text', function() {
        expect(diff(
          '&copy; 2023 Company',
          '&copy; 2024 New Company'
        )).to.equal(
          '&copy; <del class="mod">2023</del><ins class="mod">2024 New</ins> Company'
        );    
      });

      it('diffs escaped HTML tags correctly', function() {
        expect(diff(
          '&lt;div class="old"&gt;content&lt;/div&gt;',
          '&lt;div class="new"&gt;content&lt;/div&gt;'
        )).to.equal(
          '&lt;div class="<del class="mod">old</del><ins class="mod">new</ins>"&gt;content&lt;/div&gt;'
        );
      });

      it('handles HTML entities in different scripts', function() {
        expect(diff(
          '&lt;span&gt;привет&lt;/span&gt;',
          '&lt;span&gt;здравствуйте&lt;/span&gt;'
        )).to.equal(
          '&lt;span&gt;<del class="mod">привет</del><ins class="mod">здравствуйте</ins>&lt;/span&gt;'
        );
      });

      it('correctly processes HTML entities in attributes', function() {
        expect(diff(
          '&lt;a title="&amp; more"&gt;link&lt;/a&gt;',
          '&lt;a title="&amp; less"&gt;link&lt;/a&gt;'
        )).to.equal(
          '&lt;a title="&amp; <del class="mod">more</del><ins class="mod">less</ins>"&gt;link&lt;/a&gt;'
        );
      });

      it('handles complex entity sequences', function() {
        expect(diff(
          '&alpha;&beta;&gamma;',
          '&alpha;&delta;&gamma;'
        )).to.equal(
          '&alpha;<del class="mod">&beta;</del><ins class="mod">&delta;</ins>&gamma;'
        );
      });
    });
  });
});
