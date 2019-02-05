import React, { Component } from 'react';
import {connect} from 'react-redux';
import {CSSTransition} from 'react-transition-group';

import {indexGithub, loadGithubCode} from '../actions/githubCode';
import GithubCode from './GithubCode';

const MAX_CHARS = 19000;

class GithubCodeContainer extends Component {
  state = { 
    intervalId: null,
    code: null,
    previousPageYOffset: window.pageYOffset
   }

  componentWillMount() {
    this.props.indexGithub();
  }

  shouldComponentUpdate() {
    if (this.state.code)
      return false;
    return true;
  }

  async componentDidUpdate(oldProps) {
    if (oldProps.githubIndexing === null && oldProps.githubIndexing !== this.props.githubIndexing) {
      // Recently changed this to accommodate for a growing GitHub / for smaller screens
      this.props.loadGithubCode(true, 7);
    }

    if (oldProps.githubCode.length !== this.props.githubCode.length) {
      if (this.shouldLoadMoreCode())
        this.props.loadGithubCode();
      else if (!this.state.code)
        this.setState({code: this.props.githubCode});
    }
  }

  shouldLoadMoreCode = () => {
    const codeString = this.props.githubCode.map(codeLine => codeLine.code).join('');
    return codeString.length < MAX_CHARS * (window.innerWidth / 1920);
  }

  handleScrollChange = () => {
    if (window.pageYOffset === 0 && this.state.previousPageYOffset - window.pageYOffset > 300)
      window.scrollTo(0, this.state.previousPageYOffset);
    else
      this.setState({previousPageYOffset: window.pageYOffset});
  }

  render() { 
    return ( 
      <div className="GithubCodeContainer">
        <CSSTransition
            in={!!this.state.code}
            classNames="GithubCodeContainer"
            mountOnEnter
            unmountOnExit
            timeout={1000}
          >
            <GithubCode code={this.state.code} />
          </CSSTransition>
      </div>
     );
  }
}

const mapStateToProps = ({githubCode}) => {
  return {
    githubCode: githubCode.code.map(code => code.code.split('\n').map((line, i) => ({repo: code.repo, filePath: code.filePath, lineNo: i, code: line})))
                               .reduce((acc, val) => acc.concat(val), []),
    githubIndexing: githubCode.indexing
  };
};

export default connect(mapStateToProps, {indexGithub, loadGithubCode})(GithubCodeContainer);