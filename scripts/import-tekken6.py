"""Import the T6 console / Bloodline Rebellion archive from cached source pages.

Requires lxml. See docs/tekken-6-content.md for source URLs and coverage rules.
HTML and FAQ source caches are kept outside the distributable data in .seo-cache/tekken6.
"""
import copy
import json
import pathlib
import re
import subprocess
from lxml import html

ROOT = pathlib.Path(__file__).resolve().parents[1]
CACHE = ROOT / '.seo-cache/tekken6'
OUTPUT = ROOT / 'public/data/tekken-6.json'
def read(name): return (CACHE / name).read_text(encoding='utf-8')
def text(element): return re.sub(r'\s+', ' ', element.text_content().replace('\xa0', ' ')).strip()
def clean(s): return re.sub(r'\s+', ' ', s).strip()
def canonical(s): return re.sub(r'[ /+]', '', s).lower()

SLUGS = {c['name']: c['slug'] for c in json.loads((ROOT/'public/data/tekken-5.json').read_text(encoding='utf-8'))['characters']}
SLUGS.update({'Kuma':'kuma','Panda':'panda','Lili Rochefort':'lili','Roger Jr.':'roger-jr','Alisa Bosconovitch':'alisa-bosconovitch'})
FRAME_IDS = {'alisa':'alisa-bosconovich','bob':'bob-richards','craig':'marduk','deviljin':'devil-jin','jack6':'jack-6','leo':'leo-kliesen','lili':'lili','kuma':'kuma-panda','panda':'kuma-panda','dragunov':'sergei-dragunov'}
NAMES = {'Alisa Boskonovitch':'alisa','Kuma / Panda':'kuma','Leo Kliesen':'leo','Lili De Rochefort':'lili','Mokujin':'mokujin'}

def alternatives(s):
    """Expand archive alternatives without merging independent conditions."""
    s=s.strip()
    # One recurring typo in the TZ basic arts leaves the direction group open.
    s=re.sub(r'^\((u/b_u_u/f)(\+[1-4])', r'(\1)\2', s)
    m=re.search(r'\(([^()]*(?:_[^()]*)+)\)',s)
    if m:
        return [v for option in m[1].split('_') for v in alternatives(s[:m.start()]+option+s[m.end():])]
    # Parentheses around a whole command do not change its execution.
    if s.startswith('(') and s.endswith(')') and s.count('(')==1: s=s[1:-1]
    if '_' in s:
        bits=s.split('_')
        # Shared button suffix in df_d+1, ub_u_uf+4, etc.
        suffix=re.search(r'(\+[1-4].*)$',bits[-1])
        if suffix and all(re.fullmatch(r'(?:[dfub]/?[fb]?|[dfub]{1,2})',b.strip(),re.I) for b in bits[:-1]):
            return [b.strip()+suffix[1] for b in bits[:-1]]+[bits[-1].strip()]
        return [b.strip() for b in bits if b.strip()]
    return [s]

def command(s):
    s=clean(s).replace('−','-').replace('–','-').replace(';',' > ')
    s=re.sub(r'<(?:NEW|UPDATE)>','',s)
    s=s.replace('{B!}', ' B! ').replace('{B!)',' B! ').replace('{CH]','CH ').replace('{CH}', 'CH ')
    s=s.replace('B!', 'bound')
    s=re.sub(r'\{([^}]+)\}',r'(\1)',s)
    s=s.replace('N','n') if s == 'N' else re.sub(r'(?<![A-Za-z])N(?![A-Za-z])','n',s)
    s=re.sub(r'(?<![a-zA-Z])(df|db|uf|ub)(?![a-zA-Z])', lambda m:m[1][0]+'/'+m[1][1],s,flags=re.I)
    s=re.sub(r'(?<![a-zA-Z])ff(?=[,+~ ]|$)','f,f',s,flags=re.I)
    s=re.sub(r'(?<![a-zA-Z])fff(?=[,+~ ]|$)','f,f,f',s,flags=re.I)
    s=re.sub(r'(?<![a-zA-Z])bb(?=[,+~ ]|$)','b,b',s,flags=re.I)
    s=re.sub(r'(?<![a-zA-Z])bf(?=[,+~ ]|$)','b,f',s,flags=re.I)
    s=re.sub(r'(?<![A-Za-z])([DFUB](?:/[DFUB])?)(?![A-Za-z])',lambda m:'~'+m[1].lower(),s)
    s=s.replace('~~','~')
    s=re.sub(r'~([du])/([fb])',r'~\1\2',s)
    s=re.sub(r'(?<=[1-4])~n',',n',s)
    s=re.sub(r'(^|[ ,])~n',r'\1n',s)
    s=re.sub(r'\b(WS|FC|BT|SS|WR)\s*[,+]\s*',r'\1 ',s)
    s=re.sub(r'\b([A-Z]{2,5}),',r'\1 ',s)
    s=re.sub(r'\bEWGF\b','f,n,d,d/f:2',s,flags=re.I)
    s=re.sub(r'\bWGF\b','f,n,d,d/f+2',s,flags=re.I)
    s=re.sub(r'\bcd(?=[,+])','f,n,d,d/f',s,flags=re.I)
    s=re.sub(r'\s*([,:+~])\s*',r'\1',s)
    s=s.replace('*',' (hold)')
    s=s.replace('?',' (hold)')
    s=re.sub(r',?<',r', (delay) ',s)
    s=s.replace('...', ' (repeat)')
    s=re.sub(r'\bAOP\.', 'AOP ',s)
    s=s.replace('DRG ', 'DGN ').replace('ANIMAL ','AKS ').replace('PKB ','PAB ')
    s=s.replace('fn,','f,n,')
    s=re.sub(r'(?<=[1-4])\.(?=[1-4])',',',s)
    s=s.replace('then press', '>').replace('and repeat','(repeat)').replace('any direction','(any direction)')
    s=re.sub(r'(?<=[1-4])n(?=[,+])',',n',s)
    s=re.sub(r'\(hold\)\+',r'(hold) ',s)
    s=s.replace(' (optional (repeat))',' (optional repeat)').replace(' (optional 1 (repeat))',' (optional repeated 1)').replace(' (optional 4 (repeat))',' (optional repeated 4)')
    s=s.replace('Low Parry','(low parry)')
    s=re.sub(r'\b([A-Z]{2,5})\+',r'\1 ',s)
    s=re.sub(r'(^|[ >,])~([1-4])',r'\1(quickly) \2',s)
    s=re.sub(r'\)~([1-4])',r') (quickly) \1',s)
    # Broken optional-bracket punctuation in the source should stay optional.
    if s.count('[')>s.count(']'):s+=']'*(s.count('[')-s.count(']'))
    s=re.sub(r'\[([^]]+)\]',lambda m:'(optional '+m[1].replace('(','').replace(')','')+')',s)
    return clean(s)

