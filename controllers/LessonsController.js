const TableModel = require("../models/TableTimeModel");

class LessonsController {
    static createLesson = async (uid, req, res, next)=>{
        try{   
            let { tableId, teacherId, subjectId, classId, classRoomsId="{}", lessonsCount=1 } = req.body;
            classRoomsId = JSON.parse(classRoomsId);
            if(tableId && teacherId && subjectId && classId){
                const table = await TableModel.getTableById(tableId, uid);
                if(table){
                    const tableParsed = {teachers: JSON.parse(table.dataValues.teachers), classes: JSON.parse(table.dataValues.classes), weekDays: JSON.parse(table.dataValues.weekDays), lessons: JSON.parse(table.dataValues.lessons), subjects: JSON.parse(table.dataValues.subjects), classRooms: JSON.parse(table.dataValues.classRooms)};
                    const {teachers, classes, lessons, subjects, classRooms, weekDays} = tableParsed;
                    const lessonId = Date.now();
                    
                    if(teachers[teacherId] && subjects[subjectId] && classes[classId]){ 
                        teachers[teacherId + ""].lessons[lessonId + ""] = lessonId;
                        teachers[teacherId + ""].wholeLessonsCount = +teachers[teacherId + ""].wholeLessonsCount + +lessonsCount;
                        
                        subjects[subjectId + ""].lessons[lessonId + ""] = lessonId;
                        subjects[subjectId + ""].wholeLessonsCount = +subjects[subjectId + ""].wholeLessonsCount + +lessonsCount;
                        
                        classes[classId + ""].lessons[lessonId + ""] = lessonId;
                        classes[classId + ""].wholeLessonsCount = +classes[classId + ""].wholeLessonsCount + +lessonsCount;
                        Object.keys(classRoomsId).forEach((evt)=> {
                            classRooms[evt + ""].lessons[lessonId + ""] = lessonId;
                            classRooms[evt + ""].wholeLessonsCount = +classRooms[evt + ""].wholeLessonsCount + +lessonsCount;
                        });

                        lessons[lessonId + ""] = {lessonId, teacherId, subjectId, classId, classRoomsId, lessonsCount};
                        await TableModel.updateTable({id: tableId, userId: uid}, {lessons, subjects, teachers, classes, classRooms});
                        const newTable = await TableModel.getTableById(tableId, uid);
                        return res.json({table: newTable});
                    }
                    return res.json({errorMessage: "not right teacherId, subjectId or classId"});
                }

                return res.json({errorMessage: "wrong table id"});
            }
            return res.json({errorMessage: "not full writed form for create lesson"});
        }catch(err){
            return next(err);
        }
    }
    static updateLesson = async (uid, req, res, next)=>{
        try{   
            let { lessonId, tableId, teacherId, subjectId, classId, classRoomsId="{}", lessonsCount } = req.body;
            classRoomsId = JSON.parse(classRoomsId);
            const classRoomsIdKeys = Object.keys(classRoomsId);
            const classRoomsIdsKeys = [];
            const table = await TableModel.getTableById(tableId, uid);
            if(table){
                const tableParsed = {teachers: JSON.parse(table.dataValues.teachers), classes: JSON.parse(table.dataValues.classes), weekDays: JSON.parse(table.dataValues.weekDays), lessons: JSON.parse(table.dataValues.lessons), subjects: JSON.parse(table.dataValues.subjects), classRooms: JSON.parse(table.dataValues.classRooms)};
                const {teachers, classes, lessons, subjects, classRooms, weekDays} = tableParsed;
                const lesson = lessons[lessonId + ""];
                if(!lesson){
                    return res.json({errorMessage: "wrong lessonId"});
                }
                // Update teacher if there is passed teacherId
                if(teacherId && +teacherId !== +lesson.teacherId){
                    if(teachers[teacherId + ""]){
                        teachers[teacherId + ""].lessons[lessonId + ""] = lessonId;
                        teachers[teacherId + ""].wholeLessonsCount = +teachers[teacherId + ""].wholeLessonsCount + +(lessonsCount || +lesson.lessonsCount);
                    }else{
                        return res.json({errorMessage: "wrong teacherId"});
                    }

                    delete teachers[lesson.teacherId + ""].lessons[lessonId + ""];
                    teachers[lesson.teacherId + ""].wholeLessonsCount = +teachers[lesson.teacherId + ""].wholeLessonsCount - +lesson.lessonsCount;
                }
                // Update subject if there is passed subjectId
                if(subjectId && +subjectId !== +lesson.subjectId){
                    if(subjects[subjectId + ""]){
                        subjects[subjectId + ""].lessons[lessonId + ""] = lessonId;
                        subjects[subjectId + ""].wholeLessonsCount = +subjects[subjectId + ""].wholeLessonsCount + +(lessonsCount || +lesson.lessonsCount);
                    }else{
                        return res.json({errorMessage: "wrong subjectId"});
                    }

                    delete subjects[lesson.subjectId + ""].lessons[lessonId + ""];
                    subjects[lesson.subjectId + ""].wholeLessonsCount = +subjects[lesson.subjectId + ""].wholeLessonsCount - +lesson.lessonsCount;
                }
                // Update class if there is passed classId
                if(classId && +classId !== +lesson.classId){
                    if(classes[classId + ""]){
                        classes[classId + ""].lessons[lessonId + ""] = lessonId;
                        classes[classId + ""].wholeLessonsCount = +classes[classId + ""].wholeLessonsCount + +(+lessonsCount || +lesson.lessonsCount);
                    }else{
                        return res.json({errorMessage: "wrong classId"});
                    }

                    delete classes[lesson.classId + ""].lessons[lessonId + ""];
                    classes[lesson.classId + ""].wholeLessonsCount = +classes[lesson.classId + ""].wholeLessonsCount - +lesson.lessonsCount;
                }
                // Update classRooms if there is passed classId
                if(classRoomsId){
                    const oldclassRoomsId = lesson.classRoomsId;
                    const oldclassRoomsIdKeys = Object.keys(oldclassRoomsId);

                    const newClassRoomsIdKeys = [];
                    const oldClassRoomsIdKeys = [];

                    oldclassRoomsIdKeys.forEach((evt)=> !classRoomsId[evt + ""] ? oldClassRoomsIdKeys.push(evt) : null );
                    classRoomsIdKeys.forEach((evt)=> !oldclassRoomsId[evt + ""] ? newClassRoomsIdKeys.push(evt) : null );
                    
                    // Delete from classRooms.lessons lessonId where there is this lessonId and update wholeLessonsCount
                    oldClassRoomsIdKeys.forEach((evt) => {
                        delete classRooms[evt + ""].lessons[lessonId + ""];
                        classRooms[evt + ""].wholeLessonsCount = +classRooms[evt + ""].wholeLessonsCount - +lesson.lessonsCount;
                    });
                    // Add in classRooms.lessons lessonId and update wholeLessonsCount
                    newClassRoomsIdKeys.forEach((evt) => {
                        classRooms[evt + ""].lessons[lessonId + ""] = lessonId;
                        classRooms[evt + ""].wholeLessonsCount = +classRooms[evt + ""].wholeLessonsCount + +(lessonsCount || lesson.lessonsCount);
                    });
                }
                if(lessonsCount && +lessonsCount !== +lesson.lessonsCount){
                    if(!teacherId || +teacherId === +lesson.teacherId){
                        teachers[lesson.teacherId + ""].wholeLessonsCount = (+teachers[lesson.teacherId + ""].wholeLessonsCount - +lesson.lessonsCount) + +lessonsCount;
                    }
                    if(!subjectId || +subjectId === +lesson.subjectId){
                        subjects[lesson.subjectId + ""].wholeLessonsCount = (+subjects[lesson.subjectId + ""].wholeLessonsCount - +lesson.lessonsCount) + +lessonsCount;
                    }
                    if(!classId || +classId === +lesson.classId){
                        classes[lesson.classId + ""].wholeLessonsCount = (+classes[lesson.classId + ""].wholeLessonsCount - +lesson.lessonsCount) + +lessonsCount;
                    }
                    Object.keys(lesson.classRoomsId).forEach((evt)=>{
                        classRooms[evt + ""].wholeLessonsCount = (+classRooms[evt + ""].wholeLessonsCount - +lesson.lessonsCount) + +lessonsCount;
                    });
                }

                const obj = {};
                if(lessonsCount) obj.lessonsCount = lessonsCount;
                if(teacherId) obj.teacherId = teacherId;
                if(subjectId) obj.subjectId = subjectId;
                if(classId) obj.classId = classId;
                if(classRoomsId) obj.classRoomsId = classRoomsId;
                lessons[lessonId + ""] = {...lesson, ...obj};

                await TableModel.updateTable({id: tableId, userId: uid}, {lessons, teachers, subjects, classes, classRooms});
                const newTable = await TableModel.getTableById(tableId, uid);
                return res.json({table: newTable});
            }
            return res.json({errorMessage: "wrong table id"});
        }catch(err){
            return next(err);
        }
    }
    static deleteLesson = async (uid, req, res, next)=>{
        try{   
            const { lessonId, tableId } = req.body;
            const table = await TableModel.getTableById(tableId, uid);
            if(table){
                const tableParsed = {teachers: JSON.parse(table.dataValues.teachers), classes: JSON.parse(table.dataValues.classes), weekDays: JSON.parse(table.dataValues.weekDays), lessons: JSON.parse(table.dataValues.lessons), subjects: JSON.parse(table.dataValues.subjects), classRooms: JSON.parse(table.dataValues.classRooms)};
                const {teachers, classes, lessons, subjects, classRooms, weekDays} = tableParsed;
                const lesson = lessons[lessonId + ""];

                if(teachers[lesson.teacherId] && subjects[lesson.subjectId] && classes[lesson.classId]){
                    delete teachers[lesson.teacherId + ""].lessons[lessonId + ""];
                    teachers[lesson.teacherId + ""].wholeLessonsCount = +teachers[lesson.teacherId + ""].wholeLessonsCount - +lesson.lessonsCount;
                    
                    delete subjects[lesson.subjectId + ""].lessons[lessonId + ""];
                    subjects[lesson.subjectId + ""].wholeLessonsCount = +subjects[lesson.subjectId + ""].wholeLessonsCount - +lesson.lessonsCount;
                    
                    delete classes[lesson.classId + ""].lessons[lessonId + ""];
                    classes[lesson.classId + ""].wholeLessonsCount = +classes[lesson.classId + ""].wholeLessonsCount - +lesson.lessonsCount;
                    
                    Object.keys(lesson.classRoomsId).forEach((evt)=> {
                        delete classRooms[evt + ""].lessons[lessonId + ""];
                        classRooms[evt + ""].wholeLessonsCount = +classRooms[evt + ""].wholeLessonsCount - +lesson.lessonsCount;
                    });

                    delete lessons[lessonId + ""];
                    const newTable = await TableModel.updateTable({id: tableId, userId: uid}, {lessons, subjects, teachers, classes, classRooms});
                    return res.json({table: newTable});
                }
                return res.json({errorMessage: "not right teacherId, subjectId or classId"});
            }
            return res.json({errorMessage: "wrong table id"});
        }catch(err){
            return next(err);
        }
    }
}

module.exports = LessonsController;