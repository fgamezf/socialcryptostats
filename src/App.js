import logo from './logo.svg';
import './App.css';
import { StreamData } from './components/streamData'
import { Header } from './components/header'
import { Footer } from './components/footer'


require('dotenv').config();

function App() {

  return (
    <div className="App">     
        <Header/>
        <StreamData/>
        <Footer/>
    </div>
  );
}

export default App;
