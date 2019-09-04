/**

 @Name：用于打包PC完整版，即包含layui.js和所有模块的完整合并（该文件不会存在于构建后的目录）
 @Author：贤心
 @License：LGPL
    
 */
 
byui.define(function(exports){
  var cache = byui.cache;
  byui.config({
    dir: cache.dir.replace(/lay\/dest\/$/, '')
  });
  exports('byui.all', byui.v);
});
