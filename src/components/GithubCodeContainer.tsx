import React, { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { indexGithub, loadGithubCode } from '../store/githubCodeSlice';
import { useAppDispatch, useAppSelector } from '../store';
import type { GithubCodeLine } from '../types';
import GithubCode from './GithubCode';

const MAX_CHARS = 19000;

function GithubCodeContainer() {
  const dispatch = useAppDispatch();
  const githubIndexing = useAppSelector(state => state.githubCode.indexing);
  const rawGithubCode = useAppSelector(state => state.githubCode.code);

  const githubCode: GithubCodeLine[] = rawGithubCode
    .map(code => code.code.split('\n').map((line, i) => ({ repo: code.repo, filePath: code.filePath, lineNo: i, code: line })))
    .reduce<GithubCodeLine[]>((acc, val) => acc.concat(val), []);

  const [frozenCode, setFrozenCode] = useState<GithubCodeLine[] | null>(null);
  const previousIndexingRef = useRef<typeof githubIndexing>(null);
  const codeLoadingInitiated = useRef(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(indexGithub());
  }, [dispatch]);

  useEffect(() => {
    // When indexing becomes available (was null, now has data)
    if (previousIndexingRef.current === null && githubIndexing !== null && !codeLoadingInitiated.current) {
      codeLoadingInitiated.current = true;
      dispatch(loadGithubCode({ allProjects: true, numberOfProjects: 7 }));
    }
    previousIndexingRef.current = githubIndexing;
  }, [githubIndexing, dispatch]);

  useEffect(() => {
    if (frozenCode) return; // Already frozen, don't load more
    if (githubCode.length === 0) return;

    const codeString = githubCode.map(line => line.code).join('');
    if (codeString.length < MAX_CHARS * (window.innerWidth / 1920)) {
      dispatch(loadGithubCode({}));
    } else {
      setFrozenCode(githubCode);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawGithubCode.length]);

  return (
    <div className="GithubCodeContainer">
      <CSSTransition
        nodeRef={nodeRef}
        in={!!frozenCode}
        classNames="GithubCodeContainer"
        mountOnEnter
        unmountOnExit
        timeout={1000}
      >
        <div ref={nodeRef}>
          <GithubCode code={frozenCode} />
        </div>
      </CSSTransition>
    </div>
  );
}

export default GithubCodeContainer;
