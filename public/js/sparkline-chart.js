var echartBar = function(){
    var barChart = echarts.init(document.getElementById('barchart'));
    // 指定图表的配置项和数据
    var option = {
        color: ['#fff'],
        title: {
            text: 'ECharts 入门示例'
        },
        grid: {
            bottom: 0,
            top: 0,
            left: 0,
            right: 0
        },
        tooltip: {
            show: true,
            trigger: 'item'
        },
        legend: {
            data:['销量']
        },
        xAxis: {
            show: false,
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {
            show: false
        },
        series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20, 20, 36, 10, 10, 20],
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    barChart.setOption(option);
}()

var echartLine = function(){
    var barChart = echarts.init(document.getElementById('sparkline'));
    // 指定图表的配置项和数据
    var option = {
        color: ['#fff'],
        title: {
            text: 'ECharts 入门示例'
        },
        grid: {
            bottom: 0,
            top: 0,
            left: 0,
            right: 0
        },
        tooltip: {
            show: true,
            trigger: 'item'
        },
        legend: {
            data:['销量']
        },
        xAxis: {
            show: false,
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {
            show: false
        },
        series: [{
            name: '销量',
            type: 'line',
            data: [5, 20, 36, 10, 10, 20, 20, 36, 10, 10, 20],
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    barChart.setOption(option);
}()

