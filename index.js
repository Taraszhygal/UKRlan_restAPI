const express = require('express')
const app = express()
const port = 9393

var Pool = require('pg-pool')

var pool = new Pool({
  host: 'localhost',
  database: 'diploma',
  user: 'postgres',
  password: 'nutter01',
  port: 5432,
})

try {
  pool.connect()
    .then(client => {
      client.query('select now() as now').then(result => {
        console.log('DB connected at: ', result.rows[0])
      })
      client.release()
    })
} catch (error) {
  console.log('[index.ts] Unable to connect to the database:', error);
}

app.get('/data', async (req, res) => {
  try {
    let limit = Number(req.query.limit);
    let offset = Number(req.query.offset);
    let from = req.query.fromDate
    let to = req.query.toDate
    let query = 'select * from data'

    console.log(from)
    console.log(to)
    if (from && !to) {
      console.log(1)
      const ms = (new Date(from)).getTime()
      query += ` where add_time >= ${ms} `
    }

    if (to && !from) {
      console.log(2)
      const ms = (new Date(to)).getTime()
      query += ` where add_time <= ${ms} `
    }

    if (to && from) {
      console.log(3)
      const toMs = (new Date(to)).getTime()
      const fromMs = (new Date(from)).getTime()
      query += ` where add_time <= ${toMs} and add_time >= ${fromMs} `
    }

    if (limit) {
      if (limit > 500) {
        limit = 500
      }
      if (limit < 1) {
        limit = 1
      }
      query += ` limit ${limit} `
    } else {
      query += ` limit 1000 `
    }

    if (offset) {
      if (offset < 0) {
        offset = 0
      }
      query += ` offset ${offset} `
    } else {
      query += ` offset 0 `
    }

    const data = await pool.query(query).then((result) => result.rows)
    const transformed = transformNumericToDate(data)
    res.status(200).json(transformed)
  } catch (e) {
    console.log(e)
  }
})

const transformNumericToDate = (rows) => {
  return rows.map((el) => {
    return {
      ...el,
      add_time: new Date(Number(el.add_time)),
      expired_time: new Date(Number(el.expired_time)),
      given_time: new Date(Number(el.given_time)),
      sync_time: new Date(Number(el.sync_time))
    }
  })
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
