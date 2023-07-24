import Image from 'next/image'
import { Inter } from 'next/font/google'
import axios from 'axios'
import React, { useEffect,useState } from 'react';
import Head from 'next/head';

import CodeEditor from '../component/codeEditor';
const inter = Inter({ subsets: ['latin'] })



export default function Home() {

  const [code, setCode] = useState(`#include <iostream>

  int main() {
      // Print "Hello, World!" to the console
      std::cout << "Hello, World!" << std::endl;
      return 0;
  }`);
  const handleCodeChange = (newCode:string) => {
    setCode(newCode);
  };
  async function send() {
    const inputArea = document.getElementById('input') as HTMLTextAreaElement;

    const outputArea = document.getElementById('output') as HTMLTextAreaElement;
    const contents = code

    // Display the contents in the console or use it as needed
    console.log(contents);
    console.log(contents);
    try {
      const res = await axios.post('https://code-exe.co:8000/execute', { code: contents, input: inputArea.value });
      console.log(res);
      outputArea.value = res.data.output;

    }
    catch (error: any) {
      outputArea.value= "Error - " + error.response.data.error
      console.error(error)
    }

  }
  return (
    <React.Fragment >
       <Head>

        <link rel="stylesheet" href="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.3.2/build/styles/default.min.css"></link>
    </Head>
    <div className='w-full flex items-center justify-between'>
      <p className='text-2xl font-bold'> C++ code executor</p>
     
    <button onClick={send} type="button" className="text-white m-3 bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Run Code</button>


    </div>

      <div className='flex h-screen'>

        <div className='w-full'>
        <CodeEditor setValue={setCode}  />
        

      

        </div>
        <div className='w-full'>

        <textarea id="input" rows={4} className="block h-1/2 resize-none p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your Input code..."></textarea>
          <textarea id="output" rows={4} className="block h-1/2 resize-none  p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Output..."></textarea>

        </div>


      </div>



      </React.Fragment>
  )
}