def hit_level(s):
    levels={'h':'High','m':'Mid','l':'Low','s':'Special mid','!':'Unblockable'}
    return ' / '.join(levels.get(c.lower(),c) for c in s if c not in '[](), _') if s and s!='-' else ''

def note(row, value):
    value=clean(value)
    if value and value not in row.get('notes',''): row['notes']=clean(row.get('notes','')+' '+value)

def properties(s):
    notes=[]
    for token in s.split():
        core=re.sub(r'\[[^]]*\]','',token)
        hit=re.search(r'\[([^]]+)\]',token)
        suffix=f' (hit {hit[1]})' if hit else ''
        if core=='JG': notes.append('Launches on hit'+suffix+'.')
        if core=='JGc': notes.append('Launches on counter hit'+suffix+'.')
        if core=='JGco': notes.append('Launches only on counter hit'+suffix+'.')
        if core=='B!': notes.append('Bound'+suffix+'.')
        if core=='F!': notes.append('Floor break'+suffix+'.')
        if core=='HA': notes.append('Homing attack'+suffix+'.')
        if core=='TC': notes.append('Crouching evasive frames'+suffix+'.')
        if core=='TJ': notes.append('Airborne evasive frames'+suffix+'.')
    return ' '.join(notes)

def import_moves(c):
    root=html.fromstring(read(c['id']+'.html'))
    for sup in root.xpath('//sup'): sup.drop_tree()
    sections={'moves':[],'throws':[],'chains':[],'stances':[],'unblockables':[],'strings':[],'techniques':[],'combos':[],'wallCombos':[]}
    for tb in root.xpath('//table[@class="medium"]'):
        trs=tb.xpath('.//tr')
        if not trs:continue
        headers=[text(td) for td in trs[0].xpath('./td')]
        if not headers or headers[0]!='Command':continue
        headings=tb.xpath('preceding::h2[1]'); heading=text(headings[0]) if headings else ''
        section='moves'
        if 'Grappling' in heading or 'Throw' in heading: section='throws'
        elif 'Unblockable' in heading:section='unblockables'
        elif 'String Hit' in heading:section='strings'
        group=tb.getparent().get('id','').replace('collapseobj_','')
        footnotes=root.xpath(f'//*[@id="collapseobj_{group}_note"]')
        foot=text(footnotes[0]) if footnotes else ''
        footmap={m[1]:clean(m[2]) for m in re.finditer(r'#(\d+)\s+(.*?)(?=\s+#\d+|$)',foot)}
        stance=''; parents=[]
        for tr in trs[1:]:
            cells=tr.xpath('./td'); values=[text(td) for td in cells]
            if len(values)==1:
                # The stance code is explicitly supplied in the source's group label.
                codes=re.findall(r'(?: - |\s-\s)([A-Z]{2,5})(?:\s*-|\s*$)',values[0])
                if codes: stance=codes[-1]
                continue
            if len(values)<4:continue
            raw=values[0]; name=values[1] if section!='strings' else f'{values[1] or "Preset"} hit string'
            depth=len(cells[0].text_content())-len(cells[0].text_content().lstrip('\xa0 '))
            follow=raw.startswith('=')
            if follow:
                raw=raw.lstrip('= '); name=name.lstrip('= ')
                while parents and parents[-1][0]>=depth:parents.pop()
                if not parents:continue
                raw=parents[-1][1]+','+raw
                if section=='throws': actual='chains'
                else: actual=section
            else:actual=section
            parents.append((depth,raw))
            refs=re.findall(r'#(\d+)',raw+' '+values[-1])
            raw=re.sub(r'\(?#[0-9]+\)?','',raw).strip()
            # Optional continuations remain contextual instead of becoming mandatory inputs.
            inputs=alternatives(raw)
            inputs=[command((stance+' ' if stance and stance!='LFF' else '')+v) for v in inputs]
            if not inputs or not inputs[0]:continue
            row={'name':name, 'input':inputs[0]}
            if len(inputs)>1:row['alternateInputs']=list(dict.fromkeys(inputs[1:]))
            if section=='strings':
                row['damage']=values[2]; row['hitLevel']=hit_level(values[3])
                if values[1].isdigit():row['hits']=int(values[1])
            else:
                if values[3] and values[3]!='-':row['damage']=values[3]
                if section=='throws':
                    position=values[2]
                    if position.lower() in ['left','right','back','air','crouch']:
                        row['input']='('+position.lower()+' throw) '+row['input']
                        if row.get('alternateInputs'):row['alternateInputs']=['('+position.lower()+' throw) '+v for v in row['alternateInputs']]
                    if len(values)>4:
                        if values[4] and values[4] not in ['None','-','System']:row['breakInput']=values[4].replace('_',' or ')
                        elif values[4]=='None':row['unbreakable']=True
                else:
                    level=hit_level(values[4])
                    if level:row['hitLevel']=level
                    if values[2]: note(row,'Ends in '+values[2]+'.')
                if len(values)>5:note(row,properties(values[5]))
            for ref in refs:
                if ref in footmap:note(row,footmap[ref])
            # Non-damaging stance entries belong in the stance section; attacks stay searchable in moves.
            if actual=='moves' and not row.get('damage') and not row.get('hitLevel'):actual='stances'
            row={k:v for k,v in row.items() if v not in ['',None]}
            sections[actual].append(row)
    return sections

