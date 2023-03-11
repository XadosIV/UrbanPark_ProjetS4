import { AccessibilityNew } from "@mui/icons-material"
import { Box, Stack, Typography, Button } from "@mui/material"
import { AppRoutes } from "./AppRoutes"
import { Link } from "react-router-dom";
import React from "react";

export function App() {
	return (
		<Box
			sx={{ padding: 2 }}
		>
			<Stack
				direction="row"
				justifyContent="center"
				alignItems="center"
				spacing={2}

				sx={{
					marginBottom: 2,
				}}
			>


				<AccessibilityNew fontSize="large" />
				<Link to="/">
					<Typography variant="h3">home</Typography>
				</Link>
				<AccessibilityNew fontSize="large" />
				<Link to="/test">
					<Button variant="contained">go test</Button>
				</Link>
				<Link to="/essai">
					<Button variant="contained">go essai</Button>
				</Link>
			</Stack>
			<AppRoutes />
		</Box>
	)
}




// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
