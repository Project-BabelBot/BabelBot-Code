// import logo from './Images/logo.svg';
import './CSS/App.css';
import Avatar from './Components/Avatar';
import ListenButton from './Components/Listen-Button';
import Canvas from './Components/Canvas';

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    <>
      <Avatar />
      <ListenButton />
      <Canvas />
    </>
  );
}

export default App;
