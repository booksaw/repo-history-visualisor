import { FileData, DirectoryData } from "../components/NetworkDiagram";
import { ContributorProps } from "../components/RepositoryVisualiser";
import { Vector } from "../utils/MathUtils";
import { ContributorDisplayConstants } from "../visualisation/VisualisationConstants";
import { VariableDataProps } from "./VisualisationVariableManager";


export class ContributorManager {

    getCommitContributorLocation(changes: FileData[], nodes: DirectoryData[],): Vector {

        let totx = 0;
        let toty = 0;
        let tot = 0;

        changes.forEach(change => {
            const dirs = nodes.filter(d => d.name === change.directory);
            if (dirs.length !== 1) {
                return;
            }
            const dir = dirs[0];

            if (dir.x !== undefined && dir.y !== undefined) {
                totx += dir.x;
                toty += dir.y;
                tot++;
            }
        })

        if (tot === 0) {
            return new Vector(0, 0);
        }

        return new Vector(totx / tot, toty / tot);
    }

    getContributorMoveFunction(author: string, changePerTick: Vector) {
        return (props: VariableDataProps) => {
            const contributor = props.contributors.value[author];
            contributor.x += changePerTick.x;
            contributor.y += changePerTick.y;
        }
    }

    calculateChangePerTick(location: Vector, contributor: ContributorProps, contributorMovementTicks: number): Vector {
        const changePerTick = Vector.subtract(location, new Vector(contributor.x - (ContributorDisplayConstants.profileWidth / 2), contributor.y - (ContributorDisplayConstants.profileWidth / 2)));
        changePerTick.scale(1 / (contributorMovementTicks * 1.2));
        return changePerTick;
    }


}

export default new ContributorManager();