import React, { Component } from 'react';
import {connect} from 'react-redux';

import {indexGithub, loadGithubCode} from '../actions/githubCode';
import GithubCode from './GithubCode';


class GithubCodeContainer extends Component {
  state = { 
    codeSnippets: 1,
    intervalId: null
   }

  componentWillMount() {
    this.props.indexGithub();
    this.setState({intervalId: setInterval(this.updateSnippets, 1000)});
  }

  componentDidUpdate(oldProps) {
    if (oldProps.githubIndexing === null && oldProps.githubIndexing !== this.props.githubIndexing) {
      this.props.loadGithubCode(true);
    }
    // console.log(this.props.githubCode);
  }

  updateSnippets = () => {
    const code = document.querySelector('.GithubCode');
    if (!code)
      return;

    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight, 
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );

    if (docHeight - code.clientHeight > 0 && this.state.codeSnippets < 1000) {
      console.log(this.state.codeSnippets);
      if (this.state.codeSnippets < this.props.githubCode.length) {
        this.props.loadGithubCode();
      }
      this.setState({codeSnippets: this.state.codeSnippets + 100});
    }
    else {
      clearInterval(this.state.intervalId);
    }
      
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