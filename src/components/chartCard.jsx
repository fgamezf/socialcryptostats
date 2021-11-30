import { Card } from "react-bootstrap";
import { LineChart } from "./chart";

export const ChartCard = ({ chartData, pair, currentPriceData }) => {
  return (
    <Card className="mt-4">
      <Card.Header>{pair}</Card.Header>
      <Card.Body>
        <Card.Title>
         {pair}
        </Card.Title>
        <Card.Text>
          {currentPriceData[pair] &&
          <h5 className="currentPrice">Current price: {currentPriceData[pair]} {process.env.REACT_APP_BASE_COIN}</h5>
          }
          <LineChart chartData={chartData} />
        </Card.Text>
      </Card.Body>
    </Card>
  );
};
