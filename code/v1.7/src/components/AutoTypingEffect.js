import React from 'react';

//importing typewriter-effect
import { TypeAnimation } from 'react-type-animation';
import './AutoTypingEffect.css';

function AutoTypingEffect() {
    return (
        <div className="AutoTypingEffect">
            <TypeAnimation
                sequence={[
                    // Same substring at the start will only be typed out once, initially
                    'Apartment',
                    1000, // wait 1s before replacing "Mice" with "Hamsters"
                    'Plaza',
                    1000,
                    'For Rent',
                    1000
                  
                ]}
                wrapper="span"
                speed={10}            
                repeat={Infinity}
            />

        </div>
    );
}

export default AutoTypingEffect;
