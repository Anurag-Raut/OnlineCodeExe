const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const cors=require('cors');
const app = express();
const port = 4000;
app.use(cors());
app.use(bodyParser.json());

app.get('/health',(req,res)=>{
  try{

    const fs = require('fs');

    const currentDir = process.cwd();
    
    fs.access(currentDir, fs.constants.F_OK, (err) => {
      if (err) {
        res.status(400).send(true);
        console.error('Current working directory does not exist or is deleted.');
      } else {
        res.status(200).send(true);
        console.log('Current working directory exists and is not deleted.');
      }
    });

  }
  catch(error){

  }
 
})

app.post('/execute', (req, res) => {
  const code = req.body.code;
  const input = req.body.input; // New parameter for user input

  if (!code) {
    return res.status(400).json({ error: 'Code not provided' });
  }

  try {
    // Save the code and input to temporary files
    const fs = require('fs');
    fs.writeFileSync('temp_code.cpp', code);
    fs.writeFileSync('temp_input.txt', input);

    // Compile the C++ code
    exec('g++ temp_code.cpp -o temp_code -std=c++17 -lstdc++fs', (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: stderr });
      }

      // Run the executable with input redirection
      exec('./temp_code < temp_input.txt', { timeout: 10000, killSignal: 'SIGKILL' }, (execError, stdout, stderr) => {
        if (execError) {
          if(execError.killed){
            return res.status(500).json({ error: "TIMEOUT" });
          }
          return res.status(500).json({ error: stderr });
        }
        return res.json({ output: stdout.trim() });
      });
    });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
