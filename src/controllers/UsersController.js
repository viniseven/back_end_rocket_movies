const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')
const { hash } = require('bcryptjs')

class UsersController {
    async create(request, response){
        const { name, email, password } = request.body

        const database = await sqliteConnection();
        const checkUserExists = await database.get('SELECT * FROM users WHERE email = (?)', [email])

        if(checkUserExists){
            throw new AppError('Este email já está em uso')
        }

        const hashedPassowrd = await hash(password, 8)
        
        await database.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',[name, email, hashedPassowrd])

        return response.status(201).json();
    }
    
    async update(request, response){
        const  { id }  = request.params
        const { name, email } = request.body
        
        const database = await sqliteConnection();

        const user = await database.get('SELECT * FROM users WHERE id = (?)', [id])

        if(!user){
            throw new AppError('Usuário não existe')
        }

        const userWithUpdateEmail = await database.get('SELECT * FROM users WHERE email = (?)', [email])

        if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id){
            throw new AppError('Este email já está em uso')
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        await database.run(`UPDATE users SET name = ?, email = ?, updated_at = DATETIME ('now')  WHERE id = ?`, 
        [user.name, user.email, id])

        return response.status(200).json();
    }
}

module.exports = UsersController