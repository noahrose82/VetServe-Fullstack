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
exports.deleteVeteran = exports.putVeteran = exports.postVeteran = exports.getVeteranById = exports.getVeterans = void 0;
const VeteransDAO = __importStar(require("../dao/veterans.dao"));
const getVeterans = async (_req, res) => {
    try {
        const results = await VeteransDAO.readVeterans();
        return res.json(results);
    }
    catch {
        return res.status(500).json({ error: 'Failed to read veterans' });
    }
};
exports.getVeterans = getVeterans;
const getVeteranById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const result = await VeteransDAO.readVeteranById(id);
        if (!result)
            return res.status(404).json({ error: 'Veteran not found' });
        return res.json(result);
    }
    catch {
        return res.status(500).json({ error: 'Failed to read veteran' });
    }
};
exports.getVeteranById = getVeteranById;
const postVeteran = async (req, res) => {
    try {
        const created = await VeteransDAO.createVeteran(req.body);
        return res.status(201).json(created);
    }
    catch {
        return res.status(500).json({ error: 'Failed to create veteran' });
    }
};
exports.postVeteran = postVeteran;
const putVeteran = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const updated = await VeteransDAO.updateVeteran(id, req.body);
        if (!updated)
            return res.status(404).json({ error: 'Veteran not found' });
        return res.json(updated);
    }
    catch {
        return res.status(500).json({ error: 'Failed to update veteran' });
    }
};
exports.putVeteran = putVeteran;
const deleteVeteran = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const ok = await VeteransDAO.deleteVeteran(id);
        if (!ok)
            return res.status(404).json({ error: 'Veteran not found' });
        return res.status(204).send();
    }
    catch {
        return res.status(500).json({ error: 'Failed to delete veteran' });
    }
};
exports.deleteVeteran = deleteVeteran;
