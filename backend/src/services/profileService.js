import * as profileRepository from '../repositories/profileRepository.js';

export const updateProfile = async (userId, updateData) => {
  return await profileRepository.updateProfile(userId, updateData);
};
