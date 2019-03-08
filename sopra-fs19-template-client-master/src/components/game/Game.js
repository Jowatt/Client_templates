import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import Player from "../../views/Player";
import { Spinner } from "../../views/design/Spinner";
import { Button } from "../../views/design/Button";
import {Link, withRouter} from "react-router-dom";

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
`;

const Users = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      users: null
    };
  }

  logout() {
    fetch(`${getDomain()}/users/logout?token=${localStorage.getItem("token")}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({token: localStorage.getItem(("token"))})
    }).then(response => {
      if (response.ok){
        localStorage.removeItem("token");
        this.props.history.push("/login");
      }
      else throw new Error(response.status);
    }).catch(err => {
      console.log(err);
      alert("Something went wrong: " + err);
    });
  }

  componentDidMount() {
    fetch(`${getDomain()}/users?token=${localStorage.getItem("token")}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
        .then(response => response.json(), error =>
        {
          this.props.history.push("/login");
        })
        .then( users => {
          // delays continuous execution of an async operation for 0.8 seconds.
          // This is just a fake async call, so that the spinner can be displayed
          // feel free to remove it :)
          try { this.setState({users}); }
          catch {
            alert("Sorry something went wrong!");
            this.logout();
            localStorage.removeItem("token");
          }

        })
        .catch(err => {
          console.log(err);
          alert("Something went wrong fetching the users: " + err);
        });
  }

  render() {
    return (
      <Container>
        <h2>Happy Coding! </h2>
        <p>Get all users from secure end point:</p>
        {!this.state.users ? (
          <Spinner />
        ) : (
          <div>
            <Users>
              {this.state.users.map(user => {
                return (
                    <Link to={"/path"}>
                  <PlayerContainer key={user.id}>
                    <Player user={user}

                    />
                  </PlayerContainer>
                    </Link>
                );
              })}
            </Users>
            <Button
              width="100%"
              onClick={() => {
                this.logout();
              }}
            >
              Logout
            </Button>
          </div>
        )}
      </Container>
    );
  }
}

export default withRouter(Game);
