const mainObject = {
    id: 1,
    userId: 174687189784,
    name: "example",
    year: "2023/2024",
    weekDaysCount: 5,
    daysHours: 7,
    weekDays: {
        "1": {
            dayId: 1,
            name: "Monday",
            shortName: "Mo",
            hours: {
                "ef": {
                    breakId: 1,
                    name: "arajin dasamijoc",
                    shortName: "1",
                    timeStart: "08:00",
                    timeEnd: "08:15",
                },
                "1": {
                    hourId: 1,
                    name: "arajin das",
                    shortName: "1",
                    timeStart: "08:15",
                    timeEnd: "08:55",
                    available: {},
                    possible: {},
                    not_available: {}
                }
            }
        },
        "2":{
            dayId: 2,
            name: "Tuesday",
            shortName: "Tu",
            hours: {
                "ef": {
                    breakId: 1,
                    name: "arajin dasamijoc",
                    shortName: "1",
                    timeStart: "08:00",
                    timeEnd: "08:15",
                },
                "1": {
                    hourId: 1,
                    name: "arajin das",
                    shortName: "1",
                    timeStart: "08:15",
                    timeEnd: "08:55",
                    available: {},
                    possible: {},
                    not_available: {}
                }
            }
        },
        "3": {
            dayId: 3,
            name: "Wednesday",
            shortName: "We",
            hours: {
                "1": {
                    hourId: 1,
                    name: "arajin das",
                    shortName: "1",
                    timeStart: "08:15",
                    timeEnd: "08:55",
                    available: {},
                    possible: {},
                    not_available: {}
                }
            }
        },
        "4": {
            dayId: 4,
            name: "Thursday",
            shortName: "Th",
            hours: {
                "1": {
                    hourId: 1,
                    name: "arajin das",
                    shortName: "1",
                    timeStart: "08:15",
                    timeEnd: "08:55",
                    available: {},
                    possible: {},
                    not_available: {}
                }
            }
        },
        "5": {
            dayId: 5,
            name: "Friday",
            shortName: "Fr",
            hours: {
                "1": {
                    hourId: 1,
                    name: "arajin das",
                    shortName: "1",
                    timeStart: "08:15",
                    timeEnd: "08:55",
                    available: {},
                    possible: {},
                    not_available: {}
                }
            }
        }
    },
    subjects: {
        "1" : {
            subjectId: 1,
            longName: "hayoc lezu",
            shortName: "hy",
            color: "rgba(15, 24, 156)",
            wholeLessonsCount: 4,
            classRoomsId: {},
            lessonsId: {"1":1}
        }
    },
    classes: {
        "1" : {
            classId: 1,
            longName: "arajin dasaran",
            shortName: "1",
            color: "rgba(15, 24, 156)",
            wholeLessonsCount: 4,
            classSupervisors: {"1": 1},
            lessonsId: {}
        }
    },
    classRooms: {
        "1" : {
            classRoomId: 1,
            longName: "Number 1",
            shortName: "N1",
            color: "rgba(15, 24, 156)",
            wholeLessonsCount: 4,
            lessonsCount: 0,
            lessonsId: {}
        }
    },
    teachers: {
        "1" : {
            teacherId: 1,
            name: "Elen",
            lastName: "Mesropyan",
            shortName: "ME",
            email: "",
            phone: "",
            gender: "female",
            color: "rgba(15, 24, 156)",
            wholeLessonsCount: 4,
            classRoomsId: {},
            classIdWhoesSupervisor: {"1": 1},
            lessonsId: {}
        }
    },
    lessons: {
        "1": {
            lessonId: 1,
            teacherId: 1,
            subjectId: 1,
            classId: 1,
            classRoomsId: {"1":1},
            lessonsCount: 4
        }
    }
}