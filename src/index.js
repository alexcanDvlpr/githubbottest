const Octokit = require("@octokit/rest");

const octokit = new Octokit({
    auth: "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",
});

async function main() {
    // Get the repository name and owner
    const { repository } = context.payload;
    const { name: repoName, owner: { login: repoOwner } } = repository;

    // Get all the pull requests for the repository
    const { data: pullRequests } = await octokit.pulls.list({
        repo: repoName,
        owner: repoOwner
    });

    // Iterate over each pull request
    for (let pullRequest of pullRequests) {
        // Check if the pull request is open and if the head branch is the one you want to check
        if (pullRequest.state === "open" && pullRequest.head.ref === "main") {
            // Get the list of commits for the pull request
            const { data: commits } = await octokit.pulls.listCommits({
                repo: repoName,
                owner: repoOwner,
                pull_number: pullRequest.number
            });

            // Iterate over each commit
            for (let commit of commits) {
                // Check if the commit message includes the word "fix"
                if (commit.commit.message.toLowerCase().includes("fix")) {
                    // Post a comment on the pull request
                    octokit.issues.createComment({
                        repo: repoName,
                        owner: repoOwner,
                        issue_number: pullRequest.number,
                        body: "Este es el comentario creado por GithubActions"
                    });
                }
            }
        }
    }
}