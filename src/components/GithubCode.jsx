import React from 'react';
import _ from 'lodash';
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

const GithubCode = ({code}) => {
  if (!code) return null;

  const shuffledCode = code && _.shuffle(code);
  return (
    <div className="GithubCode">
      {shuffledCode.map(c => {
        const splittedPath = c.filePath.split('.');
        return (
          <a
            key={c.code+c.filePath+c.lineNo+c.repo}
            href={`https://github.com/Jirinrin/${c.repo}/blob/master/${c.filePath}`} 
            rel="noopener noreferrer" target="_blank"
          >
            <SyntaxHighlighter 
              key={c.code+c.filePath+c.lineNo+c.repo}
              style={duotone}
              language={LANGUAGE_REFERENCE[splittedPath[splittedPath.length - 1]]}
            >
              {c.code}
            </SyntaxHighlighter>
          </a>
        );
      })}
    </div>
   );
}

export default GithubCode;