import base64
import requests
import yaml
import os
from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
MY_GITHUB_USERNAME = os.getenv("MY_GITHUB_USERNAME")

HEADERS = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json",
}


def get_my_repos():
    repos = []
    page = 1

    while True:
        url = (
            "https://api.github.com/user/repos"
            "?affiliation=owner"
            "&per_page=100"
            f"&page={page}"
        )

        response = requests.get(url, headers=HEADERS)
        response.raise_for_status()

        batch = response.json()

        if not batch:
            break

        repos.extend(batch)
        page += 1

    return repos


def get_project_demo(owner, repo):
    path = ".github/project-demo.yml"

    url = f"https://api.github.com/repos/" f"{owner}/{repo}/contents/{path}"

    response = requests.get(url, headers=HEADERS)

    if response.status_code == 404:
        return None

    response.raise_for_status()

    data = response.json()

    content = base64.b64decode(data["content"]).decode("utf-8")

    return yaml.safe_load(content)


def main():
    repos = get_my_repos()

    print(f"Found {len(repos)} repositories owned by {MY_GITHUB_USERNAME}\n")

    for repo in repos:
        owner = repo["owner"]["login"]
        repo_name = repo["name"]

        print("=" * 80)
        print(f"Repository: {owner}/{repo_name}")

        try:
            metadata = get_project_demo(owner, repo_name)

            if metadata is None:
                print("project-demo.yml not found")
                continue

            print("project-demo.yml found:")
            print(metadata)

        except Exception as e:
            print(f"Error: {e}")


if __name__ == "__main__":
    main()
