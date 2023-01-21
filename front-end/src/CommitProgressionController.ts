


export function createTickFunction(ticksToProgress: number, addCommit: () => void) {
    let currentTicks = 0;
    const tick = function() {
        if(ticksToProgress === -1){
            return;
        }

        currentTicks++; 
        if(currentTicks >= ticksToProgress) {
            addCommit();
            currentTicks = 0;
        }
    }

    return tick;
}