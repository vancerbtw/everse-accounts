import Router from 'next/router';
import Head from 'next/head';

class Home extends React.Component {
  componentDidMount() {
    localStorage.setItem("token", "");
    return Router.push('/')
  }

  render() {
    return (<div>Logging out...</div>);
  }
}

export default Home
