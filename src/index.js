const express = require("express")
const server = express()
const router = express.Router()
const fs = require("fs")

server.use(express.json({extended : true}))

const readFile = () => {
  const content = 
  fs.readFileSync('./data/horarios.json', 'utf-8')
  return JSON.parse(content)
}

const writeFile = (content) => {
  const updateFile = JSON.stringify(content)
  fs.writeFileSync('./data/horarios.json',
    updateFile, 'utf-8')
}

router.get('/', (req, res) => {
  const content = readFile()
  res.send(content)
})

router.post('/', (req, res) => {
  const { day, intervals, start, end } = req.body
  const currentContent = readFile()
  const verify = currentContent.some(item => item.day === day)
  if(verify) return res.send({ message: 'Data já possui horários'})
  currentContent.push( req.body )
  writeFile(currentContent)
  res.send( req.body )
})

router.put('/:day', (req, res) => {
  const dados = req.body
  const day = req.params.day.replaceAll('-','/')
  console.log(day)
  const currentContent = readFile()
  const selectedItem = currentContent.map(item => {
    if(item.day === day) {
      item.intervals = req.body
    }
    return item
  })
  writeFile(selectedItem)
  res.send(selectedItem)
})

router.delete('/:day', (req, res) => {
  const day = req.params.day.replaceAll('-','/')
  console.log(day)
  const currentContent = readFile()
  const selectedItem = currentContent.filter( item => item.day != day )
  writeFile(selectedItem)
  res.send(selectedItem)
})

server.use(router)

server.listen(3333, () => {
  console.log('Server Up!')
})

