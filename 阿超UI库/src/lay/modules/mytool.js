byui.define(['jquery'], function(exports){
    "use strict";
    // to do you code
    var $ = byui.$; // 这个就是程序猿常用的jquery库了
  
    // 这里可以做更多的你熟悉的js事件...
  
    // 工厂模式，暴露code模块，在其他模块引用的话就可以调用它
    exports('mytool', function(){
        console.log('test');
    });
  });