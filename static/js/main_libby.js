

// set inital Table to year 2021 & initial chart to tornados
yearSel = createYearSelector();
var selectedYear = 2021
var selectedChart = 1
var ChartNew = 0
var timeChartNew = 0
getChartJson();
getTimeJson();
getStateJson();

// PULL API DATA INTO JS

// Perform a GET request to the chart query URL/
function getChartJson(){
    d3.json("/api/json").then(function (data) { 
        createTable(data)
    })
}

// Perform a GET request to the time query URL/
function getTimeJson(){
    timeURL = "/api/time"
    d3.json(timeURL).then(function (data) {
        createTime(data)
    })
}

// Perform a GET request to the state query URL
function getStateJson(){
    stateURL = "/api/state"
    d3.json(stateURL).then(function (data) {
        createState(data)
    })
}

// function getStateJson2(){
//     stateURL = "/api/state"
//     d3.json(stateURL).then(function (data) {
//         createState2(data)
//     })
// }

yearSel.addEventListener("change", function () {
    // Get the selected year from the year selector element.
    selectedYear = yearSel.value;
    let yearTitle = d3.select(".panel-title")
    yearTitle.text(`Tornado Statistics for year ${selectedYear}`)
    // d3.json("/api/json").then(function (data) { 
    //     createTable(data)
    // })
    console.log(`call chart Json`)
    getChartJson();
    console.log(`call state Json`)
    getStateJson();
    console.log(`call show variables`)
    showVariables(selectedYear, selectedChart);   
});

// console.log(`after function ${selectedYear}`)
// showVariables(selectedYear, selectedChart);
function showVariables(){
    console.log(`show function ${selectedYear}`)
    console.log(`show function ${selectedChart}`)
}

// get chart type selection
var chartSel = document.getElementById("but")
chartSel.onclick = function () {
    // Get the selected chart from the year selector element.
    if(document.getElementById("Tornado").checked) {
        selectedChart = 1}
    if(document.getElementById("Mag").checked) {
        selectedChart = 2}
    if(document.getElementById("Loss").checked) {
        selectedChart = 3}
    // console.log(`inside function ${selectedChart}`)
    // console.log(selectedYear)
    // return selectedYear
    getChartJson();
    getTimeJson();
    getStateJson();
    showVariables(selectedYear, selectedChart);   
};

function createTable(chartData) {

    // get data for summary table
    var totalLoss = 0
    var totalInjuries = 0
    var totalFatalities = 0
    var totalLength = 0
    var totalTornados = 0
    var maxLength = 0
    var maxWidth = 0
    var maxInjuries = 0
    var maxFatalities = 0
    var maxLoss = 0
    var maxMag = 0

    console.log(`create table year = ${selectedYear}`)
    for (var t=0; t < chartData.length; t++){
        if (Object.values(chartData[t])[7] == selectedYear){
            totalLoss = totalLoss + Object.values(chartData[t])[5],
            totalInjuries = totalInjuries + Object.values(chartData[t])[3],
            totalFatalities = totalFatalities + Object.values(chartData[t])[2],
            totalLength = totalLength + Object.values(chartData[t])[4]
            totalTornados = totalTornados + 1
            if (Object.values(chartData[t])[4] > maxLength){
                maxLength = Object.values(chartData[t])[4]
            }
            if (Object.values(chartData[t])[6] > maxWidth){
                maxWidth = Object.values(chartData[t])[6]
            }
            if (Object.values(chartData[t])[3] > maxInjuries){
                maxInjuries = Object.values(chartData[t])[3]
            }
            if (Object.values(chartData[t])[2] > maxFatalities){
                maxFatalities = Object.values(chartData[t])[2]
            }
            if (Object.values(chartData[t])[5] > maxLoss){
                maxLoss = Object.values(chartData[t])[5]
            }
            if (Object.values(chartData[t])[0] > maxMag){
                maxMag = Object.values(chartData[t])[0]
            }
        }
    }

    // summary table values
    totalLossMillion = (totalLoss/1000000).toLocaleString('en-US', { maximumFractionDigits: 1 })
    maxLossMillion = (maxLoss/1000000).toLocaleString('en-US', { maximumFractionDigits: 1 })
    maxWidthMiles = maxWidth/1760

    d3.select("#total-tornado").text(`Total Tornados: ${totalTornados}`)
    d3.select("#total-loss").text(`Total Loss: $${totalLossMillion} million`)
    d3.select("#total-injuries").text(`Total Injuries: ${totalInjuries}`)
    d3.select("#total-fatalities").text(`Total Fatalities: ${totalFatalities}`)
    d3.select("#total-length").text(`Total Length: ${totalLength.toLocaleString('en-US', { maximumFractionDigits: 1 })} miles`)
    d3.select("#max-loss").text(`Maximum loss for a tornado: $${maxLossMillion} million`)
    d3.select("#max-injuries").text(`Maximum injuries for a tornado: ${maxInjuries}`)
    d3.select("#max-fatalities").text(`Maximum fatalities for a tornado: ${maxFatalities}`)
    d3.select("#max-length").text(`Maximum length for a tornado: ${maxLength.toLocaleString('en-US', { maximumFractionDigits: 1 })} miles`)
    d3.select("#max-width").text(`Maximum width for a tornado:${maxWidthMiles.toLocaleString('en-US', { maximumFractionDigits: 1 })} miles`)
};


