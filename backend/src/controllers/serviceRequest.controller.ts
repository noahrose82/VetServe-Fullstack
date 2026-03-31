import { Request, Response } from 'express';
import * as ServiceRequestDAO from '../dao/serviceRequests.dao';

export const getRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const options = {
      status: req.query.status as string | undefined,
      veteranId: req.query.veteranId ? parseInt(req.query.veteranId as string) : undefined,
      category: req.query.category as string | undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };

    const requests = await ServiceRequestDAO.readRequests(options);
    console.log(`Retrieved ${(requests as any[]).length} service requests from database`);
    res.json(requests);
  } catch (error) {
    console.error('Error fetching service requests:', error);
    res.status(500).json({ error: 'Failed to fetch service requests' });
  }
};

export const getRequestById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params['id']);
    const request = await ServiceRequestDAO.readRequestById(id);
    
    if (!request) {
      res.status(404).json({ error: 'Service request not found' });
      return;
    }
    
    res.json(request);
  } catch (error) {
    console.error('Error fetching service request:', error);
    res.status(500).json({ error: 'Failed to fetch service request' });
  }
};

export const postRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const newRequest = await ServiceRequestDAO.createRequest(req.body);
    console.log('Created new service request:', newRequest);
    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error creating service request:', error);
    res.status(500).json({ error: 'Failed to create service request' });
  }
};

export const putRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params['id']);
    const updatedRequest = await ServiceRequestDAO.updateRequest(id, req.body);
    
    if (!updatedRequest) {
      res.status(404).json({ error: 'Service request not found' });
      return;
    }
    
    console.log('Updated service request:', updatedRequest);
    res.json(updatedRequest);
  } catch (error) {
    console.error('Error updating service request:', error);
    res.status(500).json({ error: 'Failed to update service request' });
  }
};

export const deleteRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params['id']);
    const deleted = await ServiceRequestDAO.deleteRequest(id);
    
    if (!deleted) {
      res.status(404).json({ error: 'Service request not found' });
      return;
    }
    
    console.log('Deleted service request ID:', id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting service request:', error);
    res.status(500).json({ error: 'Failed to delete service request' });
  }
};