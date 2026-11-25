import hashlib
import pathlib
import sys

EDITS = [
    (
        "deep focus on frontend development, and I'm now working toward full-stack, starting with HabeshaCart. I build interfaces that are fast, accessible and visually\n                    refined \u2014 and I care as much about the millisecond a hover takes to settle as about the layout grid.",
        "deep focus on frontend development, and I'm now working toward full-stack, starting with HabeshaCart.\n                    I build interfaces that are quick to load, work with a keyboard, and don't break when the content grows.",
    ),
    (
        "A great website isn't just about looking good \u2014 it's about making the user feel at home instantly.",
        "If a page needs explaining, the design isn't finished.",
    ),
    (
        "I care most about the unglamorous parts: validating input before it reaches the screen, handling\n                    loading and error states so a page never looks broken, keeping the code small enough to reason\n                    about, and not shipping anything that leaks what it shouldn't. Every project here is deployed and\n                    clickable \u2014 I'd rather ship something small and finished than something large and half-working.",
        "Most of the work I care about is invisible: checking input before it reaches the screen, handling\n                    loading and error states so a page never looks broken, and keeping the code small enough that I can\n                    still explain it. Everything here is deployed and clickable. I'd rather finish something small than\n                    half-finish something bigger.",
    ),
]

EXPECTED = "4c42465e9a433150d7c9181e864c47149927bed070e3736cb472fc528a910fc5"
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
