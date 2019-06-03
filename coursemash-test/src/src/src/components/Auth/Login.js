import React from 'react';
import firebase from '../../firebase';
import { 
    Grid,
    Form,
    Segment,
    Button,
    Header,
    Message,
    Icon 
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';



class Login extends React.Component {
    
    state = {
        email: '',
        password: '',
        errors: [],
        loading: false
    }
 
    handleChange = event => { 
        this.setState({[event.target.name]: event.target.value});
    }

    displayErrors = errors => errors.map((error, i) =>
        <p key={i}>{ error.message }</p>);
    
    handleInputError = (errors, inputName) => {
        return errors.some(error => 
            error.message.toLowerCase().includes(inputName)
        )
            ? "error"
            : ""
    }

    handleSubmit = event => {
        event.preventDefault();

        if (this.isFormValid(this.state)) {
            this.setState({ errors: [], loading: true });
            firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(signedInUser => {
                    console.log("Signed In User:", signedInUser);
                })
                .catch(err => {
                    console.error(err);
                    this.setState({
                        errors: this.state.errors.concat(err),
                        loading: false
                    });
                })
        }
    }

    isFormValid = ({email, password}) => email && password;


    render() {
        const { 
            email,
            password,
            errors, 
            loading
        } = this.state;

        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h1" icon color="yellow" textAlign="center">
                        <Icon name="code branch" color="yellow" />
                            Login to CourseMash
                    </Header>
                    
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}

                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>
                            <Form.Input
                                fluid 
                                name="email" 
                                icon="mail" 
                                iconPosition="left" 
                                placeholder="School Email" 
                                onChange={this.handleChange} 
                                value={email}
                                className={this.handleInputError(errors, 'email')}
                                type="email"
                            />  

                            <Form.Input 
                            fluid name="password"
                            icon="lock"
                            iconPosition="left"
                            placeholder="Password"
                            onChange={this.handleChange}
                            value={password}
                            className={
                                this.handleInputError(errors, 'password')
                            }
                            type="password" />

                            <Button 
                            disabled={loading}
                            className={loading ? 'loading' : ''}
                            color="yellow"
                            fluid size="large">Login</Button>
                        </Segment>
                    </Form>
                    <Message>Don't have an account? 
                        <Link to="/register"> Register now.</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        )
    }
};

export default Login;