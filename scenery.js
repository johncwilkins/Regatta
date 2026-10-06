import * as THREE from './vendor/three.module.js';
export function addYachtClub(scene){
 const club=new THREE.Group();club.name='Island Heights Yacht Club · stylized';club.position.set(170,0,-170);
 const mat=color=>new THREE.MeshStandardMaterial({color,roughness:.85});const shingle=mat(0x9c9386),trim=mat(0xece2c9),roof=mat(0x485c50),wood=mat(0x806548),glass=mat(0x344e5b);
 const box=(w,h,d,x,y,z,m)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);club.add(o);return o};
 const shore=new THREE.Mesh(new THREE.CylinderGeometry(48,52,1.5,48),mat(0x6c8250));shore.scale.z=.65;shore.position.set(0,.15,13);club.add(shore);
 box(38,1.2,24,0,1,0,wood);box(29,9,17,0,6,3,shingle);
 const top=new THREE.Mesh(new THREE.ConeGeometry(22,5,4),roof);top.rotation.y=Math.PI/4;top.scale.z=.65;top.position.set(0,13,3);club.add(top);
 box(36,.65,5,0,6,-8,trim);box(36,.4,5,0,2,-8,trim);
 for(let x=-17;x<=17;x+=4.25){box(.3,4, .3,x,4,-10,trim);box(.28,3,.28,x,8,-10,trim)}
 for(const y of [6.4,9.4]){box(36,.22,.22,0,y,-10,trim);box(36,.18,.18,0,y-1,-10,trim)}
 for(let x=-12;x<=12;x+=4){box(2.2,2.4,.18,x,8, -5.6,glass);box(2.5,.16,.25,x,9.3,-5.8,trim);box(.12,2.4,.25,x,8,-5.8,trim)}
 box(4,.7,31,12,.9,-26,wood);for(let z=-38;z<-11;z+=6)box(.4,2,.4,14,0,z,wood);
 const pole=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,17,8),trim);pole.position.set(-21,9,-9);club.add(pole);
 const flag=new THREE.Mesh(new THREE.PlaneGeometry(4,2,16,4),new THREE.MeshBasicMaterial({color:0xd94243,side:THREE.DoubleSide}));flag.position.set(2,0,0);const flagPivot=new THREE.Group();flagPivot.name='Yacht club wind flag';flagPivot.position.set(-21,16,-9);flagPivot.add(flag);club.add(flagPivot);club.userData.windFlag=flagPivot;
 for(let i=0;i<5;i++){const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.5,.7,6,6),wood);trunk.position.set(-30+i*14,3,26);club.add(trunk);const tree=new THREE.Mesh(new THREE.ConeGeometry(5,11,7),mat(0x355d3d));tree.position.set(-30+i*14,10,26);club.add(tree)}
 scene.add(club);return club;
}
export function createPuffVisuals(scene){
 const geometry=new THREE.PlaneGeometry(2,2);geometry.rotateX(-Math.PI/2);
 const puffs=Array.from({length:12},()=>{const material=new THREE.MeshBasicMaterial({color:0x003858,transparent:true,opacity:.2,depthWrite:false,side:THREE.DoubleSide,stencilWrite:true,stencilRef:1,stencilFunc:THREE.NotEqualStencilFunc});material.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>','diffuseColor.a *= 1.0-smoothstep(0.12,0.5,length(vMapUv-vec2(0.5)));\n#include <opaque_fragment>');};
 // A tiny white map enables the standard UV varying for the soft edge.
 const map=new THREE.DataTexture(new Uint8Array([255,255,255,255]),1,1);map.needsUpdate=true;material.map=map;
 const mesh=new THREE.Mesh(geometry,material);mesh.renderOrder=2;scene.add(mesh);return mesh});
 return patches=>patches.forEach((p,i)=>{const mesh=puffs[i];mesh.position.set(p.x,.09,p.z);mesh.scale.set(p.radiusX,1,p.radiusZ);mesh.rotation.y=-p.angle;mesh.material.opacity=.21+.16*p.power});
}

