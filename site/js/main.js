// 当窗口变化，设置arcsde数据图片的高度=分割线的高度
listWidth = 213;
var hasSlide = true;
var resizewindow = function () {
    // 更改map高度 and width
    var mapheight = $(window).height() - $(".pagehead").height() - 10;
    $("#list").height(mapheight);
    $("#allmap").height(mapheight);
};

$("#allmap").width($(window).width() - listWidth-5);
resizewindow();

$(window).resize(function (even) {
    $("body").width($(window).width())
    resizewindow();
    if($(window).width() < 900){
        $("body").width("900px");
        if(hasSlide) {
            $("#allmap").width(900 - listWidth - 5);
        }else{
            $("#allmap").width(900 - 5);
        }
    }else{
        $("body").width($(window).width());
        console.log($(window).width());
        if(hasSlide){
            $("#allmap").width($("body").width() - listWidth-5);
        }else{
            $("#allmap").width($(window).width() - 5)
        }
    }

});

// 百度地图API功能
var map = new BMap.Map("allmap");
var initmap = function() {
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


// bd_encrypt坐标转化，添加点
var addPoint = function(lng,lat,lable,level){
    // addPointByBaidu(lng,lat,lable,level)
    var baiduPoint = bd_encrypt(lat,lng);
    var point = new BMap.Point(baiduPoint.lng, baiduPoint.lat);
    var labletext = lable;
    var marker = new BMap.Marker(point);
    map.centerAndZoom(point, level);
    var marker = new BMap.Marker(point);  // 创建标注
    map.addOverlay(marker);               // 将标注添加到地图中
    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    var textLength = labletext.length;

    var opts = {
        position: point,    // 指定文本标注所在的地理位置
        offset: new BMap.Size(-(textLength * 5), -10)    //设置文本偏移量，左右，上下
    }
    var label = new BMap.Label(labletext, opts);  // 创建文本标注对象
    label.setStyle({
        color : "red",
        fontSize : "15px",
        height : "24px",
        fontFamily:"微软雅黑"
    });
    map.addOverlay(label);
    $("label.BMapLabel").parent().width(textLength*19);
}

// 使用

//var serverString = "http://localhost:12902/server/geocoding?keyWord=武汉市青山区沿港一巷5号1栋";
var getPointFromServer = function(keywords) {

    $.get("http://"+host+"/server/geocoding?keyWord="+keywords,function(data){
        console.log(data);
        var resultJson = JSON.parse(data);
        var lng = parseFloat(resultJson.results.location.lng);
        var lat = parseFloat(resultJson.results.location.lat);
        var sourcetext = resultJson.results.source;
        addPoint(lng,lat,sourcetext,16);
        console.log(lng,lat);
    });
}


// 解析单个地址
var processOneAddr = function(inputtext){
    map.clearOverlays();
    getPointFromServer(inputtext);
}

// 解析多个地址
var processManyAddr = function(adds) {
    map.clearOverlays();
    var adds = adds || [
        "武汉大学",
        "华中科技大学"
    ];
    for(var i in adds){
        console.log(adds[i]);
        getPointFromServer(adds[i]);
    }


}
initmap();// 初始化地图


$("#muitisearch").click(function(){
    var inputtextarea = $("#inputtextarea").val().split("；");
    processManyAddr(inputtextarea);
})

$("#onesearch").click(function(){
    var inputtext = $("#inputtext").val().replace(/[/,\\]/g,",");
//    processOneAddr(inputtext);
    var local = new BMap.LocalSearch(map, {
        renderOptions:{map: map}
    });
    local.search(inputtext);
})

$('#inputtext').bind('keypress',function(event){
    if(event.keyCode == "13"){
        $("#onesearch").click();
    }
});

$("#inputtextarea").bind('keypress',function(event){
    if(event.keyCode == "13"){
        $("#muitisearch").click();
    }
})
$("#sarchtext").bind('keypress',function(event){
    if(event.keyCode == "13"){
        $("#searchbutton").click();
    }
})

$(".headText").click(function(){// Test side menu
    if(hasSlide){
        $("#list").hide();
        $("#allmap").width($(window).width());
    }else{
        $("#list").show();
        $("#allmap").width($(window).width() -listWidth)
        $
    }
    hasSlide = !hasSlide;

})
