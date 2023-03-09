import './App.css';

function App() {
	function GetData(){
		fetch("http://localhost:3000/api/stuff")
			.then((res) => {res.json(); console.log(res)})
			.then(data => {
				console.log(data);
				return(
					<div id="DATA">
						DATA :
						<ul>
							{data ? data.map(item => {return <li>{item[0]}</li>}) : "no-data"}
						</ul>
					</div>
				);
			})
			.catch(error => {
				return(
					<div id="ERROR">
						ERROR :
						<ul>
							{error ? error.map(item => {return <li>{item[0]}</li>}) : "no-data"}
						</ul>
					</div>
				);
			})
	}
	return(
		<div className="App">
			ALED
			{GetData()}
		</div>
	);
}
	
export default App;