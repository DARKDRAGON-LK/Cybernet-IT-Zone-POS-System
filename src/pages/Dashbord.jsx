import React from "react";
import classNames from "classnames";


// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
} from "reactstrap";

function Dashboard(props) {
  const [bigChartData, setbigChartData] = React.useState("data1");
  const setBgChartData = (name) => {
    setbigChartData(name);
  };
  return (
    <>
      <div className="content">
        <Row>
          <Col xs="12">
            <Card className="card-chart">
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="6">
                    <h5 className="card-category">Total Sales</h5>
                    <CardTitle tag="h2">Performance</CardTitle>
                  </Col>
                  <Col sm="6">
                    <ButtonGroup
                      className="btn-group-toggle float-right"
                      data-toggle="buttons"
                    >
                      <Button
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data1"
                        })}
                        color="info"
                        id="0"
                        size="sm"
                        onClick={() => setBgChartData("data1")}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Last Month
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-single-02" />
                        </span>
                      </Button>
                      <Button
                        color="info"
                        id="1"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data2"
                        })}
                        onClick={() => setBgChartData("data2")}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Last 6 Month
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-gift-2" />
                        </span>
                      </Button>
                      <Button
                        color="info"
                        id="2"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data3"
                        })}
                        onClick={() => setBgChartData("data3")}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Last Year
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-tap-02" />
                        </span>
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Total Profits</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-bell-55 text-info" /> Rs.300,000
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Daily Sales</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-delivery-fast text-primary" />{" "}
                  Rs.3,500
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Total Expences</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-send text-success" /> Rs.10,000
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="12" md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Latest Tranceactions</CardTitle>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Invoice Number</th>
                      <th>Customer Name</th>
                      <th>Payment type</th>
                      <th className="text-center">Ammount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>000102</td>
                      <td>Mr.K.V.P. Thiwanka</td>
                      <td><p className="text-success">Cash</p></td>
                      <td className="text-center">Rs.36,738</td>
                    </tr>
                    <tr>
                      <td>000101</td>
                      <td>Mrs.K.K. Arachchi</td>
                      <td><p className="text-success">Cash</p></td>
                      <td className="text-center">Rs.3,235</td>
                    </tr>
                    <tr>
                      <td>000100</td>
                      <td>Mr.G.H. Danushka</td>
                      <td><p className="text-warning">Card</p></td>
                      <td className="text-center">Rs.10,738</td>
                    </tr><tr>
                      <td>000099</td>
                      <td>Mr.K.V.P. Thiwanka</td>
                      <td><p className="text-success">Cash</p></td>
                      <td className="text-center">Rs.2,000</td>
                    </tr><tr>
                      <td>000098</td>
                      <td>Mr.A.R. Ranaweera</td>
                      <td><p className="text-warning">Card</p></td>
                      <td className="text-center">Rs.50,000</td>
                    </tr><tr>
                      <td>000097</td>
                      <td>Mr.K.V.P. Thiwanka</td>
                      <td><p className="text-success">Cash</p></td>
                      <td className="text-center">Rs.3,738</td>
                    </tr><tr>
                      <td>000096</td>
                      <td>Mr.A.R. Ranaweera</td>
                      <td><p className="text-success">Cash</p></td>
                      <td className="text-center">Rs.6,738</td>
                    </tr><tr>
                      <td>000095</td>
                      <td>Mr.K.V.P. Thiwanka</td>
                      <td><p className="text-warning">Card</p></td>
                      <td className="text-center">Rs.12,738</td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