FRAME_STANCES={'Single Boot':'SBT','Dual Boot':'DBT','Destroy Form':'DES','Chaos Judgment':'CJM','Back Turned':'BT','Flamingo':'FLA','Muay Thai':'MTS','Sway':'SWY','Relax':'RLX','Handstand':'HSP','Vale Tudo':'VTS','Deity Flight':'FLY','Kempo':'KNP','Shifting Clouds':'STC','Sumo Sit':'SIT','Right Foot Forward':'RFF','Left Flamingo':'LFS','Right Flamingo':'RFS','Sitdown':'SIT','Crouching Demon':'CDS','Spinning Ball':'ROL','Jaguar Step':'JGS','Bear Sit':'SIT','Hunting Bear':'HBS','Dynamic Entry':'DEN','Silent Entry':'SEN','Hitman':'HMS','Mist Step':'MS','Art Of Phoenix':'AOP','Rain Dance':'RDS','Hypnotist':'HYP','Savage':'SAV','Back Sway':'SWY','Flicker':'FLK','Peekaboo':'PAB','Ducking':'DCK','Left Sway':'LWV','Right Sway':'RWV','Albatross':'ALB','Scare Crow':'SCR','Mantis':'MNT','Tarantula':'TRT','Haze':'HAZ','Rocket':'ROC','Animal Kick':'AKS','Evasive Spin':'CES'}

def frame_command(raw,heading):
    # Reject broken machine translations; retain numeric rows with an unambiguous command.
    raw=raw.replace('while standing','WS').replace('while crouching','FC')
    raw=re.sub(r'\b(?:hold|Hold)\b','(hold)',raw)
    words=re.findall(r'[A-Za-z]+',re.sub(r'\([^)]*\)','',raw))
    if any(w.lower() not in ['ws','fc','bt','ss','wr','ch','fff','ff','bb','bf','df','db','uf','ub','f','b','d','u','n','qcf','qcb','hcf','hcb','ewgf','wgf'] for w in words):return []
    if '?' in raw or '{' in raw or '&' in raw:return []
    if 'Frame Data' in heading:prefix=''
    elif heading in FRAME_STANCES:prefix=FRAME_STANCES[heading]+' '
    else:return []
    result=[]
    for inp in alternatives(raw):
        inp=command(inp)
        # Common stance-entry commands shown at the top of a stance table are not attacks from that stance.
        if prefix and not re.fullmatch(r'(?:[dfbu]/?[fb]?\+)?[1-4](?:[+,~:][dfbu/1-4]+)*',inp):continue
        result.append(prefix+inp)
    return result

def import_frames(c):
    frameid=FRAME_IDS.get(c['id'],c['slug'])
    root=html.fromstring(read('frame-'+frameid+'.html'))
    lookup={}
    for section in ['moves','stances','unblockables']:
        for row in c['sections'][section]:
            for inp in [row['input']]+row.get('alternateInputs',[]):lookup.setdefault(canonical(inp),[]).append(row)
    imported=0; skipped=0; conflicts=0
    for table_index,tb in enumerate(root.xpath('//table[contains(@class,"frame-data-table")]')):
        hs=tb.xpath('preceding::h2[1]');heading=text(hs[0]) if hs else ''
        if table_index==0:heading=c['name']+' Frame Data'
        for tr in tb.xpath('.//tr'):
            vals=[text(td) for td in tr.xpath('./td')]
            if len(vals)!=6:continue
            inputs=frame_command(vals[0],heading)
            if not inputs:skipped+=1;continue
            fd={}
            for key,value in zip(['startup','block','hit','counterHit'],vals[2:]):
                value=re.sub(r'\s*~\s*','~',value)
                if value and value not in ['?','+','-']:
                    if key=='startup':
                        m=re.match(r'^(\d+(?:~\d+)?)\b',value)
                        if m and '?' not in value:fd[key]=m[1]
                    else:fd[key]=value
            if not fd:continue
            targets=[]
            for inp in inputs:
                targets.extend(lookup.get(canonical(inp),[]))
            if not targets:
                row={'name':'Move','input':inputs[0],'frameData':fd}
                if len(inputs)>1:row['alternateInputs']=inputs[1:]
                if vals[1]:row['damage']=vals[1]
                if 'startup' not in fd and ',' in inputs[0]:row['frameScope']='Follow-up only'
                c['sections']['moves'].append(row)
                for inp in inputs:lookup.setdefault(canonical(inp),[]).append(row)
                imported+=1
            else:
                for row in {id(r):r for r in targets}.values():
                    if row.get('frameData') and row['frameData']!=fd:conflicts+=1;continue
                    row['frameData']=copy.deepcopy(fd)
                    if 'startup' not in fd and ',' in row['input']:row['frameScope']='Follow-up only'
                    imported+=1
    return {'frameRows':imported,'unmappedFrameRows':skipped,'frameConflicts':conflicts}

