import Role from './role.model';
import { IRole } from './role.interface';
import { isEmptyObject } from '../../core/utils';
import jwt from 'jsonwebtoken';
import { HttpException } from '../../core/exceptions';
import { Sequelize,  Op } from 'sequelize'; 

class RoleService { 
    public  getRoleAll= async() => {
        const roles = await Role.findAll(); 
        return roles;
      }
}

export default RoleService;