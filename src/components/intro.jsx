import { Card } from "react-bootstrap";

export const IntroCard = ({ title, header }) => {
  return (
    <Card className="mt-4">
      <Card.Header>{header}</Card.Header>
      <Card.Body>
        <Card.Title>
         {title}
        </Card.Title>
        <Card.Text >
            <ul>
            <li>Now you can easily <strong>monitor your cryptocurrencies</strong> and anticipate whale marketing.</li>
            <li>If your cryptocurrency <strong>appears green</strong>, there is noise on Twitter.</li>
            <li>Select one or more cryptocurrencies to display a graph of the number of tweets per minute in real time.</li>
            </ul>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};
