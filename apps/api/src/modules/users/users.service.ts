import * as usersRepository from './users.repository.js';

export async function getAllUsers() {
  return usersRepository.findAllUsers();
}
