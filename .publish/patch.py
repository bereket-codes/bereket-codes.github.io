import hashlib
import pathlib
import sys

EDITS = [
    (
        "then revisit it as a dashboard that shows every dollar already assigned.",
        "then revisit it as a dashboard that shows every birr already assigned.",
    ),
    (
        '<p class="text-white-50 mb-4 mx-auto" data-reveal style="--d:240ms;max-width:460px;line-height:1.75">I\'m currently open to freelance projects, collaborations, and full-time opportunities. Let\'s build something great.</p>',
        '<p class="text-white-50 mb-4 mx-auto" data-reveal style="--d:240ms;max-width:460px;line-height:1.75">Open to freelance work and full-time roles. Email is the fastest way to reach me.</p>',
    ),
    (
        '<div class="container"><p class="mb-0">&copy; <span id="year">2026</span> Bereket Tadesse. Built with passion &amp; precision.</p></div>',
        '<div class="container"><p class="mb-0">&copy; <span id="year">2026</span> Bereket Tadesse. Hand-built, no build step.</p></div>',
    ),
]

EXPECTED = "563d05219d4929b27fb017b4803b79c3be473b614823fe304b44e92cad8e8ade"
FILES = ["index.html"]

for name in FILES:
    path = pathlib.Path(name)
    text = path.read_text(encoding="utf-8")
    for old, new in EDITS:
        count = text.count(old)
        if count != 1:
            sys.exit("%s: expected 1 match, found %d for %r" % (name, count, old[:70]))
        text = text.replace(old, new)
    path.write_bytes(text.encode("utf-8"))

for name in FILES:
    digest = hashlib.sha256(pathlib.Path(name).read_bytes()).hexdigest()
    print(name, digest)
    if digest != EXPECTED:
        sys.exit("%s: hash mismatch" % name)

print("copy edit verified")
