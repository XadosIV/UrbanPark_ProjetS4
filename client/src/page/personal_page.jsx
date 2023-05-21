import { useContext } from "react";
import { PersoSub, PersoGuardian, PersoAdmin, PersoService, PersonalInfos } from "../components";
import "../css/page-perso.css";
import { ContextUser } from "../contexts/context_user";

export function PersonalPage(){
	const { userRole, userId } = useContext(ContextUser);

	const persoParRole = () => {
		switch (userRole) {
			case "Abonné":
				return <PersoSub />;
			case "Gérant":
				return <PersoAdmin id={userId}/>;
			case "Gardien":
				return <PersoGuardian id={userId} />;
			case "Agent d'entretien":
				return <PersoService id={userId} />;
			default:
				return null;
		}
	};

	return <div className="container" style={{
			display:"flex",
			flexDirection:"column",
			alignItems:"stretch"
		}}>
		<h1 style={{
			marginLeft:"1.5rem"
		}}>
			Page personnelle
		</h1>
		<PersonalInfos />
		{
			persoParRole()
		}
	</div>
}