export function addCommitteeBoat(scene){
 const root=new THREE.Group();root.name='Committee boat';
 const navy=new THREE.MeshStandardMaterial({color:0x173f62,roughness:.4}),cream=new THREE.MeshStandardMaterial({color:0xf2eee0,roughness:.6}),glass=new THREE.MeshStandardMaterial({color:0x33576b,roughness:.2,metalness:.25}),teak=new THREE.MeshStandardMaterial({color:0x9a643b,roughness:.8});
 const box=(name,w,h,d,x,y,z,material)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.name=name;mesh.position.set(x,y,z);root.add(mesh);return mesh};
 // Flared Downeast hull: broad transom, fine raised bow, and a lower V-shaped bottom.
 const stations=[[-3.5,1.12,.65,-.45],[-2.4,1.3,.68,-.55],[0,1.28,.72,-.55],[1.8,.95,.85,-.34],[2.9,.45,1.02,.05],[3.45,.025,1.12,.5]],vertices=[],indices=[];
 for(const [x,w,top,bottom]of stations)vertices.push(x,top,w,x,bottom,w*.56,x,bottom,-w*.56,x,top,-w);
 for(let i=0;i<stations.length-1;i++)for(let j=0;j<4;j++){const a=i*4+j,b=i*4+(j+1)%4,c=(i+1)*4+(j+1)%4,d=(i+1)*4+j;indices.push(a,b,d,b,c,d)}
 indices.push(0,3,1,1,3,2,20,21,23,21,22,23);
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setIndex(indices);geometry.computeVertexNormals();const hull=new THREE.Mesh(geometry,navy);hull.name='Downeast flared hull';root.add(hull);
 // Cream deck follows the sheer instead of a rectangular barge outline.
 const deck=new THREE.Shape();stations.forEach(([x,w],i)=>i?deck.lineTo(x,w):deck.moveTo(x,w));for(const [x,w]of [...stations].reverse())deck.lineTo(x,-w);deck.closePath();const deckGeo=new THREE.ShapeGeometry(deck);deckGeo.rotateX(Math.PI/2);const dp=deckGeo.attributes.position;for(let i=0;i<dp.count;i++){const x=dp.getX(i);let y=.65;for(let j=0;j<stations.length-1;j++)if(x>=stations[j][0]&&x<=stations[j+1][0]){const t=(x-stations[j][0])/(stations[j+1][0]-stations[j][0]);y=stations[j][2]+t*(stations[j+1][2]-stations[j][2])}dp.setY(i,y+.015)}deckGeo.computeVertexNormals();const deckMesh=new THREE.Mesh(deckGeo,new THREE.MeshStandardMaterial({color:0xf2eee0,side:THREE.DoubleSide}));deckMesh.name='Raised sheer deck';root.add(deckMesh);
 box('Teak aft cockpit',2.35,.06,1.8,-2.1,.73,0,teak);
 box('Wheelhouse',2.4,1.25,1.95,.35,1.4,0,cream);
 for(const side of [-1,1]){box('Side window',1.7,.63,.035,.35,1.66,side*.99,glass);box('Cockpit coaming',2.6,.35,.1,-2,.85,side*1.12,cream)}
 const windshield=box('Raked windscreen',.055,.68,1.7,1.58,1.68,0,glass);windshield.rotation.z=.13;
 box('Wheelhouse roof',3.25,.17,2.25,.15,2.09,0,cream);box('Aft canopy',1.8,.12,2.1,-2.15,2.06,0,cream);
 for(const z of [-.94,.94])box('Canopy support',.07,1.2,.07,-2.95,1.4,z,cream);
 box('Bow rail',1.05,.08,.06,2.4,1.23,0,cream);
 const pole=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,2.9,8),cream);pole.position.set(-.3,3.5,0);root.add(pole);
 const flag=new THREE.Mesh(new THREE.PlaneGeometry(1.2,.65),new THREE.MeshBasicMaterial({color:0xf3df37,side:THREE.DoubleSide}));flag.name='Committee boat preview flag';flag.position.set(.3,4.6,0);root.add(flag);root.userData.previewFlag=flag;
 scene.add(root);return root;
}

