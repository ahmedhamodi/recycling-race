/**
 * This is a Stateful Component. Its primary purpose is to fetch data, or do other logic that requires component lifecycles
 */
import React from 'react';
import BasicTable from './BasicTable';
import firebase from 'firebase';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import 'firebase/firestore';

import './Display.scss';

class Display extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataPostgres: [],
      dataFirebase: {},
      teacherName: '',
      aluminum: 0,
      batteries: 0,
      bottles: 0,
      cans: 0,
      cardboard: 0,
      computerParts: 0,
      glass: 0,
      metal: 0,
      paper: 0,
      wood: 0
    };
  }

  fetchData = () => {
    fetch('/recycling-data')
      .then(res => res.json())
      .then(json => {
        this.setState({ dataPostgres: json });
        this.props.loadData(json)
      });
  }

  addData = async () => {
    let body = {
      teacherName: this.state.teacherName,
      aluminum: parseInt(this.state.aluminum),
      batteries: parseInt(this.state.batteries),
      bottles: parseInt(this.state.bottles),
      cans: parseInt(this.state.cans),
      cardboard: parseInt(this.state.cardboard),
      computerParts: parseInt(this.state.computerParts),
      glass: parseInt(this.state.glass),
      metal: parseInt(this.state.metal),
      paper: parseInt(this.state.paper),
      wood: parseInt(this.state.wood)
    };
    const response = await fetch('/add-recycling-data', 
    {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(body)
    });
    return response.json();
  };

  fetchDataFirebase = () => {
    const fdb = firebase.firestore();
    fdb
      .collection("recycled_material")
      .get()
      .then(snapshot => {
        const data = {};
        snapshot
          .forEach(entry => {
            data[entry.id] = entry.data();
          })
        this.setState({ dataFirebase: data })
      })
      .catch(e => {
        console.error("something went wrong", e)
      })
  }

  /**
   * This is a React Component Lifecycle method. 
   * It will fire when the component has been mounted onto the DOM tree.
   */
  componentDidMount() {
    this.fetchData();
    // this.fetchDataFirebase();
  }

  calculateScore(val) {
    let totalScore = 0

    Object.keys(val).forEach(e => {
      if (e !== "id" && e !== "teacher") {
        totalScore += val[e]
      }
    });
    
    return totalScore
  }

  getHighScore() {
    let maxScore = 0
    let teacherName = ""
    this.state.dataPostgres.map(val => {
      let score = this.calculateScore(val)
      if (score > maxScore) {
        maxScore = score
        teacherName = val.teacher
      }
    })
    return teacherName
  }

  setTeacherName = (event) => {
    this.setState({
      teacherName: event.target.value
    });
  }
  setAluminum = (event) => {
    this.setState({
      aluminum: parseInt(event.target.value)
    });
  }
  setBatteries = (event) => {
    this.setState({
      batteries: parseInt(event.target.value)
    });
  }
  setBottles = (event) => {
    this.setState({
      bottles: parseInt(event.target.value)
    });
  }
  setCans = (event) => {
    this.setState({
      cans: parseInt(event.target.value)
    });
  }
  setCardboard = (event) => {
    this.setState({
      cardboard: parseInt(event.target.value)
    });
  }
  setComputerParts = (event) => {
    this.setState({
      computerParts: parseInt(event.target.value)
    });
  }
  setGlass = (event) => {
    this.setState({
      glass: parseInt(event.target.value)
    });
  }
  setMetal = (event) => {
    this.setState({
      metal: parseInt(event.target.value)
    });
  }
  setPaper = (event) => {
    this.setState({
      paper: parseInt(event.target.value)
    });
  }
  setWood = (event) => {
    this.setState({
      wood: parseInt(event.target.value)
    });
  }

  render() {
    return (
      <div className="display-container">
        <h2>Current Leader:</h2>
        <p>{this.getHighScore()}'s classroom is in the lead!</p>
        <h2>Add a new entry!</h2>
        <TextField id="outlined-basic" label="Teacher Name" variant="outlined" onChange={this.setTeacherName}/>
        <TextField id="outlined-basic" label="Aluminum" variant="outlined" onChange={this.setAluminum}/>
        <TextField id="outlined-basic" label="Batteries" variant="outlined" onChange={this.setBatteries}/>
        <TextField id="outlined-basic" label="Bottles" variant="outlined" onChange={this.setBottles}/>
        <TextField id="outlined-basic" label="Cans" variant="outlined" onChange={this.setCans}/>
        <TextField id="outlined-basic" label="Cardboard" variant="outlined" onChange={this.setCardboard}/>
        <TextField id="outlined-basic" label="Computer Parts" variant="outlined" onChange={this.setComputerParts}/>
        <TextField id="outlined-basic" label="Glass" variant="outlined" onChange={this.setGlass}/>
        <TextField id="outlined-basic" label="Metal" variant="outlined" onChange={this.setMetal}/>
        <TextField id="outlined-basic" label="Paper" variant="outlined" onChange={this.setPaper}/>
        <TextField id="outlined-basic" label="Wood" variant="outlined" onChange={this.setWood}/>
        <br></br>
        <br></br>
        <Button variant="contained" color="primary" onClick={this.addData}>Submit</Button>
        <h2>Current Leader: </h2>
        <h2>Local Data Handling</h2>
        <BasicTable data={this.state.dataPostgres} />
        <h2>Global Data Handling</h2>
        <BasicTable  data={this.props.storeData} />
        <h2>Scores</h2>
        {this.state.dataPostgres.map(val => 
          <p>{val.teacher}'s classroom: {this.calculateScore(val)}</p>
        )}
        {/* <h2>Firebase Data (json)</h2>
        {
          Object.entries(this.state.dataFirebase).length === 0
            ? "**Firebase not set up**"
            : JSON.stringify(this.state.dataFirebase, null, 2)
        } */}
      </div>
    )
  }
}

export default Display;

Display.propTypes = {};
