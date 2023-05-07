import React, { useEffect, useState } from 'react';
import { GetDemandeAbo } from '../services';
import { DemandeAbo } from './demande_abo';

export function ListeDemandeAbo(){

    const [ listeDemande, setListeDemande ] = useState(new Array(0));

    useEffect(() => {
        async function fetchDemandeAbo(){
            let resDemandeAbo = await GetDemandeAbo();
            // console.log("resDemnadeAbo", resDemandeAbo);
            setListeDemande(resDemandeAbo.data);
        }
        fetchDemandeAbo();
    }, [])

    const affListeDemande = () => {
        if(listeDemande.length === 0){
            return <li> aucune demande d'abonnement en attente </li>
        }else{
            return listeDemande.map((demande, index) => {
                return <DemandeAbo infos={demande} key={index} />
            })
        }
    }

    return (
        <div className='div-liste-demande'>
            <h1 className='title-demande'> Demandes d'Abonnement </h1>
            <ul className='demande-liste'>
                { affListeDemande() }
            </ul>
        </div>
    );
};

