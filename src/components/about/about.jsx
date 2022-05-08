import React from 'react';
import { useParams } from 'react-router';

const About = () => {
    let {id} = useParams()

    const backToHome = () => {
         
    }

    return (
        <div>
            <h1>about id : {id}</h1>
            <button onClick={backToHome}>back</button>
        </div>
    );
}

export default About;
