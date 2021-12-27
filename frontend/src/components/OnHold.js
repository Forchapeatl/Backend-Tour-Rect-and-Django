import React from 'react';
import './OnHold.css';

import { useState, useEffect } from 'react';

export default function(props) {
  const [remaining, setRemaining] = useState(props.duration);
  useEffect(() => {
    const _timer = setTimeout(() => {
      setRemaining(remaining - 1);
    }, 1000);
    return function cleanup() {
      clearTimeout(_timer);
    };
  });

  if (remaining <= 1) {
    return null;
  }
  return (
    <div className="OnHold">
      Your tickets are on hold for the
      next {remaining} seconds.
    </div>
  );
}

export class OnHold extends React.Component {
  constructor(props) {
    super(props);
    this.state = { remaining: props.duration };
  }

  componentDidMount() {
    this._timer = setInterval(() => {
      const remaining = this.state.remaining - 1;
      this.setState({ remaining });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this._timer);
  }

  render() {
    const { remaining } = this.state;
    if (remaining <= 1) {
      return null;
    }
    return (
      <div className="OnHold">
        Your tickets are on hold for the
        next {remaining} seconds.
      </div>
    );
  }
};
