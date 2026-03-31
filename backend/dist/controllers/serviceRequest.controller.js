"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRequest = exports.putRequest = exports.postRequest = exports.getRequestById = exports.getRequests = void 0;
const DAO = __importStar(require("../dao/serviceRequests.dao"));
const getRequests = async (req, res) => {
    try {
        // pagination
        const limit = Math.min(Number(req.query.limit) || 25, 100);
        const offset = Math.max(Number(req.query.offset) || 0, 0);
        // filtering
        const status = req.query.status?.trim();
        const category = req.query.category?.trim();
        const veteranIdRaw = req.query.veteranId;
        const veteranId = veteranIdRaw ? Number(veteranIdRaw) : undefined;
        const rows = await DAO.readRequests({
            status,
            category,
            veteranId: veteranId !== undefined && !Number.isNaN(veteranId) ? veteranId : undefined,
            limit,
            offset
        });
        return res.json(rows);
    }
    catch {
        return res.status(500).json({ error: 'Failed to read service requests' });
    }
};
exports.getRequests = getRequests;
const getRequestById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const result = await DAO.readRequestById(id);
        if (!result)
            return res.status(404).json({ error: 'Request not found' });
        return res.json(result);
    }
    catch {
        return res.status(500).json({ error: 'Failed to read service request' });
    }
};
exports.getRequestById = getRequestById;
const postRequest = async (req, res) => {
    try {
        const created = await DAO.createRequest(req.body);
        return res.status(201).json(created);
    }
    catch {
        return res.status(500).json({ error: 'Failed to create service request' });
    }
};
exports.postRequest = postRequest;
const putRequest = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const updated = await DAO.updateRequest(id, req.body);
        if (!updated)
            return res.status(404).json({ error: 'Request not found' });
        return res.json(updated);
    }
    catch {
        return res.status(500).json({ error: 'Failed to update service request' });
    }
};
exports.putRequest = putRequest;
const deleteRequest = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const ok = await DAO.deleteRequest(id);
        if (!ok)
            return res.status(404).json({ error: 'Request not found' });
        return res.status(204).send();
    }
    catch {
        return res.status(500).json({ error: 'Failed to delete service request' });
    }
};
exports.deleteRequest = deleteRequest;
