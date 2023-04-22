

export interface VisualisationSpeedOptions {
    ticksToProgress: number,
    displayChangesFor: number,
    contributorMovementTicks: number,
}

export class SpeedOptions {
    public static readonly MANUAL: VisualisationSpeedOptions = {
        ticksToProgress: -1,
        displayChangesFor: 100,
        contributorMovementTicks: 50,
    };

    public static readonly SLOW: VisualisationSpeedOptions = {
        ticksToProgress: 300,
        displayChangesFor: 150,
        contributorMovementTicks: 100,
    };

    public static readonly NORMAL: VisualisationSpeedOptions = {
        ticksToProgress: 200,
        displayChangesFor: 100,
        contributorMovementTicks: 50,
    };

    public static readonly FAST: VisualisationSpeedOptions = {
        ticksToProgress: 60,
        displayChangesFor: 30,
        contributorMovementTicks: 20,
    };

    public static readonly VERYFAST: VisualisationSpeedOptions = {
        ticksToProgress: 7,
        displayChangesFor: 3,
        contributorMovementTicks: 3,
    }


    public static getSpeedFromString(speed?: string) {
        switch (speed) {
            case "SLOW":
                return SpeedOptions.SLOW;
            case "FAST":
                return SpeedOptions.FAST;
            case "MANUAL":
                return SpeedOptions.MANUAL;
            case "VERYFAST":
                return SpeedOptions.VERYFAST;
            default:
                return SpeedOptions.NORMAL;
        }
    }

    public static getStringFromVisSpeed(visSpeed:  VisualisationSpeedOptions) {
        switch(visSpeed){
            case SpeedOptions.MANUAL:
                return "MANUAL"
            case SpeedOptions.SLOW:
                return "SLOW";
            case SpeedOptions.FAST:
                return "FAST";
            case SpeedOptions.VERYFAST:
                return "VERYFAST";
            default:
                return "NORMAL"
        }
    }
}