
/**
 * Wrapper for a repository
 */
export interface Repository {
    u: string, // url
    commits: Commit[], 
}

/**
 * Details of an individual commit
 */
export interface Commit {
    t: number, // timestamp
    c: FileChange[], // file changes
}

/**
 * Details of an individual file change
 */
export interface FileChange {
    t: string, // type 
    f: string, // file + filepath
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
