class Keyboard {

    constructor() {

    	document.addEventListener("keydown", this.keydown.bind( this ) );

    	this.targets = [];

    	this.targetIndex = 0;

    	this.target = null;

    }

    keydown( e ) {

        console.log( e.keyCode );

        // CTRL
        if ( e.keyCode == 17) {

        	if ( this.targets.length > 0 ) {
        		this.targetIndex++;

        		if ( this.targetIndex == this.targets.length ) {
        			this.targetIndex = 0;
        		}

        		this.target = this.targets[ this.targetIndex ];
        	}

        }
        
        switch( e.keyCode ) {

        	case 13: // ENTER
        		this.target.position.z -= 1;
        		console.log( "position.z:", this.target.position.z);
        	break; 
        	case 32: // SPACE
        		this.target.position.z += 1;
        		console.log( "position.z:", this.target.position.z);
        	break;
        	case 38: // UP
        		this.target.position.y += 1;
        		console.log( "position.y:", this.target.position.y);
        	break; 
        	case 40: // DOWN
        		this.target.position.y -= 1;
        		console.log( "position.y:", this.target.position.y);
        	break;
        	case 37: // LEFT
        		this.target.position.x -= 1;
        		console.log( "position.x:", this.target.position.x);
        	break; 
        	case 39: // RIGHT
        		this.target.position.x += 1;
        		console.log( "position.x:", this.target.position.x);
        	break;
        	case 65: // A
        		this.target.rotation.z -= 1;
        		console.log( "rotation.z:", this.target.rotation.z);
        	break; 
        	case 69: // E
        		this.target.rotation.z += 1;
        		console.log( "rotation.z:", this.target.rotation.z);
        	break;
        	case 90: // Z
        		this.target.rotation.y -= 1;
        		console.log( "rotation.y:", this.target.rotation.y);
        	break; 
        	case 83: // S
        		this.target.rotation.y += 1;
        		console.log( "rotation.y:", this.target.rotation.y);
        	break;
        	case 81: // Q
        		this.target.rotation.x -= 1;
        		console.log( "rotation.x:", this.target.rotation.x);
        	break; 
        	case 68: // D
        		this.target.rotation.x += 1;
        		console.log( "rotation.x:", this.target.rotation.x);
        	break;

        }

    }

    addObject( object ) {

    	this.targets.push( object );

    	if ( this.targets.length == 1 ) {
    		this.target = this.targets[ this.targetIndex ];
    	}
    }

}

export { Keyboard };