const weekDays = require("./defaultValues");
function generateHours({durationHours=45, betweenHours=10, lengthHours=7, initalHour={"1": {hourId: 1, name: 1, shortName:1, timeStart: "08:10", timeEnd: "08:50"}}}){
    const hoursObj = initalHour;
    let hoursKey = Object.keys(initalHour);

    for(let i = hoursKey.length; i < lengthHours; i++){
        let x = hoursObj[hoursKey[i - 1]].timeEnd.split(":");
        let g = +x[1] + betweenHours;
        let timeStart = g >= 60 ? ((((+x[0] + 1) + "").length) <= 1 ? "0" + (+x[0] + 1) : (+x[0] + 1)) + ":" + (((g - 60) + "").length <= 1 ? "0" + (g - 60) : (g - 60)) : (((+x[0] + "").length) <= 1 ? "0" + +x[0] : +x[0]) + ":" + g; 

        let y = timeStart.split(":");
        let c = +y[1] + durationHours;
        let timeEnd = c >= 60 ? ((((+y[0] + 1) + "").length) <= 1 ? "0" + (+y[0] + 1) : (+y[0] + 1)) + ":" + (((c - 60) + "").length <= 1 ? "0" + (c - 60) : (c - 60)) : (((+y[0] + "").length) <= 1 ? "0" + +y[0] : +y[0]) + ":" + c; 
        hoursObj[(i + 1) + ""] = {
            hourId: (i + 1),
            name: (i + 1),
            shortName: (i + 1),
            timeStart,
            timeEnd
        };
        hoursKey = Object.keys(hoursObj);
    }

    return hoursObj;
}
function generateFewHours({lengthHours=1, weekDaysHours={"1": {hourId: 1, name: 1, shortName: 1, timeStart: "08:10", timeEnd: "08:50"}}}){
    const hoursObj = {};
    let hoursKey = Object.keys(weekDaysHours);
    for(const hourKey of hoursKey){
        if(+hourKey <= +lengthHours){
            hoursObj[hourKey + ""] = {...weekDaysHours[hourKey + ""]};
        }
    }
    return hoursObj;
}
function updateHoursName({oldHours, hourId, newName, newShortName, newTimeStart, newTimeEnd}){
    const obj = {};
    if(newName !== undefined && newName !== null) obj.name = newName;
    if(newShortName !== undefined && newShortName !== null) obj.shortName = newShortName;
    if(newTimeStart !== undefined && newTimeStart !== null) obj.timeStart = newTimeStart;
    if(newTimeEnd !== undefined && newTimeEnd !== null) obj.timeEnd = newTimeEnd;

    oldHours[hourId + ""] = {...oldHours[hourId + ""], ...obj};
    return oldHours;
}

module.exports = {generateHours, generateFewHours, updateHoursName};