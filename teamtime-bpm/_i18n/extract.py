import re, json, sys
CYR=re.compile('[А-Яа-яЁё]')
TAG=re.compile(r'(<(?!/?b\b|br\b)[^>]*>)')
ATTR=re.compile(r'\b(alt|title|aria-label|content)="([^"]*)"')
def segments(html):
    out=[]
    for tok in TAG.split(html):
        if tok.startswith('<') and not re.match(r'</?b\b|<br',tok):
            for m in ATTR.finditer(tok):
                if CYR.search(m.group(2)): out.append(m.group(2))
        elif CYR.search(tok):
            out.append(' '.join(tok.split()))
    return out
if __name__=='__main__':
    segs=[]
    for f in sys.argv[1:]:
        h=open(f).read()
        h=re.sub(r'<!--.*?-->','',h,flags=re.S)
        for s in segments(h):
            if s not in segs: segs.append(s)
    json.dump(segs,open(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)),'segments.json'),'w'),ensure_ascii=False,indent=0)
    for i,s in enumerate(segs): print(i,s)