def import_sd_frames():
    additions=0;conflicts=[]
    allowed={'Standing','Advancing','Dashing','Poking','Standing to Crouch','While Crouching','While Standing','Jumping','Sidestep','Special Attacks'}
    for file in CACHE.glob('sd-*-frame-data.html'):
        cid=file.stem.removeprefix('sd-').removesuffix('-frame-data')
        if cid=='jack-6':cid='jack6'
        if cid not in byid:continue
        c=byid[cid];lookup={canonical(i):r for r in c['sections']['moves'] for i in [r['input']]+r.get('alternateInputs',[])}
        root=html.fromstring(file.read_text(encoding='utf8'))
        for tb in root.xpath('//table'):
            prev=tb.xpath('preceding-sibling::*[1]')
            if not prev or text(prev[0]) not in allowed:continue
            trs=tb.xpath('.//tr')
            if not trs:continue
            headers=[text(td) for td in trs[0].xpath('./td|./th')]
            if headers[:4]!=['INPUT','RANGE','DMG','SPEED']:continue
            for tr in trs[1:]:
                vals=[text(td) for td in tr.xpath('./td')]
                if len(vals)!=7:continue
                inputs=frame_command(vals[0],c['name']+' Frame Data')
                if not inputs:continue
                fd={}
                for key,value in zip(['startup','block','hit','counterHit'],vals[3:]):
                    value=re.sub(r'\s*~\s*','~',value)
                    if '?' in value or '�' in value or value in ['-','–','']:continue
                    if key=='startup' and not re.fullmatch(r'\d+(?:~\d+)?',value):continue
                    fd[key]=value
                if not fd:continue
                targets=[lookup[canonical(i)] for i in inputs if canonical(i) in lookup]
                if not targets:
                    row={'name':'Move','input':inputs[0]}
                    if len(inputs)>1:row['alternateInputs']=inputs[1:]
                    if re.fullmatch(r'[hmlsSM ,]+',vals[1]):row['hitLevel']=hit_level(re.sub(r'[Ss][Mm]','s',vals[1]))
                    if re.search(r'\d',vals[2]):row['damage']=vals[2]
                    c['sections']['moves'].append(row);targets=[row]
                    for inp in inputs:lookup[canonical(inp)]=row
                for row in {id(r):r for r in targets}.values():
                    existing=row.setdefault('frameData',{})
                    for key,value in fd.items():
                        if key not in existing:existing[key]=value;additions+=1
                        elif key=='startup' and existing[key]!=value:
                            conflicts.append([c['slug'],row['input'],existing[key],value])
                            row['startupAlternatives']=list(dict.fromkeys(row.get('startupAlternatives',[existing[key]])+[value]))
                    if not row.get('hitLevel') and re.fullmatch(r'[hmlsSM ,]+',vals[1]):row['hitLevel']=hit_level(re.sub(r'[Ss][Mm]','s',vals[1]))
                    if 'JG' in fd.get('hit',''):note(row,'Launches on hit.')
    (CACHE/'sd-conflicts.json').write_text(json.dumps(conflicts,indent=2),encoding='utf8')
    return additions

def preferred_punishers():
    root=html.fromstring(read('punishers.html'))
    names={'Alisa':'alisa','Anna':'anna','Armor King':'armorking','Asuka':'asuka','Baek':'baek','Bob':'bob','Bruce':'bruce','Bryan':'bryan','Christie':'christie','Devil Jin':'deviljin','Dragunov':'dragunov','Eddy':'eddy','Feng':'feng','Ganryu':'ganryu','Heihachi':'heihachi','Hwoarang':'hwoarang','Jack-6':'jack6','Jin':'jin','Julia':'julia','Kazuya':'kazuya','King':'king','Kuma':'kuma','Lars':'lars','Law':'marshall','Lee':'lee','Lei':'lei','Leo':'leo','Lili':'lili','Marduk':'craig','Miguel':'miguel','Nina':'nina','Panda':'panda','Paul':'paul','Raven':'raven','Roger Jr':'roger','Steve':'steve','Wang':'wang','Xiaoyu':'ling','Yoshimitsu':'yoshimitsu','Zafina':'zafina'}
    reviewed=set();added=0;skipped=[]
    for tr in root.xpath('//tr'):
        cells=tr.xpath('./td')
        if len(cells)!=4 or text(cells[0]) not in names:continue
        cid=names[text(cells[0])]
        if cid in reviewed:continue
        reviewed.add(cid);c=byid[cid]
        lookup={canonical(inp):r for r in c['sections']['moves'] for inp in [r['input']]+r.get('alternateInputs',[])}
        c['_preferred']=[]
        for cell,window in zip(cells[1:],[10,12,14]):
            # Damage occupies a separate span; use text before that span.
            bold=cell.xpath('./b')
            raw=text(bold[0]) if bold else (cell.text or '').strip()
            if not raw:raw=''.join(cell.itertext()).split('dmg')[0]
            inp=command(raw)
            if inp in [r['input'] for r in c['_preferred']]:continue
            if not DIRECT.fullmatch(inp):skipped.append([cid,inp,'motion or conditional route']);continue
            base=lookup.get(canonical(inp))
            if not base or not base.get('frameData',{}).get('startup'):base=lookup.get(canonical(inp.split(',')[0]))
            startup=base.get('frameData',{}).get('startup','') if base else ''
            if not re.fullmatch(r'\d+(?:~\d+)?',startup):skipped.append([cid,inp,'startup absent']);continue
            frames=max(int(n) for value in [startup]+base.get('startupAlternatives',[]) for n in value.split('~'))
            if frames>window:skipped.append([cid,inp,'source timing conflict']);continue
            c['_preferred'].append({'name':'Punishment string','input':inp,'startupFrames':frames,'position':'standing','launcher':bool(cell.xpath('.//img[contains(@alt,"Juggle")]'))})
            added+=1
    (CACHE/'punisher-skipped.json').write_text(json.dumps(skipped,indent=2),encoding='utf8')
    return added

def faq_sections(filename):
    s=read(filename)
    matches=list(re.finditer(r'^-\s+([A-Z]{1,2})\.\s+(.+?)\s+-$',s,re.M))
    for i,m in enumerate(matches):
        name=m[2].strip(); cid=NAMES.get(name)
        if cid is None:
            cid=next((c['id'] for c in characters if c['name']==name),None)
        if cid:
            yield cid,s[m.end():matches[i+1].start() if i+1<len(matches) else s.find('9. YouTube',m.end()) or len(s)]

def combo_input(s):
    s=re.sub(r'<(?:NEW|UPDATE)>','',s).strip()
    s=re.sub(r'\[([+-]\d+) dmg\]',r'(\1 damage)',s)
    return command(s)

