import React, { Component } from 'react';
import ApiContext from '../ApiContext';
import ValidateForm from '../ValidateForm/ValidateForm'
import config from '../config';
import './AddNote.css'

class AddNote extends Component{
    constructor(props){
        super(props);
        this.state = {
          nameValid: false,
          name: '',
          validationNameMessages: {
            name: '',
          },
          contentValid: false,
          content: '',
          validationContentMessages: {
            content: '',
          },
          optionValid: false,
          option: '',
      }
    }

static contextType = ApiContext;

updateOption(option) {
  this.setState({option}, ()=>{this.validateOption(option)});
}

validateOption(fieldValue) {
  let hasError = false;

  if(fieldValue = "") {
    hasError = true;
  }
  else {
    hasError = false;
  }
  this.setState({
    optionValid: !hasError
  }, this.formValid3 );
}

formValid3(){
this.setState({
  formValid3: this.state.optionValid
});
}

updateName(name){
  this.setState({name}, ()=>{this.validateName(name)});
}

validateName(fieldValue) {
    const fieldErrors = {...this.state.validationNameMessages};
    let hasError = false;

    fieldValue = fieldValue.trim();
    if(fieldValue.length === 0) {
      fieldErrors.name = 'Name is required';
      hasError = true;
    }
    this.setState({
      validationNameMessages: fieldErrors,
      nameValid: !hasError
    }, this.formValid );
}

formValid(){
  this.setState({
    formValid: this.state.nameValid
  });
}

updateContent(content){
  this.setState({content}, ()=>{this.validateContent(content)});
}

validateContent(fieldValue) {
  const fieldErrors = {...this.state.validationContentMessages};
  let hasError = false;

  fieldValue = fieldValue.trim();
  if(fieldValue.length === 0) {
    fieldErrors.content = 'Content is required';
    hasError = true;
  }
  this.setState({
    validationContentMessages: fieldErrors,
    contentValid: !hasError
  }, this.formValid2 );
}

formValid2(){
  this.setState({
    formValid2: this.state.contentValid
  });
}

handleSubmit = e => {
    e.preventDefault()
    const { NoteName,Content,FolderName } =e.target
    const Note ={
        name: NoteName.value,
        content: Content.value,
        folderId: FolderName.value,
        
    }
    fetch(`${config.API_ENDPOINT}/notes`, {
        method: 'POST',
        body: JSON.stringify(Note),
        headers: {
            'content-type': 'application/json',
          }
    })
        .then(res => {
            if (!res.ok) {
            // get the error message from the response,
            return res.json().then(error => {
                // then throw it
                throw error
            })
          }
            return res.json()
        })

        .then(data =>{
            console.log(data)
            this.context.addNote(data)
            this.props.history.push('/')
        })

        .catch(error => {
            this.setState({ error })
          })
      }
    render(){
        return(
            <form 
                className ="AddNote-Form"
                onSubmit = {this.handleSubmit}
                >
                <label htmlFor="NoteName">Note Name</label>
                <input type="text" id="NoteName" name="NoteName" 
                 onChange={e => this.updateName(e.target.value)}/>
                 <ValidateForm className='validationError' hasError={!this.state.name} message={this.state.validationNameMessages.name}></ValidateForm>
                 <br />
                
                <label htmlFor="Content">Content</label>
                <input type="text" id="Content" name="content" 
                onChange={e => this.updateContent(e.target.value)}/>
                <ValidateForm className='validationError' hasError={!this.state.content} message={this.state.validationContentMessages.content}></ValidateForm>
                <br />

                <label htmlFor="FolderName">FolderName</label>
                <br />
                <select id='FolderName' name='FolderName' 
                onChange={e => this.updateOption(e.target.value)}> 
                    <option value="" disabled selected>Choose a folder</option>
                    {this.context.folders.map(folder =>
                        <option key={folder.id} value={folder.id}>
                        {folder.name}
                        </option>
                    )}
                </select>

                <button type= "submit" disabled={!this.state.formValid || !this.state.formValid2 || !this.state.formValid3}>Submit</button>
            </form>
        )
    }
}

export default AddNote;