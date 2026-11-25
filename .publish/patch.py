import hashlib
import pathlib
import sys

EDITS = [
    (
        '<meta name="description" content="Frontend developer in Addis Ababa building fast, accessible interfaces in HTML, CSS, JavaScript and React. Open to freelance and full-time roles.">',
        '<meta name="description" content="Frontend developer in Addis Ababa, going full-stack. I build fast, accessible interfaces in HTML, CSS, JavaScript and React. Open to freelance and full-time roles.">',
    ),
    (
        '<meta property="og:description" content="Frontend developer in Addis Ababa. I build fast, accessible interfaces in HTML, CSS, JavaScript and React.">',
        '<meta property="og:description" content="Frontend developer in Addis Ababa, going full-stack. I build fast, accessible interfaces in HTML, CSS, JavaScript and React.">',
    ),
    (
        '<meta name="twitter:description" content="Frontend developer in Addis Ababa. Fast, accessible interfaces in HTML, CSS, JavaScript and React.">',
        '<meta name="twitter:description" content="Frontend developer in Addis Ababa, going full-stack. Fast, accessible interfaces in HTML, CSS, JavaScript and React.">',
    ),
    (
        '>Frontend developer in Addis Ababa. I build React and vanilla-JavaScript interfaces that hold up outside the demo \u2014 accessible, responsive, and checked on a real phone before I call it done.</p>',
        '>Frontend developer in Addis Ababa, going full-stack. I build React and vanilla-JavaScript interfaces that hold up outside the demo.</p>',
    ),
    (
        'deep focus on frontend development. I build interfaces',
        "deep focus on frontend development, and I'm now working toward full-stack, starting with HabeshaCart. I build interfaces",
    ),
    (
        '<strong>Now</strong><span>Open to freelance projects and full-time frontend roles</span>',
        '<strong>Now</strong><span>Open to freelance projects and full-time work \u00b7 frontend now, full-stack next</span>',
    ),
]

EXPECTED = "f5ca43e9558e8328bb1a22401fd154195acf9f34e2ee0f4d05eb30a1bd7950e3"
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
