import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

function StockWatchList(props) {
  const stockSymbols = props.stockSymbols;
  const setSelectedStock = props.setSelectedStock
  console.log("stockSymbols:", stockSymbols)
  return (
    <Box>
          <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Stock Symbol</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...stockSymbols].map((stockSymbol) => (
                <TableRow
                  key={stockSymbol}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {stockSymbol}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Button
                      onClick={() => {
                        setSelectedStock(stockSymbol);
                      }}
                    >
                      View Chart
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    </Box>
  );
}

export default StockWatchList;
