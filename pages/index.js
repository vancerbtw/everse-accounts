import Head from 'next/head';
import Router from 'next/router';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: undefined
    };
  }

  componentDidMount() {
    this.setState({
      token: localStorage.getItem("token")
    })
  }

  render() {
    let link = (
      <div className="text-blue-500 cursor-pointer" onClick={() => {Router.push('/login')}}>
        Login
      </div>
    );

    if (this.state.token) {
      link = (
        <div className="text-blue-500 cursor-pointer" onClick={() => {Router.push('/logout')}}>
          Logout
        </div>
      );
    }
    return (
      <div>
        <div className={"h-64 w-screen bg:gray-100"}>Home, Token: {this.state.token != "" ? this.state.token: "Token is not available" || "Token is not available"}</div>
       {link}
      </div>
    );
  }
}

export default Home
