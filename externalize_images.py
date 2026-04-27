import re
import os
import base64

path = 'script.js'
text = open(path, 'r', encoding='utf-8').read()
start = text.find('const IMG = {')
if start == -1:
    raise SystemExit('IMG object not found')
end = text.find('};', start)
if end == -1:
    raise SystemExit('IMG object end not found')
obj_text = text[start:end+2]
pattern = re.compile(r'\s*(\w+):\s*"(data:image/(?:jpeg|png);base64,[^\"]+)"\s*,?')
entries = pattern.findall(obj_text)
print('start', start)
print('end', end)
print('obj len', len(obj_text))
print('found entries', len(entries))
for key, data_url in entries:
    print(key, data_url[:30])
    m = re.match(r'data:image/(jpeg|png);base64,(.+)', data_url)
    if not m:
        raise SystemExit('Bad data URL for ' + key)
    ext = 'png' if m.group(1) == 'png' else 'jpeg'
    b64 = m.group(2)
    out_dir = 'imagens'
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f'{key}.{ext}')
    with open(out_path, 'wb') as f:
        f.write(base64.b64decode(b64))
replacement_lines = ['const IMG = {']
for key, data_url in entries:
    ext = 'png' if data_url.startswith('data:image/png') else 'jpeg'
    replacement_lines.append(f'  {key}: "imagens/{key}.{ext}",')
replacement_lines.append('};')
replacement_text = '\n'.join(replacement_lines)
new_text = text[:start] + replacement_text + text[end+2:]
open(path, 'w', encoding='utf-8').write(new_text)
print('Updated script.js with external image paths')
