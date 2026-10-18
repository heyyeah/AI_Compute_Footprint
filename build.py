#!/usr/bin/env python3
"""Bundle the page into single files.

dist/standalone.html  - one self-contained HTML file to open or share anywhere
dist/artifact.html    - body-only version for publishing as a Claude artifact
                        (the artifact host adds its own <html>/<head>/<body>)
"""
from pathlib import Path
import re

root = Path(__file__).parent
html = (root / "index.html").read_text(encoding="utf-8")
css = (root / "assets/styles.css").read_text(encoding="utf-8")
model = (root / "data/model.js").read_text(encoding="utf-8")
app = (root / "assets/app.js").read_text(encoding="utf-8")

title = re.search(r"<title>.*?</title>", html, re.S).group(0)
fonts = re.search(r'<link rel="stylesheet" href="https://fonts.googleapis.com[^>]*>', html).group(0)
body = html.split("<!--BODY-START-->")[1].split("<!--BODY-END-->")[0]
scripts = f"<script>\n{model}\n</script>\n<script>\n{app}\n</script>\n"

(root / "dist").mkdir(exist_ok=True)

artifact = f"{title}\n{fonts}\n<style>\n{css}\n</style>\n{body}\n{scripts}"
(root / "dist/artifact.html").write_text(artifact, encoding="utf-8")

standalone = re.sub(r'<link rel="stylesheet" href="assets/styles\.css[^"]*">', lambda m: f"<style>\n{css}\n</style>", html)
standalone = re.sub(r'<script src="data/model\.js[^"]*"></script>\n<script src="assets/app\.js[^"]*"></script>\n', lambda m: scripts, standalone)
(root / "dist/standalone.html").write_text(standalone, encoding="utf-8")
print("wrote dist/artifact.html and dist/standalone.html")
