/**

 @Name：baiyun 移动模块入口 | 构建后则为移动模块集合
 @Author：贤心
 @License：MIT
    
 */

 
if(!baiyun['baiyun.mobile']){
  baiyun.config({
    base: baiyun.cache.dir + 'lay/modules/mobile/'
  }).extend({
    'layer-mobile': 'layer-mobile'
    ,'zepto': 'zepto'
    ,'upload-mobile': 'upload-mobile'
    ,'layim-mobile': 'layim-mobile'
  });
}  

baiyun.define([
  'layer-mobile'
  ,'zepto'
  ,'layim-mobile'
], function(exports){
  exports('mobile', {
    layer: baiyun['layer-mobile'] //弹层
    ,layim: baiyun['layim-mobile'] //WebIM
  });
});