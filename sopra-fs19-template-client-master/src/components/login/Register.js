import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import User from "../shared/models/User";
import { withRouter } from "react-router-dom";
import { Button } from "../../views/design/Button";



const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  height: 520px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const ErrorLabel = styled.label`
  color: red;
  display: ${props => (props.display)};
  line-height:.7em;
  margin-bottom: 0.5em;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: ${props => (props.invalid ? "#b22222 solid 2px" :"none")}
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Title = styled.h2`
  font-weight: bold;
  color: white;
  text-align: center;
`;

class Register extends React.Component {
    /**
     * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
     * The constructor for a React component is called before it is mounted (rendered).
     * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: name and username
     * These fields are then handled in the onChange() methods in the resp. InputFields
     */
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            username: null,
            password: null,
            passwordRepeat: null,
            passwordValid: true,
            requestValid: true
        };
    }
    /**
     * HTTP POST request is sent to the backend.
     * If the request is successful, a new user is returned to the front-end and its token is stored in the localStorage.
     */
    register() {
        let status;
        fetch(`${getDomain()}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: this.state.name,
                username: this.state.username,
                password: this.state.password,
            })
        })
            .then(response => {
                status = response.status;
                return response.json();
            })
            .then(returnedUser => {
                //handle errorResponses
                if (status === 400) {
                    this.setState({"requestValid": false});
                    return;
                }
                else if (returnedUser.token === null){ throw new Error (status + " - " + returnedUser.message);}

                this.props.history.push(`/login`);
            })
            .catch(err => {
                if (err.message.match(/Failed to fetch/)) {
                    alert("The server cannot be reached. Did you start it?");
                }
                else {
                  alert(`Something went wrong during the registration: ${err.message}`);
                }
            })
    }
    /**
     *  Every time the user enters something in the input field, the state gets updated.
     * @param key (the key of the state for identifying the field that needs to be updated)
     * @param value (the value that gets assigned to the identified state key)
     */
    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        this.setState({ [key]: value });
    }

    handlePasswordValidation(value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        if (value === this.state.password) {
            this.setState({"passwordRepeat": value});
            this.setState({"passwordValid": "true"});
        }
        else {
            this.setState({"passwordValid": null});
        }
    }

    back_login(){
        this.props.history.push("/login")
    }

    /**
     * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
     * Initialization that requires DOM nodes should go here.
     * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
     * You may call setState() immediately in componentDidMount().
     * It will trigger an extra rendering, but it will happen before the browser updates the screen.
     */
    componentDidMount() {}

render() {
    return (
        <BaseContainer>
            <FormContainer>
                <Form>
                    <Title>Enter your credentials!</Title>
                    <Label>Username</Label>
                    <ErrorLabel display={this.state.requestValid?"none":""}>username already existing.</ErrorLabel>

                    <InputField
                        placeholder="Enter here.."
                        onChange={e => {
                            this.handleInputChange("username", e.target.value);
                        }}
                    />
                    <Label>Name</Label>
                    <InputField
                        placeholder="Enter here.."
                        onChange={e => {
                            this.handleInputChange("name", e.target.value);
                        }}
                    />
                    <Label>Password</Label>
                    <InputField type="password"
                        placeholder="Enter here.."
                        onChange={e => {
                            this.handleInputChange("password", e.target.value);
                        }}
                    />
                    <Label>Repeat Password</Label>
                    <InputField type="password"
                                placeholder="Enter here.." invalid={!this.state.passwordValid}
                                onChange={e => {
                                    this.handlePasswordValidation(e.target.value);
                                }}
                                onKeyPress={event => {
                                    if(event.key === 'Enter') {
                                        if (!this.state.username || !this.state.name || !this.state.password || !this.state.passwordValid || !this.state.passwordRepeat){
                                            return
                                        }else{
                                        this.register();}
                                    }}}
                     />

                    <ButtonContainer>
                        <Button
                            width="10%"
                            onClick={() => {
                                this.back_login();
                            }}
                        >
                            Back
                        </Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button
                            disabled={!this.state.username || !this.state.name || !this.state.password || !this.state.passwordValid || !this.state.passwordRepeat}
                            width="50%"
                            onClick={() => {
                                this.register();
                            }}
                        >
                            Sign Up
                        </Button>
                    </ButtonContainer>
                </Form>
            </FormContainer>
        </BaseContainer>
    );
}
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Register);