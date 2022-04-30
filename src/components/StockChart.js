import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import Box from "@mui/material/Box";

const round = (number) => {
  return number ? +number.toFixed(2) : null;
};

function StockChart(props) {
  const [series, setSeries] = useState([
    {
      data: [],
    },
  ]);
  const [price, setPrice] = useState(-1);
  const [prevPrice, setPrevPrice] = useState(-1);
  const [priceTime, setPriceTime] = useState(null);

  const getstocks = async () => {
    const stocksUrl = `https://yahoo-finance-api.vercel.app/${props.selectedStock}`;
    const response = await fetch(stocksUrl);
    return response.json();
  };

  const chart = {
    options: {
      chart: {
        type: "candlestick",
        height: 350,
      },
      title: {
        text: props.selectedStock,
        align: "left",
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
      },
    },
  };

  useEffect(() => {
    let timeoutId;
    async function getLatestPrice() {
      try {
        if (props.selectedStock !== "") {
          console.log("Request:", props.selectedStock);
          const data = await getstocks();
          console.log("Response:",data);
            const stock = data.chart.result[0];
            setPrevPrice(price);
            setPrice(stock.meta.regularMarketPrice.toFixed(2));
            setPriceTime(new Date(stock.meta.regularMarketTime * 1000));
            const quote = stock.indicators.quote[0];
            const prices = stock.timestamp.map((timestamp, index) => ({
              x: new Date(timestamp * 1000),
              y: [
                quote.open[index],
                quote.high[index],
                quote.low[index],
                quote.close[index],
              ].map(round),
            }));
            setSeries([
              {
                data: prices,
              },
            ]);
        }
      } catch (error) {
        console.log("Logging Error:", error);
        setSeries([
          {
            data: [],
          },
        ]);
      }
      timeoutId = setTimeout(getLatestPrice, 5000);
    }
    getLatestPrice();
    return () => {
      clearTimeout(timeoutId);
    };
  }, [props.selectedStock]);

  console.log("Selected Stock:", props.selectedStock)

  return (
    <Box>
      {props.selectedStock !== "" ? (
          <Chart
            options={chart.options}
            series={series}
            type="candlestick"
            width="100%"
            height={320}
          />
      ) : (
        ""
      )}
    </Box>
  );
}

export default StockChart;
