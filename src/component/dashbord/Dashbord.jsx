import React, { useState, useEffect, useContext } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sideBar/Sidebar";
import "./Dashbord.css";
import axios from 'axios';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import PaymentIcon from '@mui/icons-material/Payment';
import { AuthContext } from '../AuthProvider/AuthProvider';
import Loader from '../Preloader/Loader';


const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
}));

const Dashbord = () => {
  const [salesRange, setSalesRange] = useState("7days");
  const [TableData, setTableData] = useState([]);
  const [IncomeData, setIncomeData] = useState([]);
  const [SalesData, setSalesData] = useState([]);
  const classes = useStyles();
  const theme = useTheme();
  const { user } = useContext(AuthContext);


  useEffect(() => {
    axios.get('http://localhost:5000/api/recenttransactions')
      .then(response => {
        const data = response.data;
        setTableData(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/chart/income')
      .then(response => {
        setIncomeData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [IncomeData]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/chart/sales')
      .then(response => {
        setSalesData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [SalesData]);



  const combinedData = IncomeData.map(({ Date, Income }) => {
    const { Sales } = SalesData.find(item => item.Date === Date) || {};
    return { Date, Income, Sales };
  });


  const filteredData = () => {
    // console.log(combinedData);
    switch (salesRange) {
      case "7days":
        return combinedData.slice(-7);
      case "30days":
        return combinedData.slice(-30);
      case "1year":
        return combinedData.slice(-365);
      default:
        return combinedData;
    }
  };

  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '1.2rem' }}>
        <div className="loderarea">
          <div className="preloader"><Loader/>
          <p className="Hedding">You must be logged in to view this page.</p></div>
        </div>
      </div>
    );
  }else{
    if (user !== "Admin") {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '1.2rem' }}>
          <div className="loderarea">
            <div className="preloader"><Loader/>
            <p className="Hedding">You Dont have Permission to view this page.</p></div>
          </div>
        </div>
      );
    }else{
    return (

      <div className="Dashbord">
        <div className="row1">
          <Navbar />
        </div>
  
        <div className="column1">
          <Sidebar />
        </div>
  
        <div className="Dashbordmaincontent">
          <p className="heading">Dashboard</p>
          <div className="buttonGroup">
            <div className="btnSection">
              <div className="toggle" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <ToggleButtonGroup
                  value={salesRange}
                  exclusive
                  onChange={(e, value) => setSalesRange(value)}
                  aria-label="sales range"
                >
                  <ToggleButton value="7days" style={{ color: 'white' }}>Last 7 days</ToggleButton>
                  <ToggleButton value="30days" style={{ color: 'white' }}>Last 30 days</ToggleButton>
                  <ToggleButton value="1year" style={{ color: 'white' }}>Last 1 year</ToggleButton>
                </ToggleButtonGroup>
              </div>
            </div>
          </div>
          <div className="areachart-container">
            <div className="column">
              <div className="areachart">
                {filteredData().length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart
                      data={filteredData()}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      title="Income"
                    >
                      <XAxis dataKey="Date" stroke="white" />
                      <YAxis stroke="white" />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="Income" stroke="#82ca9d" fill="#82ca9d" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="title">No data available.</p>
                )}
              </div>
            </div>
            <div className="column">
              <div className="areachart">
                {filteredData().length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart
                      data={filteredData()}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      title="Sales"
                    >
                      <XAxis dataKey="Date" stroke="white" />
                      <YAxis stroke="white" />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="Sales" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="title">No data available.</p>
                )}
              </div>
            </div>
          </div>
          <p className="title">Recent Transactions</p>
          <div className="areatable">
            <ThemeProvider theme={darkTheme}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="sales data">
                  <TableHead>
                    <TableRow>
                      <TableCell>Invoice_No</TableCell>
                      <TableCell >EMP_ID</TableCell>
                      <TableCell >Date</TableCell>
                      <TableCell >Payment Type</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {TableData.map((row) => (
                      <TableRow key={row.Invoice_No}>
                        <TableCell component="th" scope="row">
                          {row.Invoice_No}
                        </TableCell>
                        <TableCell >{row.EMP_ID}</TableCell>
                        <TableCell >{row.Date}</TableCell>
                        <TableCell >
                          {row.Payment_Type === 'Cash' ? <LocalAtmIcon style={{ color: 'green', margin: 4 }} /> : <PaymentIcon style={{ color: 'brown', margin: 4 }} />}
                          {row.Payment_Type}
                        </TableCell>
                        <TableCell align="right">{row.Total}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </ThemeProvider>
          </div>
        </div>
      </div>
  
    );
  }
  }
};

export default Dashbord;