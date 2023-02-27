
/**
 * Wrapper for a repository
 */
export interface Repository {
    url: string, // url
    commits: Commit[], 
}

/**
 * Details of an individual commit
 */
export interface Commit {
    timestamp: number, // timestamp
    changes: FileChange[], // file changes
    author: string, // author
    commitHash: string,
}

/**
 * Details of an individual file change
 */
export interface FileChange {
    type: string, // type 
    file: string, // file + filepath
}


/**
 * Utility to get the file change types 
 * in case the values are changed later down the line
 */
export class Filechangetype {
    static readonly MODIFIED = "M";
    static readonly ADDED = "A";
    static readonly DELETED = "D";
}

export interface RepositoryMetadata {
    url: string,
    branch: string,
    totalCommits: number,
    settings?: Settings,
}

export interface Settings {
    milestones?: Milestone[],
    structures?: Structure[],
}

export interface Milestone {
    commitHash: string, 
    milestone: string,
    commitID: number,
    displayFor?: number,
}

export interface Structure {
    label: string,
    folder: string,
    startCommitHash?: string,
    endCommitHash?: string,
}