from __future__ import annotations
from html.parser import HTMLParser
from pathlib import Path
from PIL import Image
import subprocess, re, hashlib, base64, json

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
                expected = {
                    "profile-v3-256.jpg": (256, 256),
                    "favicon-32-v4.png": (32, 32),
                    "apple-touch-icon-v4.png": (180, 180),
                    "icon-192-v4.png": (192, 192),
                    "icon-512-v4.png": (512, 512),
                }.get(path.name)
                if expected and im.size != expected:
                    raise AssertionError(f"Wrong dimensions for {path.name}: {im.size}, expected {expected}")

def check_manifest():
    manifest=json.loads((ROOT/"site.webmanifest").read_text(encoding="utf-8"))
    expected={
        "/assets/icon-192-v4.png": "192x192",
        "/assets/icon-512-v4.png": "512x512",
    }
    actual={item.get("src"):item.get("sizes") for item in manifest.get("icons", [])}
    if actual != expected:
        raise AssertionError(f"Unexpected manifest icons: {actual}")
    for path in expected:
        if not (ROOT/path.lstrip("/")).exists():
            raise AssertionError(f"Manifest icon is missing: {path}")

def check_security():
    index=(ROOT/"index.html").read_text(encoding="utf-8")
    js=(ROOT/"assets/link-bio-v3.js").read_text(encoding="utf-8")
    analytics_js=(ROOT/"assets/analytics-v1.js").read_text(encoding="utf-8")
    css=(ROOT/"assets/link-bio-v3.css").read_text(encoding="utf-8")
    privacy=(ROOT/"privacy.html").read_text(encoding="utf-8")
    analytics=(ROOT/"ANALYTICS.md").read_text(encoding="utf-8")

    forbidden_runtime=[
        "ipapi.co", "unsafe-eval", "unsafe-inline",
        "mt-analytics-endpoint", "mt-context-endpoint",
        "fetchCountry", "contextEndpoint", "workers.dev",
        "cloudflare.com", "cloudflareinsights.com", "/cdn-cgi/"
    ]
    for item in forbidden_runtime:
        if item in index or item in js or item in analytics_js or item in privacy:
            raise AssertionError(f"Forbidden runtime dependency/security token present: {item}")

    if "background-attachment:fixed" in css.replace(" ",""):
        raise AssertionError("Fixed background attachment must not be used")
    if "tr-brand.js" in index or "visual-refresh.css" in index:
        raise AssertionError("Legacy visual/localization runtime still referenced")
    if "profile-v3-256.jpg" not in index:
        raise AssertionError("Verified v3 profile asset is not wired")
    if "analytics-v1.js" not in index:
        raise AssertionError("Analytics runtime is not wired")
    if "https://counterapi.com" not in index or "counterapi.com/api" not in analytics_js:
        raise AssertionError("CounterAPI runtime/CSP configuration is incomplete")
    if "https://api.ipapi.is" not in index or "https://api.ipapi.is" not in js:
        raise AssertionError("IP-country runtime/CSP configuration is incomplete")
    if "window.mtLanguageReady" not in js or "window.mtLanguageReady" not in analytics_js:
        raise AssertionError("Analytics does not wait for automatic language resolution")
    if '{ capture: true }' not in analytics_js:
        raise AssertionError("Language-switch analytics is vulnerable to observer ordering")
    if "Anonymous metrics" not in index:
        raise AssertionError("UI privacy status does not disclose anonymous metrics")
    if "ipapi.is" not in privacy or "connection IP" not in privacy:
        raise AssertionError("IP-country privacy disclosure is incomplete")
    if "public/no-auth" not in analytics.lower():
        raise AssertionError("Analytics integrity risk is not documented")

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
    check_images(); check_manifest(); check_security()
    subprocess.run(["node","--check",str(ROOT/"assets/link-bio-v3.js")], check=True)
    subprocess.run(["node","--check",str(ROOT/"assets/analytics-v1.js")], check=True)
    print("Link Bio validation passed")

if __name__=="__main__": main()
