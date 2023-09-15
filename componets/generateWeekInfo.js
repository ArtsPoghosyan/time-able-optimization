const weekDays = require("./defaultValues.js");
const {generateFewHours, generateHours, updateHoursName} = require("./generateHoursInfo.js");

function generateWeekDaysWithHours({weekDaysName=weekDays, weekDaysCount=5}){
    const hours = generateHours({});
    const weekDaysObj = {};

    for(let i = 1; i <= weekDaysCount; i++){
        weekDaysObj[i + ""] = {
            ...weekDaysName[i + ""],
            hours
        };
    }
    return weekDaysObj;
}
function updateWeekDays({weekDaysName=weekDays, oldWeekDays, newWeekDaysCount, oldWeekDaysCount}){
    let weekDaysObj = {};
    let weekKeys = Object.keys(oldWeekDays);
    console.log(weekKeys);
    if(+newWeekDaysCount < +oldWeekDaysCount){
        for(const dayKey of weekKeys){
            if(+dayKey <= +newWeekDaysCount){
                weekDaysObj[dayKey + ""] = {...oldWeekDays[dayKey + ""]};
            }
        }
        return weekDaysObj;
    }

    if(+newWeekDaysCount <= 7){
        const hours = oldWeekDays["1"].hours;
        weekDaysObj = {...oldWeekDays};

        for(let i = weekKeys.length + 1; i <= newWeekDaysCount; i++){
            weekDaysObj[i + ""] = {
                ...weekDaysName[i + ""],
                hours
            };
        }
        return weekDaysObj;
    }
    return oldWeekDays;
}
function updateWeekDayName({oldWeekDays, dayId, newDayName="", newShortName=""}){
    oldWeekDays[dayId + ""] = {...oldWeekDays[dayId + ""], name: newDayName, shortName: newShortName};
    return oldWeekDays;
}
function updateWeekDayHours({oldHoursCount, newHoursCount, weekDays}){
    const weekDaysObj = {};
    let weekKeys = Object.keys(weekDays);
    let hours;

    if(oldHoursCount > newHoursCount){
        hours = generateFewHours({lengthHours: newHoursCount, weekDaysHours: weekDays["1"].hours});
    }
    if(oldHoursCount < newHoursCount){
        hours = generateHours({lengthHours: newHoursCount, initalHour: weekDays["1"].hours});
    }
    for(const dayKey of weekKeys){
        weekDaysObj[dayKey] = {...weekDays[dayKey], hours};
    }
    return weekDaysObj;
}
function updateWeekDayHoursInfo(data){
    const weekDays = data.oldWeekDays;
    const hours = updateHoursName({...data, oldHours: weekDays["1"].hours});
    const daysKeys = Object.keys(weekDays);
    
    for(const dayKey of daysKeys){
        weekDays[dayKey + ""] = {...weekDays[dayKey + ""], hours};
    }

    return weekDays;
}

module.exports = {generateWeekDaysWithHours, updateWeekDays, updateWeekDayName, updateWeekDayHours, updateWeekDayHoursInfo};