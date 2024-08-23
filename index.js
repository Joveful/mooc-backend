const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": "1"
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": "2"
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": "3"
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": "4"
  }
]

app.use(express.json())

morgan.token('post', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))

app.get('/', (request, response) => {
  response.send('<h1>Please leave</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})


app.post('/api/persons/', (request, response) => {
  const body = request.body
  const duplicate = persons.find(
    person => person.name === body.name
  )

  if (duplicate) {
    return response.status(400).json({
      error: "Person is already in phonebook"
    })
  }

  if (!(body.name && body.number)) {
    return response.status(400).json({
      error: "Name or number missing"
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 10000)
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/info', (request, response) => {
  const date = new Date(Date.now())
  response.send(`Phonebook has info of ${persons.length} persons\n\n${date}`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