def import_combos():
    for cid,body in faq_sections('combos.txt'):
        if cid not in byid:continue
        c=byid[cid]; chunks=re.split(r'\n\s*\n',body)
        current=None
        for block in chunks:
            lines=[l.strip() for l in block.splitlines() if l.strip() and not re.fullmatch(r'-+',l.strip())]
            if not lines:continue
            if len(lines)>1 and re.fullmatch(r'=+',lines[1]):
                current=re.sub(r'<(?:NEW|UPDATE)>','',lines[0]).strip(); lines=lines[2:]
            if current == 'NOTES' or (current and 'item move combos' in current):continue
            if not current:continue
            if not lines:continue
            routes=[]
            for line in lines:
                if line.startswith('- '):routes.append(line[2:])
                elif routes:routes[-1]+=' '+line
            for route in routes:
                route=re.sub(r'<(?:NEW|UPDATE)>','',route).strip()
                dm=re.search(r'\s+\((\d+)(?:\s*[^)]*)?\)',route)
                damage=dm[1] if dm else None
                if dm:route=route[:dm.start()]+route[dm.end():]
                if current.startswith('Other Launchers'):
                    for inp in alternatives(route):
                        inp=combo_input(inp)
                        if 'CH' in inp or '(' in inp:continue
                        for row in c['sections']['moves']:
                            if canonical(row['input'])==canonical(inp):note(row,'Launches on hit.')
                    continue
                natural=current.startswith('Natural Combos')
                if natural:
                    inp=combo_input(route)
                    # Annotate existing move rows; guaranteed strings inform punishment choices without duplicate combo cards.
                    for row in c['sections']['moves']:
                        if canonical(row['input'])==canonical(inp):
                            row['naturalCombo']='counter-hit' if 'counter hit' in current else 'normal-hit'
                    c.setdefault('_natural',[]).append({'input':inp,'damage':damage,'counter': 'counter hit' in current})
                    continue
                launchers=[combo_input(v) for v in alternatives(current)]
                inp=combo_input(route)
                row={'name':'Juggle follow-up','launchers':launchers,'input':inp}
                if damage:row['reportedDamage']=damage
                if any('damage)' in x for x in launchers):note(row,'Guide damage uses the first launcher; alternate launcher adjustments are shown beside their commands.')
                key=(tuple(launchers),inp)
                if not any((tuple(r.get('launchers',[])),r['input'])==key for r in c['sections']['combos']):c['sections']['combos'].append(row)
        # One entry per shared follow-up, without dropping launcher-specific damage.
        merged={}
        for row in c['sections']['combos']:
            key=(row['input'],row.get('reportedDamage'),row.get('notes'))
            if key in merged:merged[key]['launchers']=list(dict.fromkeys(merged[key]['launchers']+row['launchers']))
            else:merged[key]=row
        c['sections']['combos']=list(merged.values())

def import_hidden():
    counts={}
    for cid,body in faq_sections('hidden.txt'):
        if cid not in byid:continue
        c=byid[cid];count=0
        entries=[]
        for line in body.splitlines():
            if line.startswith('- '):entries.append(line[2:].strip())
            elif entries and line.startswith('  '):entries[-1]+=' '+line.strip()
        for entry in entries:
            entry=re.sub(r'<(?:NEW|UPDATE)>','',entry).strip()
            if not entry or not re.search(r'[1-4]',entry):continue
            if cid=='alisa' and entry.startswith('[DES],'):
                c['sections']['techniques'].append({'name':'Boot stop','input':'f+3+4~b','alternateInputs':['DES f+3+4~b','DES f,f~b'],'notes':'Cancel Boot or Dual Boot with back. The f,f entry applies while in Destroy Form.'})
                count+=1;continue
            descs=re.findall(r'\[([^]]+)\]',entry)
            raw=re.sub(r'\[[^]]+\]','',entry).strip()
            # Plain language conditions are retained as notes, not mistaken for buttons.
            m=re.search(r'\s+(?:on the side|after a floor|has high|on hit|after a successful|after successful|auto-block|when |while |after |does |can )',raw)
            if m:descs.append(raw[m.start():].strip());raw=raw[:m.start()]
            if raw.startswith('Hold '):raw=raw[5:]+' (hold)'
            if raw.startswith('Can do all attacks'):
                c.setdefault('notes',[]).append('Jab attacks can also begin from back turned.');continue
            raw=raw.rstrip(' -')
            raw=raw.replace('Small hop,','(small hop) ')
            inputs=[command(v) for v in alternatives(raw)]
            if not inputs:continue
            target=next((r for sec in c['sections'].values() for r in sec if canonical(r['input'])==canonical(inputs[0])),None)
            detail='; '.join(descs)
            if target:
                if detail:note(target,detail+'.')
            else:
                row={'name':'Hidden technique','input':inputs[0]}
                if len(inputs)>1:row['alternateInputs']=inputs[1:]
                if detail:row['notes']=detail+'.'
                c['sections']['techniques'].append(row)
            count+=1
        counts[cid]=count
    return counts

