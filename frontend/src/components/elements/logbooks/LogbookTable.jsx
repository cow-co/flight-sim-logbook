import { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { fetchLogbooks } from "../../../common/api-calls";
import { useSelector, useDispatch } from "react-redux";

const LogbookTable = () => {
  const [logbooks, setLogbooks] = useState([]);
  const userId = useSelector((state) => state.users.userId);

  useEffect(() => {
    async function callFetcher() {
      const res = await fetchLogbooks(userId);
      if (res.errors.length === 0) {
        setLogbooks(res.entries);
      }
    }

    if (userId) {
      callFetcher();
    }
  }, [userId]);

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