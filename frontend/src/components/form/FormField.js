import React from 'react';
import './FormField.css';

export function FormField(props) {
  const { name, label, value, onUpdate } = props;
  const onChange = (event) => {
    onUpdate(name, event.target.value);
  }
  return (
    <div key={name} className="FormField">
      <label>{label}</label>
      <br/>
      <input type="text" name={name} value={value} onChange={onChange} />
    </div>
  );
}
