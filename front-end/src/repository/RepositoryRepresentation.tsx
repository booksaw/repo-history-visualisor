
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
    milestone?: string, // milestone
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
