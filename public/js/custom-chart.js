// 浏览量图表
;(function(){
    var lineChart = echarts.init(document.getElementById('linechart'));
    // 指定图表的配置项和数据
    var option = {
        color: ['#fff'],
        grid: {
            bottom: 0,
            top: 0,
            left: 0,
            right: 0
        },
        tooltip: {
            show: true,
            trigger: 'item',
            formatter: '{b} : {c}'
        },
        xAxis: {
            show: false,
            data: ['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
        },
        yAxis: {
            show: false
        },
        series: [{
            name: '最近7日浏览量',
            type: 'line',
            data: [5, 28, 36, 10, 10, 20, 20],
            showAllSymbol:true
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    lineChart.setOption(option);
})()

// 模板数量图表
;(function(){
    var barChart = echarts.init(document.getElementById('barchart'));
    // 指定图表的配置项和数据
    var option = {
        color: ['#fff'],
        grid: {
            bottom: 0,
            top: 0,
            left: 0,
            right: 0
        },
        tooltip: {
            show: true,
            trigger: 'item',
            formatter: ' {b} : {c} '
        },
      
        xAxis: {
            show: false,
            data: ['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
        },
        yAxis: {
            show: false
        },
        series: [{
            name: '最近30天下载量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20, 20]
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    barChart.setOption(option);
})()


// 每月新增用户图表
;(function(){
    var barChart = echarts.init(document.getElementById('new_user_chart'));
    var option = {
        color: ['#bfc2cd'],

        grid: {
            top: 10,
            bottom: 30,
            left: 30,
            right: 10
        },
        tooltip: {
            show: true,
            trigger: 'item',
            axisPointer: {
                lineStyle: {
                    opacity: 0
                }
            },
            formatter: '{a} : {c}'
        },
  
        xAxis: {
            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
            axisLine: {
                lineStyle: {
                    color: '#858585'
                }
            }
        },
        yAxis: {
            splitLine: {
                lineStyle: {
                    color: ['#dbdce0'],
                    type:　'dashed'
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#858585'
                }
            }
        },
        series: [{
            name: '新增用户',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20, 20, 36, 10, 10, 20, 5],
            barWidth: '60%',
            itemStyle: {
                normal:{
                    barBorderRadius:[4,4,0,0]   
                }
                
            }
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    barChart.setOption(option);
})()

