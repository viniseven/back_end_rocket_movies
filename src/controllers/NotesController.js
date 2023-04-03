const knex = require('../database/knex')

class NotesController{
    async create(request, response){
        const { title, description, rating, tags } = request.body
        const { user_id }  = request.params

        const [note_id] = await knex('movie_notes').insert({
            title,
            description,
            rating,
            user_id
        })

        const tagsInsert = tags.map(name => {
            return {
                note_id,
                user_id,
                name
            }
        })

        await knex('movie_tags').insert(tagsInsert)

        return response.status(201).json({ message: 'Nota criada com sucesso'});
    }
}

module.exports = NotesController