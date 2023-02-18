import { VariableDataProps } from "./VisualisationVariableManager";

export interface ScheduledChange {
    ticksUntilChange: number,
    applyChange: (props: VariableDataProps) => void,
    repeating?: boolean,
}

export class ScheduledChangesManager {

    private delayedChanges: ScheduledChange[] = [];

    applyAllChanges(props: VariableDataProps) {
        this.delayedChanges.forEach(change => {
            change.applyChange(props);
        })
        this.delayedChanges = [];
    }

    addDelayedChange(change: ScheduledChange) {
        this.delayedChanges.push(change);
    }

    removeChange(change: ScheduledChange) {
        const index = this.delayedChanges.indexOf(change);
        this.delayedChanges.splice(index, 1);
    }

    updateScheduledChanges(props: VariableDataProps) {
        [...this.delayedChanges].forEach(change => {
            change.ticksUntilChange--;
            if (change.repeating || change.ticksUntilChange <= 0) {
                change.applyChange(props);
            }

            if (change.ticksUntilChange <= 0) {
                this.removeChange(change);
            }


        })
    }

}

export default new ScheduledChangesManager();
