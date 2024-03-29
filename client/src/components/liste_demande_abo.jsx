import React, { useEffect, useState } from 'react';
import { GetDemandeAbo } from '../services';
import { DemandeAbo } from './demande_abo';

export function ListeDemandeAbo(){

    const [ listeDemande, setListeDemande ] = useState(new Array(0));
    const [ upListeAbo, setUpListeAbo ] = useState(false);
    const updateDemande =  () => {
        setUpListeAbo(!upListeAbo);
    }

    useEffect(() => {
        async function fetchDemandeAbo(){
            let resDemandeAbo = await GetDemandeAbo();
            setListeDemande(resDemandeAbo);
        }
        fetchDemandeAbo();
    }, [upListeAbo])

    const makeKey = (id1, id2) => {
        return parseInt("" + id1 + id2);
    }

    const affListeDemande = () => {
        if(listeDemande.length === 0){
            return <li className='demande-abo-user'><div className="main-content">
                    <h2>Aucune demande d'abonnement en attente</h2>
                </div></li>
        }else{
            return listeDemande.map((demande, index) => {
                return <DemandeAbo infos={demande} key={makeKey(index, demande.id)} up={updateDemande} />
            })
        }
    }

    return (
        <div className='div-liste-demande'>
            <h1 className='title-demande'> Demandes d'abonnement </h1>
            <ul className='demande-liste'>
                { affListeDemande() }
            </ul>
        </div>
    );
};

