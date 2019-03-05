// const points = mds_data;
const points = fd_data;
const margin = {top: 20, right: 20, bottom: 30, left: 40};
const width = 500 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const xScale = d3.scaleLinear()
    .range([0, width]);

const yScale = d3.scaleLinear()
    .range([height, 0]);

const xAxis = d3.axisBottom(xScale);

const yAxis = d3.axisLeft(yScale);

const svg = d3.select("#chart1")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let dual_selected = false;
let d1, d2;

var yaxistext = "mds x-axis"
var xaxistext = "mds y-axis"

// xScale.domain(d3.extent(points, d => d['x'])).nice();
// yScale.domain(d3.extent(points, d => d['y'])).nice();

xScale.domain(d3.extent(points, function(d){
    return d.x}));
yScale.domain(d3.extent(points, function(d){ return d.y}));

// x-axis
svg.append("g")
    .attr("class", "xaxis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

// y-axis
svg.append("g")
    .attr("class", "yaxis")
    .call(yAxis);

// plot points
svg.selectAll(".dot")
    .data(points)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 3)
    .attr("cx", d => xScale(d.x))
    .attr("cy", d => yScale(d.y))
    .attr("fill", function (d, i) {
        if(i < 800) {
            return "red";
        } else {
            return "green";
        }
    })
    .on("click", function (d, i) {
        console.log("here");
        if(dual_selected){
            d2 = i;
            var myNode = document.getElementById("chart2");
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }
            var myNode = document.getElementById("chart3");
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }

            create_chart_2();
            create_chart_3();
            dual_selected = false;
        } else {
            d1 = i;
            dual_selected = true;
        }
    });

// text label for the x axis
svg.append("text")
    .attr("class", "axistext")
    .attr("transform",
        "translate(" + (width - margin.left) + " ," +
        (height + margin.top+5) + ")")
    .style("text-anchor", "middle")
    .text(yaxistext);

// text label for the y axis
svg.append("text")
    .attr("class", "axistext")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height/2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text(xaxistext);

function create_chart_2() {
    var svg = d3.select("#chart2"),
        margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // firstServe = [fd_data[d1]['firstServe'], fd_data[d2]['firstServe']]
    // Name = [fd_data[d1]['player'], fd_data[d2]['player']]
    // let dat1 = firstServe.map(Math.abs);
    // let dat2 = ace.map(Math.abs);

    data = [{"name":fd_data[d1]['player'],"value":fd_data[d1]['total'],"isWinner":fd_data[d1]['isWinner']},
        {"name":fd_data[d2]['player'],"value":fd_data[d2]['total'],"isWinner":fd_data[d2]['isWinner']}]

    console.log(data);

    // var max_value = d3.max([d3.max(dat1), d3.max(dat2)]);
    // console.log(max_value);

    var x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, width - margin.right])
        .padding(0.1)

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)]).nice()
        .range([height, margin.top])

    // var y2 = d3.scaleLinear()
    //     .rangeRound([height, height/2]);

    // x.domain(data[0].map(function (d, i) {
    //     return i;
    // }));
    //
    // y1.domain([0, max_value]);
    // y2.domain([0, max_value]);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0))

    g.append("g")
        .call(d3.axisLeft(y))
        // .call(g => g.select(".domain").remove());
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Total points");

    // g.append("g")
    // .call(d3.axisLeft(y2))
    // .append("text")
    // .attr("fill", "#000")
    // .attr("transform", "rotate(-270)")
    // .attr("y", 6)
    // .attr("dy", "0.71em")
    // .attr("text-anchor", "end")
    // .text("Values");

    g.selectAll(".bar1")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar1")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", function(d) {
            if (d.isWinner == true) {
                return "green";
            } else {
                return "red";
            }
        });
    // //
    // g.selectAll(".bar2")
    // .data(data[1])
    // .enter().append("rect")
    // .attr("class", "bar2")
    // .attr("x", function (d, i) {
    //     return x(i);
    // })
    // .attr("y", function (d) {
    //     return y2(d);
    // })
    // .attr("width", x.bandwidth())
    // .attr("height", function (d) {
    //     return height - y2(d);
    // })
    //     .attr("fill", "red");

}
function create_chart_3() {
    var svg = d3.select("#chart3"),
        margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // firstServe = [fd_data[d1]['firstServe'], fd_data[d2]['firstServe']]
    // Name = [fd_data[d1]['player'], fd_data[d2]['player']]
    // let dat1 = firstServe.map(Math.abs);
    // let dat2 = ace.map(Math.abs);

    data = [{"name":fd_data[d1]['player'],"value":fd_data[d1]['avgFirstServe'],"isWinner":fd_data[d1]['isWinner']},
            {"name":fd_data[d2]['player'],"value":fd_data[d2]['avgFirstServe'],"isWinner":fd_data[d2]['isWinner']}]

    console.log(data);

    // var max_value = d3.max([d3.max(dat1), d3.max(dat2)]);
    // console.log(max_value);

    var x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, width - margin.right])
        .padding(0.1)

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)]).nice()
        .range([height, margin.top])

    // var y2 = d3.scaleLinear()
    //     .rangeRound([height, height/2]);

    // x.domain(data[0].map(function (d, i) {
    //     return i;
    // }));
    //
    // y1.domain([0, max_value]);
    // y2.domain([0, max_value]);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0))

    g.append("g")
        .call(d3.axisLeft(y))
        // .call(g => g.select(".domain").remove());
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("First Serve");

    // g.append("g")
    // .call(d3.axisLeft(y2))
    // .append("text")
    // .attr("fill", "#000")
    // .attr("transform", "rotate(-270)")
    // .attr("y", 6)
    // .attr("dy", "0.71em")
    // .attr("text-anchor", "end")
    // .text("Values");

    g.selectAll(".bar1")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar1")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", function(d) {
            if (d.isWinner == true) {
                return "green";
            } else {
                return "red";
            }
        });
    // //
    // g.selectAll(".bar2")
    // .data(data[1])
    // .enter().append("rect")
    // .attr("class", "bar2")
    // .attr("x", function (d, i) {
    //     return x(i);
    // })
    // .attr("y", function (d) {
    //     return y2(d);
    // })
    // .attr("width", x.bandwidth())
    // .attr("height", function (d) {
    //     return height - y2(d);
    // })
    //     .attr("fill", "red");

}