export function addCoastalLandmarks(scene){
 const timber=new THREE.MeshStandardMaterial({color:0x996547,roughness:.85}),white=new THREE.MeshStandardMaterial({color:0xefe7d7,roughness:.6}),steel=new THREE.MeshStandardMaterial({color:0x52778a,metalness:.25,roughness:.5});
 const boardwalk=new THREE.Group();boardwalk.position.set(145,0,201);scene.add(boardwalk);
 const box=(w,h,d,x,y,z,m)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);boardwalk.add(o);return o};
 box(32,.6,9,0,2,0,timber);for(const x of [-14,-7,0,7,14])for(const z of [-3,3])box(.5,4,.5,x,.5,z,timber);
 const wheel=new THREE.Group();wheel.position.set(0,13,0);wheel.rotation.y=Math.PI/2;boardwalk.add(wheel);const rotor=new THREE.Group();wheel.add(rotor);
 for(const radius of [9,10]){const ring=new THREE.Mesh(new THREE.TorusGeometry(radius,.18,6,48),white);rotor.add(ring)}
 const cabins=[];for(let i=0;i<12;i++){const a=i*Math.PI/6,spoke=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,10,6),steel);spoke.position.set(5*Math.cos(a),5*Math.sin(a),0);spoke.rotation.z=a-Math.PI/2;rotor.add(spoke);const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.4,1.8,1.3),new THREE.MeshStandardMaterial({color:[0xf26739,0xe6bc35,0x37a7b5,0xb73562][i%4],roughness:.6}));cabin.position.set(10*Math.cos(a),10*Math.sin(a),0);rotor.add(cabin);cabins.push(cabin)}
 for(const z of [-2,2]){const leg=new THREE.Mesh(new THREE.CylinderGeometry(.25,.35,12,8),steel);leg.position.set(0,6,z);leg.rotation.x=z>0?.22:-.22;boardwalk.add(leg)}
 for(const x of [-11,11]){box(5,3.5,6,x,4,0,new THREE.MeshStandardMaterial({color:x<0?0xf2c386:0x72b6b3,roughness:.8}));box(5.7,.6,6.7,x,6,0,white)}
 const ferry=addCommitteeBoat(scene);ferry.name='Distant coastal ferry';ferry.position.set(195,0,-125);ferry.scale.set(2.8,1.6,2.2);ferry.rotation.y=.7;
 return time=>{rotor.rotation.z=time*.035;for(const cabin of cabins)cabin.rotation.z=-rotor.rotation.z;ferry.position.y=.12*Math.sin(time*1.2)};
}

export function updateYachtClubWind(club,time,wind,strength=12){const pivot=club.userData.windFlag;if(!pivot)return;pivot.rotation.y=-(wind*Math.PI/180+Math.PI);const flag=pivot.children[0],p=flag.geometry.attributes.position;for(let i=0;i<p.count;i++){const along=(p.getX(i)+2)/4;p.setZ(i,Math.sin(time*3.8+along*7)*along*.22*Math.min(1,strength/8))}p.needsUpdate=true;flag.geometry.computeBoundingSphere();}

