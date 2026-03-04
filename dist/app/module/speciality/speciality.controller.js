"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.specialtyController = void 0;
const speciality_service_1 = require("./speciality.service");
const catchAsync_1 = require("../../shared/catchAsync");
const createSpecialty = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = req.body;
    const response = await speciality_service_1.specialtyService.createSpecialty(payload);
    res.status(201).json({
        success: true,
        message: "create successful",
        data: response
    });
});
const getAllSpecialty = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const response = await speciality_service_1.specialtyService.getAllSpecialty();
    (0, catchAsync_1.sendResponse)(res, {
        httpStatusCode: 201,
        success: true,
        message: "fetch success",
        data: response
    });
});
const deleteSpecialty = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const response = await speciality_service_1.specialtyService.deleteSpecialty(id);
    res.status(201).json({
        success: true,
        message: "delete successful",
        data: response
    });
});
const updateSpecialty = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const response = await speciality_service_1.specialtyService.updateSpecialty(id, payload);
    res.status(201).json({
        success: true,
        message: "delete successful",
        data: response
    });
});
exports.specialtyController = {
    createSpecialty,
    getAllSpecialty,
    deleteSpecialty,
    updateSpecialty
};
//# sourceMappingURL=speciality.controller.js.map