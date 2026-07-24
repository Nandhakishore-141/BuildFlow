import * as profileService from '../services/profileService.js';
import * as authService from '../services/authService.js';

export const getProfile = async (req, res, next) => {
  try {
    const data = await authService.getUserProfile(req.user.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, profilePhoto } = req.body;
    
    // Explicitly reject updating sensitive fields
    if (req.body.email || req.body.role || req.body.provider) {
       return res.status(400).json({ 
         status: 'error', 
         message: 'Cannot update email, role, or provider via this endpoint' 
       });
    }

    const data = await profileService.updateProfile(req.user.id, { name, phone, profilePhoto });
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};
