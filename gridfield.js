/* Gridfield for jQuery
 * Version 0.1
 * Written by Ry Wharton (ry-at-misprint-dot-org)
 * @requires jQuery v1.2
 *
 */

$.fn.gridfield = function(options) {
  var settings = jQuery.extend({ 
    columnWidth: 200,
    gutter: 10,
    yPadding: 10 }, options);
  
  var self = $(this);
  var columns = [];
  var columnCount = 0;
  var modules = self.children("li");

  modules.each(function(i,m) { m.w = Math.ceil($(m).width()/(settings.columnWidth+settings.gutter)) });
  var updateColumnCount = function() { 
    columnCount = Math.floor(($(window).width()-settings.gutter) / (settings.columnWidth + settings.gutter));
  }
  
  var heightSort = function(a,b) { 
    if (a.y == b.y) return a.x-b.x; 
    else return a.y-b.y;
  }

  var leftToRightSort = function(a,b) { 
    return a.x-b.x; 
  }

  arrange = function() {
    updateColumnCount();
    columns = [];
    for (i=0; i<columnCount;i++) {
      columns[i] = { x:i, y:0 };
    }

    modules.hide().each(function(i,m) { 
      var next;
      if (m.w == 1) {
        next = columns.sort(heightSort)[0];
      } else if (m.w <= columnCount){
        var possibles = [];
        $.each( columns.sort(leftToRightSort).slice(0,(columnCount-m.w)+1) , function(i,c) {
          // find minimum height to be placed in this column
          var max = -1;
          for(j=i; j<i+m.w; j++) {
            if (columns[j].y > max) { max = columns[j].y };
          }
          possibles.push({x:i, y:max});
        });
        next = possibles.sort(heightSort)[0];
      } else {
        return;
      }
      // update all spanned columns
      $(m).css({position:"absolute", top:next.y+"px", left:next.x*(settings.columnWidth+settings.gutter)+"px"}).show();
      $.each(columns.sort(leftToRightSort).slice(next.x,next.x+m.w), function(i,v) { v.y = next.y+$(m).height()+settings.yPadding; });
      self.css({ height: columns.sort(heightSort)[columnCount-1].y,
                 width: columnCount*(settings.columnWidth+settings.gutter)-settings.gutter });
    });
    
  }

  $(window).resize(function() { 
    arrange();
  }); 

  arrange();
  return self;
}
