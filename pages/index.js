import Head from 'next/head'
import Nav from "../components/Nav"
import '../styles/index.css'

const Home = () => (
  <div className="container">
    <Head>
      <title>Everse</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main class="flex flex-col h-full">
      <Nav />
      <div class="flex-grow items-center pt-16 flex flex-col overflow-x-scroll">
        <div class="flex flex-col w-4/5">
          <span class="text-4xl font-bold pb-3">Our Projects</span>
          <div class="header w-full h-full mb-12 flex flex-col overflow-hidden shadow-xl transition duration-500 ease-in-out hover:scale-105 transform cursor-pointer flex flex-col" style={{borderRadius: "2rem", height: "28vh", background: "linear-gradient(165deg,#f2801f,#d04032)"}}>
            <span class="text-4xl font-bold pt-6 pl-6 text-white">Jelbrek.icu</span>
            <button class="bg-gray-200 transition duration-500 ease-in-out hover:scale-110 transform text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center justify-between ml-6 mt-1" style={{borderRadius: "0.5rem", width: "15%"}}>
              <span>Available Now</span>
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path></svg>
            </button>
          </div>
          <div class="header w-full h-full shadow-xl transition duration-500 ease-in-out hover:scale-105 transform cursor-pointer flex flex-col" style={{borderRadius: "2rem", height: "28vh", background: "linear-gradient(165deg,#487cdc,#1d4ca3)"}}>
            <span class="text-4xl font-bold pt-6 pl-6 text-white">Blaze Repo</span>
            <span class="text-2xl font-medium pl-6 text-white">Coming Soon</span>
          </div>
        </div>
      </div>
      {/* <div class="flex flex-col-reverse text-center py-4 px-4 h-screen w-screen" style={{position: "absolute"}}>
        <div class="p-2 items-center text-indigo-100 leading-none rounded-full flex inline-flex discord-alert mr-8 ml-8" style={{backgroundColor: "rgb(4, 162, 146)"}} role="alert" onClick={() => window.location = "https://discord.gg/wBjy7Gb"}>
          <span class="flex rounded-full  uppercase px-2 py-1 text-xs font-bold mr-3" style={{backgroundColor: "#017569"}}>New</span>
          <span class="font-semibold mr-2 text-left flex-auto">Join our new Discord!</span>
          <svg class="fill-current opacity-75 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"/></svg>
        </div>
      </div> */}
    </main>
  </div>
)

export default Home
