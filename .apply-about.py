from pathlib import Path

path = Path("index.html")
html = path.read_text()

replacements = [
    (
        '.about-lead{font-size:1.28rem;font-weight:700;line-height:1.45;letter-spacing:-.01em;color:var(--text);margin:0 0 .9rem;max-width:56ch}\n',
        '',
    ),
    (
        'data-reveal style="--d:80ms">How I<br>build</h2>',
        'data-reveal style="--d:80ms">Hello, I\'m<br>Bereket</h2>',
    ),
    (
        '                <p class="about-lead" data-reveal style="--d:240ms">Hello, I\'m Bereket.</p>\n',
        '',
    ),
    (
        "                    I'm a <strong>junior full stack developer</strong> in Addis Ababa and a Computer Science graduate\n"
        "                    from <strong>Unity University</strong> (Class of 2026). I build with React and Next.js on the front\n"
        "                    end, Node and Express on the server, and SQL for the data.",
        "                    A <strong>junior full stack developer</strong> in Addis Ababa and a Computer Science graduate from\n"
        "                    <strong>Unity University</strong> (Class of 2026). I build with React and Next.js on the front end,\n"
        "                    Node and Express on the server, and SQL for the data.",
    ),
]

for old, new in replacements:
    found = html.count(old)
    if found != 1:
        raise SystemExit(f"expected one match, found {found}: {old[:60]!r}")
    html = html.replace(old, new)

path.write_text(html)
print("index.html updated")
