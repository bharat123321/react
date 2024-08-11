import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import { Link} from 'react-router-dom';
function Index() {
  return (
    <CardGroup>
      <Card className="card-spacing" as={Link} to="/imgtotext">
        <Card.Img variant="top" src="holder.js/100px160" />
        <Card.Body>
          <Card.Title style={{textAlign:"center"}}>Convert Image to Text</Card.Title>
          <p>Converting an image to text using (OCR) involves extracting textual content from images 
          </p>
        </Card.Body>
      </Card>
      
      <Card className="card-spacing" as={Link} to="/imgtoword">
        <Card.Img variant="top" src="holder.js/100px160" />
        <Card.Body>
          <Card.Title>Image To Word</Card.Title>
          <Card.Text>
            This card has supporting text below as a natural lead-in to
            additional content.{' '}
          </Card.Text>
        </Card.Body>
         
      </Card>
      <Card className="card-spacing" as={Link} to="/pdftoword">
        <Card.Img variant="top" src="holder.js/100px160" />
        <Card.Body>
          <Card.Title>Pdf To Word</Card.Title>
          <Card.Text>
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This card has even longer content than the
            first to show that equal height action.
          </Card.Text>
        </Card.Body>
      </Card>
    </CardGroup>
  );
}

export default Index;