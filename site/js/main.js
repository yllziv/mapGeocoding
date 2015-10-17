var changeline = 0;
$("#inputtextarea").hide();


var oneline = function () {
    $("#changeline").children("span").attr("class", "glyphicon glyphicon-menu-hamburger");
    $("#inputtextarea").hide();
    $("#inputtext").show();
};
var mutiline = function () {
    console.log("po")
    $("#changeline").children("span").attr("class", "glyphicon glyphicon-minus");
    $("#inputtextarea").show();
    $("#inputtext").hide();
};

$("#changeline").click(function () {
    if (changeline % 2 == 1) oneline();
    else mutiline();
    changeline++;
});

// 百度地图API功能
var initmap = function() {
    var map = new BMap.Map("allmap");
    map.centerAndZoom(new BMap.Point(114.3642, 30.536475), 12);
    map.enableScrollWheelZoom(true);
    var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
    var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
    var overView = new BMap.OverviewMapControl();
    var overViewOpen = new BMap.OverviewMapControl({isOpen:true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT});
    var mapType1 = new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP,BMAP_HYBRID_MAP]});
    map.addControl(top_left_control);
    map.addControl(top_left_navigation);
    map.addControl(overView);          //添加默认缩略地图控件
    map.addControl(overViewOpen);      //右下角，打开
    map.addControl(mapType1);          //2D图，卫星图
}

// 更改map高度
var mapheight = $(window).height() - $(".pagehead").height();
$("#list").height(mapheight);
$("#allmap").height(mapheight);

initmap();// 初始化地图