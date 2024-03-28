import Demo from "../components/Demo"
import Hero from "../components/Hero"
import Navbar from "../components/Navbar"

const Home = () => {
    return (
        <div >
            <div className="main">
                <div className="gradient" />
            </div>
            
            
            <div className="app">
            <Navbar />
                <Hero />
                <Demo />
            </div>
        </div>
    )
}

export default Home