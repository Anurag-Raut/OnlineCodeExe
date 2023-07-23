import React, { useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import {tokyoNight} from '@uiw/codemirror-theme-tokyo-night';
const CodeEditor = ({setValue}:any) => {
  const onChange = React.useCallback((value:any, viewUpdate:any) => {
    console.log('value:', value);
    setValue(value);
  }, []);
  return (
    <CodeMirror
      value={`#include <iostream>

      int main() {
          // Print "Hello, World!" to the console
          std::cout << "Hello, World!" << std::endl;
          return 0;
      }`}
      height="100vh"
      theme={tokyoNight}
    
      extensions={[javascript({ jsx: true })]}
      onChange={onChange}
    />
  );
};

export default CodeEditor;
