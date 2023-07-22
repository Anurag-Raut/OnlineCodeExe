import React, { useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import {tokyoNight} from '@uiw/codemirror-theme-tokyo-night';
const CodeEditor = () => {
  const onChange = React.useCallback((value:any, viewUpdate:any) => {
    console.log('value:', value);
  }, []);
  return (
    <CodeMirror
      value="console.log('hello world!');"
      height="100vh"
      theme={tokyoNight}
      extensions={[javascript({ jsx: true })]}
      onChange={onChange}
    />
  );
};

export default CodeEditor;
