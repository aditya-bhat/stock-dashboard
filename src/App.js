import logo from './logo.svg';
import './App.css';
import Main from "./components/Main"
import TextField from '@mui/material/TextField';


function App() {
  document.title = "Stock Market Dashboard";
  return (
    <div className="App">
      <div className="App-header">
      <h4>Stock Dashboard</h4>
        <Main></Main>
      </div>
    </div>
  );
}

export default App;
