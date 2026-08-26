from __future__ import annotations
from html.parser import HTMLParser
from pathlib import Path
from PIL import Image
import subprocess, re, hashlib, base64

ROOT = Path(__file__).resolve().parents[1]

class RefParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.refs=[]
    def handle_starttag(self, tag, attrs):
        d=dict(attrs)
        for key in ("src","href"):
            v=d.get(key)
            if v and not v.startswith(("http://","https://","mailto:","#","intent:","vnd.","instagram:","snssdk", "data:")):
                self.refs.append((tag,key,v.split("?",1)[0].split("#",1)[0]))
        if tag=="img" and d.get("srcset"):
            for part in d["srcset"].split(","):
                v=part.strip().split()[0].split("?",1)[0]
                self.refs.append((tag,"srcset",v))

def resolve(html:Path, ref:str)->Path:
    if ref.startswith("/"):
        return ROOT/ref.lstrip("/")
    return (html.parent/ref).resolve()

def check_html(path:Path):
    p=RefParser(); p.feed(path.read_text(encoding="utf-8"))
    for _,_,ref in p.refs:
        if not ref or ref=="/": continue
        target=resolve(path,ref)
        if not target.exists():
            raise AssertionError(f"Missing asset referenced by {path.relative_to(ROOT)}: {ref}")

def check_images():
    for path in ROOT.glob("assets/*"):
        if path.suffix.lower() in {".png",".jpg",".jpeg",".webp"}:
            with Image.open(path) as im:
                im.verify()
            with Image.open(path) as im:
                if im.width < 32 or im.height < 32:
                    raise AssertionError(f"Suspiciously small image: {path}")
                expected = {"profile-v3-256.jpg": (256, 256)}.get(path.name)
                if expected and im.size != expected:
                    raise AssertionError(f"Wrong dimensions for {path.name}: {im.size}, expected {expected}")

def check_security():
    index=(ROOT/"index.html").read_text(encoding="utf-8")
    js=(ROOT/"assets/link-bio-v3.js").read_text(encoding="utf-8")
    css=(ROOT/"assets/link-bio-v3.css").read_text(encoding="utf-8")
    forbidden=["counterapi.com","ipapi.co","unsafe-eval","unsafe-inline"]
    for item in forbidden:
        if item in index or item in js or item in (ROOT/"privacy.html").read_text(encoding="utf-8") or item in (ROOT/"404.html").read_text(encoding="utf-8"):
            raise AssertionError(f"Forbidden runtime dependency/security token present: {item}")
    if "background-attachment:fixed" in css.replace(" ",""):
        raise AssertionError("Fixed background attachment must not be used")
    if "tr-brand.js" in index or "visual-refresh.css" in index:
        raise AssertionError("Legacy visual/localization runtime still referenced")
    if "profile-v3-256.jpg" not in index:
        raise AssertionError("Verified v3 profile asset is not wired")
    if js.index("wireEvents();") > js.index("await chooseInitialLanguage()"):
        raise AssertionError("Navigation is wired after geolocation; first-tap race can return")
    if 'if (!isFallbackReturn)' not in js:
        raise AssertionError("Fallback return de-duplication is missing")
    match = re.search(r'<script type="application/ld\+json">(.*?)</script>', index, re.S)
    if not match:
        raise AssertionError("JSON-LD block is missing")
    digest = "sha256-" + base64.b64encode(hashlib.sha256(match.group(1).encode()).digest()).decode()
    if digest not in index:
        raise AssertionError("CSP hash does not match the JSON-LD block")
    legacy=(ROOT/"youtube-app-opener/index.html").read_text(encoding="utf-8")
    if "requestedVideoId" in legacy or "watch?v=" in legacy or "params.get(\"v\")" in legacy:
        raise AssertionError("Legacy video-ID routing logic remains")

def main():
    for html in [ROOT/"index.html", ROOT/"404.html", ROOT/"privacy.html", ROOT/"youtube-app-opener/index.html"]:
        check_html(html)
    check_images(); check_security()
    subprocess.run(["node","--check",str(ROOT/"assets/link-bio-v3.js")], check=True)
    print("Link Bio validation passed")

if __name__=="__main__": main()
