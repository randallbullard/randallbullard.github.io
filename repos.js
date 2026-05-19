const GITHUB_USERNAME = "randallbullard";

const LANG_COLORS = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    Java: "#b07219",
    "C#": "#178600",
    Go: "#00ADD8",
    Rust: "#dea584",
    Ruby: "#701516",
    PHP: "#4F5D95",
    Shell: "#89e051",
    HTML: "#e34c26",
    CSS: "#563d7c",
    C: "#555555",
    "C++": "#f34b7d",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    Dart: "#00B4AB",
    Dockerfile: "#384d54",
    HCL: "#844FBA",
    PowerShell: "#012456",
};

async function fetchRepos() {
    const container = document.getElementById("repos-container");

    try {
        const response = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`
        );

        if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status}`);
        }

        const repos = await response.json();
        const publicRepos = repos.filter((r) => !r.fork);

        if (publicRepos.length === 0) {
            container.innerHTML = '<p class="no-repos">No public repositories found.</p>';
            return;
        }

        container.innerHTML = publicRepos
            .map((repo) => {
                const lang = repo.language;
                const langDot = lang
                    ? `<span><span class="lang-dot" style="background:${LANG_COLORS[lang] || "#888"}"></span>${lang}</span>`
                    : "";

                const stars = repo.stargazers_count
                    ? `<span>&#9733; ${repo.stargazers_count}</span>`
                    : "";

                const description = repo.description
                    ? `<p>${escapeHtml(repo.description)}</p>`
                    : "<p>No description provided.</p>";

                return `
                    <div class="repo-card">
                        <h3><a href="${repo.html_url}" target="_blank" rel="noopener">${escapeHtml(repo.name)}</a></h3>
                        ${description}
                        <div class="repo-meta">
                            ${langDot}
                            ${stars}
                        </div>
                    </div>
                `;
            })
            .join("");
    } catch (err) {
        container.innerHTML = `<p class="no-repos">Unable to load repositories. <a href="https://github.com/${GITHUB_USERNAME}?tab=repositories" target="_blank" rel="noopener">View on GitHub</a></p>`;
    }
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

fetchRepos();
