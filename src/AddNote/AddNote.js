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
          validationMessages: {
            name: '',
          }
        }
      }

static contextType = ApiContext;

validateName(fieldValue) {
    const fieldErrors = {...this.state.validationMessages};
    let hasError = false;

    fieldValue = fieldValue.trim();
    if(fieldValue.length === 0) {
      fieldErrors.name = 'Name is required';
      hasError = true;
    }
    this.setState({
      validationMessages: fieldErrors,
      nameValid: !hasError
    }, this.formValid );
}

  formValid(){
    this.setState({
      formValid: this.state.nameValid
    });
  }
  updateName(name){
    this.setState({name}, ()=>{this.validateName(name)});
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
                 <ValidateForm className='validationError' hasError={!this.state.name} message={this.state.validationMessages.name}></ValidateForm>
                 <br />
                
                <label htmlFor="Content">Content</label>
                <input type="text" id="Content" name="content" />
                <br />
                <label htmlFor="FolderName">FolderName</label>
                <br />
                <select id='FolderName' name='FolderName'> 
                    <option value={null}>...</option>
                    {this.context.folders.map(folder =>
                        <option key={folder.id} value={folder.id}>
                        {folder.name}
                        </option>
                    )}
                </select>
                

                <button type= "submit" disabled={!this.state.formValid}>Submit</button>
            </form>
        )
    }
}

export default AddNote;