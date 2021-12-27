import React from 'react';

export function withFieldValidation(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { error: null };
    }

    validate(name, value) {
      if (value.length === 0) {
        this.setState({ error: 'Field cannot be empty' });
      } else {
        this.setState({ error: null });
      }
      this.props.onUpdate(name, value);
    }

    render() {
      const { error } = this.state;
      const { onUpdate, ...passThroughProps } = this.props;
      return (
        <div className="Validated">
          <WrappedComponent
            onUpdate={this.validate.bind(this)}
            {...passThroughProps}
            />
          {error && <div className="Error">{error}</div>}
        </div>
      );
    }
  }
}
