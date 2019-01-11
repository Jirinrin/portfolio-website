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
    window.addEventListener('scroll', this.handleScrollChange);
  }

  async componentDidUpdate(oldProps) {
    if (oldProps.githubIndexing === null && oldProps.githubIndexing !== this.props.githubIndexing) 
      this.props.loadGithubCode(true);

    if (oldProps.githubCode.length !== this.props.githubCode.length) {
      if (this.shouldLoadMoreCode())
        this.props.loadGithubCode();
      else {
        this.setState({code: this.props.githubCode});
        // setTimeout(() => window.removeEventListener('scroll', this.handleScrollChange), 10000);
      }
    }
  }

  shouldLoadMoreCode = () => {
    const codeString = this.props.githubCode.map(codeLine => codeLine.code).join('');
    return codeString.length < MAX_CHARS * (window.innerWidth / 1920);
  }

  handleScrollChange = () => {
    console.log(this.state.previousPageYOffset);
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
        {/* <code className="text-test" id="text-test-3"/> */}
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