import React, { Component } from 'react';
import QrReader from 'react-qr-reader';
import axios from 'axios';
import Cookies from 'js-cookie';


export default class QRScan extends Component {
  state = {
    barcode_id: '',
    checkinTime: '',
    success: false
  }
  
  handleScan = (data) => {
    if (data) {
      var today = new Date();
      var time = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes();

      try {
        this.setState({
          barcode_id: data,
          checkinTime: time,
          success: true,
        })
      } catch (error) {
        console.log(error);
      }

    }
  }

  handleConfirmation = (e) => {
    e.preventDefault();

    document.getElementById("btn").style.display = "none";

    var CancelToken = axios.CancelToken;
    var cancel;

    axios.post('http://localhost:8086/log', {
      barcode_id: this.state.barcode_id,
      checkinTime: this.state.checkinTime,
    }, {headers: {'SESSION-KEY': Cookies.get('SESSION-KEY')}}, 
       {cancelToken: new CancelToken(function executor(c) {
         cancel = c;
       })})    
    .then(response => {
      if(response.status === 200) {
        this.setState ({
          success: true,
        })
        cancel();
        alert("Scan was successful")
      } else {
        this.setState ({
          success: false,
        })
      }
    })
    .catch((err) => {
      if(err.response.status) {
        console.log(err.response.status);
        alert('Invalid QR-Code');
      } else if(err.request) {
        console.log(err.request);
      }
    })

  }

  handleError = (err) => {
    console.error(err)
  }
  render() {
    const succ = this.state.success;

    return (
      <div>
       <QrReader
           delay={100}
           onError={this.handleError}
           onScan={this.handleScan}
           style={{ width: '100%' }}
         />
        <p>{this.state.result}</p>
        {
          succ
          ? <button id="btn" type="submit" className="btn btn-lg btn-primary btn-block" onClick={this.handleConfirmation}> Confirm </button>
          : <h3> Scan QR-Code</h3>
        }
      </div>
    )
  }
}