JAPANESE = {
 '立ち途中に':'WS ', 'しゃがみ状態で':'FC ', 'しゃがんだ状態で':'FC ', '背向け中に':'BT ',
 '横移動中に':'SS ', '横移動':'SS ', 'ブート中に':'SBT ', 'DE中に':'DEN ', 'SE中に':'SEN ',
 '進歩中に':'(during crouch dash) ', '金鶏中に':'KNK ', 'サヴェッジスタンス(SS)中に':'SAV ', 'SS中に':'SAV ',
 'モードスケアクロウ中に':'SCR ', '金打中に':'KIN ', '地雷刃中に':'FLE ', '鳳凰の構え中に':'AOP ',
 '座り中に':'RLX ', '逆立ち中に':'HSP ', 'レフトフラミンゴ中に':'LFS ', 'ライトフラミンゴ中に':'RFS ',
 '右構え中に':'RFF ', 'チャージドラゴン中に':'DSS ', '酔歩中に':'DRU ', '虎の構え中に':'TGR ',
 '妃睡鳥中に':'PNX ', '鶴の構え中に':'CRA ', 'ピーカブースタイル中に':'PAB ', 'フリッカー構え中に':'FLK ',
 'ロングダッキング中に':'(extended duck) ', 'ダッキング中に':'DCK ', 'クイックターン中に':'(quick turn) ',
 'カオスジャッジメント中に':'CJM ', 'フラミンゴ中に':'FLA ', 'バサートスタンス中に':'MTS ', '飛空中に':'FLY ',
 'カウンターヒット':'CH', 'カウンター':'CH', 'クリーンヒット':'clean hit', '初段カウンターヒット':'CH on first hit',
 'しゃがみ状態にヒット':'against crouching', '近距離ヒット':'close hit',
 'タイミングよく':'timed', '少し待って':'delay', '少し待つ':'delay', 'ディレイ':'delay',
 '2発目ディレイ':'delay second hit', '3発目ディレイ':'delay third hit', 'ジャスト':'just frame',
 '前ダッシュ':'dash', 'バックダッシュ':'backdash', '少し歩いて':'walk forward', '少し歩く':'walk forward',
 '右横移動':'SSR', '左横移動':'SSL', 'しゃがむ':'crouch', 'しゃがみ':'crouch', 'くぐる':'cross under',
 '壁やられ・強':'wall splat', '壁際で':'at wall', '壁':'wall', 'ホールド':'hold',
 'レバー8で立ち状態へ':'tap up to stand', '6入力で振り向き':'f to face forward',
 '背向けから4入力で正面向きへ':'b to face forward', '正面へ':'face forward', '下段さばき':'low parry',
 '大ジャンプ中に':'(jump) ', '大ジャンプ':'jump', '無刀ノ極へ':'enter NSS',
 '1、2、3、5発目ヒット':'hits 1,2,3,5 connect', '1、2発目ヒット':'first two hits connect',
 '2、3発目ヒット':'second and third hits connect', '2、3、4発目ヒット':'hits 2,3,4 connect',
 '2発目のみヒット':'second hit connects', '1、3、4発目ヒット':'hits 1,3,4 connect',
 '1、3、4、6発目ヒット':'hits 1,3,4,6 connect', '※パンチボタン連打':'mash punches',
 '逆立ちから6入力で座りへ':'f from HSP to RLX', 'フリッカー構えを1でキャンセル':'cancel FLK with db',
 '構えチェンジローリングライト～ライトフラミンゴ':'stance switch, rolling right kick, RFS',
}

def japanese_input(value,cid):
    value=value.replace('＋','+').replace('(B)',' bound ')
    # Different characters use the same Japanese word for a forward step.
    value=value.replace('ステップ中に',{'bryan':'SLI ','nina':'qcf ','anna':'qcf ','bruce':'f,n,d,d/f '}.get(cid,'(step) '))
    for src,dest in sorted(JAPANESE.items(),key=lambda pair:-len(pair[0])):value=value.replace(src,dest)
    value=re.sub(r'(?<=[PK])(?=SSL|SSR)', ' > ', value)
    value=value.replace('2WP中','BOK ').replace('～',' > ')
    value=re.sub(r'\[([^]]+)\]',r' (\1) ',value)
    value=value.replace('【','{').replace('】','}')
    if re.search(r'[\u3040-\u30ff\u3400-\u9fff]',value):return None
    def buttons(m):
        raw=m[0]; tokens=re.findall(r'[1-9☆]+|LP|RP|WP|LK|RK|WK|[+{}]',raw)
        out='';prev=''
        dirs={'1':'d/b','2':'d','3':'d/f','4':'b','6':'f','7':'u/b','8':'u','9':'u/f','5':'n','☆':'n'}
        btns={'LP':'1','RP':'2','WP':'1+2','LK':'3','RK':'4','WK':'3+4'}
        quick=False;quick_seen=False
        for token in tokens:
            if token=='{':quick=True;quick_seen=False;continue
            if token=='}':quick=False;continue
            if token=='+':out+='+';prev='+';continue
            isdir=token[0].isdigit() or token[0]=='☆'
            v=','.join(dirs[ch] for ch in token) if isdir else btns[token]
            if out and prev!='+':out+=('+' if prev=='direction' and not isdir else '~' if quick and quick_seen and prev=='button' else ',')
            out+=v;prev='direction' if isdir else 'button'
            if quick:quick_seen=True
        return out
    # Restrict conversion to Japanese lever/button chunks; translated annotations are protected.
    parts=re.split(r'(\([^)]*\))',value)
    for i in range(0,len(parts),2):
        parts[i]=re.sub(r'(?<![A-Za-z])(?:[1-9☆]+|LP|RP|WP|LK|RK|WK|[+{}])+(?![A-Za-z])',buttons,parts[i])
    value=''.join(parts)
    value=value.replace(' (dash) ',' f,f ').replace(' (backdash) ',' b,b ')
    value=value.replace('+2 (just frame)',':2')
    value=re.sub(r'([1-4])CH',r'\1 (CH)',value)
    value=re.sub(r'([1-4])(SSL|SSR)',r'\1 > \2',value)
    value=value.replace('d/f+3,28or2 (SSR)', 'd/f+3,2 (cancel to SSR: down on P1, up on P2)')
    value=value.replace('3LKRP8or2 (SSR)', 'd/f+3,2 (cancel to SSR: down on P1, up on P2)')
    return clean(value)

