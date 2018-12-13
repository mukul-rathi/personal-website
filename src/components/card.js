import React from 'react'
import SocialButton from './social-button';
import LinkButton from './link-button';
import TextContent from './text-content';

const Card  = (props) => {
    //display social/link button only if defined
    return(
        <div>
            <h3> {props.title}</h3>
            {props.img && <SocialButton href={props.img.href} img={props.img.src} alt={props.img.alt}/> }
            
            {props.button &&  <LinkButton href={props.button.href}> {props.button.text} </LinkButton>}
            
            <TextContent>
                {props.children}
            </TextContent>
        </div>
    );
}

export default Card;