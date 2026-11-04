"""Build one clean, platform-labeled ZIP per AIO Story Pipeline skill."""

from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile


ROOT = Path(__file__).resolve().parent
PLATFORMS = ("codex", "claude", "gemini", "chatgpt")


def main() -> None:
    releases = ROOT / "releases"
    releases.mkdir(exist_ok=True)
    for platform in PLATFORMS:
        skill = ROOT / platform / "aio-story-pipeline"
        if not (skill / "SKILL.md").is_file():
            raise FileNotFoundError(f"Missing skill manifest: {skill / 'SKILL.md'}")
        archive = releases / f"aio-story-pipeline-{platform}.zip"
        with ZipFile(archive, "w", ZIP_DEFLATED) as bundle:
            for path in sorted(skill.rglob("*")):
                if not path.is_file():
                    continue
                relative = path.relative_to(skill)
                # Codex UI metadata is irrelevant to Gemini CLI and ChatGPT Skills.
                if platform in {"gemini", "chatgpt"} and relative.parts[0] == "agents":
                    continue
                bundle.write(path, Path("aio-story-pipeline") / relative)
        print(f"Created {archive.relative_to(ROOT)} ({archive.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