def import_gamewatch():
    aliases={'marduk':'craig','jack':'jack6','devil':'deviljin','xiaoyu':'ling','law':'marshall'}
    conditions={
        ('lars','4'):'Delay the first jab slightly after the launcher while holding forward.',
        ('alisa','3'):'Time SBT 3 carefully: too early whiffs; too late allows a tech roll.',
        ('miguel','4'):'After b+2,2, briefly tap up to stand before d/f+4,1,1.',
        ('bob','1'):'Delay d+2,3 slightly after the launcher to avoid whiffing.',
        ('jin','1'):'Delay the second hit of b+2,1 slightly.',
        ('jin','3'):'Delay the second hit of b+2,1 slightly.',
        ('kazuya','5'):'Delay the third hit of d/f+3,2,1 for the late wall hit.',
        ('lili','4'):'Crouch with d/b or d/f after bound; tapping d instead can sidestep.',
        ('asuka','5'):'Hold d after 2,1,1+2 to recover crouching for WS 1,4.',
        ('king','1'):'Use a small sidestep right immediately after CH b+1 to realign.',
        ('eddy','3'):'Stable with Christie; the same route is less reliable with Eddy.',
        ('law','4'):'After b,f into DSS, return to neutral before each forward-button follow-up.',
        ('baek','3'):'Timing is strict; delay WS 2,1 as needed and confirm that WS 2 connects.',
        ('wang','4'):'Dash as soon as the throw recovery ends.',
        ('nina','1'):'Cancel d/f+3,2 into sidestep right: down on P1, up on P2.',
    }
    count=0;skipped=[]
    for file in CACHE.glob('gamewatch-*.html'):
        root=html.fromstring(file.read_text(encoding='utf-8'))
        for anchor in root.xpath('//a[@name]'):
            cid=aliases.get(anchor.get('name'),anchor.get('name'))
            if cid not in byid:continue
            for sibling in anchor.getparent().getparent().itersiblings():
                if not isinstance(sibling.tag,str):continue
                if sibling.xpath('.//a[@name]'):break
                for line in sibling.text_content().splitlines():
                    if not re.match(r'^\(\d\)',line.strip()) or '。' in line or 'の連続技' in line:continue
                    raw=re.sub(r'^\(\d\)','',line.strip())
                    number=re.match(r'^\((\d)\)',line.strip())[1]
                    inp=japanese_input(raw,cid)
                    if not inp:skipped.append([cid,raw]);continue
                    parts=inp.split(' > ')
                    if len(parts)<2:continue
                    # Stance entry plus launcher belong together, not as a non-attacking launcher.
                    if parts[0] in ['f+3+4','2+3']:
                        parts=[parts[0]+' > '+parts[1]]+parts[2:]
                    row={'name':'Basic juggle','launchers':[parts[0]],'input':' > '.join(parts[1:])}
                    if (cid,number) in conditions:row['notes']=conditions[cid,number]
                    section='wallCombos' if '(wall' in inp or '(at wall)' in inp else 'combos'
                    if section=='wallCombos':row['name']='Wall carry and finish'
                    byid[cid]['sections'][section].append(row);count+=1
    # These pairs have the same documented movesets, but retain their distinct roster portraits.
    for src,dst in [('eddy','christie'),('kuma','panda')]:
        for section in ['combos','wallCombos']:
            extras=[r for r in byid[src]['sections'][section] if r['name'] in ['Basic juggle','Wall carry and finish']]
            byid[dst]['sections'][section].extend(copy.deepcopy(extras));count+=len(extras)
    (CACHE/'gamewatch-skipped.json').write_text(json.dumps(skipped,ensure_ascii=False,indent=2),encoding='utf8')
    return count

DIRECT=re.compile(r'^(?:(WS|FC) )?(?:(?:d/f|d/b|u/f|u/b|f|b|d|u)\+)?[1-4](?:\+[1-4])*(?:,[1-4](?:\+[1-4])*)*$')
def punishers(c):
    lookup={canonical(inp):r for r in c['sections']['moves'] for inp in [r['input']]+r.get('alternateInputs',[])}
    candidates=[]
    for row in c['sections']['moves']:
        if re.search(r'parry|reversal|taunt|stance|push',row['name'],re.I):continue
        inp=row['input']; m=DIRECT.fullmatch(inp)
        if not m or ',' in inp:continue
        fd=row.get('frameData',{}); startup=fd.get('startup','')
        if not re.fullmatch(r'\d+(?:~\d+)?',startup):continue
        frames=max(int(n) for value in [startup]+row.get('startupAlternatives',[]) for n in value.split('~'))
        if row.get('frameScope') or re.match(r'Low|Unblockable',row.get('hitLevel','')):continue
        if not row.get('hitLevel') and re.match(r'(FC )?d(?:/b)?\+',inp):continue
        launcher='Launches on hit.' in row.get('notes','')
        if frames>18 and not launcher:continue
        damage=sum(map(int,re.findall(r'\d+',row.get('damage','0'))))
        candidate={'name':row['name'],'input':inp,'startupFrames':frames,'position':'crouching' if m[1] else 'standing','launcher':launcher,'_damage':damage}
        if row.get('startupAlternatives'):candidate['notes']='Uses the slower reported startup where the references differ.'
        if c['slug']=='yoshimitsu' and inp=='1+4':candidate['notes']='Very short range: only punish when the opponent remains close enough for Flash.'
        candidates.append(candidate)
    for natural in c.get('_natural',[]):
        if natural['counter'] or not DIRECT.fullmatch(natural['input']):continue
        inp=natural['input']; opening=inp.split(',')[0]; base=lookup.get(canonical(opening))
        if not base or re.match(r'Low|Unblockable',base.get('hitLevel','')):continue
        startup=base.get('frameData',{}).get('startup','')
        if not re.fullmatch(r'\d+(?:~\d+)?',startup):continue
        frames=max(int(n) for value in [startup]+base.get('startupAlternatives',[]) for n in value.split('~'))
        if frames>18:continue
        candidates.append({'name':'Natural combo','input':inp,'startupFrames':frames,'position':'crouching' if inp.startswith(('WS ','FC ')) else 'standing','_damage':int(natural['damage'] or 0)})
    # Use a compact strongest-damage option at each startup; retain an alternative launcher where it matters.
    chosen={}
    for r in sorted(candidates,key=lambda r:(not r.get('launcher',False),-r['_damage'])):
        chosen.setdefault((r['position'],r['startupFrames']),r)
    for row in c.get('_preferred',[]):chosen[row['position'],row['startupFrames']]=dict(row,_damage=0)
    result=[]
    for r in sorted(chosen.values(),key=lambda r:(r['position'],r['startupFrames'])):
        del r['_damage'];result.append(r)
    return result

roster=json.loads(read('roster.json'))
characters=[]
for item in sorted(roster,key=lambda c:c['name']):
    c=dict(item);c['slug']=SLUGS.get(c['name'],re.sub(r'[^a-z0-9]+','-',c['name'].lower()).strip('-'))
    c['portrait']={'image':'/characters/tekken-6/'+c['slug']+'.webp','fit':'cover'}
    c['sections']=import_moves(c)
    characters.append(c)
