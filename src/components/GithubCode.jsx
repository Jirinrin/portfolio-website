import React from 'react';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
// import {duotoneSea as duotone} from 'react-syntax-highlighter/dist/styles/prism';
import {duotoneForest as duotone} from 'react-syntax-highlighter/dist/styles/prism';
// import {duotoneLight as duotone} from 'react-syntax-highlighter/dist/styles/prism';
// import {duotoneDark as duotone} from 'react-syntax-highlighter/dist/styles/prism';

import './GithubCode.scss';

// https://github.com/conorhastings/react-syntax-highlighter/blob/HEAD/AVAILABLE_LANGUAGES_PRISM.MD
const LANGUAGE_REFERENCE = {
  js: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
  css: 'css',
  scss: 'scss',
  html: 'markup',
  java: 'java',
  c: 'c',
  cpp: 'cpp',
  h: 'cpp',
  cs: 'csharp',
  py: 'python',
  lua: 'lua',
  md: 'markdown'
};

const GithubCode = (props) => {
  return ( 
    <div className="GithubCode">
      {props.code && props.code.map(code => {
        const splittedPath = code.filePath.split('.');
        console.log(code.code.split('\n'))
        // console.log(LANGUAGE_REFERENCE[splittedCode[splittedCode.length - 1]]);
        console.log(splittedPath[splittedPath.length - 1]);
        return ( 
          <a href={`https://github.com/Jirinrin/${code.repo}/blob/master/${code.filePath}`} target="_blank">
            <SyntaxHighlighter 
              key={code.code+code.filePath+code.lineNo+code.repo}
              // style={duotoneLight}
              style={duotone}
              language={LANGUAGE_REFERENCE[splittedPath[splittedPath.length - 1]]}
            >
              {code.code}
            </SyntaxHighlighter>
          </a>
        );
      })}
    </div>
   );
}

export default GithubCode;