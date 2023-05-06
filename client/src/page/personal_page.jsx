import { useContext, useEffect, useState } from "react";
import { PersoSub, PersoGuardian, PersoAdmin, PersoService, PersonalInfos } from "../components";
import "../css/page-perso.css";
import { ContextUser } from "../contexts/context_user";
import { userFromToken } from "../services";

export function PersonalPage(){
	const { userToken, userId } = useContext(ContextUser);
	const [ roleUser, setRoleUser ] = useState("");

	useEffect(() => {
        async function fetchUserInfos() {
            const resUserToken = await userFromToken(userToken);
            setRoleUser(resUserToken.data[0].role);
            // console.log("token", resUserToken.data[0])
        }
        fetchUserInfos();
    }, [userToken]);

	const persoParRole = () => {
		switch (roleUser) {
			case "Abonné":
				return <PersoSub />;
			case "Gérant":
				return <PersoAdmin />;
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
