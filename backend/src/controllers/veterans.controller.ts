import { Request, Response } from 'express';
import * as VeteransDAO from '../dao/veterans.dao';

export const getVeterans = async (req: Request, res: Response): Promise<void> => {
  try {
    const veterans = await VeteransDAO.readVeterans();
    console.log(`Retrieved ${(veterans as any[]).length} veterans from database`);
    res.json(veterans);
  } catch (error) {
    console.error('Error fetching veterans:', error);
    res.status(500).json({ error: 'Failed to fetch veterans' });
  }
};

export const getVeteranById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params['id']);
    const veteran = await VeteransDAO.readVeteranById(id);
    
    if (!veteran) {
      res.status(404).json({ error: 'Veteran not found' });
      return;
    }
    
    res.json(veteran);
  } catch (error) {
    console.error('Error fetching veteran:', error);
    res.status(500).json({ error: 'Failed to fetch veteran' });
  }
};

export const postVeteran = async (req: Request, res: Response): Promise<void> => {
  try {
    const newVeteran = await VeteransDAO.createVeteran(req.body);
    console.log('Created new veteran:', newVeteran);
    res.status(201).json(newVeteran);
  } catch (error) {
    console.error('Error creating veteran:', error);
    res.status(500).json({ error: 'Failed to create veteran' });
  }
};

export const putVeteran = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params['id']);
    const updatedVeteran = await VeteransDAO.updateVeteran(id, req.body);
    
    if (!updatedVeteran) {
      res.status(404).json({ error: 'Veteran not found' });
      return;
    }
    
    console.log('Updated veteran:', updatedVeteran);
    res.json(updatedVeteran);
  } catch (error) {
    console.error('Error updating veteran:', error);
    res.status(500).json({ error: 'Failed to update veteran' });
  }
};

export const deleteVeteran = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params['id']);
    const deleted = await VeteransDAO.deleteVeteran(id);
    
    if (!deleted) {
      res.status(404).json({ error: 'Veteran not found' });
      return;
    }
    
    console.log('Deleted veteran ID:', id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting veteran:', error);
    res.status(500).json({ error: 'Failed to delete veteran' });
  }
};