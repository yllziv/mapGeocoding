// 当窗口变化，设置arcsde数据图片的高度=分割线的高度
var resizewindow = function () {
    // 更改map高度
    var mapheight = $(window).height() - $(".pagehead").height() - 10;
    $("#list").height(mapheight);
    $("#allmap").height(mapheight)
};
resizewindow();
$(window).resize(function () {
    resizewindow();
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

// 添加点
var addPoint = function(point,lable,level){
    var point = point || new BMap.Point(116.404, 39.915);
    map.centerAndZoom(point, level);
    var marker = new BMap.Marker(point);  // 创建标注
    map.addOverlay(marker);               // 将标注添加到地图中
    marker.setLabel(lable);
    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画

}

var serverString = "http://localhost:12902/geocoding?keyWord=%E6%AD%A6%E6%B1%89%E5%B8%82%E9%9D%92%E5%B1%B1%E5%8C%BA%E6%B2%BF%E6%B8%AF%E4%B8%80%E5%B7%B75%E5%8F%B71%E6%A0%8B&cityName=131&out_coord_type=gcj02&ak=E4805d16520de693a3fe707cdc962045";
//severString = decodeURI(serverString);
var getPointFromServer = function() {
    //$.ajax({
    //    type:'GET',
    //    url:serverString,
    //    dataType:'jsonp',
    //    data:'',
    //    scriptCharset:'utf-8',
    //    jsonp:'callback',
    //    success:function(result) {
    //       console.log("ok");
    //        console.log(result)
    //    },
    //    timeout:3000
    //});
    $.get(serverString,function(data){
        var originString = replaceString(unescape(data),"+");
        var lngString = originString;
        var re = /\d+(\.\d+)+/;
        var lng = re.exec(lngString)[0];
        var latString = originString.split("lat")[1];
        var lat = re.exec(latString)[0];
        console.log(parseFloat(lng),parseFloat(lat))
    });
}

var replaceString = function(str,substr){
    var result = [];
    for(var i = 0,j = 0; i < str.length; i++){
        if(str[i] != substr){
            j++;
            result.push(str[i]);
        }
    }
    return result.join("");
}

// 解析单个地址
var processOneAddr = function(inputtext){
    map.clearOverlays();
    var myGeo = new BMap.Geocoder();
    myGeo.getPoint(inputtext, function(point){
        if (point) {
            map.centerAndZoom(point, 16);
            addPoint(point,new BMap.Label(inputtext,{offset:new BMap.Size(20,-10)}),16);
        }else{
            alert("您选择地址没有解析到结果!");
        }
    }, "武汉市");
}

var processManyAddr = function(adds) {
    map.clearOverlays();
    var myGeo = new BMap.Geocoder();
    var index = 0;
    var adds = adds || [
        "武汉大学",
        "华中科技大学"
    ];

    var bdGEO = function () {
        var add = adds[index];
        geocodeSearch(add);
        index++;
    }
    var geocodeSearch = function (add) {
        if (index < adds.length) {
            setTimeout(bdGEO, 20);
        }
        myGeo.getPoint(add, function (point) {
            if (point) {
                var address = new BMap.Point(point.lng, point.lat);
                addPoint(address, new BMap.Label(add,{offset:new BMap.Size(20,-10)}),13);
            }
        }, "武汉市");
    }
    bdGEO();
}

getPointFromServer();
initmap();// 初始化地图
//addPoint(); // 添加点
//bdGEO();// 多个点


$("#muitisearch").click(function(){
    var inputtextarea = $("#inputtextarea").val().split("；");
    processManyAddr(inputtextarea);
})

$("#onesearch").click(function(){
    var inputtext = $("#inputtext").val();
    processOneAddr(inputtext);
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


$('#home').click(function (e) {
    e.preventDefault()
    $(this).tab('show');
});
$('#profile').click(function (e) {
    e.preventDefault()
    $(this).tab('show');
});


var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
    {"input" : "inputtext"
        ,"location" : map
    });

ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
    var str = "";
    var _value = e.fromitem.value;
    var value = "";
    if (e.fromitem.index > -1) {
        value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
    }
    str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

    value = "";
    if (e.toitem.index > -1) {
        _value = e.toitem.value;
        value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
    }
    str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
    G("searchResultPanel").innerHTML = str;
});

var myValue;
ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
    var _value = e.item.value;
    myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
    G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

    setPlace();
});

function setPlace(){
    map.clearOverlays();    //清除地图上所有覆盖物
    function myFun(){
        var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
        map.centerAndZoom(pp, 18);
        map.addOverlay(new BMap.Marker(pp));    //添加标注
    }
    var local = new BMap.LocalSearch(map, { //智能搜索
        onSearchComplete: myFun
    });
    local.search(myValue);
}

