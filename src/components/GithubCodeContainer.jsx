import React, { Component } from 'react';
import {connect} from 'react-redux';

import {indexGithub, loadGithubCode} from '../actions/githubCode';
import GithubCode from './GithubCode';


class GithubCodeContainer extends Component {
  state = {  }

  componentWillMount() {
    this.props.indexGithub();
  }

  componentDidUpdate(oldProps) {
    if (oldProps.githubIndexing !== this.props.githubIndexing) {
      this.props.loadGithubCode(true);
      this.props.loadGithubCode();
    }
      
  }

  render() { 
    return ( <GithubCode code={this.props.githubCode}/> );
  }
}

const mapStateToProps = ({githubCode, githubIndexing}) => {
  return {
    githubCode: githubCode.map(code => code.code.split('\n').map((line, i) => ({repo: code.repo, filePath: code.filePath, lineNo: i, code: line}))).flat(),
    githubIndexing
  };
};

export default connect(mapStateToProps, {indexGithub, loadGithubCode})(GithubCodeContainer);