
import React, { Component} from 'react'

export default class LoadingError extends Component{
    constructor(props){
        super(props);
        this.state = {
            hasError: false
        };
    }
    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.log('caught error', error, errorInfo);
        this.setState({hasError:true});
    }
    render(){
        if(this.state.hasError){
            return(
                <h2>Could not load note.</h2>
                
            );
        }
        return this.props.children;
    }
}