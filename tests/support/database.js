const { Pool } = require('pg')

const DbConfig = {
  user: 'mipyddmd',
  host: 'tuffi.db.elephantsql.com',
  database: 'mipyddmd',
  password: 'pE_Mb17lkzY72ySUgdf7mOa9vIbqmvmR',
  port: 5432
}

export async function executeSQL(sqlScript) {
  try {
    const pool = new Pool(DbConfig)

    const client = await pool.connect()

    const result = await client.query(sqlScript)

    console.log(result.rows)
  } catch (error) {
    console.log('Erro ao executar o SQL ' + error)
  }
}
