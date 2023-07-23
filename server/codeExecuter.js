const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const cors=require('cors');
const app = express();
const port = 4000;
app.use(cors());
app.use(bodyParser.json());

app.get('/health',(req,res)=>{
  try {
    const fs = require('fs');

    const currentDir = process.cwd();

    // Create a dummy test code for the health check
    const testCode = `
      #include <iostream>
      int main() {
        std::cout << "Health Check" << std::endl;
        return 0;
      }
    `;

    fs.writeFileSync('test_code.cpp', testCode);

    exec('g++ test_code.cpp -o test_code -std=c++17', (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: stderr, q: 'err' });
      }

      fs.access(currentDir + '/test_code', fs.constants.F_OK, (err) => {
        if (err) {
          return res.status(500).send(false);
        }

        res.status(200).json(true);
      });
    });
  } catch (error) {
    res.status(400).send(false);
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
        return res.status(500).json({ error: stderr ,q:'err'});
      }

      // Run the executable with input redirection
      exec('./temp_code < temp_input.txt', { timeout: 10000, killSignal: 'SIGKILL' }, (execError, stdout, stderr) => {
        if (execError) {
          if(execError.killed){
            return res.status(500).json({ error: "TIMEOUT" });
          }
          return res.status(500).json({ error: stderr,q:'error' });
        }
        return res.json({ output: stdout.trim() });
      });
    });
  } catch (error) {
    return res.status(500).json({ error: error ,q:'errrroor'});
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
