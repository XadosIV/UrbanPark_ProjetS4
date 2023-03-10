import './App.css';
import React from 'react';

function App() {
	const [error, setError] = React.useState(null);
	const [isLoaded, setIsLoaded] = React.useState(false);
	const [items, setItems] = React.useState([]);
	
	// Remarque : le tableau vide de dépendances [] indique
	// que useEffect ne s’exécutera qu’une fois, un peu comme
	// componentDidMount()
	React.useEffect(() => {
		fetch("http://localhost:3001/api/stuff")
		.then(res => res.json())
		.then(
			(result) => {
				setIsLoaded(true);
				setItems(result);
			},
			// Remarque : il faut gérer les erreurs ici plutôt que dans
			// un bloc catch() afin que nous n’avalions pas les exceptions
			// dues à de véritables bugs dans les composants.
			(error) => {
				setIsLoaded(true);
				setError(error);
			}
		)
	}, [])
		
	if (error) {
		return <div>Erreur : {error.message}</div>;
	} else if (!isLoaded) {
		return <div>Chargement...</div>;
	} else {
		return (
			<ul>
			{items.map(item => (
				<li key={item._id}><ul>
					{Object.keys(item).map(key => (
						<li key={key}>{item[key]}</li>
					))}
				</ul></li>
			))}
			</ul>
		);
	}
}

export default App;