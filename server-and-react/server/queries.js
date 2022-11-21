const Pool = require('pg').Pool
const pool = new Pool({
    user: 'mvarcell',
    host: 'localhost',
    database: 'norbit',
    password: '12345678',
    port: 5432,
})


const getBoatData = (request, response) => {
    pool.query('SELECT * FROM boatdata ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getBoatDataById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM boatdata WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const addBoatData = (request, response) => {
    const { latitude, longitude, heading } = request.body

    pool.query('INSERT INTO boatdata (latitude, longitude, heading) VALUES ($1, $2, $3) RETURNING *', [latitude, longitude, heading], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Boatdata added with ID: ${results.rows[0].id} Data: latitude:${latitude} longitude:${longitude} heading:${heading}`)
    })
}

const updateBoatData = (request, response) => {
    const id = parseInt(request.params.id)
    const { latitude, longitude, heading } = request.body

    pool.query(
        'UPDATE boatdata SET latitude = $1, longitude = $2 WHERE heading = $3',
        [latitude, longitude, heading],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`Boatdata modified with ID: ${id} Now: latitude:${latitude} longitude:${longitude} heading:${heading}`)
        }
    )
}

const deleteBoatDataById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM boatdata WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`BoatData deleted with ID: ${id}`)
    })
}

module.exports = {
    getBoatData,
    getBoatDataById,
    addBoatData,
    updateBoatData,
    deleteBoatDataById,
  }