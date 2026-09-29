"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorIncludeConfig = exports.doctorFilterableFields = exports.doctorSearchableFields = void 0;
exports.doctorSearchableFields = ['name', 'email', 'qualification', 'designation', 'currentWorkingPlace', 'registrationNumber', 'specialties.specialty.title'];
exports.doctorFilterableFields = ['gender', 'isDeleted', 'appointmentFee', 'experience', 'registrationNumber', 'specialties.specialtyId', 'currentWorkingPlace', 'designation', 'qualification', 'specialties.specialty.title', 'user.role'];
exports.doctorIncludeConfig = {
    user: true,
    specialties: {
        include: {
            specialty: true
        }
    },
    appointments: {
        include: {
            patient: true,
            doctor: true,
            prescription: true
        }
    },
    doctorSchedules: {
        include: {
            schedule: true
        }
    },
    prescriptions: true,
    reviews: true
};
//# sourceMappingURL=doctor.constant.js.map