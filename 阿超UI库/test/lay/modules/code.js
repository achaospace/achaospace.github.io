/**
 * @file code - 测试
 * @author xuexb <fe.xiaowu@gmail.com>
 */

/* global byui */
/* eslint-disable max-nested-callbacks, fecs-indent */

var laycode = byui.code;
var $ = byui.$;

/**
 * 创建dom元素, 并返回 jquery 对象
 *
 * @inner
 *
 * @param  {string} html 标签
 *
 * @return {jQuery}
 */
var createNode = function (html) {
  return $(html).addClass('test-node').appendTo('body');
};

describe('code', function () {
  // 输出测试节点
  beforeEach(function () {
    createNode('<div id="test-div"></div>');
  });

  // 删除节点
  afterEach(function () {
    $('.test-node').remove();
  });

  it('css loaded', function () {
    expect($('#layuicss-skincodecss').length).to.equal(1, 'css link 节点必须存在');
  });

  it('default params', function () {
    expect(function () {
      laycode();
    }).to.not.throw();

    createNode('<pre class="byui-code"><div class="byui-code-div">123</div></pre>');
    laycode();

    expect($('.byui-code').hasClass('byui-code-view')).to.equal(true, '元素的样式名必须包含 byui-code-view');
    expect($('.byui-code').find('.byui-code-div').length).to.equal(1, '默认没有 encode');
    expect($('.byui-code').find('.byui-code-h3 a').length).to.equal(1, '默认有版权元素');
  });

  it('options.elem', function () {
    createNode('<pre class="byui-test"><div>123</div></pre>');

    laycode();
    expect($('.byui-test').hasClass('byui-code-view')).to.be.false;

    laycode({
      elem: '.byui-test'
    });
    expect($('.byui-test').hasClass('byui-code-view')).to.be.true;
  });

  it('options.title', function () {
    createNode('<pre class="byui-code"><div>123</div></pre>');

    laycode({
      title: 'byui',

      // 主要是版权和标题在一个元素内
      about: false
    });

    expect($('.byui-code-h3').text()).to.equal('byui', '判断标题元素');
  });

  it('options.height', function () {
    createNode('<pre class="byui-code"><div>123</div></pre>');

    laycode({
      height: 100
    });

    expect($('.byui-code-ol').css('maxHeight')).to.equal('100px', '判断ol元素的最大高');
  });

  it('options.encode', function () {
    createNode('<pre class="byui-code"><div class="byui-code-div">123\'"</div></pre>');

    laycode({
      encode: true
    });

    expect($('.byui-code').find('.byui-code-div').length).to.equal(0, 'encode 后元素被转义');
  });

  it('options.skin', function () {
    createNode('<pre class="byui-code"><div class="byui-code-div">123</div></pre>');

    laycode({
      skin: 'notepad'
    });

    expect($('.byui-code-notepad').length).to.equal(1, '自定义风格存在');
  });

  it('options.about', function () {
    createNode('<pre class="byui-code"><div class="byui-code-div">123</div></pre>');

    laycode({
      about: false
    });

    expect($('.byui-code').find('.byui-code-h3 a').length).to.equal(0, '不输出版权元素');
  });

  it('attr lay-title', function () {
    createNode('<pre class="byui-code" lay-title="byui"><div>123</div></pre>');

    laycode({
      // 主要是版权和标题在一个元素内
      about: false
    });

    expect($('.byui-code-h3').text()).to.equal('byui', '判断标题元素');
  });

  it('attr lay-height', function () {
    createNode('<pre class="byui-code" lay-height="100px"><div>123</div></pre>');

    laycode();

    expect($('.byui-code-ol').css('maxHeight')).to.equal('100px', '判断ol元素的最大高');
  });

  it('attr lay-encode', function () {
    createNode('<pre class="byui-code" lay-encode="true"><div class="byui-code-div">123</div></pre>');

    laycode();

    expect($('.byui-code').find('.byui-code-div').length).to.equal(0, 'encode 后元素被转义');
  });

  it('attr lay-skin', function () {
    createNode('<pre class="byui-code" lay-skin="notepad"><div class="byui-code-div">123</div></pre>');

    laycode();

    expect($('.byui-code-notepad').length).to.equal(1, '自定义风格存在');
  });

  it('multiple nested', function () {
    createNode([
      '<pre class="byui-code">',
        '<div class="byui-code-div">123</div>',
        '<pre class="byui-code"><div class="byui-code-div">123</div></pre>',
      '</pre>'
    ].join(''));

    laycode();

    expect($('.byui-code-view').length).to.equal(2, '必须输出2个代码块');
    expect($('.byui-code-h3').length).to.equal(2, '必须输出2个标题元素');
  });

  it('multiple init', function () {
    createNode('<pre class="byui-code"><div class="byui-code-div">123</div></pre>');

    laycode();
    expect($('.byui-code-view').length).to.equal(1);
    expect($('.byui-code-h3').length).to.equal(1);

    laycode();
    expect($('.byui-code-view').length).to.equal(1, '同标签多次调用时 view 层只有一个');
    expect($('.byui-code-h3').length).to.equal(2, '多次调用输出多个标题元素');
  });

  it('multiple line', function () {
    var html = [];

    for (var i = 0; i < 300; i++) {
      html.push('<div class="byui-code-div">byui</div>');
    }

    createNode('<pre class="byui-code">' + html.join('\n') + '</pre>');

    laycode();

    expect($('.byui-code-div').length).to.equal(300);
  });
});
/* eslint-enable max-nested-callbacks, fecs-indent */
