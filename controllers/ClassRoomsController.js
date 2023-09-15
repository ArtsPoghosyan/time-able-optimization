const TableModel = require("../models/TableTimeModel");

class ClassRoomsController {
    static createClassRoom = async (uid, req, res, next)=>{
        try{   
            const { longName, shortName, color=`rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 10)}, ${Math.floor(Math.random() * 10)})`, tableId } = req.body;
            const table = await TableModel.getTableById(tableId, uid);
            if(table){
                const classRooms = JSON.parse(table.dataValues.classRooms);
                const classRoomId = Date.now();

                classRooms[classRoomId + ""] = {classRoomId, longName, shortName, color, wholeLessonsCount:0, lessonsCount:0, lessons: {}};
                await TableModel.updateTable({id: tableId, userId: uid}, {classRooms});
                const newTable = await TableModel.getTableById(tableId, uid);
                return res.json({table: newTable});
            }
            return res.json({errorMessage: "wrong table id"});
        }catch(err){
            return next(err);
        }
    }
    static updateClassRoom = async (uid, req, res, next)=>{
        try{   
            const { longName, shortName, color, classRoomId, tableId } = req.body;
            const table = await TableModel.getTableById(tableId, uid);
            if(table){
                const classRooms = JSON.parse(table.dataValues.classRooms);
                if(classRooms[classRoomId + ""]){
                    const obj =  {};
                    if(longName) obj.longName = longName;
                    if(shortName) obj.shortName = shortName;
                    if(color) obj.color = color;
                    classRooms[classRoomId + ""] = { ...classRooms[classRoomId + ""], ...obj };

                    await TableModel.updateTable({id: tableId, userId: uid}, {classRooms});
                    const newTable = await TableModel.getTableById(tableId, uid);
                    return res.json({table: newTable});
                }
                return res.json({table});
            }
            return res.json({errorMessage: "wrong table id"});
        }catch(err){
            return next(err);
        }
    }
    static deleteClassRoom = async (uid, req, res, next)=>{
        try{   
            const { classRoomId, tableId } = req.body;
            const table = await TableModel.getTableById(tableId, uid);
            if(table){
                const tableParsed = {teachers: JSON.parse(table.dataValues.teachers), classes: JSON.parse(table.dataValues.classes), weekDays: JSON.parse(table.dataValues.weekDays), lessons: JSON.parse(table.dataValues.lessons), subjects: JSON.parse(table.dataValues.subjects), classRooms: JSON.parse(table.dataValues.classRooms)};
                const {teachers, classes, lessons, subjects, classRooms, weekDays} = tableParsed;

                // Get classRoom by id
                const classRoom = classRooms[classRoomId + ""];
                if(classRoom){
                    // Delete classRoom by id
                    delete classRooms[classRoomId + ""];

                    // Delete from lessons there is where this classRoomdId
                    Object.keys(classRoom.lessons).forEach((evt)=>{
                        delete lessons[evt + ""].lessons[classRoomId + ""];
                    });

                    await TableModel.updateTable({id: tableId, userId: uid}, {lessons, classRooms});
                    const newTable = await TableModel.getTableById(tableId, uid);
                    return res.json({table: newTable});
                }
                return res.json({table});
            }
            return res.json({errorMessage: "wrong table id"});
        }catch(err){
            return next(err);
        }
    }
}

module.exports = ClassRoomsController;