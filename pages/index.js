import Head from 'next/head';

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
    return <div className={"h-screen w-screen bg:gray-100"}>Home, Token: {this.state.token != "" ? this.state.token: "Token is not available" || "Token is not available"}</div>
  }
}

export default Home
