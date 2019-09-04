/**

 @Name：byui 移动模块入口 | 构建后则为移动模块集合
 @Author：贤心
 @License：MIT
    
 */

 
if(!byui['byui.mobile']){
  byui.config({
    base: byui.cache.dir + 'lay/modules/mobile/'
  }).extend({
    'layer-mobile': 'layer-mobile'
    ,'zepto': 'zepto'
    ,'upload-mobile': 'upload-mobile'
    ,'layim-mobile': 'layim-mobile'
  });
}  

byui.define([
  'layer-mobile'
  ,'zepto'
  ,'layim-mobile'
], function(exports){
  exports('mobile', {
    layer: byui['layer-mobile'] //弹层
    ,layim: byui['layim-mobile'] //WebIM
  });
});