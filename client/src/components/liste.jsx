import React, { useEffect } from "react";

export function Liste(element, funct, list) {

	return (<div style={{display:"flex", flexWrap:"wrap", justifyContent:"center"}}>
		<ul style={{minWidth:"60%", maxWidth:"100%"}}>
			{
				list.map((info, index) => (
					<li onClick={funct} style={{backgroundColor:"red", listStyle:"none"}}>
						{element(info)}
					</li>
				))
			}
		</ul>
		<div id="container" style={{backgroundColor:"blue", maxWidth:"30%", transitionDuration:"0.5s"}}></div>
	</div>)
}