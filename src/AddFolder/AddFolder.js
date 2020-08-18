import React, { Component } from 'react';
import ApiContext from '../ApiContext';
import config from '../config';
import ValidateForm from '../ValidateForm/ValidateForm'
import './AddFolder.css'

class AddFolder extends Component{

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

validateName(fieldValue){
    const fieldErrors = {...this.state.validationMessages};
    let hasError = false;
  
    fieldValue = fieldValue.trim();
    if(fieldValue.length === 0){
      fieldErrors.name = 'Name is required';
      hasError = true;
    }
    this.setState({
      validationMessages: fieldErrors,
      nameValid: !hasError
    }, this.formValid);
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
    const { folderName } =e.target
    const folder ={
        name: folderName.value,

    }
    fetch(`${config.API_ENDPOINT}/folders`, {
        method: 'POST',
        body: JSON.stringify(folder),
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
            this.context.addFolder(data)
            this.props.history.push('/')
        })

        .catch(error => {
            this.setState({ error })
          })
      }



    render(){
        return(
            <section className= "addFolder">
                <h2 className= "addfolder-title">Create Folder</h2>
                <form 
                    className= 'addFolder-form'
                    onSubmit={this.handleSubmit}
                >
                    <label className="folderName" 
                    htmlFor="folderName">Folder Name
                    </label>

                    <input type = "text" id= 'folderName' name="folderName" onChange={e => this.updateName(e.target.value)} />
                    <ValidateForm className="validateionError" hasError={!this.state.name} message={this.state.validationMessages.name}></ValidateForm>

                    <button type= "submit" className="addFolder-button" disabled={!this.state.formValid}>Submit

                    </button>
                </form>


            </section>
        )
    }
}

export default AddFolder