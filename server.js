var express = require("express"),
  cors = require("cors"),
  fs = require("fs")
var request = require('request-promise-native')
var app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors({
  origin: 'https://ainize.ai',
}))

var table = {}
var context = fs.readFileSync('./sentences.txt', 'utf8');

app.post('/chat/create/', (req, res) => {
  const bot_id = req.query.bot_id
  //const context = req.body.context

  console.log(bot_id, context)

  if(!(bot_id in table)){
    table[bot_id] = {}
    table[bot_id] = {
      
    'context' : context,
    'prev_q' : '',
    'prev_a' : ''

  }
    
    console.log('create_bot : ' + bot_id)
    res.send('Success create Bot!')
  }
  else{
    console.log('exsit bot')
    res.writeHead(400)
    res.end()
  }
})

//chatting
app.get('/chat', async function (req, res) {
  return new Promise(async (resolve, reject) => {
    const bot_id = req.query.bot_id
    const question = req.query.ques
    
    console.log(bot_id, question)
    console.log(bot_id, table)

    console.log('Here1')
    const prev_q = table[bot_id]['prev_q']
    const prev_a = table[bot_id]['prev_a']
    //const context = table[bot_id]['context']
        

    if(bot_id in table){
      // form data
      let postData = {
        prev_q : prev_q,
        prev_a : prev_a,
        context : context,
        question : question
      }
       
      // request option
      var options = {
        url:'http://127.0.0.1:5000/chat',
        method: 'POST',
        form: postData
      };

      request(options, function (error, response, body) {
        // in addition to parsing the value, deal with possible errors
        if (error) return reject(error);
        try {
            // JSON.parse() can throw an exception if not valid JSON
            console.log(body)
            res.send(body)
            resolve(body)
        } catch(e) {
            reject(e);
        }
      })
    }else{
      res.writeHead(400)
      res.end()
      return
    }
  })
})
app.listen(80, () => {
  console.log("server connect")
})