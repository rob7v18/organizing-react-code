import React from 'react';
import './ValidateForm.css'

export default function ValidateForm(props) {
  console.log('in val', props.message)
  if(props.hasError) {
    return (
      <div className="error">{props.message}</div>
    );
  }

  return <></>
}