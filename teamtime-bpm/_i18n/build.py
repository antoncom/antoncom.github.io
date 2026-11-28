"""Собирает языковые версии /xx/index.html из /ru/index.html по таблицам перевода xx.py."""
import re, sys, json, importlib.util

import os
HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(HERE)
CYR = re.compile('[А-Яа-яЁё]')
TAG = re.compile(r'(<(?!/?b\b|br\b)[^>]*>)')
ATTR = re.compile(r'\b(alt|title|aria-label|content)="([^"]*)"')

LANGS = {
    #       og:locale  makarenko  дополнительный шрифт Google Fonts
    'en': ('en_US', 'en', None),
    'de': ('de_DE', 'de', None),
    'es': ('es_ES', 'es', None),
    'hi': ('hi_IN', 'hi', 'Noto+Sans+Devanagari:wght@400;500;600;700'),
    'zh': ('zh_CN', 'zh', 'Noto+Sans+SC:wght@400;500;600;700'),
    'ko': ('ko_KR', 'ko', 'Noto+Sans+KR:wght@400;500;600;700'),
}

def norm(s): return ' '.join(s.split())

def build(lang):
    spec = importlib.util.spec_from_file_location(lang, os.path.join(HERE, f'{lang}.py'))
    mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
    src = open(f'{SITE}/ru/index.html').read()
    src = re.sub(r'<!--.*?-->', '', src, flags=re.S)
    segs = json.load(open(os.path.join(HERE, 'segments.json')))
    assert len(mod.T) == len(segs), (lang, len(mod.T), len(segs))
    tr = dict(zip(segs, mod.T))
    out = []
    for tok in TAG.split(src):
        if tok.startswith('<') and not re.match(r'</?b\b|<br', tok):
            def rep(m):
                v = m.group(2)
                if CYR.search(v):
                    v = tr[norm(v)].replace('"', '&quot;')
                    v = re.sub(r'</?b>|<br>', '', v)
                return f'{m.group(1)}="{v}"'
            # не трогаем названия языков в переключателе
            out.append(tok if 'lang-switch' in tok else ATTR.sub(rep, tok))
        elif CYR.search(tok):
            key = norm(tok)
            lead = tok[:len(tok) - len(tok.lstrip())]; trail = tok[len(tok.rstrip()):]
            out.append(lead + tr[key] + trail)
        else:
            out.append(tok)
    html = ''.join(out)
    locale, mk, font = LANGS[lang]
    html = html.replace('<html lang="ru">', f'<html lang="{lang}">')
    html = html.replace('content="ru_RU"', f'content="{locale}"')
    html = html.replace('assets/img/logo-teamtime.png', 'assets/img/logo-teamtime-en.png')
    html = html.replace('https://antoncom.github.io/makarenko/ru/', f'https://antoncom.github.io/makarenko/{mk}/')
    html = html.replace('<summary>RU</summary>', f'<summary>{lang.upper()}</summary>')
    html = html.replace('lang="ru" class="current"', 'lang="ru"').replace(f'href="../{lang}/" lang="{lang}"', f'href="../{lang}/" lang="{lang}" class="current"')
    if font:
        html = html.replace('&display=swap', f'&family={font}&display=swap', 1)
    # проверка: кириллица допустима только в названии «Русский»
    left = [l for l in html.splitlines() if CYR.search(l) and 'Русский' not in l]
    assert not left, (lang, left[:3])
    os.makedirs(f'{SITE}/{lang}', exist_ok=True)
    open(f'{SITE}/{lang}/index.html', 'w').write(html)
    print(lang, 'ok', len(html))

if __name__ == '__main__':
    for l in (sys.argv[1:] or list(LANGS)): build(l)
