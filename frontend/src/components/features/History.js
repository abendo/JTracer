import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import Title from './Title';
import axios from "axios";
import Cookies from 'js-cookie';
import { Container } from '@material-ui/core';


export default function ClassOccupancy() {
  const [loading, setLoading] = React.useState(true);
  const [history, setHistory] = React.useState([]);

  React.useEffect(() => {
      axios.get('http://localhost:8086/past', {headers: {'SESSION-KEY': Cookies.get('SESSION-KEY')}})
      .then((response) => {
          setHistory(response.data['history']);
          setLoading(false);
      })
      .catch((err) => {
          if(err.response) {
              console.log(err.response);
          }
      })
  }, [])

  const tableBody = (rows) => (<TableBody>
    {rows.map((row) => (
      <TableRow key={row.id}>
        <TableCell>{row.id}</TableCell>
        <TableCell>{row.barcodeId}</TableCell>
        <TableCell>{row.checkinTime}</TableCell>
      </TableRow>
    ))}
  </TableBody>)

  return (
    <React.Fragment>
      {loading ? <CircularProgress/> :
      <Container>
      <Title>Recent History</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Barcode ID</TableCell>
            <TableCell>Checkin Time</TableCell>
          </TableRow>
        </TableHead>
        {tableBody(history)}
      </Table>
      </Container>
      }
    </React.Fragment>
  );
}

