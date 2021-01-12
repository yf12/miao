# svg&d3

3.5

svg

* XML格式

* 基础属性
  * fill 填充
  * stroke 描边色    //矩形描边是从矩形的边缘向两侧描的
    stroke-dasharray  虚线

基础标签

* rect
  x,y,width,height

* circle
  cx,cy,r

* ellipse
  cx,cy,rx,ry

* line
  x1,y1,x2,y2      

* polyline 折现填充
  从起始点到终点连线，与其他线围成的闭合区域

* polygon 多边形
  points
    x1,y1,x2,y2,x3,y3  

* path标签
  d
  * M(Moveto) 20 30  把我的画笔移到(20,30)这个位置上来(绝对位置,相当于画布)
    m 20 30  相对于当前位置
    L(Lineto) 100 100 从当前点画一条线到目标点
    h 水平移动
    v 垂直移动

    贝塞尔曲线
    * 二阶贝塞尔曲线
      Q x1 y1(控制点) x y(终点)
      T x y 创建对称的二阶贝塞尔曲线(控制点以之前的终点对称)
    * 三阶贝塞尔曲线
      C x1 y1(控制点) x2 y2(控制点) x y(终点)
      S x2 y2 x y 创建对称的三阶贝塞尔曲线(第一个控制点是前一个曲线的第二个对称点以之前的终点对称)

    A 画个弧出来
    * rx 水平轴
    * ry 垂直轴
    * rotate 旋转轴
    * 大小弧 1大 0小
    * 弧线方向 1顺时针 0逆时针
    * x,y 终点

    z 闭合路径，使之成为一个多边形
  一个path可以画出多个离散的图形  

* <g></g>  group 非自闭合标签 
  整组操作标签
  通用属性子标签会继承

* <use href="#id" x="" y="" />
  直接用之前写好的元素(同一个页面中)

* <defs></defs>
  放在defs标签里的内容不会被显示出来

* <symbol></symbol>
  有viewBox属性，可以随意放大缩小图标

* svg元素的属性
  * viewBox  x y width height

* 后出现的元素总在先出现的元素的上面


# d3

* enter //多余的数据产生的占位符
  exit  //多余的dom元素/没有与数据匹配到的元素(没有数据与其绑定)  .remove()
  