const TableModel = require("../models/TableTimeModel");

class SubjectController {
    static createSubject = async (uid, req, res, next)=>{
        try{   
            let { classRoomsId="{}", longName, shortName, color=`rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 10)}, ${Math.floor(Math.random() * 10)})`, tableId } = req.body;
            classRoomsId = JSON.parse(classRoomsId);
            const table = await TableModel.getTableById(tableId, uid);
            if(table){
                const subjectId = Date.now();
                const subjects = JSON.parse(table.dataValues.subjects);

                subjects[subjectId + ""] = {subjectId, longName, shortName, color, classRoomsId, wholeLessonsCount:0, lessons:{}};
                await TableModel.updateTable({id: tableId, userId: uid}, {subjects});
                const newTable = await TableModel.getTableById(tableId, uid);
                return res.json({table: newTable});
            }
            return res.json({errorMessage: "wrong table id"});
        }catch(err){
            return next(err);
        }
    }
    static updateSubject = async (uid, req, res, next)=>{
        try{   
            let { longName, shortName, color, classRoomsId="{}", subjectId, tableId } = req.body;
            classRoomsId = JSON.parse(classRoomsId);

            const table = await TableModel.getTableById(tableId, uid);
            if(table){
                const subjects = JSON.parse(table.dataValues.subjects);
                if(subjects[subjectId + ""]){
                    const obj =  {};
                    if(longName) obj.longName = longName;
                    if(shortName) obj.shortName = shortName;
                    if(color) obj.color = color;
                    if(classRoomsId) obj.classRoomsId = classRoomsId;
                    subjects[subjectId + ""] = { ...subjects[subjectId + ""], ...obj };

                    await TableModel.updateTable({id: tableId, userId: uid}, {subjects});
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
    static deleteSubject = async (uid, req, res, next)=>{
        try{   
            const { subjectId, tableId } = req.body;
            const table = await TableModel.getTableById(tableId, uid);
            if(table){
                const tableParsed = {teachers: JSON.parse(table.dataValues.teachers), classes: JSON.parse(table.dataValues.classes), weekDays: JSON.parse(table.dataValues.weekDays), lessons: JSON.parse(table.dataValues.lessons), subjects: JSON.parse(table.dataValues.subjects), classRooms: JSON.parse(table.dataValues.classRooms)};
                const {teachers, classes, lessons, subjects, classRooms, weekDays} = tableParsed;

                // Delete teacher by id
                const subject = subjects[subjectId + ""];
                if(subject){
                    delete subjects[subjectId + ""];

                    // Delete lessons there is where this subjectId
                    Object.keys(subject.lessons).forEach((evt)=>{
                        const lesson = lessons[evt + ""];
                        
                        delete classes[lesson.classId + ""].lessons[evt + ""];
                        classes[lesson.classId + ""].wholeLessonsCount = +classes[lesson.classId + ""].wholeLessonsCount - +lesson.lessonsCount;

                        delete teachers[lesson.teacherId + ""].lessons[evt + ""];
                        teachers[lesson.teacherId + ""].wholeLessonsCount = +teachers[lesson.teacherId + ""].wholeLessonsCount - +lesson.lessonsCount;

                        Object.keys(lesson.classRoomsId).forEach((e)=> {
                            delete classRooms[e + ""].lessons[evt + ""];
                            classRooms[e + ""].wholeLessonsCount = +classRooms[e + ""].wholeLessonsCount - +lesson.lessonsCount;
                        });
                        
                        // delete lesson from lessons 
                        delete lessons[evt + ""];
                    });
                    await TableModel.updateTable({id: tableId, userId: uid}, {classes, teachers, lessons, subjects, classRooms});
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

module.exports = SubjectController;