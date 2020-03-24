import Head from 'next/head'
import Nav from "../components/Nav"
import '../styles/index.css'

const Home = () => (
  <div className="container">
    <Head>
      <title>Everse</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main>
      <Nav />
        <div class="flex items-center justify-center flex-shrink-0 text-black mr-6 h-screen">
            <span class="font-medium text-6xl tracking-tight -my-100">Coming Soon</span>
        </div>
    </main>
  </div>
)

export default Home
