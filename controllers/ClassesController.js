const TableModel = require("../models/TableTimeModel");

class ClassesController {
    static createClass = async (uid, req, res, next)=>{
        try{   
            let { longName, shortName, color=`rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 10)}, ${Math.floor(Math.random() * 10)})`, classSupervisors="{}", tableId } = req.body;
            classSupervisors = JSON.parse(classSupervisors);
            const classSupervisorsKeys = Object.keys(classSupervisors);
            const table = await TableModel.getTableById(tableId, uid);
            if(table){
                const tableParsed = {teachers: JSON.parse(table.dataValues.teachers), classes: JSON.parse(table.dataValues.classes), weekDays: JSON.parse(table.dataValues.weekDays)};
                const {teachers, classes, weekDays} = tableParsed;
                const classId = Date.now();
                
                if(classSupervisorsKeys.length !== 0){
                    for(const idSupervsor of classSupervisorsKeys){
                        const teacher = teachers[idSupervsor + ""];
                        if(teacher){
                            teachers[idSupervsor + ""] = {...teacher, classIdWhoesSupervisor: {...teacher.classIdWhoesSupervisor, [classId + ""]: classId}};
                        }else{
                            delete classSupervisors[idSupervsor + ""];
                        }
                    }
                    classes[classId + ""] = {classId, longName, shortName, color, wholeLessonsCount:0, classSupervisors, lessons: {}};
                    await TableModel.updateTable({id: tableId, userId: uid}, {classes, teachers});
                    const newTable = await TableModel.getTableById(tableId, uid);
                    return res.json({table: newTable});
                }
                classes[classId + ""] = {classId, longName, shortName, color, wholeLessonsCount:0, classSupervisors, lessons: {}};
                await TableModel.updateTable({id: tableId, userId: uid}, {classes});
                const newTable = await TableModel.getTableById(tableId, uid);
                return res.json({table: newTable});
            }
            return res.json({errorMessage: "wrong table id"});
        }catch(err){
            return next(err);
        }
    }
    static updateClass = async (uid, req, res, next)=>{
        try{   
            let { longName, shortName, color, classSupervisors="{}", classId, tableId } = req.body;
            classSupervisors = JSON.parse(classSupervisors);
            const classSupervisorsKeys = Object.keys(classSupervisors);
            const table = await TableModel.getTableById(tableId, uid);
            if(table){
                const teachers = JSON.parse(table.dataValues.teachers);
                const classes = JSON.parse(table.dataValues.classes);
                const oldClassSupervsors = classes[classId + ""] ? classes[classId + ""].classSupervisors : null;
                if(oldClassSupervsors){
                    const oldClassSupervsorsKeys = Object.keys(oldClassSupervsors);

                    const newSupervisorsKeys = [];
                    const oldSupervisorsKeys = [];

                    oldClassSupervsorsKeys.forEach((evt)=> !classSupervisors[evt + ""] ? oldSupervisorsKeys.push(evt) : null );
                    classSupervisorsKeys.forEach((evt)=> !oldClassSupervsors[evt + ""] ? newSupervisorsKeys.push(evt) : null );
                    
                    // Delete from teachers classId who don't supvervisors
                    oldSupervisorsKeys.forEach((evt) => delete teachers[evt + ""].classIdWhoesSupervisor[classId + ""]);
                    // Add in teachers classId who supvervisors
                    newSupervisorsKeys.forEach((evt) => teachers[evt + ""] ? teachers[evt + ""].classIdWhoesSupervisor[classId + ""] = classId : delete classSupervisors[evt + ""]);

                    const obj = {};
                    if(longName) obj.longName = longName;
                    if(shortName) obj.shortName = shortName;
                    if(color) obj.color = color;
                    if(classSupervisors) obj.classSupervisors = classSupervisors;
                    classes[classId + ""] = {...classes[classId + ""], ...obj};

                    await TableModel.updateTable({id: tableId, userId: uid}, {classes, teachers});
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
    static deleteClass = async (uid, req, res, next)=>{
        try{   
            const { classId, tableId } = req.body;
            const table = await TableModel.getTableById(tableId, uid);
            if(table){
                const tableParsed = {teachers: JSON.parse(table.dataValues.teachers), classes: JSON.parse(table.dataValues.classes), weekDays: JSON.parse(table.dataValues.weekDays), lessons: JSON.parse(table.dataValues.lessons), subjects: JSON.parse(table.dataValues.subjects), classRooms: JSON.parse(table.dataValues.classRooms)};
                const {teachers, classes, lessons, subjects, classRooms,  weekDays} = tableParsed;
                
                // Delete class by id
                const clas = classes[classId + ""];

                if(clas){
                    delete classes[classId + ""];

                    // Delete classId from teachers "classdWhoesSupervisors"
                    Object.keys(clas.classSupervisors).forEach((evt) => delete teachers[evt + ""].classIdWhoesSupervisor[classId + ""]);
                    
                    // Delete lessons there is where this classId
                    Object.keys(clas.lessons).forEach((evt)=>{
                        const lesson = lessons[evt + ""];

                        delete teachers[lesson.teacherId + ""].lessons[evt + ""];
                        teachers[lesson.teacherId + ""].wholeLessonsCount = +teachers[lesson.teacherId + ""].wholeLessonsCount - +lesson.lessonsCount;

                        delete subjects[lesson.subjectId + ""].lessons[evt + ""];
                        subjects[lesson.subjectId + ""].wholeLessonsCount = +subjects[lesson.subjectId + ""].wholeLessonsCount - +lesson.lessonsCount;

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

module.exports = ClassesController;