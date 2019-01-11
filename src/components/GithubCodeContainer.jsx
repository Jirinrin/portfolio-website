import React, { Component } from 'react';
import {connect} from 'react-redux';

import {indexGithub, loadGithubCode} from '../actions/githubCode';
import GithubCode from './GithubCode';


class GithubCodeContainer extends Component {
  state = { 
    intervalId: null
   }

  componentWillMount() {
    this.props.indexGithub();
    this.setState({intervalId: setInterval(this.loadMoreCode, 1000)});
  }

  componentDidUpdate(oldProps) {
    if (oldProps.githubIndexing === null && oldProps.githubIndexing !== this.props.githubIndexing) {
      this.props.loadGithubCode(true);
    }
    // console.log(this.props.githubCode);
  }

  loadMoreCode = () => {
    const code = document.querySelector('.GithubCode');
    if (!code)
      return;

    /// constante van mk
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight, 
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );

    if (docHeight - code.clientHeight > 0)
      this.props.loadGithubCode();
    else
      clearInterval(this.state.intervalId);
      
    console.log(code.clientHeight, docHeight);
  }

  render() { 
    return ( 
      <div className="GithubCodeContainer">
        <GithubCode code={this.props.githubCode} snippets={this.state.codeSnippets} />
      </div>
     );
  }
}

const mapStateToProps = ({githubCode}) => {
  return {
    githubCode: githubCode.code.map(code => code.code.split('\n').map((line, i) => ({repo: code.repo, filePath: code.filePath, lineNo: i, code: line}))).flat(),
    githubIndexing: githubCode.indexing
  };
};

export default connect(mapStateToProps, {indexGithub, loadGithubCode})(GithubCodeContainer);