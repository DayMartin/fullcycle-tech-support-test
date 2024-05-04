const express = require('express')
const app = express()

const port = 3000

const config = {
  host: 'database',
  user: 'root',
  password: 'root',
  database: 'dbpeople'
}


const mysql = require('mysql')
const connection = mysql.createConnection(config)


const insert = sqlInsert(connection)

function sqlInsert(connection) {
  return new Promise((resolve, reject) => {
    const sql = `insert into people(name) values ?`
    const peoples = [['Obi-Wan Kenobi'], ['R2-D2'], ['Darth Vader']]
    connection.query(sql, [peoples], (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
        console.log(`Foram inseridas ${result.affectedRows} pessoas!`)
      }
    })
  })
}

insert.then(result => {
  console.log(result)
})

const select = sqlSelect(connection)

function sqlSelect(connection) {
  return new Promise((resolve, reject) => {
    const sql = `select * from people`
    connection.query(sql, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

const listPeople = async () => {
  const allPeople = (await select)
  console.log(allPeople)
  return allPeople
}

// const listPeoples = '<ul>' + teste.map(item => `<li>${item}</li>`).join('') + '</ul>'

app.get('/', async (req, res) => {
  const peoples = await listPeople()
  const listPeoples = '<ul>' + peoples.map(item => `<li align="center">${item.name}</li>`).join('') + '</ul>'
  res.send(`<h1 align="center">Full Cycle Rocks!</h1>\n${listPeoples}`)
})

app.listen(port, () => {
  console.log(`Ouvindo na porta: ${port}`)
})