// A separate harbor setting, built once and toggled as a group at race start.
export function addCoastalTown(scene){
 const town=new THREE.Group();town.name='Coastal Town scenery';scene.add(town);
 const material=color=>new THREE.MeshStandardMaterial({color,roughness:.85});
 const sand=material(0xd7bd8d),grass=material(0x668451),trim=material(0xf5efdf),wood=material(0x98734f),glass=material(0x42677c),roof=material(0x526473);
 const box=(parent,name,w,h,d,x,y,z,m)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.name=name;mesh.position.set(x,y,z);parent.add(mesh);return mesh};
 const shore=new THREE.Mesh(new THREE.CylinderGeometry(1,1,2,64),sand);shore.name='Sandy coastal shoreline';shore.scale.set(290,1,63);shore.position.set(-110,-.15,288);town.add(shore);
 const lawn=new THREE.Mesh(new THREE.CylinderGeometry(1,1,.45,64),grass);lawn.scale.set(282,1,52);lawn.position.set(-110,1,293);town.add(lawn);
 box(town,'Shore road',505,.12,7,-110,1.3,282,material(0x66716c));
 const houseColors=[0xe8dfc7,0x8faebb,0xc8a0a0,0xaebca2,0xd6b481,0xc5cccf];
 for(let i=0;i<22;i++){
  const house=new THREE.Group();house.name='Coastal shore house';house.position.set(-352+i*23,1.25,260+(i%3)*17);house.rotation.y=(i%3-1)*.06;town.add(house);
  const w=9+i%3*1.2,h=6+i%2*2,d=9;
  const siding=material(houseColors[i%houseColors.length]);box(house,'Shingle siding',w,h,d,0,h/2+1,0,siding);
  for(const x of [-w*.36,w*.36])for(const z of [-3,3])box(house,'Raised-house piling',.35,2,.35,x,0,z,wood);
  const top=new THREE.Mesh(new THREE.ConeGeometry(w*.79,3.2,4),roof);top.rotation.y=Math.PI/4;top.scale.z=d/w;top.position.y=h+2.6;house.add(top);
  box(house,'Front porch',w+1,.3,3,0,1,-5.6,wood);box(house,'Porch awning',w+1,.2,3,0,4.2,-5.6,trim);
  for(const x of [-w*.42,w*.42])box(house,'Porch post',.18,3,.18,x,2.6,-6.6,trim);
  for(const x of [-w*.28,w*.28])for(const y of (h>6?[3,6]:[3])){box(house,'Window frame',1.8,1.9,.14,x,y,-4.56,trim);box(house,'Blue window',1.5,1.6,.16,x,y,-4.65,glass);}
  box(house,'Front door',1.3,2.6,.16,0,2.5,-4.6,material(0x526e7e));
 }
 // Twelve separate waterfront neighborhoods give steering bearings through 360 degrees.
 const villageSiding=houseColors.map(material),treeMats=[0x376749,0x4c7951,0x648648].map(material);
 for(let sector=0;sector<12;sector++){
  const a=sector*Math.PI/6,radius=340+(sector%3)*16;
  const village=new THREE.Group();village.name='Horizon waterfront neighborhood';village.position.set(radius*Math.cos(a),0,radius*Math.sin(a));village.rotation.y=Math.PI/2-a;town.add(village);
  const beach=new THREE.Mesh(new THREE.CylinderGeometry(1,1,1.5,24),sand);beach.name='Neighborhood sandy shore';beach.scale.set(62,1,31);beach.position.y=.1;village.add(beach);
  const greens=new THREE.Mesh(new THREE.CylinderGeometry(1,1,.3,24),grass);greens.scale.set(59,1,26);greens.position.set(0,1,3);village.add(greens);
  for(let i=0;i<3;i++){
   const house=new THREE.Group();house.name='Horizon shore house';house.position.set((i-1)*30,1.2,3+(i%2)*8);village.add(house);const h=7+(sector+i)%3*2,w=11;
   box(house,'Coastal siding',w,h,10,0,h/2,0,villageSiding[(sector+i)%villageSiding.length]);
   const top=new THREE.Mesh(new THREE.ConeGeometry(9.2,4,4),roof);top.rotation.y=Math.PI/4;top.scale.z=.9;top.position.y=h+1.9;house.add(top);
   box(house,'Porch deck',13,.4,3,0,1,-6,wood);box(house,'Porch roof',13,.25,3,0,4.5,-6,trim);
   for(const x of [-5,5])box(house,'Porch column',.25,3.5,.25,x,2.8,-7,trim);
   for(const x of [-3,3]){box(house,'Window surround',2.3,2.8,.2,x,h*.65,-5.1,trim);box(house,'Waterfront window',1.9,2.4,.22,x,h*.65,-5.24,glass);}
   box(house,'Front door',1.5,3,.2,0,1.6,-5.15,villageSiding[(sector+i+2)%villageSiding.length]);
  }
  for(let i=0;i<6;i++){
   const tree=new THREE.Group();tree.name='Horizon coastal tree';tree.position.set(-49+i*19,1.2,i%2?20:-7);village.add(tree);
   const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.4,.6,7,6),wood);trunk.position.y=3.5;tree.add(trunk);
   const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(5,1),treeMats[(sector+i)%3]);crown.position.y=8.5;crown.scale.y=1.25;tree.add(crown);
  }
  box(village,'Waterfront pier',3,.5,21,0,1,-30,wood);for(const z of [-23,-32,-39])box(village,'Pier piling',.4,2.6,.4,1.3,.2,z,wood);
  if(sector%3===0){const lighthouse=new THREE.Mesh(new THREE.CylinderGeometry(2,3,24,10),trim);lighthouse.name='Coastal lighthouse';lighthouse.position.set(46,13,0);village.add(lighthouse);const lantern=box(village,'Lighthouse lantern',4,3,4,46,26.5,0,glass);const cap=new THREE.Mesh(new THREE.ConeGeometry(3.4,3,10),roof);cap.position.set(46,29.5,0);village.add(cap);}
 }
 for(let i=0;i<40;i++){
  const tree=new THREE.Group();tree.name='Coastal shade tree';tree.position.set(-374+(i*47)%535,1.3,273+(i%4)*13);town.add(tree);
  const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.32,.5,6,6),wood);trunk.position.y=3;tree.add(trunk);
  const canopy=new THREE.Mesh(new THREE.IcosahedronGeometry(4.2+i%3*.4,1),material([0x376749,0x4c7951,0x648648][i%3]));canopy.position.y=7;canopy.scale.set(1,1.2,.9);tree.add(canopy);
 }
 const club=new THREE.Group();club.name='Harbor Yacht Club';club.position.set(-190,0,230);town.add(club);
 box(club,'Club waterfront deck',39,1.2,24,0,1.5,6,wood);box(club,'Blue yacht clubhouse',28,9,17,0,6.6,8,material(0x91b0be));
 const gable=new THREE.Mesh(new THREE.ConeGeometry(22,6,4),roof);gable.rotation.y=Math.PI/4;gable.scale.z=.64;gable.position.set(0,14,8);club.add(gable);
 box(club,'Club veranda roof',37,.4,6,0,7,-3,trim);
 for(let x=-17;x<=17;x+=4.25){box(club,'Veranda column',.35,5,.35,x,4.2,-5,trim);box(club,'Veranda railing',4,.22,.22,x,3,-5,trim);}
 for(let x=-10;x<=10;x+=5){box(club,'Club window trim',3.2,3.5,.2,x,7.5,-.6,trim);box(club,'Club window',2.8,3.1,.25,x,7.5,-.75,glass);}
 box(club,'Club cupola',4.5,3.2,4.5,0,17.3,8,trim);const cupolaRoof=new THREE.Mesh(new THREE.ConeGeometry(3.8,2.5,4),roof);cupolaRoof.rotation.y=Math.PI/4;cupolaRoof.position.set(0,20,8);club.add(cupolaRoof);
 box(club,'Harbor dock',3,.6,25,20,1,-15,wood);for(let z=-26;z<0;z+=5)box(club,'Dock piling',.45,3,.45,21.4,.2,z,wood);
 const pole=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,16,8),trim);pole.position.set(-22,8.8,-2);club.add(pole);
 const pivot=new THREE.Group();pivot.name='Harbor club wind flag';pivot.position.set(-22,16,-2);club.add(pivot);
 const flag=new THREE.Mesh(new THREE.PlaneGeometry(4,2,16,4),new THREE.MeshBasicMaterial({color:0x247bc4,side:THREE.DoubleSide}));flag.position.x=2;pivot.add(flag);club.userData.windFlag=pivot;
 return {group:town,club};
}

