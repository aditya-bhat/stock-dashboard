import { useEffect, useState } from 'react';
import protobuf from 'protobufjs';
const { Buffer } = require('buffer');

const emojis = {
  'up': '⬆️',
  'down': '🔻',
  '': '',
}

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function LiveStockPanel(props) {
  const [stocks, setstocks] = useState([]);

  useEffect(() => {
    console.log("Value Changes", JSON.stringify([...props.stockSymbols]))
    const params = new URLSearchParams(window.location.search);
    const ws = new WebSocket('wss://streamer.finance.yahoo.com');

    const protoFile= require("../YPricingData.proto");
    protobuf.load(protoFile, (error, root) => {
      if (error) {
        return console.log(error);
      }
      const Yaticker = root.lookupType('yaticker');

      ws.onopen = function open() {
        console.log('connected');
        let stockSymbols =[...props.stockSymbols]
        if(stockSymbols.length > 0){
          console.log(stockSymbols)
          ws.send(
            JSON.stringify({
              subscribe: ([...props.stockSymbols])
                .map((symbol) => symbol.toUpperCase()),
            })
          );
        }
      };

      ws.onclose = function close() {
        console.log('disconnected');
      };

      ws.onmessage = function incoming(message) {
        const next = Yaticker.decode(new Buffer(message.data, 'base64'));
        setstocks((current) => {
          let stock = current.find((stock) => stock.id === next.id);
          if (stock) {
            return current.map((stock) => {
              if (stock.id === next.id) {
                return {
                  ...next,
                  direction:
                    stock.price < next.price
                      ? 'up'
                      : stock.price > next.price
                      ? 'down'
                      : stock.direction,
                };
              }
              return stock;
            });
          } else {
            return [
              ...current,
              {
                ...next,
                direction: '',
              },
            ];
          }
        });
      };
    });
  }, [JSON.stringify([...props.stockSymbols])]);

  return (
    <div className="stocks">
      {stocks.map((stock) => (
        <div className="stock" key={stock.id}>
          <h2 className={stock.direction}>
            {stock.id} {formatPrice(stock.price)} {emojis[stock.direction]}
          </h2>
        </div>
      ))}
    </div>
  );
}

export default LiveStockPanel;