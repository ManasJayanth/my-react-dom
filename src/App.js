import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      count: 0
    };
  }
  render() {
    const onClickHandler = () => {
      this.setState(state => {
        return {
          count: state.count + 1
        };
      });
    };
    return (
      <div className="root">
        <div className={ this.state.count > 5 ? "counter red": "counter" }>{this.state.count}</div>
        <button onClick={onClickHandler}>Increment</button>
      </div>
    );
  }
}


export default App;
