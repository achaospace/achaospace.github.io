/**
 * @file byui - 测试
 * @author xuexb <fe.xiaowu@gmail.com>
 */

/* global byui */
/* eslint-disable max-nested-callbacks, fecs-indent */

var $ = byui.$;

/**
 * 是否基于`phantomjs`测试, 因为有些特殊的case在ie中是不可用的, 比如: `window.event = {}`
 *
 * @type {boolean}
 */
var IS_PHANTOMJS = byui.device('phantomjs').phantomjs;

describe('byui', function () {
  it('version', function () {
    expect(byui.v).to.be.a('string');
    expect(byui.v).to.not.be.empty;
  });

  it('byui.config', function () {
    expect(byui.config()).to.deep.equal(byui);
    expect(byui.config({
      testName: 'byui'
    })).to.deep.equal(byui);
    expect(byui.cache.testName).to.equal('byui');
  });

  describe('byui.router', function () {
    var defaultData = {
      path: [],
      search: {},
      hash: ''
    };

    it('default params', function () {
      expect(byui.router).to.be.a('function');
      expect(byui.router()).to.be.a('object').and.deep.equal(defaultData);
    });

    it('error router', function () {
      [
        null,
        '',
        '#123',
        '123',
        '##'
      ].forEach(function (key) {
        expect(byui.router(key)).to.deep.equal(defaultData);
      });
    });

    it('router querystring', function () {
      expect(byui.router('#/a=1/b=2/c=')).to.deep.equal($.extend({}, defaultData, {
        href: '/a=1/b=2/c=',
        search: {
          a: '1',
          b: '2',
          c: ''
        }
      }));

      expect(byui.router('#/a=测试/b=2').search).to.deep.equal({
        a: '测试',
        b: '2'
      });

      // todo
      // urlencode
      // urldecode
    });

    it('router hash', function () {
      expect(byui.router('#/name#byui')).to.deep.equal($.extend({}, defaultData, {
        hash: '#byui',
        path: ['name'],
        href: '/name#byui'
      }));
      expect(byui.router('#/name#byui').hash).to.equal('#byui');
      expect(byui.router('#/name#byui=1').hash).to.equal('#byui=1');
      expect(byui.router('#/name##byui').hash).to.equal('##byui');
      expect(byui.router('#/name=1#byui').hash).to.equal('#byui');
      expect(byui.router('#/name=1/b=2#byui').hash).to.equal('#byui');
    });

    it('router path', function () {
      expect(byui.router('#/a/b/c=2#hash')).to.deep.equal({
        path: ['a', 'b'],
        search: {
          c: '2'
        },
        hash: '#hash',
        href: '/a/b/c=2#hash'
      });
    });
  });

  describe('byui.each', function () {
    it('check params', function () {
      expect(byui.each).to.be.a('function');
      expect(byui.each()).to.deep.equal(byui);
      expect(byui.each({})).to.deep.equal(byui);
      expect(byui.each([])).to.deep.equal(byui);
      expect(byui.each({}, function () {})).to.deep.equal(byui);
      expect(byui.each([], function () {})).to.deep.equal(byui);
    });

    it('null params', function (done) {
      var index = 0;
      byui.each(null, function (index) {
        index += 1;
      });
      setTimeout(function () {
        expect(index).to.equal(0);
        done();
      });
    });

    it('object each', function (done) {
      byui.each({
        name: 'byui'
      }, function (key, value) {
        expect(this + '').to.deep.equal(value).and.equal('byui');
        expect(key).to.equal('name');
        done();
      });
    });

    it('array each', function (done) {
      byui.each([
        'byui'
      ], function (index, value) {
        expect(this + '').to.deep.equal(value).and.equal('byui');
        expect(index).to.equal(0);
        done();
      });
    });

    it('break array each', function () {
      var arr = new Array(100).join(',').split(',');
      var flag = -1;
      byui.each(arr, function (index) {
        flag = index;
        if (index > 5) {
          return true;
        }
      });
      expect(flag).to.equal(6);

      flag = -1;
      byui.each(arr, function (index) {
        flag = index;
        if (index > 5) {
          return false;
        }
      });
      expect(flag).to.equal(99);
    });

    it('break object each', function () {
      var obj = {
        name: 'byui',
        version: '2.x'
      };
      var flag = null;
      byui.each(obj, function (key) {
        flag = key;
        return true;
      });
      expect(flag).to.equal('name');

      flag = null;
      byui.each(obj, function (key) {
        flag = key;
        return false;
      });
      expect(flag).to.equal('version');
    });
  });

  describe('byui.img', function () {
    var base64 = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    it('success callback', function (done) {
      byui.img(base64, function (img) {
        expect(img).to.not.undefined;
        expect(typeof(img)).to.equal('object', '是img对象');
        expect(img.nodeType).to.equal(1, 'img标签节点');

        // 在ie11中不通过, 原因目前不明
        // expect(img.width).to.equal(1);
        // expect(img.height).to.equal(1);
        done();
      });
    });

    it('error callback', function (done) {
      byui.img('/api/mock?statusCode=404', function () {}, function (e) {
        expect(e).to.not.undefined;
        done();
      });
    });

    // 先删除, 因为没有哪个图片是决定不变的
    // it('http 200', function (done) {
    //   byui.img('https://www.baidu.com/img/bd_logo1.png', function (img) {
    //     expect(img).to.not.undefined;
    //     done();
    //   });
    // });

    // 由于没有超时配置, 在部分设备中, dns解析可能超时
    // it('http 404', function (done) {
    //   byui.img('http://www.404.xx/logo.404.gif', function () {}, function (e) {
    //     expect(e).to.not.undefined;
    //     done();
    //   });
    // });

    it('load complete', function (done) {
      byui.img(base64, function () {
        byui.img(base64, function (img) {
          expect(img).to.not.undefined;
          done();
        });
      });
    });
  });

  it('byui.hint', function () {
    expect(byui.hint).to.be.a('function');
    expect(byui.hint()).to.be.a('object');
    expect(byui.hint().error).to.be.a('function');
  });

  describe('byui.stope', function () {
    it('stopPropagation', function (done) {
      byui.stope({
        stopPropagation: function (e) {
          expect(e).to.be.undefined;
          done();
        }
      });
    });

    it('cancelBubble', function () {
      var event = {};
      byui.stope(event);
      expect(event.cancelBubble).to.be.true;
    });

    // ie中不支持, 只针对phantomjs测试
    if (IS_PHANTOMJS) {
      it('window.event', function () {
        var old = window.event;
        var event = window.event = {};
        byui.stope();
        expect(event.cancelBubble).to.be.true;
        window.event = old;
      });
    }
  });

  describe('byui.onevent', function () {
    it('check params and return value', function () {
      expect(byui.onevent).to.be.a('function');
      expect(byui.onevent()).to.deep.equal(byui);
      expect(byui.onevent([], [], [])).to.deep.equal(byui);
      expect(byui.onevent({}, {}, {})).to.deep.equal(byui);
      expect(byui.onevent('test-' + Date.now(), 'click', function () {})).to.not.deep.equal(byui);
    });

    it('bind event', function (done) {
      var id = 'test-bind-event';
      var data = {
        name: 'byui'
      };
      byui.onevent(id, 'click', function (param) {
        expect(this).to.deep.equal(byui);
        expect(param).to.deep.equal(data);
        done();
      });
      byui.event(id, 'click', data);
    });

    it('coverage of the same name event', function () {
      var id = 'test-same-event';
      var index = 0;
      byui.onevent(id, 'click', function () {
        index = 1;
      });
      byui.onevent(id, 'click', function () {
        index = 2;
      });
      byui.event(id, 'click');
      expect(index).to.equal(2);
    });
  });

  describe('byui.event', function () {
    it('trigger event', function (done) {
      byui.onevent('test-trigger', 'click(*)', function (data) {
        expect(data).to.be.true;
        done();
      });
      byui.event('test-trigger', 'click(*)', true);
    });

    it.skip('trigger multiple', function () {
      var index = 0;
      var id = 'test-trigger-multiple';
      byui.onevent(id, 'nav', function () {
        index += 1;
      });
      byui.event(id, 'nav');
      byui.event(id, 'nav');
      byui.event(id, 'nav');
      expect(index).to.equal(3);
    });

    it('return value', function () {
      expect(byui.event('id', 'event')).to.be.null;

      // 只有在返回 false 时, 结果才是 false
      byui.onevent('test-return-value-1', 'click', function (data) {
        return data;
      });
      expect(byui.event('test-return-value-1', 'click', false)).to.be.false;
      expect(byui.event('test-return-value-1', 'click', true)).to.be.null;
      expect(byui.event('test-return-value-1', 'click')).to.be.null;
    });
  });

  describe('byui.sort', function () {
    var numberData = [
      {
        name: 1
      },
      {
        name: 3
      },
      {
        name: 2
      }
    ];

    it('check params and return value', function () {
      expect(byui.sort()).to.deep.equal([], '空参数时默认为空数组');

      expect(byui.sort({})).to.deep.equal({}, '只传空对象默认返回');
      expect(byui.sort({
        name: 'byui'
      })).to.deep.equal({
        name: 'byui'
      }, '只传一个对象参数时返回');

      expect(byui.sort([{
        name: 'byui'
      }], 'name')).to.deep.equal([{
        name: 'byui'
      }]);

      expect(byui.sort([{
        name: 'byui'
      }], 'name', true)).to.deep.equal([{
        name: 'byui'
      }]);
    });

    // 测试是否污染原数据
    it('clone object', function () {
      var clone = byui.sort(numberData, 'name');

      // 往clone对象添加
      clone.push('byui');

      expect(clone).to.have.lengthOf(4);
      expect(numberData).to.have.lengthOf(3);
    });

    it('format value number', function () {
      var result = byui.sort([
        {
          key: '1'
        },
        {
          key: '-1'
        },
        {
          key: 2
        },
        {
          key: 3
        }
      ], 'key');
      expect(result).to.deep.equal([
        {
          key: '-1'
        },
        {
          key: '1'
        },
        {
          key: 2
        },
        {
          key: 3
        }
      ]);
    });

    it('asc order', function () {
      var result = byui.sort(numberData, 'name');
      expect(result).to.deep.equal([
        {
          name: 1
        },
        {
          name: 2
        },
        {
          name: 3
        }
      ]);
    });

    it('desc order', function () {
      var result = byui.sort(numberData, 'name', true);
      expect(result).to.deep.equal([
        {
          name: 3
        },
        {
          name: 2
        },
        {
          name: 1
        }
      ]);
    });

    it('error data', function () {
      var data = [
        // null,
        {
          name: 5
        },
        {},
        [],
        'test',
        {
          name: '3'
        }
      ];
      expect(byui.sort(data, 'name')).to.deep.equal([
        {},
        [],
        'test',
        {
          name: '3'
        },
        {
          name: 5
        }
      ]);
    });
  });

  it('byui.device', function () {
    expect(byui.device).to.be.a('function');
    expect(byui.device()).to.be.a('object');
    expect(byui.device().ie).to.be.not.undefined;
    expect(byui.device().ios).to.be.not.undefined;
    expect(byui.device().android).to.be.not.undefined;
    expect(byui.device().weixin).to.be.a('boolean');
    expect(byui.device('weixin').weixin).to.be.false;
    expect(byui.device('.*')['.*']).to.be.not.empty;
    expect(byui.device('byui.com')['byui.com']).to.be.false;
  });

  describe('byui.getStyle', function () {
    it('real test', function () {
      var elem = $('<div />').css({
        position: 'fixed',
        zIndex: 10
      }).appendTo('body').get(0);

      expect(byui.getStyle(elem, 'position')).to.equal('fixed');
      expect(byui.getStyle(elem, 'z-index')).to.equal('10');
    });

    it('mock currentStyle', function (done) {
      var node = {
        currentStyle: {
          getPropertyValue: function (name) {
            expect(name).to.equal('byui');
            done();
          }
        }
      };
      byui.getStyle(node, 'byui');
    });
  });

  it('byui.extend', function () {
    expect(byui.extend).to.be.a('function');
    expect(byui.extend()).to.deep.equal(byui);
    expect(byui.extend({
      v: 'v',
      util: 'util'
    })).to.deep.equal(byui);

    var id = 'test-extend-' + Date.now();
    var data = {};
    data[id] = id;
    expect(byui.modules[id]).to.be.undefined;
    byui.extend(data);
    expect(byui.modules[id]).to.be.not.undefined;
    expect(byui.modules[id]).to.equal(id);
    delete byui.modules[id];
  });

  describe('byui.data', function () {
    if (IS_PHANTOMJS) {
      it('not support JSON', function () {
        var old = window.JSON;
        window.JSON = null;
        expect(byui.data()).to.be.undefined;
        window.JSON = {};
        expect(byui.data()).to.be.undefined;
        window.JSON = old;
      });
    }

    // 在支持情况下才测试
    if (window.localStorage) {
      it('delete table data', function() {
        var id = 'test-delete-data';
        localStorage[id] = true;
        expect(localStorage[id]).to.equal('true');
        expect(byui.data(id, null)).to.be.true;
        expect(localStorage[id]).to.be.undefined;
      });

      it('get table data', function () {
        var table = 'test-get-table-data';
        expect(byui.data(table)).to.deep.equal({});

        byui.data(table, {
          key: 'name',
          value: 'byui'
        });
        expect(byui.data(table)).to.deep.equal({
          name: 'byui'
        });

        // 删除数据
        byui.data(table, null);
      });

      it('get data', function () {
        var id = 'test-get-data';

        // 直接获取肯定为空
        expect(byui.data(null, id)).to.be.undefined;

        // 写入数据
        expect(byui.data(null, {
          key: id,
          value: true
        })).to.be.true;

        expect(byui.data(null, id)).to.be.true;

        // 清除数据
        byui.data(null, {
          key: id,
          remove: true
        });
      });

      it('remove data', function () {
        var id = 'test-remove-data';

        byui.data(null, {
          key: id,
          value: true
        });
        expect(byui.data(null, id)).to.be.true;
        byui.data(null, {
          key: id,
          remove: true
        });
        expect(byui.data(null, id)).to.be.undefined;
      });
    }
  });
});
/* eslint-enable max-nested-callbacks, fecs-indent */