export function addArcticHarbor(scene){
 const group=new THREE.Group();group.name='Arctic scenery';scene.add(group);
 const mat=color=>new THREE.MeshStandardMaterial({color,roughness:.9}),snow=mat(0xe9f4f7),rock=mat(0x657681),timber=mat(0x8e5840),trim=mat(0xe5dbc8),roof=mat(0x3b5969),glass=new THREE.MeshStandardMaterial({color:0x8fc8d8,roughness:.35,metalness:.1});
 const box=(parent,name,w,h,d,x,y,z,m)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.name=name;o.position.set(x,y,z);parent.add(o);return o};
 // Color the snow directly on one mountain surface: overlapping snow shells flickered.
 const mountainMaterial=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.95});
 for(let sector=0;sector<12;sector++){
  const a=sector*Math.PI/6,radius=350+(sector%3)*17,w=95+(sector%4)*13,d=70+(sector%3)*10,h=46+(sector%5)*8;
  const ridge=new THREE.Group();ridge.name='Snowy arctic ridge';ridge.position.set(radius*Math.cos(a),0,radius*Math.sin(a));ridge.rotation.y=Math.PI/2-a;group.add(ridge);
  const base=new THREE.Mesh(new THREE.CylinderGeometry(1,1,2,12),rock);base.scale.set(w*.65,1,d*.65);base.position.y=.2;ridge.add(base);
  for(let j=0;j<3;j++){
   const height=h*(1-j*.15),radius=w*.36,geo=new THREE.ConeGeometry(radius,height,5,8),p=geo.attributes.position,colors=[];
   const stone=new THREE.Color(0x657681),ice=new THREE.Color(0xe9f4f7);
   for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),line=height*.02+height*.035*Math.sin(x*.15+j)*Math.cos(z*.13);const blend=THREE.MathUtils.smoothstep(y,line-height*.045,line+height*.045),c=stone.clone().lerp(ice,blend);colors.push(c.r,c.g,c.b);}
   geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));const peak=new THREE.Mesh(geo,mountainMaterial);peak.name='Single-surface snowy mountain';peak.scale.z=d/w;peak.position.set((j-1)*w*.24,height/2,0);peak.rotation.y=j*.35;ridge.add(peak);
  }
 }
 const club=new THREE.Group();club.name='Northern Lights Yacht Club';club.position.set(185,0,170);group.add(club);
 const shore=new THREE.Mesh(new THREE.CylinderGeometry(1,1,2,32),rock);shore.scale.set(75,1,36);shore.position.set(0,.2,25);club.add(shore);
 const snowfield=new THREE.Mesh(new THREE.CylinderGeometry(1,1,.5,32),snow);snowfield.scale.set(73,1,34);snowfield.position.set(0,1.5,25);club.add(snowfield);
 box(club,'Timber harbor deck',35,1.1,22,0,1.3,0,timber);
 // Triangular prism: the roof reaches the deck on both sides of the A-frame.
 const vertices=[-14,2,-1,14,2,-1,0,22,-1,-14,2,18,14,2,18,0,22,18];
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setIndex([0,2,1,3,4,5,0,3,2,2,3,5,2,5,1,1,5,4,0,1,3,1,4,3]);geo.computeVertexNormals();
 const cabin=new THREE.Mesh(geo,timber);cabin.name='A-frame yacht clubhouse';club.add(cabin);
 // One snowy roof surface, raised clear of the timber prism. No overlapping roof/snow boxes.
 const roofGeo=new THREE.BufferGeometry();roofGeo.setAttribute('position',new THREE.Float32BufferAttribute([-14.3,2,-2,0,22.3,-2,14.3,2,-2,-14.3,2,19,0,22.3,19,14.3,2,19],3));roofGeo.setIndex([0,3,1,1,3,4,1,4,2,2,4,5]);roofGeo.computeVertexNormals();
 const snowyRoof=new THREE.Mesh(roofGeo,new THREE.MeshStandardMaterial({color:0xe9f4f7,roughness:.95,side:THREE.DoubleSide}));snowyRoof.name='Single-surface snowy A-frame roof';club.add(snowyRoof);
 const windowGeo=new THREE.BufferGeometry();windowGeo.setAttribute('position',new THREE.Float32BufferAttribute([-9,4,-1.04,9,4,-1.04,0,17,-1.04],3));windowGeo.setIndex([0,1,2]);windowGeo.computeVertexNormals();const window=new THREE.Mesh(windowGeo,new THREE.MeshStandardMaterial({color:0x77b5c7,roughness:.35,side:THREE.DoubleSide}));window.name='Tall triangular harbor window';club.add(window);
 box(club,'A-frame center beam',.4,16,.25,0,11,-1.22,trim);box(club,'Window cross beam',15,.35,.25,0,7,-1.22,trim);box(club,'Entry door',3,4,.3,0,4,-1.4,glass);
 box(club,'Timber dock',3,.6,28,20,1,-15,timber);for(let z=-26;z<0;z+=5)box(club,'Dock piling',.5,3,.5,21.5,.2,z,timber);
 for(let i=0;i<4;i++){const hut=new THREE.Group();hut.name='Arctic waterfront hut';hut.position.set(-43+i*27,1.7,30);club.add(hut);box(hut,'Timber hut',8,5,7,0,2.5,0,mat(i%2?0xb57b4c:0x6e8591));const top=new THREE.Mesh(new THREE.ConeGeometry(6.7,6,4),snow);top.rotation.y=Math.PI/4;top.position.y=7;hut.add(top);}
 const pole=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,16,8),trim);pole.position.set(-21,9,-4);club.add(pole);const pivot=new THREE.Group();pivot.name='Arctic club wind flag';pivot.position.set(-21,16,-4);club.add(pivot);const flag=new THREE.Mesh(new THREE.PlaneGeometry(4,2,16,4),new THREE.MeshBasicMaterial({color:0xe77532,side:THREE.DoubleSide}));flag.position.x=2;pivot.add(flag);club.userData.windFlag=pivot;
 for(let i=0;i<9;i++){const ice=new THREE.Mesh(new THREE.IcosahedronGeometry(7+i%3*2,0),new THREE.MeshStandardMaterial({color:i%2?0xd6f1f7:0xb8e4ef,roughness:.35,metalness:.1}));ice.name='Distant iceberg';ice.scale.set(1,.6+i%3*.3,.7);const a=i*Math.PI*2/9;ice.position.set(280*Math.cos(a),.8,285*Math.sin(a));ice.rotation.y=i*.8;group.add(ice);}
 return {group,club};
}