byid={c['id']:c for c in characters}
coverage={c['slug']:import_frames(c) for c in characters}
sd_count=import_sd_frames()
import_combos()
hidden_counts=import_hidden()
gamewatch_count=import_gamewatch()
preferred_count=preferred_punishers()
for c in characters:
    c['sections']['punishers']=punishers(c)
    # Exact duplicate commands are combined only inside one section; throw context stays intact.
    for section,rows in c['sections'].items():
        if section in ['combos','punishers']:continue
        seen={}
        for row in rows:
            key=canonical(row['input'])
            if key in seen:
                old=seen[key]
                for k,v in row.items():
                    if k=='notes':note(old,v)
                    elif k not in old:old[k]=v
            else:seen[key]=row
        c['sections'][section]=list(seen.values())
    coverage[c['slug']].update({'moves':len(c['sections']['moves']),'comboRoutes':len(c['sections']['combos']),'hiddenEntriesReviewed':hidden_counts.get(c['id'],0),'punishers':len(c['sections']['punishers'])})
    c.pop('_natural',None)
    c.pop('_preferred',None)
    for row in c['sections']['moves']:
        if row.get('startupAlternatives'):
            note(row,'Startup reports differ: '+', '.join(row['startupAlternatives'])+' frames. Punishment uses the slower value.')
    if not c['sections']['combos']:c.setdefault('notes',[]).append('This archive has moves, launchers and punishment timings; a complete juggle route is not documented here yet.')
    c.pop('id')
characters.append({'slug':'mokujin','name':'Mokujin','mimic':True,'portrait':{'image':'/characters/tekken-6/mokujin.webp','fit':'cover'},'sections':{},'notes':['Mokujin borrows another fighter’s moveset each round. Use that fighter’s guide; body size can change combo consistency.']})
# Preserve artwork chosen independently of the source data importer.
if OUTPUT.exists():
    prior=json.loads(OUTPUT.read_text(encoding='utf-8'))
    portraits={c['slug']:c.get('portrait') for c in prior['characters']}
    for c in characters:
        if portraits.get(c['slug']):c['portrait']=portraits[c['slug']]
if (CACHE/'portraits.json').exists():
    portraits=json.loads(read('portraits.json'))
    for c in characters:
        if c['slug'] in portraits:c['portrait']=portraits[c['slug']]
data={'schemaVersion':1,'gameId':'tekken-6','title':'Tekken 6','edition':'Console / Bloodline Rebellion','tagline':'The sixth King of Iron Fist Tournament.','source':{'label':'Tekken 6 move, frame and combo archive','note':'Console / Bloodline Rebellion data. Punishment options use documented startup and normal-hit strings; range and input timing still matter. Blank frames remain unknown. Parenthesized opening hits in combo starters must miss. Guide damage is reported, not recalculated.'},'portraits':{'credit':'Bandai Namco character artwork, preserved by Creative Uncut.','sourceUrl':'https://www.creativeuncut.com/art_tekken-6_a.html'},'characters':sorted(characters,key=lambda c:c['name'])}
# Ambiguous source typos never become executable buttons or fabricated frame matches.
inputs=list({inp for c in characters for rows in c['sections'].values() for row in rows for inp in [row['input']]+row.get('alternateInputs',[])+row.get('launchers',[])})
checker="import {parseInputNotation} from './src/utils/inputNotation.js'; let s=''; for await(const c of process.stdin)s+=c; console.log(JSON.stringify(JSON.parse(s).filter(i=>parseInputNotation(i).some(t=>t.kind==='text'))));"
result=subprocess.run(['node','--input-type=module','-e',checker],input=json.dumps(inputs),text=True,encoding='utf8',capture_output=True,cwd=ROOT,check=True)
invalid=set(json.loads(result.stdout));excluded=[]
for c in characters:
    for section,rows in c['sections'].items():
        keep=[]
        for row in rows:
            if row['input'] in invalid:
                excluded.append({'character':c['slug'],'section':section,'input':row['input']});continue
            for key in ['alternateInputs','launchers']:
                if key in row:
                    row[key]=[v for v in row[key] if v not in invalid]
                    if not row[key]:row.pop(key)
            keep.append(row)
        c['sections'][section]=keep
    c['sections'].get('combos',[]).sort(key=lambda r:0 if r['name']=='Basic juggle' else 1)
    # The FAQ and supplemental basics occasionally describe exactly the same route.
    seen_routes=set()
    for section in ['combos','wallCombos']:
        keep=[]
        for row in c['sections'].get(section,[]):
            launchers=[]
            for launcher in row.get('launchers',['']):
                route=canonical(launcher+'>'+row['input']).replace('>',',').replace('bound','')
                if route not in seen_routes:launchers.append(launcher);seen_routes.add(route)
            if launchers:
                row['launchers']=launchers;keep.append(row)
        if section in c['sections']:c['sections'][section]=keep
(CACHE/'excluded-commands.json').write_text(json.dumps(excluded,ensure_ascii=False,indent=2),encoding='utf8')
OUTPUT.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(CACHE/'coverage.json').write_text(json.dumps(coverage,indent=2)+'\n',encoding='utf-8')
stats={'characters':len(characters),'rows':sum(len(rows) for c in characters for rows in c['sections'].values()),'frameRows':sum(bool(r.get('frameData')) for c in characters for rows in c['sections'].values() for r in rows),'combos':sum(len(c['sections'].get('combos',[])) for c in characters),'wallCombos':sum(len(c['sections'].get('wallCombos',[])) for c in characters),'hiddenEntriesReviewed':sum(v['hiddenEntriesReviewed'] for v in coverage.values()),'punishers':sum(len(c['sections'].get('punishers',[])) for c in characters),'preferredStrings':sum(r['name']=='Punishment string' for c in characters for r in c['sections'].get('punishers',[])),'excludedMalformedCommands':len(excluded),'sdAddedFrameFields':sd_count}
(CACHE/'stats.json').write_text(json.dumps(stats,indent=2),encoding='utf8')
print(json.dumps(stats,indent=2))
