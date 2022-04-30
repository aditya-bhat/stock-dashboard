import { useState, useMemo } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import LiveStockPanel from "./LiveStockPanel";
import StockChart from "./StockChart";
import StockWatchList from "./StockWatchList";


const Item = styled(Paper)(({ theme }) => ({
  // backgroundColor: "#282c34",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  minHeight: "60vh",
}));

const directionEmojis = {
  up: "⬆️",
  down: "🔻",
  "": "",
};

function Main() {
  const [price, setPrice] = useState(-1);
  const [prevPrice, setPrevPrice] = useState(-1);
  const [priceTime, setPriceTime] = useState(null);
  const [stockSymbol, setStockSymbol] = useState("");
  const [stockSymbols, setStockSymbols] = useState(new Set());
  const [selectedStock, setSelectedStock] = useState("");

  const handleChange = (event) => {
    setStockSymbol(
      event.target.value ? String(event.target.value).toUpperCase() : ""
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const stocksUrl = `https://yahoo-finance-api.vercel.app/${stockSymbol}`;
    const response = await fetch(stocksUrl);

    if (response.status == 200) {
      setStockSymbols(stockSymbols.add(stockSymbol));
      setSelectedStock(stockSymbol);
      console.log(stockSymbols);
    } else {
      window.alert("Invalid Stock Symbol");
    }
  };

  const direction = useMemo(
    () => (prevPrice < price ? "up" : prevPrice > price ? "down" : ""),
    [prevPrice, price]
  );

  return (
    <Grid
      style={{ padding: "10px" }}
      container
      rowSpacing={1}
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
    >
      <LiveStockPanel stockSymbols={stockSymbols}></LiveStockPanel>
      {selectedStock !== "" &&  price !== -1? (
        <Grid item xs={12}>
          <div>
            <div className="ticker">
              {" "}
              Showing Chart for: {selectedStock} at:{" "}
              {priceTime && priceTime.toLocaleTimeString()}
            </div>
            <div className={["price", direction].join(" ")}>
              ${price} {directionEmojis[direction]}
            </div>
          </div>
        </Grid>
      ) : (
        ""
      )}
      <Grid item xs={4}>
        <Item>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <TextField
              sx={{ input: { backgroundColor: "#dfdfdf" } }}
              label="Enter Stock Symbol"
              name="stockSymbol"
              variant="outlined"
              fullWidth
              value={stockSymbol}
              onChange={handleChange}
            ></TextField>
            <Button
              style={{ margin: "10px" }}
              variant="contained"
              onClick={() => handleSubmit()}
            >
              Add to Watchlist
            </Button>
          </Box>
          <Box className="watchlist-box">
            <h4>Your Watchlist</h4>
            {[...stockSymbols].length > 0 ? (
              <StockWatchList stockSymbols={stockSymbols} setSelectedStock={setSelectedStock}></StockWatchList>
            ) : (
              ""
            )}
          </Box>
        </Item>
      </Grid>
      <Grid item xs={8}>
        {selectedStock !== "" ? (
          <Paper style={{ backgroundColor: "#e9ecef" }}>
            <StockChart selectedStock={selectedStock}></StockChart>
          </Paper>
        ) : (
          ""
        )}
      </Grid>
    </Grid>
  );
}

export default Main;
