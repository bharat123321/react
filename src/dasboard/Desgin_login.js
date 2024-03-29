import Nav_bar from '../navbar_design/Nav_bar';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function Desgin_login() {

    return (
        <>
             
            <Card style={{ margin: '0px 10% 0px' }}>
                <Card.Header>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ cursor: 'pointer' }}>Notes</h4>
                        <h5 style={{ cursor: 'pointer' }}><img src="./image/threedot.png" 
                        style={{width:"30px"}}/></h5>
                    </div>
                </Card.Header>
                <Card.Body>
                 <Card.Img variant="bottom" src="./logo192.png" style={{ width: "40%", margin: "auto", display: "block" }}/>
                 <br/>
                    <Button variant="primary">Go somewhere</Button>
                </Card.Body>

                <Card.Footer className="text-muted">2 days ago</Card.Footer>
            </Card>
        </>
    )
}

export default Desgin_login;