// get data for over time charts
function createTime(timeData) {

    // get lists for year, tornados, mag, & loss
    yearList=[]
    tornadoYear=[]
    magYear=[]
    lossYear=[]

    for (var y=0; y < timeData.length; y++){
        let years = Object.values(timeData[y])[3]
        yearList.push(years)

        let tornados_year = Object.values(timeData[y])[2]
        tornadoYear.push(tornados_year)

        let mag_year = Object.values(timeData[y])[1]
        magYear.push(mag_year)

        let loss_year = Object.values(timeData[y])[0]
        lossYear.push(loss_year)
    }   

    const ctx = document.getElementById("timeChart")

    if(selectedChart === 1) {
        chartLabel = `Tornados/Year`,
        chartDataset = tornadoYear}

    else if(selectedChart === 2) {
        chartLabel = `Average Magnitude/Year`,
        chartDataset = magYear}

    else if(selectedChart === 3) {
        chartLabel = `Property Loss/Year`,
        chartDataset = lossYear}

    console.log(`timeChartNew = ${timeChartNew}`)
    console.log(timeChartNew)

    if(timeChartNew === 1) {
        console.log(`inside ChartNew if`)
        timeChart.destroy()}
    else
        console.log('skipped destroy')


    timeChart = new Chart(ctx,{
        type: "bar",
        data: {
            labels: yearList,
            datasets: [{
                data:chartDataset,
                borderWidth: 1,
                backgroundColor: 'rgba(0,0,128)',
                label: chartLabel
            }]
        }
    })

    timeChartNew = 1
}


// get data for state charts
function createState(stateData) {
    console.log(`create state chart year = ${selectedYear}`)
    console.log(ChartNew)
    state_year = []

// filter data by year
    console.log(stateData.length)
    for (var s=0; s < stateData.length ; s++){
        if (stateData[s].Year == selectedYear){
            state_year.push(stateData[s])
        }
    }
    console.log(state_year)


// make new arrays sorted in descending order for each tornados, mag, & loss
    let state_year_tornado = state_year.slice()
    state_year_tornado = state_year_tornado.sort(function(obj1,obj2) {
        return obj2.Tornados - obj1.Tornados
    })
    console.log(state_year_tornado)
    

    let state_year_mag = state_year.slice()
    state_year_mag = state_year_mag.sort(function(obj1,obj2) {
        return obj2.Magnitude - obj1.Magnitude
    })
    console.log(state_year_mag)


    let state_year_loss = state_year.slice()
    state_year_loss = state_year_loss.sort(function(obj1,obj2) {
        return obj2.Loss - obj1.Loss
    })
    console.log(state_year_loss)


// create lists for chart
    stateCountList=[]
    countListStates=[]

    for (var i=0; i < 15; i++){
        let states = state_year_tornado[i].State
        stateCountList.push(states)

        let count_states = state_year_tornado[i].Tornados
        countListStates.push(count_states)
    }
    console.log(stateCountList)
    console.log(countListStates)


    stateMagList=[]
    magListStates=[]

    for (var m=0; m < 15; m++){
        let states = state_year_mag[m].State
        stateMagList.push(states)

        let mag_states = state_year_mag[m].Magnitude
        magListStates.push(mag_states)
    }
    console.log(stateMagList)
    console.log(magListStates)


    stateLossList=[]
    lossListStates=[]
    for (var l=0; l < 15; l++){
        let states = state_year_loss[l].State
        stateLossList.push(states)

        let loss_states = state_year_loss[l].Loss
        lossListStates.push(loss_states)
    }
    console.log(stateLossList)
    console.log(lossListStates)


    if(selectedChart === 1) {
        chartLabel = `Top 15 States: Tornados/Year in ${selectedYear}`,
        xAxis = stateCountList
        yAxis = countListStates}

    else if(selectedChart === 2) {
        chartLabel = `Top 15 States: Average Magnitude/Year in ${selectedYear}`,
        xAxis = stateMagList
        yAxis = magListStates}

    else if(selectedChart === 3) {
        chartLabel = `Top 15 States: Property Loss/Year in ${selectedYear}`,
        xAxis = stateLossList
        yAxis = lossListStates}


    console.log(`ChartNew = ${ChartNew}`)
    console.log(ChartNew)

    if(ChartNew === 1) {
        console.log(`inside ChartNew if`)
        stateChart.destroy()}
    else
        console.log('skipped destroy')


    const ctx2 = document.getElementById("stateChart")

    stateChart = new Chart(ctx2,{
        type: "bar",
        data: {
            labels: xAxis,
            datasets: [{
                data:yAxis,
                borderWidth: 1,
                backgroundColor: 'rgba(128,0,128)',
                label: chartLabel
            }]
        }
    })

    ChartNew = 1

}

function createYearSelector() {
    // Code for dropdown menu that updates map
    // Get a reference to the year selector element.
    var yearSelector = document.getElementById("year-selector");
  
    // Loop through the years from 2007 to 2021.
    for (var year = 2007; year <= 2021; year++) {
        // Create an option element for the year.
        var option = document.createElement("option");
        option.value = year;
        option.text = year;
        // Append the option element to the year selector element.
        yearSelector.appendChild(option);
    }
    return yearSelector
  }



