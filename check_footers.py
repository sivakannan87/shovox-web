import glob
import re

for f in sorted(glob.glob(r'd:\Shovox\shovox web\*.html')):
    with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
        text = fp.read()
    m = re.findall(r'<footer.*?</footer>', text, flags=re.DOTALL)
    for footer in m:
        links = re.findall(r'<a\s+[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', footer, flags=re.DOTALL)
        clean_links = [(href, re.sub(r'<[^>]+>', '', t).strip()) for href, t in links]
        print(f'=== {f} ===')
        for h, t in clean_links:
            print(f'   {t} -> {h}')
