export class Keyboard {
    keys = {};
    update(key, state) {
        if (state) {
            this.keys[key] = true;
        }
        else {
            delete this.keys[key];
        }
    }
    onKeyDown(event) {
        if ('Tab'  === event.key) {return;}
        this.update(event.key, true);
    }
    onKeyUp(event) {
        this.update(event.key, false);
    }
};

export class Mouse {
    left = false;
    middle = false;
    right = false;
    position = {x: 0, y: 0};
    delta = {x: 0, y: 0};
    update(event, state) {
        if (0 === event.button) {
            this.left = state;            
        }
        if (1 === event.button) {
            this.middle = state;            
        }
        if (2 === event.button) {
            this.right = state;            
        }
    }
    onMouseDown(event) {
        this.update(event, true);
    }
    onMouseUp(event) {
        this.update(event, false);
    }   
    onMouseMove(event) {
        this.delta.x = event.movementX;
        this.delta.y = event.movementY;
        this.position.x = event.clientX;
        this.position.y = event.clientY;
    }   
};
