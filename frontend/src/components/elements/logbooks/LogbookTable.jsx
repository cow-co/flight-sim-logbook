import { useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const LogbookTable = () => {
  const [logbooks, setLogbooks] = useState([{
    _id: "1",
    aircraft: "MiG-21 FISHBED",
    hours: 2,
    ships: 2,
    sead: false,
    bvr: false,
    bfm: true,
    cas: false,
    carrier: false
  }, {
    _id: "2",
    aircraft: "F/A-18C",
    hours: 2.5,
    ships: 4,
    sead: true,
    bvr: true,
    bfm: false,
    cas: false,
    carrier: true
  }]);

  return (
    <TableContainer component={Paper} className="table-backer">
      <Table aria-label="logbook table">
        <TableHead>
          <TableRow>
            <TableCell>Aircraft</TableCell>
            <TableCell>Duration (hours)</TableCell>
            <TableCell>Ships</TableCell>
            <TableCell>SEAD</TableCell>
            <TableCell>BVR</TableCell>
            <TableCell>BFM</TableCell>
            <TableCell>CAS</TableCell>
            <TableCell>Carrier Ops</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logbooks.map((entry) => {
              return (
              <TableRow
                key={entry._id}
              >
                <TableCell
                className="aircraft-name">
                  {entry.aircraft}
                </TableCell>
                <TableCell>{entry.hours}</TableCell>
                <TableCell>{entry.ships}</TableCell>
                <TableCell>{entry.sead ? "✓" : "✗"}</TableCell>
                <TableCell>{entry.bvr ? "✓" : "✗"}</TableCell>
                <TableCell>{entry.bfm ? "✓" : "✗"}</TableCell>
                <TableCell>{entry.cas ? "✓" : "✗"}</TableCell>
                <TableCell>{entry.carrier ? "✓" : "✗"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default LogbookTable;