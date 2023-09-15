const TableModel = require("../models/TableTimeModel");
const {updateWeekDays, updateWeekDayName, updateWeekDayHours, updateWeekDayHoursInfo} = require("../componets/generateWeekInfo.js");

class SettingsController {
    static updateTableInfo = async (uid, req, res, next)=>{
        try{
            const { name, year, tableId } = req.body;
            const objOption = {};
            if(name) objOption.name = name;
            if(year) objOption.year = year;

            await TableModel.updateTable({id: tableId, userId: uid}, objOption);
            const table = await TableModel.getTableById(tableId, uid);
            return res.json({table});
        }catch(err){
            return next(err);
        }
    }
    static updateTableDays = async (uid, req, res, next)=>{
        try{
            const { daysCount, tableId } = req.body;
            if(+daysCount < 1 || +daysCount > 7){
                return res.json({errorMessage: "week days count cann't be small from 1 and big from 7"});
            }
            const table = await TableModel.getTableById(tableId, uid);
            if(+table.dataValues.weekDaysCount === +daysCount){
                return res.json({table});
            }
            const weekDays = updateWeekDays({oldWeekDays: JSON.parse(table.dataValues.weekDays), newWeekDaysCount: daysCount, oldWeekDaysCount: table.weekDaysCount});
            await TableModel.updateTable({id: tableId, userId: uid}, {weekDays, weekDaysCount: daysCount});
            const newTable = await TableModel.getTableById(tableId, uid);
            return res.json({table: newTable});
        }catch(err){
            return next(err);
        }
    }
    static updateTableDayName = async (uid, req, res, next)=>{
        try{
            const { dayId, newDayName, newShortName, tableId } = req.body;
            const table = await TableModel.getTableById(tableId, uid);
            const weekDays = updateWeekDayName({oldWeekDays: JSON.parse(table.dataValues.weekDays), dayId, newDayName, newShortName});
            await TableModel.updateTable({id: tableId, userId: uid}, {weekDays});
            const newTable = await TableModel.getTableById(tableId, uid);
            return res.json({table: newTable});
        }catch(err){
            return next(err);
        }
    }
    static updateTableDaysHours = async (uid, req, res, next)=>{
        try{
            const { tableId, newHoursCount } = req.body;
            if(+newHoursCount < 1 || +newHoursCount > 31){
                return res.json({errorMessage: "day hours count cann't be small from 1 and big from 31"});
            }
            const table = await TableModel.getTableById(tableId, uid);
            if(+table.dataValues.daysHours === +newHoursCount){
                return res.json({table});
            }
            const weekDays = updateWeekDayHours({oldHoursCount: table.dataValues.daysHours, newHoursCount, weekDays: JSON.parse(table.dataValues.weekDays)});
            await TableModel.updateTable({id: tableId, userId: uid}, {weekDays, daysHours: newHoursCount});
            const newTable = await TableModel.getTableById(tableId, uid);
            return res.json({table: newTable});
        }catch(err){
            return next(err);
        }
    }
    static updateTableDaysHourInfo = async (uid, req, res, next)=>{
        try{
            const { tableId, hourId, newName, newShortName, newTimeStart, newTimeEnd } = req.body;
            const table = await TableModel.getTableById(tableId, uid);
            const weekDays = updateWeekDayHoursInfo({oldWeekDays: JSON.parse(table.dataValues.weekDays), hourId, newName, newShortName, newTimeStart, newTimeEnd});
            await TableModel.updateTable({id: tableId, userId: uid}, {weekDays});
            const newTable = await TableModel.getTableById(tableId, uid);
            return res.json({table: newTable});
        }catch(err){
            return next(err);
        }
    }
}

module.exports = SettingsController;