"""Build compact SVG paths from State of Maryland MD iMAP generalized boundaries.
Input: GeoJSON query in EPSG:3857, maxAllowableOffset=350 metres.
Source: https://mdgeodata.md.gov/imap/rest/services/Boundaries/MD_PhysicalBoundaries/FeatureServer/1
"""
import json, re, sys
from pathlib import Path
j=json.loads(Path(sys.argv[1]).read_text())
rings=[]
for f in j['features']:
 g=f['geometry']; polygons=[g['coordinates']] if g['type']=='Polygon' else g['coordinates']
 rings.extend(r for p in polygons for r in p)
pts=[p for r in rings for p in r]
x0=min(p[0] for p in pts); x1=max(p[0] for p in pts); y0=min(p[1] for p in pts); y1=max(p[1] for p in pts)
scale=920/(x1-x0)
items=[]
for f in j['features']:
 name=f['properties']['county']; id=re.sub(r"[.'’]",'',name.lower()).replace(' ','-')
 if id=='baltimore': id='baltimore-county'
 g=f['geometry']; polygons=[g['coordinates']] if g['type']=='Polygon' else g['coordinates']
 path=' '.join('M'+' L'.join(f'{(p[0]-x0)*scale+30:.1f},{(y1-p[1])*scale+30:.1f}' for p in ring)+' Z' for poly in polygons for ring in poly)
 items.append({'id':id,'name':name,'path':path})
Path('src/data/boundaries.json').write_text(json.dumps({'viewBox':f'0 0 980 {(y1-y0)*scale+60:.1f}','source':'https://mdgeodata.md.gov/imap/rest/services/Boundaries/MD_PhysicalBoundaries/FeatureServer/1','attribution':'State of Maryland, MD iMAP, SHA, DoIT. Generalized for display; not for surveying.','counties':items},separators=(',',':'))+'\n')
print('Wrote',len(items),'county boundaries')
