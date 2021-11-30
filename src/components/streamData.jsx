import React, { useEffect, useState } from "react";
import { Card, Table, Form, Container, Col, Row } from "react-bootstrap";
import { ChartCard } from "./chartCard";
import { IntroCard } from "./intro";
import Chart from "chart.js/auto";

export const StreamData = (props) => {
  // Default values
  const [connected, setConnected] = useState(false);
  const [currentData, setCurrentData] = useState({});
  const [historicalData, setHistoricalData] = useState({});
  const [selectedCoins, setSelectedCoins] = useState([]);
  const [chartCards, setChartCards] = useState([]);
  const [priceData, setPriceData] = useState({});
  const [currentPriceData, setCurrentPriceData] = useState({});
  const [pairs, setPairs] = useState([]);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Price",
        data: [],
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  });

  /*
   * This runs our function when the page loads.
   */
  useEffect(() => {
    const listenForCryptoTweets = () => {
      const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
      ws.onopen = () => {
        console.log("Opened Connection!");
        setConnected(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data);
        setCurrentData(data);
      };

      ws.onclose = () => {
        console.log("Closed Connection!");
        setConnected(false);
        setCurrentData({});
        setHistoricalData({});
        setSelectedCoins([]);
        setChartCards([]);
      };
    };

    // Start listen for crypto tweets
    listenForCryptoTweets();
    // Start listen for crypto price
  }, []);

  /*
   * This runs once we loaded all pairs
   */
  useEffect(() => {
    const listenForPriceUpdates = (productPair) => {
      if (productPair == null) {
        throw new Error(
          "Error in listenForPriceUpdates method. ProductPair is null!"
        );
      }

      // The websocket client provides price updates on the product, refer to the docs for more information
      const websocket = new WebSocket(
        process.env.REACT_APP_WEBSOCKET_COINBASE_URL
      );
      websocket.onopen = () => {
        console.log("Opened Connection to coinbase!");
        let msg = {
          type: "subscribe",
          product_ids: productPair,
          channels: ["ticker"],
        };
        let jsonMsg = JSON.stringify(msg);
        websocket.send(jsonMsg);
      };

      websocket.onmessage = (e) => {
        var data = JSON.parse(e.data);
        if (data.type !== "ticker") {
          return;
        }

        var pair = data.product_id;
        //let roundedTime = Math.floor(new Date(data.time) / 60000.0) * 60
        var date = new Date(data.time);
        var hours = date.getHours();
        if (hours < 10) {
          hours = "0" + hours;
        }
        var minutes = date.getMinutes();
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        var roundedTime =
          date.getDate() +
          "/" +
          (date.getMonth() + 1) +
          "/" +
          date.getFullYear() +
          " " +
          hours +
          ":" +
          minutes;

        console.log("Pair " + pair);
        console.log("Time " + roundedTime);
        console.log("Current price" + data.price);

        if (productPair.includes(pair)) {
          // Update historical price
          if (priceData[pair] !== undefined) {
            if (priceData[pair]["date"].indexOf(roundedTime) === -1) {
              priceData[pair] = {
                data: [...priceData[pair]["data"], parseFloat(data.price)],
                date: [...priceData[pair]["date"], roundedTime],
              };
            } else {
              // Calculate avg over minute (roundedTime)
              // First find index on array
              var sameTimeSearch = (element) => (element = roundedTime);
              var indexArray =
                priceData[pair]["date"].findIndex(sameTimeSearch);
              var foundPrice = priceData[pair]["data"][indexArray];

              var avgPrice = (foundPrice + parseFloat(data.price)) / 2;
              console.log("avgPrice per minute = " + avgPrice);
              // Update array
              priceData[pair]["data"][indexArray] = avgPrice;
            }
          } else {
            priceData[pair] = {
              data: [parseFloat(data.price)],
              date: [roundedTime],
            };
          }

          //Update current price
          setCurrentPriceData(prevState => ({
            ...prevState,
            [pair]: parseFloat(data.price)
          }));


        }
      };

      websocket.onclose = () => {
        console.log("Closed Connection to Coinbase!");
      };
    };
    // Start listen for crypto price
    listenForPriceUpdates(pairs);
  }, [pairs]);

  /*
   * This runs once we get twitter stats from server
   */
  useEffect(() => {
    if (!connected) return;
    var tmpPairs = [];
    var tmpData = Object.create(historicalData);
    Object.keys(currentData).forEach((item, index) => {
      tmpPairs.push(getPair(item));
      if (tmpData[item] !== undefined) {
        if (tmpData[item]["date"].indexOf(currentData[item].date) === -1) {
          tmpData[item] = {
            data: [...tmpData[item]["data"], currentData[item]["1m"].current],
            date: [...tmpData[item]["date"], currentData[item].date],
          };
        }
      } else {
        tmpData[item] = {
          data: [currentData[item]["1m"].current],
          date: [currentData[item].date],
        };
      }
    });

    if (pairs.length === 0) {
      setPairs(tmpPairs);
    }
    setHistoricalData(tmpData);

    // Update coins charts
    setChartCards(coinCards());

    // Update global chart data

    setChartData({
      labels: Object.keys(currentData).map((crypto, index) =>
        crypto.toUpperCase()
      ),
      datasets: [
        {
          label: "Current",
          data: Object.keys(currentData).map(
            (crypto, index) => currentData[crypto]["1m"].current
          ),
          fill: true,
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "rgba(75,192,192,1)",
        },
        {
          label: "-1m",
          data: Object.keys(currentData).map(
            (crypto, index) => currentData[crypto]["1m"].last
          ),
          fill: true,
          borderColor: "#742774",
        },
        {
          label: "-5m",
          data: Object.keys(currentData).map(
            (crypto, index) => currentData[crypto]["5m"].last
          ),
          fill: true,
          borderColor: "#DBAD6A",
        },
        {
          label: "-30m",
          data: Object.keys(currentData).map(
            (crypto, index) => currentData[crypto]["30m"].last
          ),
          fill: true,
          borderColor: "#628395",
        },
      ],
    });
  }, [currentData, currentPriceData]);

  const getChartConfigByCoin = (coin) => {
    if (historicalData[coin] !== undefined)
      var { labels, data1, data2 } = mergeDatasets(
        historicalData,
        priceData,
        coin
      );
    return {
      labels: labels,
      datasets: [
        {
          label: "Tweets",
          data: data1,
          fill: true,
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "rgba(75,192,192,1)",
          yAxisID: "y",
        },
        {
          label: "Price",
          data: data2,
          fill: true,
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "#742774",
          yAxisID: "y1",
        },
      ],
    };
  };

  const getPair = (coin) => {
    return coin.toUpperCase() + "-" + process.env.REACT_APP_BASE_COIN;
  };

  const mergeDatasets = (dataset1, dataset2, coin) => {
    // Define new data arrays
    var data1 = [];
    var data2 = [];
    var labels = [];

    try {
      labels = [
        ...new Set([
          ...dataset1[coin]["date"],
          ...dataset2[getPair(coin)]["date"],
        ]),
      ];
    } catch (error) {
      console.log(error);
      console.log("Error array 1 = " + dataset1[coin]);
      console.log("Error array 2 = " + dataset2[getPair(coin)]);
    }
    console.log("Labels = " + labels);
    // Iterate over labels
    labels.forEach(function (datelabel) {
      var index1 = dataset1[coin]["date"].indexOf(datelabel);
      var index2 = dataset2[getPair(coin)]["date"].indexOf(datelabel);

      if (index1 > -1) {
        data1.push(dataset1[coin]["data"][index1]);
      } else {
        data1.push(Number.NaN);
      }

      if (index2 > -1) {
        data2.push(dataset2[getPair(coin)]["data"][index2]);
      } else {
        data2.push(Number.NaN);
      }
    });

    return {
      labels,
      data1,
      data2,
    };
  };

  const handleChange = (val) => {
    let valArr = selectedCoins;
    let index = valArr.indexOf(val);
    if (index !== -1) {
      // Delete coin for monitor
      valArr.splice(index, 1);
    } else {
      // Add coin for monitor
      valArr.push(val);
    }
    setSelectedCoins(valArr);
    setChartCards(coinCards());
  };

  const coinCards = () => {
    const charts = [];
    selectedCoins.forEach(function (coin) {
      charts.push(
        <ChartCard
          key={coin}
          chartData={getChartConfigByCoin(coin)}
          pair={getPair(coin)}
          currentPriceData={currentPriceData}
        />
      );
    });

    return charts;
  };

  return (
    <Container fluid="sm">
      <Row>
        <Col>
          <IntroCard title="Help" header="Welcome" />
        </Col>
        <Col>
          {Object.entries(currentData).length > 0 && (
            <ChartCard chartData={chartData} pair="Global" currentPriceData={currentPriceData}/>
          )}
        </Col>
      </Row>

      <Row>
        <Col sm={6}>
          <Card className="mt-4">
            <Card.Header>Updated automatically every minute</Card.Header>
            <Card.Body>
              <Card.Title>
                Cryptos list retrieved from{" "}
                <strong>
                  <a href="https://www.coinbase.com">Coinbase</a>
                </strong>
              </Card.Title>
              <Card.Text>
                {Object.entries(currentData).length > 0 ? (
                  <Table bordered hover variant="dark" responsive>
                    <thead>
                      <tr>
                        <th width="40px"></th>
                        <th width="100px">Crypto</th>
                        <th width="100px">Number tweets</th>
                        <th width="100px">
                          Price ({process.env.REACT_APP_BASE_COIN})
                        </th>
                        <th width="120px">-1m</th>
                        <th width="120px">-5m</th>
                        <th width="120px">-30m</th>
                        <th width="120px">-1h</th>
                        <th width="120px">-3h</th>
                        <th width="120px">-6h</th>
                        <th width="120px">-1d</th>
                        <th width="120px">-3d</th>
                        <th width="120px">-5d</th>
                        {/**<th>Updated</th>*/}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(currentData).map((item, index) => (
                        <tr key={item}>
                          <td>
                            <Form.Check
                              id={item}
                              value={item}
                              type="checkbox"
                              onChange={(e) => handleChange(e.target.value)}
                            />
                          </td>
                          <td
                            className={
                              "cell_background_" +
                              (currentData[item]["1m"].current >
                                currentData[item]["1m"].last &&
                              currentData[item]["1m"].current >
                                currentData[item]["5m"].last &&
                              currentData[item]["1m"].current >
                                currentData[item]["30m"].last
                                ? "green"
                                : "")
                            }
                          >
                            {item.toUpperCase()}
                          </td>
                          <td>{currentData[item]["1m"].current}</td>
                          <td>{currentPriceData[getPair(item)]}</td>
                          <td>
                            {currentData[item]["1m"].last}{" "}
                            <span className="diff_porcentage">
                              ({currentData[item]["1m"].porcentage} %)
                            </span>
                          </td>
                          <td>
                            {currentData[item]["5m"].last}{" "}
                            <span className="diff_porcentage">
                              ({currentData[item]["5m"].porcentage} %)
                            </span>
                          </td>
                          <td>
                            {currentData[item]["30m"].last}{" "}
                            <span className="diff_porcentage">
                              ({currentData[item]["30m"].porcentage} %)
                            </span>
                          </td>
                          <td>
                            {currentData[item]["1h"].last}{" "}
                            <span className="diff_porcentage">
                              ({currentData[item]["1h"].porcentage} %)
                            </span>
                          </td>
                          <td>
                            {currentData[item]["3h"].last}{" "}
                            <span className="diff_porcentage">
                              ({currentData[item]["3h"].porcentage} %)
                            </span>
                          </td>
                          <td>
                            {currentData[item]["6h"].last}{" "}
                            <span className="diff_porcentage">
                              ({currentData[item]["6h"].porcentage} %)
                            </span>
                          </td>
                          <td>
                            {currentData[item]["1d"].last}{" "}
                            <span className="diff_porcentage">
                              ({currentData[item]["1d"].porcentage} %)
                            </span>
                          </td>
                          <td>
                            {currentData[item]["3d"].last}{" "}
                            <span className="diff_porcentage">
                              ({currentData[item]["3d"].porcentage} %)
                            </span>
                          </td>
                          <td>
                            {currentData[item]["5d"].last}{" "}
                            <span className="diff_porcentage">
                              ({currentData[item]["5d"].porcentage} %)
                            </span>
                          </td>
                          {/**<td>{currentData[item].date}</td>*/}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p>Waiting information ... Be patient (1 minute)! </p>
                )}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6}>{chartCards}</Col>
      </Row>
    </Container>
  );
};
